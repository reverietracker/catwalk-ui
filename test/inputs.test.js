/**
 * @jest-environment jsdom
 */

const { Model, fields } = require('catwalk');
const { Component, InputList, NumberInput, RangeInput, TextInput, SelectInput } = require('../');

class Rectangle extends Model([
    new fields.IntegerField('width', {min: 1, max: 100}),
    new fields.IntegerField('height', {min: 1, max: 100}),
    new fields.ValueField('name'),
    new fields.EnumField('color', {
        choices: [
            ['ff0000', 'red'],
            ['00ff00', 'green'],
            ['0000ff', 'blue'],
        ],
        default: 'ff0000'
    }),
]) {
    getArea() {
        return this.width * this.height;
    }
}

class Wave extends Model([
    new fields.EnumField('waveType', {choices: [
        [1, "Square"],
        [2, "Triangle"],
        [3, "Sine"],
    ], default: 1}),
]) {}

const TodoList = Model([
    new fields.ListField('todos', new fields.ValueField('todo'), {length: 8}),
]);

test('Base component has no rendering', () => {
    const base = new Component();
    expect(() => base.node).toThrow(Error);
});

test('NumberInput can be constructed from field', () => {
    const WidthInput = NumberInput.forField(Rectangle.fields.width);
    const widthInput = new WidthInput();
    expect(widthInput.node.type).toBe("number");
    expect(widthInput.node.min).toBe("1");
    expect(widthInput.node.max).toBe("100");
});

test('RangeInput can be constructed from field', () => {
    const WidthInput = RangeInput.forField(Rectangle.fields.width);
    const widthInput = new WidthInput();
    expect(widthInput.node.type).toBe("range");
    expect(widthInput.node.min).toBe("1");
    expect(widthInput.node.max).toBe("100");
});

test('TextInput can be constructed from field', () => {
    const NameInput = TextInput.forField(Rectangle.fields.name);
    const nameInput = new NameInput({attributes: {placeholder: "Name"}});
    expect(nameInput.node.type).toBe("text");
    expect(nameInput.node.placeholder).toBe("Name");
});

test('SelectInput can be constructed from field', () => {
    const ColorInput = SelectInput.forField(Rectangle.fields.color);
    const colorInput = new ColorInput();
    expect(colorInput.node.tagName).toBe("SELECT");
    expect(colorInput.node.options.length).toBe(3);
    expect(colorInput.node.options[0].value).toBe("ff0000");
    expect(colorInput.node.options[0].innerText).toBe("red");
    expect(colorInput.node.options[1].value).toBe("00ff00");
    expect(colorInput.node.options[1].innerText).toBe("green");
    expect(colorInput.node.options[2].value).toBe("0000ff");
    expect(colorInput.node.options[2].innerText).toBe("blue");
});

test("writing to NumberInput doesn't break when not tracking a model", () => {
    const widthInput = new NumberInput({property: 'width', changeEvent: 'changeWidth'});
    document.body.appendChild(widthInput.node);
    widthInput.node.value = "60";
    widthInput.node.dispatchEvent(new Event('change'));
    expect(widthInput.node.value).toBe("60");
});

test('NumberInput can track model', () => {
    const rect = new Rectangle({width: 10, height: 20});
    const widthInput = new NumberInput({property: 'width', changeEvent: 'changeWidth'});
    document.body.appendChild(widthInput.node);
    widthInput.trackModel(rect);
    rect.width = 50;
    expect(widthInput.node.value).toBe("50");
    widthInput.node.value = "60";
    widthInput.node.dispatchEvent(new Event('change'));
    expect(rect.width).toBe(60);
});

test('SelectInput can track model', () => {
    const rect = new Rectangle({width: 10, height: 20});
    const ColorInput = SelectInput.forField(Rectangle.fields.color);
    const colorInput = new ColorInput();
    document.body.appendChild(colorInput.node);
    colorInput.trackModel(rect);
    rect.color = '00ff00';
    expect(colorInput.node.value).toBe("00ff00");
    colorInput.node.value = "0000ff";
    colorInput.node.dispatchEvent(new Event('change'));
    expect(rect.color).toBe('0000ff');
});

test('SelectInput can track model with integer field', () => {
    const wave = new Wave({waveType: 1});
    const WaveTypeInput = SelectInput.forField(Wave.fields.waveType);
    const waveTypeInput = new WaveTypeInput();
    document.body.appendChild(waveTypeInput.node);
    waveTypeInput.trackModel(wave);
    wave.waveType = 2;
    expect(waveTypeInput.node.value).toBe("2");
    waveTypeInput.node.value = "3";
    waveTypeInput.node.dispatchEvent(new Event('change'));
    expect(wave.waveType).toBe(3);
});

test('input is always cleaned', () => {
    const rect = new Rectangle({width: 10, height: 20});
    const widthInput = new NumberInput({property: 'width', changeEvent: 'changeWidth'});
    document.body.appendChild(widthInput.node);
    widthInput.trackModel(rect);
    widthInput.node.value = "200";
    widthInput.node.dispatchEvent(new Event('change'));
    expect(rect.width).toBe(100);
    expect(widthInput.node.value).toBe("100");

    // setting an out-of-range value again won't cause a change event,
    // but we must still end up with the input showing the cleaned value
    widthInput.node.value = "300";
    widthInput.node.dispatchEvent(new Event('change'));
    expect(rect.width).toBe(100);
    expect(widthInput.node.value).toBe("100");
});

