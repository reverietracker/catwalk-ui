/**
 * @jest-environment jsdom
 */

const { Model, fields } = require('catwalk');
const { NumberInput } = require('../');

class Rectangle extends Model([
    new fields.IntegerField('width', {min: 1, max: 100}),
    new fields.IntegerField('height', {min: 1, max: 100}),
]) {
    getArea() {
        return this.width * this.height;
    }
}

test('NumberInput can be constructed from field', () => {
    const widthInput = NumberInput.forField(Rectangle.fields.width);
    document.body.appendChild(widthInput.node);
    expect(widthInput.node.min).toBe("1");
    expect(widthInput.node.max).toBe("100");
});

test("writing to NumberInput doesn't break when not following a model", () => {
    const widthInput = new NumberInput({property: 'width', changeEvent: 'changeWidth'});
    document.body.appendChild(widthInput.node);
    widthInput.node.value = "60";
    widthInput.node.dispatchEvent(new Event('change'));
    expect(widthInput.node.value).toBe("60");
});

test('NumberInput can follow model', () => {
    const rect = new Rectangle({width: 10, height: 20});
    const widthInput = new NumberInput({property: 'width', changeEvent: 'changeWidth'});
    document.body.appendChild(widthInput.node);
    widthInput.followModel(rect);
    rect.width = 50;
    expect(widthInput.node.value).toBe("50");
    widthInput.node.value = "60";
    widthInput.node.dispatchEvent(new Event('change'));
    expect(rect.width).toBe(60);
});
