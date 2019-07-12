# Change Log

All notable changes to the "gpd" extension will be documented in this file.

## [0.2.0] - 2019-07-12

### Added

- Selecting a note from the GPD file will highlight the note in the GPD_Note file and "dim" the other notes. To see all notes, switch away and switch back to the GPD_Note file. This is the first step in trying to replicate the Emacs feature "Narrow-to-region".

## [0.1.6] - 2019-07-08

### Fixed

- Selecting a Todo was going to the bottom of Todo instead of top.

## [0.1.5] - 2019-07-08

### Fixed

- Fixed an issue where creating a new note put the cursor in the wrong spot.

## [0.1.4] - 2019-07-07

### Fixed

- Turning off webpack for now

## [0.1.3] - 2019-07-07

### Fixed

- Publishing of files

## [0.1.2] - 2019-07-07

### Fixed

- Leveraging webpack instead of bundling all packages

## [0.1.1] - 2019-07-07

### Added

- Changelog

## [0.1.0] - 2019-07-07

### Added

- Shortcuts for:
  - Adding Todos to Backlog
  - Moving Todos to Todo
  - Marking Todos as done (including done-and-repeat)
  - Go to GPD_Note from GPD with auto-creation of notes if needed
  - Go to GPD from GPD_Note

- Syntax highlighting
- Snippets
- Keybinds
- Webpack bundling
