# Obsidian export (copy-only, non-clinical, file-level)

A small Python 3 standard-library tool that copies Markdown notes from
explicitly allowed folders of a local Obsidian vault into an output folder.

## Read this first

- **File-level allowlist only.** The tool decides which whole `.md` files to copy
  by folder and file name. It does **not** de-identify, redact, or inspect note
  content. A note inside an allowed folder that contains patient or client
  information will be copied.
- Only point `--allow` at folders a person has verified as non-clinical.
- The LV entity ontology and export canon are **not established yet**. Entity
  and field export rules are a TODO. This tool maps nothing.
- It never writes to the vault. It refuses to write inside the vault or inside a
  git working tree, and it refuses to overwrite a non-empty output folder.
- No network access, no subprocesses, no dependencies.

## Usage

```sh
# Dry run (default): prints counts and vault-relative paths only, writes nothing
python3 export_nonclinical.py --vault ~/Obsidian/MyVault --out ~/Desktop/lv-export --allow "Public/Guides"

# Copy, with a manifest
python3 export_nonclinical.py --vault ~/Obsidian/MyVault --out ~/Desktop/lv-export --allow "Public/Guides" --apply
```

- `--vault PATH` (required): the vault root. Read only.
- `--out PATH` (required): an empty or missing directory. Must not be inside the
  vault or inside a git repo.
- `--allow FOLDER` (required, repeatable): a vault-relative folder. The tool
  refuses to run without at least one. The vault root itself is not accepted.
- `--apply`: actually copy. Without it, nothing is written.

## Selection rules

1. Only `*.md` files under the `--allow` folders.
2. Symlinks are never followed or copied, at any level. An `--allow` folder that
   is a symlink, or sits below one, is refused.
3. Hidden entries (names starting with `.`), including `.obsidian`, are skipped.
4. Deny wins over allow. A path is denied if any segment (folder or file name)
   matches, case-insensitively: `clinical`, `patient`, `patients`, `case`,
   `cases`, `client`, `clients`, `private`, `medical`, `health`, `phi`, `intake`,
   `session`, `notes-private`, or anything starting with `_private`. Segments are
   also split on spaces, dots, underscores and hyphens, so `CLINICAL-notes` and
   `Session Notes.md` are denied. This is deliberately over-inclusive.
5. The number of denied files is printed. Their names are not.

## Output

- Files keep their vault-relative directory structure. Nothing is flattened, so
  same-name notes in different folders both copy.
- `MANIFEST.json` in the output folder lists each copied file as
  `{"path", "size", "sha256"}`. It contains no file contents and no absolute
  paths.

## Tests

From the repository root:

```sh
python3 -m unittest discover -s tools/obsidian-export -p 'test_*.py' -v
```

Fixtures are built in a temp directory outside the repo. No real vault content is
read.
