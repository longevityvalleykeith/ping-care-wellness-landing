"""Tests for export_nonclinical.py. All fixtures are built in a temp dir, never in the repo."""

import contextlib
import hashlib
import io
import json
import os
import shutil
import stat
import tempfile
import unittest

import export_nonclinical as tool

HERE = os.path.dirname(os.path.abspath(__file__))


def _write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(text)


def _tree_digest(root):
    """Map of vault-relative path -> sha256 for every regular file, without following symlinks."""
    digests = {}
    for dirpath, dirnames, filenames in os.walk(root, followlinks=False):
        for name in filenames:
            full = os.path.join(dirpath, name)
            if stat.S_ISREG(os.lstat(full).st_mode):
                rel = os.path.relpath(full, root).replace(os.sep, "/")
                with open(full, "rb") as fh:
                    digests[rel] = hashlib.sha256(fh.read()).hexdigest()
        for name in dirnames:
            full = os.path.join(dirpath, name)
            if os.path.islink(full):
                digests[os.path.relpath(full, root).replace(os.sep, "/") + " (symlink)"] = os.readlink(full)
    return digests


class FixtureMixin:
    def setUp(self):
        self._tmp = tempfile.mkdtemp(prefix="obsidian-export-test-")
        self.addCleanup(shutil.rmtree, self._tmp, ignore_errors=True)
        self.base = os.path.realpath(self._tmp)
        self.vault = os.path.join(self.base, "vault")
        self.outside = os.path.join(self.base, "outside")
        self.out = os.path.join(self.base, "export-out")
        self._build_fixture()

    def _build_fixture(self):
        v = self.vault
        # Allowed, non-clinical content.
        _write(os.path.join(v, "Public", "Guides", "intro.md"), "intro\n")
        _write(os.path.join(v, "Public", "Guides", "Index.md"), "guides index\n")
        _write(os.path.join(v, "Public", "Ideas", "Index.md"), "ideas index\n")  # same name, other folder
        _write(os.path.join(v, "Public", "Guides", "Healthy-Recipes.md"), "not denied: token is 'healthy'\n")
        _write(os.path.join(v, "Public", "Guides", "diagram.png"), "not markdown")
        _write(os.path.join(v, "Public", "Guides", "readme.txt"), "not markdown")

        # Deny-list hits inside the allowed folder (deny must win over allow).
        _write(os.path.join(v, "Public", "Guides", "Clinical", "protocol.md"), "DENIED clinical dir\n")
        _write(os.path.join(v, "Public", "Ideas", "CLINICAL-notes", "c.md"), "DENIED clinical token\n")
        _write(os.path.join(v, "Public", "Guides", "_private-stuff", "p.md"), "DENIED _private prefix\n")
        _write(os.path.join(v, "Public", "Guides", "notes-private", "n.md"), "DENIED notes-private\n")
        _write(os.path.join(v, "Public", "Ideas", "Session Notes.md"), "DENIED session token\n")

        # Hidden content: .obsidian and a hidden subfolder.
        _write(os.path.join(v, ".obsidian", "workspace.md"), "hidden config\n")
        _write(os.path.join(v, "Public", ".obsidian", "config.md"), "hidden config\n")
        _write(os.path.join(v, "Public", "Guides", ".hidden", "h.md"), "hidden\n")

        # Folder outside the allow list.
        _write(os.path.join(v, "Archive", "old.md"), "not allowed\n")

        # Symlinks pointing outside the vault (must never be followed or copied).
        _write(os.path.join(self.outside, "secret.md"), "OUTSIDE CONTENT\n")
        os.makedirs(os.path.join(self.outside, "dir"), exist_ok=True)
        _write(os.path.join(self.outside, "dir", "leak.md"), "OUTSIDE DIR\n")
        os.symlink(os.path.join(self.outside, "secret.md"), os.path.join(v, "Public", "Guides", "linked.md"))
        os.symlink(os.path.join(self.outside, "dir"), os.path.join(v, "Public", "Guides", "linkdir"))

        self.expected_copied = {
            "Public/Guides/Healthy-Recipes.md",
            "Public/Guides/Index.md",
            "Public/Guides/intro.md",
            "Public/Ideas/Index.md",
        }
        self.expected_denied = 5