test('inputs have labels', () => {
    const WidthInput = NumberInput.forField(Rectangle.fields.width);
    const widthInput = new WidthInput();
    expect(widthInput.node.id).toBe("width");

    const labelNode = widthInput.labelNode;
    expect(labelNode.textContent).toBe("Width");
    expect(labelNode.htmlFor).toBe("width");

    // labelNode should be cached
    expect(widthInput.labelNode).toBe(labelNode);
});

test('inputs stop tracking model when new model is set', () => {
    const rect1 = new Rectangle({width: 10, height: 20});
    const rect2 = new Rectangle({width: 30, height: 40});
    const widthInput = new NumberInput({property: 'width', changeEvent: 'changeWidth'});
    document.body.appendChild(widthInput.node);
    widthInput.trackModel(rect1);
    rect1.width = 50;
    expect(widthInput.node.value).toBe("50");
    widthInput.trackModel(rect2);
    rect1.width = 60;
    expect(widthInput.node.value).toBe("30");
    rect2.width = 70;
    expect(widthInput.node.value).toBe("70");
});

test('inputs work without a property', () => {
    const widthInput = new NumberInput({value: 50});
    document.body.appendChild(widthInput.node);
    expect(widthInput.node.value).toBe("50");
    widthInput.showValue(60);
    widthInput.node.dispatchEvent(new Event('change'));
    expect(widthInput.node.value).toBe("60");
    const rect = new Rectangle({width: 10, height: 20});
    widthInput.trackModel(rect);  // no effect
    expect(widthInput.node.value).toBe("60");
});

test('SelectInput works without a property', () => {
    const ColorInput = SelectInput.withOptions({
            choices: [
            ['ff0000', 'red'],
            ['00ff00', 'green'],
            ['0000ff', 'blue'],
        ],
        value: '00ff00',
    });
    const colorInput = new ColorInput();
    document.body.appendChild(colorInput.node);
    expect(colorInput.node.value).toBe("00ff00");

    colorInput.node.value = "0000ff";
    colorInput.node.dispatchEvent(new Event('change'));
    expect(colorInput.node.value).toBe("0000ff");

    const rect = new Rectangle({width: 10, height: 20, color: 'ff0000'});
    colorInput.trackModel(rect);  // no effect
    expect(colorInput.node.value).toBe("0000ff");
});

test('InputList can be constructed from field', () => {
    const TodoListDisplay = InputList.forField(TodoList.fields.todos, {
        elementInputClass: TextInput.forField(TodoList.fields.todos.subfield),
    });
    const todoList = new TodoList({
        todos: ['stuff turkey', 'buy milk', 'clean house'],
    });

    const todoListDisplay = new TodoListDisplay();
    document.body.appendChild(todoListDisplay.node);

    expect(todoListDisplay.node.tagName).toBe("UL");
    expect(todoListDisplay.node.children[0].tagName).toBe("LI");
    expect(todoListDisplay.node.children[0].children[0].tagName).toBe("INPUT");

    let changedIndex = null;
    let changedValue = null;
    todoListDisplay.on("change", (index, value) => {
        changedIndex = index;
        changedValue = value;
    })

    todoListDisplay.node.children[0].children[0].value = "write todo list";
    todoListDisplay.node.children[0].children[0].dispatchEvent(new Event('change'));

    expect(changedIndex).toBe(0);
    expect(changedValue).toBe("write todo list");

    todoListDisplay.trackModel(todoList);
    expect(todoListDisplay.node.children[0].children[0].value).toBe("stuff turkey");
    todoList.setTodo(0, 'put turkey in oven');
    expect(todoListDisplay.node.children[0].children[0].value).toBe("put turkey in oven");
    todoListDisplay.node.children[1].children[0].value = "buy eggs";
    todoListDisplay.node.children[1].children[0].dispatchEvent(new Event('change'));
    expect(todoList.getTodo(1)).toBe("buy eggs");
    const otherTodoList = new TodoList({
        todos: ['milk cows', 'feed chickens', 'clean barn'],
    });
    todoListDisplay.trackModel(otherTodoList);
    expect(todoListDisplay.node.children[0].children[0].value).toBe("milk cows");
});

test('InputList works without a property', () => {
    const TodoListDisplay = InputList.withOptions({
        elementCount: 3,
        elementInputClass: TextInput,
    });

    const todoListDisplay = new TodoListDisplay();
    document.body.appendChild(todoListDisplay.node);
    expect(todoListDisplay.node.tagName).toBe("UL");
    expect(todoListDisplay.node.children[0].tagName).toBe("LI");
    expect(todoListDisplay.node.children[0].children[0].tagName).toBe("INPUT");

    let changedIndex = null;
    let changedValue = null;
    todoListDisplay.on("change", (index, value) => {
        changedIndex = index;
        changedValue = value;
    })

    todoListDisplay.node.children[0].children[0].value = "buy eggs";
    todoListDisplay.node.children[0].children[0].dispatchEvent(new Event('change'));
    expect(changedIndex).toBe(0);
    expect(changedValue).toBe("buy eggs");
});
