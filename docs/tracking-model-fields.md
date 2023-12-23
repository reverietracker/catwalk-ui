# Tracking model fields

So far, we've seen how inputs provide a `trackModel` method to keep the input updated with any changes to the model, and containers provide a `trackModel` method to pass on to all child components. `trackModel` is in fact available on the base `Component` class, and we can use this mechanism in our own component subclasses.

By default, the only effect of `trackModel` is to set the component's `model` property to the given model instance. We can override this to set up an event listener on the model, and to update the component's HTML representation when the model changes. Using the `Rectangle` model from earlier:

```javascript
import { Component } from 'catwalk-ui';

class RectangleDisplay extends Component {
    constructor(options) {
        super(options);
        this.changeColorHandler = (newColor) => {
            this.node.style.backgroundColor = newColor;
        };
    }

    createNode() {
        return <div>Rectangle</div>;
    }

    trackModel(model) {
        // If we're already tracking a model, remove the old listener
        if (this.model) {
            this.model.removeListener('changeColor', this.changeColorHandler);
        }
        super.trackModel(model);

        // Make an initial update to the HTML representation to match the model
        this.changeColorHandler(this.model.color);

        // Set up a new listener to respond to changes to the model
        this.model.on('changeColor', this.changeColorHandler);
    }
}
```

This pattern of tracking changes to a model field is common enough that `Component` provides the `trackField` method as a shortcut:

```javascript
import { Component } from 'catwalk-ui';

class RectangleDisplay extends Component {
    constructor(options) {
        super(options);
        this.trackField(Rectangle.fields.color, (newColor) => {
            this.node.style.backgroundColor = newColor;
        });
    }

    createNode() {
        return <div>Rectangle</div>;
    }
}
```

Here `trackField` is passed a field object and a callback function. The callback will be called with the new value of the field whenever it changes, and also when the model is first connected via `trackModel`.
