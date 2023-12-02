# Inputs

catwalk-ui provides a set of input components that can be used to track model fields.

Starting with a model definition:

```javascript
import { Model, fields } from 'catwalk';

class Rectangle extends Model([
    new fields.IntegerField('width', {min: 1, max: 1000}),
    new fields.IntegerField('height', {min: 1, max: 1000}),
    new fields.ValueField('color'),
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
const myWidthInput1 = new WidthInput();
const myWidthInput1 = new WidthInput();
myWidthInput1.trackModel(rect);
myWidthInput1.trackModel(rect);
myWidthInput1.trackModel(rect);
document.body.appendChild(myWidthInput1.node);
document.body.appendChild(myWidthInput1.node);
document.body.appendChild(myWidthInput1.node);
```

Note that the options we're passing to `withOptions` are really just duplicating information defined on the model. As a shorthand, we can tell NumberInput to pick up its options from the model field using `forField`:

```javascript
const WidthInput = NumberInput.forField(Rectangle.fields.width);
```

Like `withOptions`, `forField` returns a class rather than an instance - it must be instantiated separately.

Alongside `NumberInput`, a `TextInput` component is provided for tracking string fields. Inputs also provide a `labelNode` property, giving a `<label>` element for the input:

```javascript
import { TextInput } from 'catwalk-ui';

const ColorInput = TextInput.forField(Rectangle.fields.color);
const myColorInput = new ColorInput();
myColorInput.trackModel(rect);

document.body.appendChild(myColorInput.labelNode);
document.body.appendChild(myColorInput.node);
```
