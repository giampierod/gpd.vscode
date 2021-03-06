# About the GPD System

The GPD system is meant for people who spend a great deal of time text editing. It is a Todo app with the power of GTD and Mark Forster's Final Version with ninjutsu shortcuts for maximum speed. Except for section headers, every line is a Todo item. Special symbols allow you to understand different aspects of the Todo item. Using combinations of regular and symbolic text, everything is free-form text.

## Pre-Requisites

To install GPD, you first need to install Visual Studio Code. Go to the following link to download, <https://code.visualstudio.com>.

## Install Method

1. Start Visual Studio Code
2. Press <kbd>ctrl</kbd><kbd>shift</kbd><kbd>X</kbd> (<kbd>⌘</kbd><kbd>⌥</kbd><kbd>x</kbd>).
3. In the search box, type "GPD" and press enter.
4. Find the GPD package and click the install button.

## Getting started

A few steps and you will be on your way.

1. Create new file, give it the extension `.GPD`, and open it in Visual Studio Code.
1. Type <kbd>/</kbd> <kbd>/</kbd> <kbd>/</kbd> <kbd>Tab</kbd>. It will instantly give you the section layouts and put your cursor in the `Backlog` section.
1. Create some Todos. Use symbols to note various aspects of the Todo. For all the symbols available (`#`, `!`, `@`, `$`, `~`, `) you can type <kbd>symbol</kbd> <kbd>tab</kbd> to enter them. All of the symbols represent different attributes of the Todo:

    * `project` <kbd>tab</kbd> → `#(Project)` - The project or group of that this Todo is part of.
    * `target` <kbd>tab</kbd> → `!(Target)` - A measurable target for the TodoE.g.: a date, a specific performance metric, etc.
    * `context` <kbd>tab</kbd> → `@(Context)` - People, places, or things are related or required for the Todo. E.g.: a meeting room, a person you are waiting for.
    * `cost` <kbd>tab</kbd> → `$(Cost)` - The amount of time or other metric that should be accounted for this Todo.
    * `completion` <kbd>tab</kbd> → `~(Completion Date)` - The date that finished the Todo.
    * `note` <kbd>tab</kbd> → `(Note ID)` - An ID that references the attached to this Todo. You normally don't need to do this yourself.

1. Once you've mastered this, you will want to get familiar with the shortcuts.

## Shortcuts

Shortcuts make GPD what it is. If you don't learn them it's not really going to work that well.

* <kbd>ctrl</kbd>-<kbd>shift</kbd>-<kbd>?</kbd> - Create a new Todo at the bottom of the ``//Backlog//`` section. If you are in a gpd_note file, the line you are currently on will be copied as a new note in the gpd file.
* <kbd>ctrl</kbd>-<kbd>shift</kbd>-<kbd>.</kbd> - Move the currently selected Todo to the top of the ``//Todo//`` section
* <kbd>ctrl</kbd>-<kbd>shift</kbd>-<kbd>}</kbd> - Move the current Todo to the top of ``//Closed//`` section and put a `~(datetime.now)` in front of it
* <kbd>ctrl</kbd>-<kbd>shift</kbd>-<kbd>{</kbd> - As above, but also copy the Todo to the bottom of the ``//Backlog//`` section (for repeat tasks)
* <kbd>ctrl</kbd>-<kbd>shift</kbd>-<kbd>,</kbd> - Find or create the note for current Todo in a companion `.GPD_Note` file. When in the `.GPD_Note` file, you can press this again to switch back the main `.GPD` file.

## Sections

Todos are divided into different sections: **Todo**, **Backlog**, and **Closed**. These sections are denoted by `//Section Name//` followed by `//End//`. The **Todo**, **Backlog**, and **Closed** sections are mandatory for this package, but you are free to create any other sections you want.

---------------

## License

This project is licensed under the Apache License 2.0. The full license text can be found in the `LICENSE` file provided with this package.
