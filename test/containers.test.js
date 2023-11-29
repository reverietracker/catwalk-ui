/**
 * @jest-environment jsdom
 */

const { Model, fields } = require('catwalk');
const { Container, NumberInput, TextInput } = require('../');

class Rectangle extends Model([
    new fields.IntegerField('width', {min: 1, max: 100}),
    new fields.IntegerField('height', {min: 1, max: 100}),
    new fields.ValueField('color'),
]) {
    getArea() {
        return this.width * this.height;
    }
}

afterEach(() => {
    document.body.innerHTML = '';
});

test('can render container', () => {
    class RectangleView extends Container {
        static components = {
            colorInput: TextInput.forField(Rectangle.fields.color),
            widthInput: NumberInput.forField(Rectangle.fields.width),
            heightInput: NumberInput.forField(Rectangle.fields.height),
        }

        createNode() {
            const node = document.createElement("div");
            const h2 = document.createElement("h2");
            h2.textContent = "Rectangle";
            node.append(h2);
            node.append(this.colorInput.node);
            node.append(" - ");
            node.append(this.widthInput.node);
            node.append(" x ");
            node.append(this.heightInput.node);
            return node;
        }
    }

    const view = new RectangleView();
    document.body.append(view.node);
    expect(document.querySelectorAll('input').length).toBe(3);
    expect(document.querySelectorAll('h2').length).toBe(1);
});

test('Container has default rendering', () => {
    class RectangleView extends Container {
        static components = {
            colorInput: TextInput.forField(Rectangle.fields.color),
            widthInput: NumberInput.forField(Rectangle.fields.width),
            heightInput: NumberInput.forField(Rectangle.fields.height),
        }
    }

    const view = new RectangleView();
    document.body.append(view.node);
    expect(document.querySelectorAll('input').length).toBe(3);
});
