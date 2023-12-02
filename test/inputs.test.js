/**
 * @jest-environment jsdom
 */

const { Model, fields } = require('catwalk');
const { Component, NumberInput, TextInput } = require('../');

class Rectangle extends Model([
    new fields.IntegerField('width', {min: 1, max: 100}),
    new fields.IntegerField('height', {min: 1, max: 100}),
    new fields.ValueField('color'),
]) {
    getArea() {
        return this.width * this.height;
    }
}

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

test('TextInput can be constructed from field', () => {
    const ColorInput = TextInput.forField(Rectangle.fields.color);
    const colorInput = new ColorInput();
    expect(colorInput.node.type).toBe("text");
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
