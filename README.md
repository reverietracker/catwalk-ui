# catwalk-ui

`catwalk-ui` is the UI layer for the [Catwalk](https://www.npmjs.com/package/catwalk) framework, allowing easy creation of user interfaces for viewing and editing a data model, that stay up to date with any changes in that model.

## Installation

```sh
npm install catwalk catwalk-ui
```

catwalk-ui works best when JSX support is set up, to allow defining UI components using HTML-like syntax. To do this on a Webpack-based project:

```sh
npm install --save-dev babel-loader @babel/core @babel/plugin-transform-react-jsx-development @babel/preset-env
```

Then, in webpack.config.js, add a rule for `.js` files with the `@babel/plugin-transform-react-jsx` plugin configured as follows:

```javascript
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-react-jsx",
                {
                  "importSource": "catwalk-ui",
                  "runtime": "automatic",
                }
              ]
            ],
          },
        },
      },
    ],
  },
```


## Usage

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

const myWidthInput = new NumberInput({property: 'width', changeEvent: 'changeWidth', min: 1, max: 100});
myWidthInput.trackModel(rect);
```

The `trackModel` method creates a two-way connection between the input and the given model instance, accessing the `'width'` property and listening to the `'changeWidth'` event as specified on `NumberInput`'s constructor.

Instances of `NumberInput` provide a `node` property giving a DOM node that can be inserted into the document:

```javascript
document.body.appendChild(myWidthInput.node);
```

Try reading and writing `window.rect.width` in the browser's JavaScript console - you'll see that the input field and the model value are kept in sync with each other.

Rather than instantiating `NumberInput` with a set of properties, we can use `NumberInput.withOptions` to create a subclass that will have those options pre-set on all instances:

```javascript
const WidthInput = NumberInput.withOptions({property: 'width', changeEvent: 'changeWidth', min: 1, max: 100});
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
