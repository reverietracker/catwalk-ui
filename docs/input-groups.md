# Input groups

## InputList

`InputList` is a component that manages a list of inputs, and can track a `ListField` on a model. It provides a `trackModel` method that can be used to connect the list to a model, and a `createNode` method that returns a `<ul>` containing the list of inputs.

```javascript
const TodoList = Model([
  new fields.ListField('todos', new fields.ValueField('todo'), {length: 8}),
]);

const todoList = new TodoList({
  todos: ['buy milk', 'walk dog', 'feed cat'],
});

class TodoListDisplay extends InputList.forField(TodoList.fields.todos, {
  elementInputClass: TextInput.forField(TodoList.fields.todos.subfield),
}) {
}
const todoListDisplay = new TodoListDisplay();
document.body.appendChild(todoListDisplay);

todoListDisplay.trackModel(todoList);
```
