#!/usr/bin/env python3
"""Copy-only, FILE-level allowlist export of non-clinical Obsidian notes.

What this tool does
    * Copies ``*.md`` files from explicitly allowed vault folders into an
      output directory, preserving the vault-relative directory structure.
    * Writes ``MANIFEST.json`` (vault-relative path, size, sha256) into the
      output directory. No file contents are written to the manifest or logs.
    * Never writes to, moves, or deletes anything inside the vault.

What this tool does NOT do
    * It is a FILE-level allowlist only. It does NOT de-identify, redact, or
      inspect note content. Any note inside an allowed folder that contains
      patient or client information WOULD be copied. Only point ``--allow`` at
      folders that have been verified as non-clinical by a human.
    * The entity / field export rules (the LV entity ontology and export canon)
      are NOT established yet and are a TODO. Nothing here maps entities or
      fields.

Selection rules (deny wins over allow)
    * Only ``.md`` files under the ``--allow`` folders (vault-relative).
    * Symlinks are never followed and never copied, at any level, including an
      ``--allow`` folder that is itself a symlink or sits below one.
    * Hidden entries (names starting with ``.``), including ``.obsidian``, are
      skipped.
    * A path is denied if ANY segment matches (case-insensitive) one of:
      clinical, patient, patients, case, cases, client, clients, private,
      medical, health, phi, intake, session, notes-private, or starts with
      ``_private``. Segments are also split on spaces, dots, underscores and
      hyphens, so ``CLINICAL-notes`` or ``Session Notes.md`` are denied too.
      This over-denies on purpose; it is the conservative direction.
    * Denied files are counted and their names are not printed.

Safety refusals (exit status 2, nothing written)
    * No ``--allow`` given, or an ``--allow`` that is absolute, is the vault
      root, contains ``..``, or is not an existing real directory.
    * ``--out`` is inside the vault, or inside a git working tree (any ancestor
      of this script or of the current directory containing ``.git``).
    * ``--out`` exists and is not an empty directory. There is no overwrite
      and no ``--force``.

Usage
    python3 export_nonclinical.py --vault PATH --out PATH --allow FOLDER [--allow FOLDER ...]
    python3 export_nonclinical.py --vault PATH --out PATH --allow FOLDER --apply

Without ``--apply`` this is a dry run: it prints counts and vault-relative
paths only, and writes nothing.

Python 3 standard library only. No network access. No subprocesses.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import stat
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Sequence

MANIFEST_NAME = "MANIFEST.json"
TOOL_NAME = "export_nonclinical.py"

DENY_NAMES = frozenset(
    {
        "clinical",
        "patient",
        "patients",
        "case",
        "cases",
        "client",
        "clients",
        "private",
        "medical",
        "health",
        "phi",
        "intake",
        "session",
        "notes-private",
    }
)
DENY_PREFIX = "_private"
_TOKEN_SPLIT = re.compile(r"[\s._\-]+")


class RefusalError(Exception):
    """The export was refused for a safety reason. Nothing is written."""


@dataclass
class ExportResult:
    candidates: List[str] = field(default_factory=list)
    denied_count: int = 0
    symlink_skips: int = 0
    copied: List[Dict[str, object]] = field(default_factory=list)
    manifest_path: Optional[str] = None


# ---------------------------------------------------------------------------
# Deny rules
# ---------------------------------------------------------------------------


def is_denied_segment(segment: str) -> bool:
    """Return True if one path segment (dir or file name) triggers the deny list."""
    low = segment.lower()
    if low.startswith(DENY_PREFIX):
        return True
    stem = low[:-3] if low.endswith(".md") else low
    if low in DENY_NAMES or stem in DENY_NAMES:
        return True
    return any(tok in DENY_NAMES for tok in _TOKEN_SPLIT.split(stem) if tok)


def is_denied_path(rel_parts: Sequence[str]) -> bool:
    return any(is_denied_segment(part) for part in rel_parts)


# ---------------------------------------------------------------------------
# Path helpers
# ---------------------------------------------------------------------------


def _is_within(child: str, parent: str) -> bool:
    """True if real path ``child`` equals or is inside real path ``parent``."""
    child_r = os.path.normcase(os.path.realpath(child))
    parent_r = os.path.normcase(os.path.realpath(parent))
    try:
        return os.path.commonpath([child_r, parent_r]) == parent_r
    except ValueError:  # e.g. different drives on Windows
        return False


def detect_repo_roots() -> List[str]:
    """Return git working-tree roots found by walking up from the script and from the cwd."""
    roots: List[str] = []
    starts = [Path(__file__).resolve().parent, Path.cwd().resolve()]
    for start in starts:
        for directory in [start, *start.parents]:
            if (directory / ".git").exists():
                if str(directory) not in roots:
                    roots.append(str(directory))
                break
    return roots


def validate_vault(vault: str) -> str:
    path = Path(vault).expanduser()
    if not path.is_dir():
        raise RefusalError(f"--vault is not an existing directory: {vault}")
    return os.path.realpath(path)


def normalize_allow(raw: str) -> str:
    """Turn a user-supplied --allow value into a clean vault-relative posix path."""
    text = raw.strip()
    if text.startswith(("/", "\\")) or re.match(r"^[A-Za-z]:", text):
        raise RefusalError(f"--allow must be vault-relative, not absolute: {raw}")
    cleaned = text.replace("\\", "/").strip("/")
    if not cleaned or cleaned == ".":
        raise RefusalError("--allow must name a folder inside the vault; the vault root is not allowed")
    parts = cleaned.split("/")
    if any(part in ("", ".", "..") for part in parts):
        raise RefusalError(f"--allow contains an invalid path segment: {raw}")
    return "/".join(parts)


def check_allow_folder(vault_root: str, rel: str) -> None:
    """Every component from the vault root down must be a real directory, not a symlink."""
    current = vault_root
    for part in rel.split("/"):
        current = os.path.join(current, part)
        try:
            st = os.lstat(current)
        except FileNotFoundError:
            raise RefusalError(f"--allow folder not found in vault: {rel}") from None
        if stat.S_ISLNK(st.st_mode):
            raise RefusalError(f"--allow folder path contains a symlink; refusing: {rel}")
    if not stat.S_ISDIR(os.lstat(current).st_mode):
        raise RefusalError(f"--allow is not a directory: {rel}")


def validate_out(out: str, vault_root: str, repo_roots: Sequence[str]) -> str:
    out_real = os.path.realpath(os.path.expanduser(out))
    if _is_within(out_real, vault_root):
        raise RefusalError("--out is inside the vault; refusing (the vault must not be written to)")
    for root in repo_roots:
        if _is_within(out_real, root):
            raise RefusalError("--out is inside a git working tree; refusing")
    if os.path.lexists(out_real):
        if not os.path.isdir(out_real):
            raise RefusalError("--out exists and is not a directory")
        if os.listdir(out_real):
            raise RefusalError("--out exists and is not empty; refusing to overwrite (no --force)")
    return out_real


def sha256_file(path: str) -> str:
    digest = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


# ---------------------------------------------------------------------------
# Scan and copy
# ---------------------------------------------------------------------------


def _raise_walk_error(err: OSError) -> None:
    raise err


def scan(vault_root: str, allows: Sequence[str]) -> ExportResult:
    """Walk each allowed folder without following symlinks and classify every .md file."""
    result = ExportResult()
    candidates = set()
    for allow in allows:
        base = os.path.join(vault_root, *allow.split("/"))
        for dirpath, dirnames, filenames in os.walk(base, followlinks=False, onerror=_raise_walk_error):
            rel_dir = os.path.relpath(dirpath, vault_root)
            rel_parts = [] if rel_dir == "." else rel_dir.split(os.sep)

            kept_dirs = []
            for name in sorted(dirnames):
                full = os.path.join(dirpath, name)
                if os.path.islink(full):
                    result.symlink_skips += 1
                    continue
                if name.startswith("."):
                    continue
                kept_dirs.append(name)
            dirnames[:] = kept_dirs

            for name in sorted(filenames):
                if name.startswith("."):
                    continue
                full = os.path.join(dirpath, name)
                if os.path.islink(full):
                    result.symlink_skips += 1
                    continue
                if not name.endswith(".md"):
                    continue
                if not stat.S_ISREG(os.lstat(full).st_mode):
                    continue
                rel = "/".join(rel_parts + [name])
                if is_denied_path(rel.split("/")):
                    result.denied_count += 1
                    continue
                candidates.add(rel)

    result.candidates = sorted(candidates)
    return result


def run_export(
    vault: str,
    out: str,
    allows: Sequence[str],
    apply: bool = False,
    repo_roots: Optional[Sequence[str]] = None,
) -> ExportResult:
    if not allows:
        raise RefusalError("at least one --allow FOLDER is required; refusing to run with none")
    vault_root = validate_vault(vault)
    rels = sorted({normalize_allow(a) for a in allows})
    for rel in rels:
        check_allow_folder(vault_root, rel)
    roots = detect_repo_roots() if repo_roots is None else list(repo_roots)
    out_real = validate_out(out, vault_root, roots)

    result = scan(vault_root, rels)
    if not apply:
        return result

    os.makedirs(out_real, exist_ok=True)
    entries: List[Dict[str, object]] = []
    for rel in result.candidates:
        src = os.path.join(vault_root, *rel.split("/"))
        dst = os.path.join(out_real, *rel.split("/"))
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        if os.path.lexists(dst):
            raise RefusalError(f"destination already exists; refusing to overwrite: {rel}")
        shutil.copy2(src, dst)
        entries.append({"path": rel, "size": os.path.getsize(dst), "sha256": sha256_file(dst)})

    manifest = {"tool": TOOL_NAME, "file_count": len(entries), "files": entries}
    manifest_path = os.path.join(out_real, MANIFEST_NAME)
    with open(manifest_path, "x", encoding="utf-8") as fh:
        json.dump(manifest, fh, indent=2)
        fh.write("\n")
    result.copied = entries
    result.manifest_path = manifest_path
    return result


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description=(
            "Copy-only FILE-level allowlist export of non-clinical Obsidian notes. "
            "Does NOT de-identify content. Dry run unless --apply is given."
        )
    )
    parser.add_argument("--vault", required=True, metavar="PATH", help="Obsidian vault root (read only)")
    parser.add_argument("--out", required=True, metavar="PATH", help="Empty output directory to create or fill")
    parser.add_argument(
        "--allow",
        action="append",
        default=[],
        metavar="FOLDER",
        help="Vault-relative folder to include (repeatable; at least one required)",
    )
    parser.add_argument("--apply", action="store_true", help="Actually copy files (default: dry run)")
    return parser


def _print_report(result: ExportResult, out: str, apply: bool) -> None:
    print("Mode: APPLY" if apply else "Mode: DRY RUN (nothing written)")
    print(f"Files eligible: {len(result.candidates)}")
    print(f"Denied by deny-list: {result.denied_count}")
    print(f"Skipped symlinks: {result.symlink_skips}")
    for rel in result.candidates:
        print(f"  {rel}")
    if apply:
        print(f"Copied: {len(result.copied)} file(s) into {out}")
        print(f"Manifest: {result.manifest_path}")
    else:
        print("Re-run with --apply to copy these files.")


def main(argv: Optional[Sequence[str]] = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        result = run_export(args.vault, args.out, args.allow, apply=args.apply)
    except RefusalError as exc:
        print(f"REFUSED: {exc}", file=sys.stderr)
        return 2
    _print_report(result, args.out, args.apply)
    return 0


if __name__ == "__main__":
    sys.exit(main())
