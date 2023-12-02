/**
 * @jest-environment jsdom
 */

const { Model, fields } = require('catwalk');
const { Component, Container, NumberInput, TextInput } = require('../');

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

test('container can be rendered and track model', () => {
    class Heading extends Component {
        createNode() {
            const node = document.createElement("h2");
            node.textContent = this.options.text;
            return node;
        }
    }

    class RectangleView extends Container {
        static components = {
            heading: Heading.withOptions({text: "Rectangle"}),
            colorInput: TextInput.forField(Rectangle.fields.color),
            widthInput: NumberInput.forField(Rectangle.fields.width),
            heightInput: NumberInput.forField(Rectangle.fields.height),
        }

        createNode() {
            const node = document.createElement("div");
            node.append(this.heading.node);
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
    const rect = new Rectangle({width: 50, height: 50, color: 'red'});
    view.trackModel(rect);
    expect(view.colorInput.node.value).toBe('red');
    expect(view.widthInput.node.value).toBe('50');
    expect(view.heightInput.node.value).toBe('50');
    rect.width = 60;
    expect(view.widthInput.node.value).toBe('60');
    view.widthInput.node.value = '70';
    view.widthInput.node.dispatchEvent(new Event('change'));
    expect(rect.width).toBe(70);
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
