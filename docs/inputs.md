# Inputs

catwalk-ui provides a set of input components that can be used to track model fields.

Starting with a model definition:

```javascript
import { Model, fields } from 'catwalk';

class Rectangle extends Model([
    new fields.IntegerField('width', {min: 1, max: 1000}),
    new fields.IntegerField('height', {min: 1, max: 1000}),
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

const rect = new Rectangle({width: 50, height: 50, color: 'red'});
window.rect = rect;
```

we can set up a `NumberInput` to track the `width` field of `rect`:

```javascript
import { NumberInput } from 'catwalk-ui';

const myWidthInput = new NumberInput({
    property: 'width', changeEvent: 'changeWidth', min: 1, max: 100
});
myWidthInput.trackModel(rect);
```

The `trackModel` method creates a two-way connection between the input and the given model instance, accessing the `'width'` property and listening to the `'changeWidth'` event as specified on `NumberInput`'s constructor.

Since `NumberInput` is a component, it provides a `node` property giving a DOM node that can be inserted into the document:

```javascript
document.body.appendChild(myWidthInput.node);
```

Try reading and writing `window.rect.width` in the browser's JavaScript console - you'll see that the input field and the model value are kept in sync with each other.

Rather than instantiating `NumberInput` with a set of properties, we can use `NumberInput.withOptions` to create a subclass that will have those options pre-set on all instances:

```javascript
const WidthInput = NumberInput.withOptions({
    property: 'width', changeEvent: 'changeWidth', min: 1, max: 100
});
const myWidthInput1 = new WidthInput();
const myWidthInput2 = new WidthInput();
const myWidthInput3 = new WidthInput();
myWidthInput1.trackModel(rect);
myWidthInput2.trackModel(rect);
myWidthInput3.trackModel(rect);
document.body.appendChild(myWidthInput1.node);
document.body.appendChild(myWidthInput2.node);
document.body.appendChild(myWidthInput3.node);
```

Note that the options we're passing to `withOptions` are really just duplicating information defined on the model. As a shorthand, we can tell NumberInput to pick up its options from the model field using `forField`:

```javascript
const WidthInput = NumberInput.forField(Rectangle.fields.width);
```

Like `withOptions`, `forField` returns a class rather than an instance - it must be instantiated separately.

Inputs provide a `labelNode` property, giving a `<label>` element for the input:

```javascript
import { TextInput } from 'catwalk-ui';

const myWidthInput = new WidthInput();
myWidthInput.trackModel(rect);

document.body.appendChild(myWidthInput.labelNode);
document.body.appendChild(myWidthInput.node);
```

The input components provided by `catwalk-ui` are:

* `Input` - the base class for all inputs, not intended to be used directly. Recognises the following options:
    * `property` - the name of the model field to track
    * `changeEvent` - the name of the event to listen to on the model
    * `label` - the text to use for the input's label
    * `id` - the identifier to use for the input's `id` attribute
    * `value` - the initial value for the input (note that this will be replaced by the value from the model when `trackModel` is called)
    * `attributes` - an object containing additional attributes to set on the input element
* `TextInput` - provides an `<input type="text">` element, suitable for tracking `ValueField`s with string values.
* `NumberInput` - provides an `<input type="number">` element, suitable for tracking `IntegerField`s. Recognises the following additional options:
    * `min` - the minimum value for the input
    * `max` - the maximum value for the input
* `RangeInput` - provides an `<input type="range">` element, suitable for tracking `IntegerField`s as a slider control. Recognises the following additional options:
    * `min` - the minimum value for the input
    * `max` - the maximum value for the input
* `SelectInput` - provides a `<select>` element, suitable for tracking `EnumField`s. Recognises the following additional option:
    * `choices` - a list of [value, label] pairs to use for the `<option>` elements

Examples:

```javascript
import { TextInput, SelectInput } from 'catwalk-ui';

const NameInput = TextInput.forField(Rectangle.fields.name);
const myNameInput = new NameInput();
myNameInput.trackModel(rect);
const ColorInput = SelectInput.forField(Rectangle.fields.color);
const myColorInput = new ColorInput();
myColorInput.trackModel(rect);

document.body.appendChild(myNameInput.node);
document.body.appendChild(myColorInput.node);
```