class RefusalTests(FixtureMixin, unittest.TestCase):
    def test_refuses_with_no_allow_and_writes_nothing(self):
        err = io.StringIO()
        with contextlib.redirect_stderr(err):
            code = tool.main(["--vault", self.vault, "--out", self.out, "--apply"])
        self.assertEqual(code, 2)
        self.assertIn("--allow", err.getvalue())
        self.assertFalse(os.path.exists(self.out))

    def test_refuses_root_or_absolute_allow(self):
        for bad in (".", "/etc", os.path.join(self.vault, "Public")):
            with self.subTest(allow=bad), self.assertRaises(tool.RefusalError):
                tool.run_export(self.vault, self.out, [bad])
        self.assertFalse(os.path.exists(self.out))

    def test_refuses_out_inside_vault(self):
        inside = os.path.join(self.vault, "Public", "export-out")
        with self.assertRaises(tool.RefusalError):
            tool.run_export(self.vault, inside, ["Public/Guides"], apply=True)
        self.assertFalse(os.path.exists(inside))

    def test_refuses_out_equal_to_vault(self):
        with self.assertRaises(tool.RefusalError):
            tool.run_export(self.vault, self.vault, ["Public/Guides"], apply=True)

    def test_refuses_out_inside_repo_working_tree(self):
        fake_repo = os.path.join(self.base, "fake-repo")
        os.makedirs(fake_repo)
        out_in_repo = os.path.join(fake_repo, "tools", "out")
        with self.assertRaises(tool.RefusalError):
            tool.run_export(self.vault, out_in_repo, ["Public/Guides"], apply=True, repo_roots=[fake_repo])
        self.assertFalse(os.path.exists(out_in_repo))

    def test_refuses_out_inside_detected_real_repo(self):
        repo_roots = tool.detect_repo_roots()
        if not repo_roots:
            self.skipTest("no .git ancestor detected for this checkout")
        out_in_repo = os.path.join(repo_roots[0], "tools", "should-not-exist")
        with self.assertRaises(tool.RefusalError):
            tool.run_export(self.vault, out_in_repo, ["Public/Guides"], apply=True)
        self.assertFalse(os.path.exists(out_in_repo))

    def test_refuses_nonempty_out_without_overwriting(self):
        _write(os.path.join(self.out, "keep.md"), "do not touch\n")
        with self.assertRaises(tool.RefusalError):
            tool.run_export(self.vault, self.out, ["Public/Guides"], apply=True)
        with open(os.path.join(self.out, "keep.md"), encoding="utf-8") as fh:
            self.assertEqual(fh.read(), "do not touch\n")
        self.assertEqual(os.listdir(self.out), ["keep.md"])

    def test_refuses_allow_folder_that_is_a_symlink(self):
        os.symlink(os.path.join(self.vault, "Public", "Guides"), os.path.join(self.vault, "Public", "Alias"))
        with self.assertRaises(tool.RefusalError):
            tool.run_export(self.vault, self.out, ["Public/Alias"])

    def test_refuses_allow_below_a_symlink(self):
        os.symlink(os.path.join(self.vault, "Public"), os.path.join(self.vault, "PubLink"))
        with self.assertRaises(tool.RefusalError):
            tool.run_export(self.vault, self.out, ["PubLink/Guides"])


