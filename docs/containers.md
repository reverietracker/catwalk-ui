# Containers

A container is a component that can contain other components.  The `Container` class has a class-level `components` property that can be used to define the components that will be created when the container is instantiated. These are available as properties on the container instance. When defining the container's HTML representation using JSX, the child components can be referenced directly (i.e. it is possible to write `{this.someInput}` rather than `{this.someInput.node}`). Using the `Rectangle` model seen previously:

```javascript
import { Container } from 'catwalk-ui';

class RectanglePanel extends Container {
    static components = {
        colorInput: TextInput.forField(Rectangle.fields.color),
        widthInput: NumberInput.forField(Rectangle.fields.width),
        heightInput: NumberInput.forField(Rectangle.fields.height),
    }

    createNode() {
        return (
            <div>
                <h2>Rectangle</h2>
                {this.colorInput} -
                {this.widthInput} x {this.heightInput}
            </div>
        );
    }
}

rect = new Rectangle({width: 50, height: 50, color: 'red'});
const rectanglePanel = new RectanglePanel();
rectanglePanel.trackModel(rect);

document.body.appendChild(rectanglePanel.node);
```

Calls to `trackModel` method on a container will be passed on to all child components.

If a `createNode` method is not provided, a default rendering will be used, consisting of a `<div>` element containing the child components in sequence. Child components that provide a `labelNode` property will be rendered as a `<div>` containing the label and the component; child components that do not provide `labelNode` will be rendered directly with no wrapper. The `baseElementName` option can be overridden to use a different element type as the top-level element.

## Fieldsets

The `Fieldset` class is a subclass of `Container` that provides a default rendering using `<fieldset>` as the top-level element. It also provides a `legend` option that can be used to set the `<legend>` element.

```javascript
import { Container, Fieldset } from 'catwalk-ui';

class SizeFieldset extends Fieldset.withOptions({legend: 'Size'}) {
    static components = {
        widthInput: NumberInput.forField(Rectangle.fields.width),
        heightInput: NumberInput.forField(Rectangle.fields.height),
    }
}

class RectanglePanel extends Container {
    static components = {
        colorInput: TextInput.forField(Rectangle.fields.color),
        sizeFieldset: SizeFieldset,
    }

    createNode() {
        return (
            <div>
                <h2>Rectangle</h2>
                <div>
                    {this.colorInput.labelNode}
                    {this.colorInput}
                </div>
                {this.sizeFieldset}
            </div>
        );
    }
}
```
