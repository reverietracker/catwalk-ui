# Containers

A container is a component that can contain other components.  The `Container` class has a class-level `components` property that can be used to define the components that will be created when the container is instantiated. These are available as properties on the container instance. When defining the container's HTML representation using JSX, the child components can be referenced directly (i.e. it is possible to write `{this.someInput}` rather than `{this.someInput.node}`).

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

Calls to `trackModel` method on a container will be passed on to all child components that implement the `trackModel` method.