class ExportTests(FixtureMixin, unittest.TestCase):
    def test_dry_run_writes_nothing(self):
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            code = tool.main(["--vault", self.vault, "--out", self.out, "--allow", "Public"])
        self.assertEqual(code, 0)
        self.assertFalse(os.path.exists(self.out))
        text = buf.getvalue()
        self.assertIn("DRY RUN", text)
        self.assertIn(f"Files eligible: {len(self.expected_copied)}", text)
        self.assertIn(f"Denied by deny-list: {self.expected_denied}", text)
        self.assertIn("Public/Guides/intro.md", text)
        self.assertNotIn("OUTSIDE", text)

    def test_apply_copies_only_allowed_non_denied_files(self):
        result = tool.run_export(self.vault, self.out, ["Public"], apply=True)
        copied = set()
        for dirpath, _, filenames in os.walk(self.out):
            for name in filenames:
                copied.add(os.path.relpath(os.path.join(dirpath, name), self.out).replace(os.sep, "/"))
        self.assertEqual(copied, self.expected_copied | {tool.MANIFEST_NAME})
        self.assertEqual(result.denied_count, self.expected_denied)
        self.assertEqual(result.symlink_skips, 2)

    def test_same_name_files_both_copied_with_structure_preserved(self):
        tool.run_export(self.vault, self.out, ["Public"], apply=True)
        with open(os.path.join(self.out, "Public", "Guides", "Index.md"), encoding="utf-8") as fh:
            self.assertEqual(fh.read(), "guides index\n")
        with open(os.path.join(self.out, "Public", "Ideas", "Index.md"), encoding="utf-8") as fh:
            self.assertEqual(fh.read(), "ideas index\n")

    def test_symlink_targets_never_copied(self):
        tool.run_export(self.vault, self.out, ["Public"], apply=True)
        for dirpath, _, filenames in os.walk(self.out):
            for name in filenames:
                with open(os.path.join(dirpath, name), encoding="utf-8", errors="replace") as fh:
                    self.assertNotIn("OUTSIDE", fh.read())

    def test_source_vault_unchanged(self):
        before = _tree_digest(self.vault)
        tool.run_export(self.vault, self.out, ["Public"], apply=True)
        self.assertEqual(_tree_digest(self.vault), before)

    def test_manifest_matches_copied_files(self):
        result = tool.run_export(self.vault, self.out, ["Public"], apply=True)
        with open(os.path.join(self.out, tool.MANIFEST_NAME), encoding="utf-8") as fh:
            manifest = json.load(fh)
        entries = manifest["files"]
        self.assertEqual({e["path"] for e in entries}, self.expected_copied)
        self.assertEqual(manifest["file_count"], len(entries))
        for entry in entries:
            self.assertEqual(set(entry), {"path", "size", "sha256"})
            copied = os.path.join(self.out, *entry["path"].split("/"))
            with open(copied, "rb") as fh:
                data = fh.read()
            self.assertEqual(entry["size"], len(data))
            self.assertEqual(entry["sha256"], hashlib.sha256(data).hexdigest())
            source = os.path.join(self.vault, *entry["path"].split("/"))
            with open(source, "rb") as fh:
                self.assertEqual(fh.read(), data)
        self.assertEqual(len(result.copied), len(entries))

    def test_cli_apply_returns_zero(self):
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            code = tool.main(["--vault", self.vault, "--out", self.out, "--allow", "Public/Guides", "--apply"])
        self.assertEqual(code, 0)
        self.assertTrue(os.path.isfile(os.path.join(self.out, tool.MANIFEST_NAME)))
        self.assertNotIn("Public/Ideas", buf.getvalue())

    def test_empty_existing_out_is_accepted(self):
        os.makedirs(self.out)
        tool.run_export(self.vault, self.out, ["Public"], apply=True)
        self.assertTrue(os.path.isfile(os.path.join(self.out, "Public", "Guides", "intro.md")))


class DenyRuleTests(unittest.TestCase):
    def test_denied_segments(self):
        for name in ["Clinical", "patients", "CASE", "client", "Notes-Private", "phi", "Intake",
                     "_private", "_Private-notes", "CLINICAL-notes", "Session Notes.md", "Medical.md"]:
            with self.subTest(name=name):
                self.assertTrue(tool.is_denied_segment(name))

    def test_allowed_segments(self):
        for name in ["Guides", "Healthy-Recipes.md", "Ideas", "Index.md", "Recipes", "Patientless-ideas.md"]:
            with self.subTest(name=name):
                self.assertFalse(tool.is_denied_segment(name))


if __name__ == "__main__":
    unittest.main()
