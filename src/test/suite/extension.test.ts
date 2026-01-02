import * as assert from 'assert';
import { before } from 'mocha';
import * as vscode from 'vscode';
import { isHeader, tags, dateFormat } from '../../state/symbols';
import { removeAllTags } from '../../state/todo';

suite('Extension Test Suite', () => {
	before(() => {
		vscode.window.showInformationMessage('Start all tests.');
	});

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('giampierod-gpd.gpd'));
	});

	test('Extension should activate', async function() {
		this.timeout(20000); // Extension activation can take up to 20 seconds in test environment
		const extension = vscode.extensions.getExtension('giampierod-gpd.gpd');
		assert.ok(extension);
		await extension!.activate();
		assert.ok(true);
	});

	test('All commands should be registered', async () => {
		const commands = await vscode.commands.getCommands(true);
		const gpdCommands = [
			'gpd.newTodo',
			'gpd.selectTodo',
			'gpd.doneTodo',
			'gpd.doneTodoAndRepeat',
			'gpd.openNote',
			'gpd.openTodo'
		];

		gpdCommands.forEach(cmd => {
			assert.ok(commands.includes(cmd), `Command ${cmd} should be registered`);
		});
	});
});

suite('Symbol Test Suite', () => {
	test('isHeader should identify header lines', () => {
		assert.ok(isHeader('//Todo//'));
		assert.ok(isHeader('//Backlog//'));
		assert.ok(isHeader('//Closed//'));
		assert.ok(isHeader('//End//'));
		assert.ok(!isHeader('  Regular todo item'));
		assert.ok(!isHeader('Just some text'));
	});

	test('Tags should be defined', () => {
		assert.ok(tags.includes('#'));
		assert.ok(tags.includes('!'));
		assert.ok(tags.includes('@'));
		assert.ok(tags.includes('$'));
		assert.ok(tags.includes('~'));
		assert.ok(tags.includes('`'));
	});

	test('Date format should be DD/MM/YY hh:mm', () => {
		assert.strictEqual(dateFormat, 'DD/MM/YY hh:mm');
	});
});

suite('Todo Manipulation Test Suite', () => {
	test('removeAllTags should remove all tag types', () => {
		const todoWithTags = 'Buy groceries #(Shopping) @(Store) $(30min) ~(01/01/26 10:00) `(2026.01.01.10.00)';
		const cleaned = removeAllTags(todoWithTags);

		// Should remove all tags
		assert.ok(!cleaned.includes('#('));
		assert.ok(!cleaned.includes('@('));
		assert.ok(!cleaned.includes('$('));
		assert.ok(!cleaned.includes('~('));
		assert.ok(!cleaned.includes('`('));

		// Should keep the actual todo text
		assert.ok(cleaned.includes('Buy groceries'));
	});

	test('removeAllTags should handle todos without tags', () => {
		const todoWithoutTags = 'Simple todo item';
		const cleaned = removeAllTags(todoWithoutTags);
		assert.strictEqual(cleaned, todoWithoutTags);
	});
});
