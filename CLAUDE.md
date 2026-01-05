# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GPD (Getting Productivity Done) is a VS Code extension that provides a GTD-style todo system designed for users who spend significant time in text editors. It combines Getting Things Done principles with Mark Forster's Final Version methodology, using keyboard shortcuts for fast todo management.

The extension works with two custom file formats:
- `.GPD` / `.gpd` - Main todo list files with special section-based structure
- `.gpd_note` / `.GPD_Note` - Companion note files linked to todos

## Development Commands

### Build and Compile
```bash
npm run compile          # Compile TypeScript to JavaScript
npm run watch           # Watch mode for continuous compilation
npm run vscode:prepublish # Prepare for publishing (runs compile)
```

### Testing
```bash
npm test                # Run all tests (compiles first via pretest)
npm run pretest         # Compile before testing
```

**IMPORTANT**: Close all VS Code instances before running `npm test` (extension tests require this).

To run tests in VS Code:
1. Press F5 or use "Extension Tests" launch configuration
2. Tests are located in `src/test/suite/extension.test.ts`
3. Test runner is configured in `src/test/runTest.ts`

Test suites include:
- Extension activation and command registration
- Symbol parsing and header detection
- Todo tag manipulation (removeAllTags)

For manual testing, see `TESTING.md` and use `test-sample.GPD`.

### Development Workflow
1. Use `npm run watch` during development for automatic recompilation
2. Press F5 to launch extension in Extension Development Host window
3. Use "Run Extension" launch configuration in `.vscode/launch.json`

## Architecture

### Core Components

**Extension Entry Point** (`src/extension.ts`)
- Registers all VS Code commands during activation
- Maps command IDs to command implementations from `src/commands/gpd.ts`
- Commands: `newTodo`, `selectTodo`, `doneTodo`, `doneTodoAndRepeat`, `openNote`, `openTodo`

**Command Layer** (`src/commands/gpd.ts`)
- Implements all user-facing commands
- Orchestrates interactions between Editor and Todo state modules
- Handles note file creation and navigation with automatic note ID generation using moment.js
- Note IDs use format: `YYYY.MM.DD.hh.mm`

**State Management** (`src/state/`)

The state layer is split into focused modules:

1. **editor.ts** - `Editor` class wraps VS Code TextEditor
   - Text search with regex support (forward/reverse)
   - Section-based navigation (finds `//SectionName//` and `//End//` markers)
   - "Narrowing" feature: visually fades non-active sections using text decorations
   - Line insertion at section boundaries (top/bottom)
   - Static `activeEditor` property provides singleton access

2. **todo.ts** - Todo manipulation logic
   - Move/copy todos between sections
   - Tag removal (strips completion dates `~()`, costs `$()`, etc.)
   - Preserves todo formatting during moves
   - Handles line deletion and cursor repositioning

3. **section-move-directive.ts** - `SectionMoveDirective` class
   - Encapsulates "where to move/copy a todo" logic
   - Pre-calculates target position based on section and TopBottom enum
   - Used for multi-section operations (e.g., done+repeat copies to two sections)

4. **symbols.ts** - Constants and patterns
   - Regex patterns for note tags, section headers
   - Tag definitions: `#` (project), `!` (target), `@` (context), `$` (cost), `~` (completion), `` ` `` (note)
   - Date format: `DD/MM/YY hh:mm`
   - Helper functions: `eolToString()`, `isHeader()`

### File Structure

The GPD file format uses section markers:
```
//Todo//
  Active todo items
//End//

//Backlog//
  Future todo items
//End//

//Closed//
  Completed todos with ~(completion date)
//End//
```

Todos can have metadata tags:
- `#(Project)` - Project grouping
- `!(Target)` - Measurable target/deadline
- `@(Context)` - Required context (people, places)
- `$(Cost)` - Time/resource estimate
- `~(Completion Date)` - Completion timestamp (auto-added)
- `` `(Note ID)`` - Link to note in companion file (auto-added)

### Note System

When a user opens a note for a todo:
1. System checks if todo has a `` `(noteId)`` tag
2. If not, generates new note ID and appends tag to todo line
3. Opens/creates `filename_note` file
4. Creates or navigates to note section with matching ID
5. Note sections mirror GPD format: `//noteId//` ... `//End//`

## Key Implementation Patterns

**Section Operations**: All todo movements use the section-based architecture. The `Editor.getSectionPosition()` method finds section markers, and `TopBottom` enum controls whether insertion happens at section start or end.

**Command Pattern**: Commands in `gpd.ts` are thin wrappers that call state manipulation functions. This keeps UI concerns separate from business logic.

**Tag Management**: The `tags` array in `symbols.ts` defines all recognized tag prefixes. Tag removal uses dynamic regex generation to handle any tag format.

**Narrowing/Focus**: The "narrow" feature uses VS Code decoration API to set opacity on text ranges, creating a visual focus effect without actually hiding content.

## Configuration

Extension contributes:
- 2 custom language definitions (GPD, GPD_Note)
- TextMate grammars in `syntaxes/` for syntax highlighting
- Snippets in `snippets/gpd.json` for quick tag entry
- 6 commands with keyboard shortcuts (see `package.json` contributions)

Default keybindings (when in GPD files):
- `Ctrl+Shift+/` - New todo in Backlog
- `Ctrl+Shift+.` - Select todo (move to Todo section)
- `Ctrl+Shift+]` - Mark todo done
- `Ctrl+Shift+[` - Done and repeat
- `Ctrl+Shift+,` - Toggle note/todo file
