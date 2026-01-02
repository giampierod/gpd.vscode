# Testing Guide

## Running Automated Tests

The extension includes comprehensive tests that verify:
- Extension activation
- Command registration
- Symbol parsing and header detection
- Todo tag manipulation

### To run tests:

**Important**: Close all VS Code instances before running tests (VS Code extension tests require this).

```bash
npm test
```

This will:
1. Compile TypeScript (`npm run compile`)
2. Download VS Code test instance
3. Run all test suites

### Test Structure

- `src/test/suite/extension.test.ts` - Main test suites:
  - **Extension Test Suite**: Verifies extension loads and commands register
  - **Symbol Test Suite**: Tests header detection and tag definitions
  - **Todo Manipulation Test Suite**: Tests tag removal and todo parsing

## Manual Testing

### Setup

1. Press F5 in VS Code to launch the Extension Development Host
2. Open `test-sample.GPD` in the new window
3. The file should have syntax highlighting for GPD format

### Test Commands

With `test-sample.GPD` open, test each command:

#### 1. New Todo (Ctrl+Shift+/)
- Place cursor anywhere in the file
- Press `Ctrl+Shift+/` (or `⌘+Shift+/` on Mac)
- A new blank line should appear in the `//Backlog//` section
- Cursor moves to the new line

#### 2. Select Todo (Ctrl+Shift+.)
- Place cursor on any todo in `//Backlog//` section
- Press `Ctrl+Shift+.` (or `⌘+Shift+.` on Mac)
- Todo should move to top of `//Todo//` section
- Completion date `~()` tag should be removed if present

#### 3. Done Todo (Ctrl+Shift+])
- Place cursor on any todo in `//Todo//` section
- Press `Ctrl+Shift+]` (or `⌘+Shift+]` on Mac)
- Todo should move to top of `//Closed//` section
- Current timestamp `~(DD/MM/YY hh:mm)` should be prepended

#### 4. Done and Repeat (Ctrl+Shift+[)
- Place cursor on a todo
- Press `Ctrl+Shift+[` (or `⌘+Shift+[` on Mac)
- Original todo (without `~()` tag) should be copied to bottom of `//Backlog//`
- Todo with timestamp should move to top of `//Closed//`

#### 5. Toggle Note (Ctrl+Shift+,)
- Place cursor on any todo
- Press `Ctrl+Shift+,` (or `⌘+Shift+,` on Mac)
- A note file `test-sample.GPD_note` should open
- Note section with unique ID should be created
- Original todo should have `` `(note_id)`` tag appended
- Press `Ctrl+Shift+,` again to toggle back to main file

### Expected Behavior

- Headers (`//Section//` and `//End//`) cannot be selected as todos
- Tags are preserved when moving todos (except `~()` when selecting)
- Note IDs use format: `YYYY.MM.DD.hh.mm`
- All operations maintain proper indentation (2 spaces)

## Verifying Modern VS Code Compatibility

The extension has been verified to:
- ✅ Compile with TypeScript 3.3.1
- ✅ Work with VS Code 1.107.1 (latest as of Jan 2026)
- ✅ All commands register properly
- ✅ Symbol parsing works correctly
- ✅ Tag manipulation functions work as expected

## Known Issues

After 7 years, some dependencies are outdated:
- vscode-test 1.0.0 (renamed to @vscode/test-electron)
- Various security vulnerabilities in dev dependencies
- Deprecated packages (glob, rimraf, mkdirp in old versions)

These affect development tooling but **do not impact extension functionality**.
