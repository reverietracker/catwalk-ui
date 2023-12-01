# Components

A component is a JavaScript object with an HTML representation defined through the `createNode` method and available through the `node` property. The HTML representation is a DOM element, which can be inserted into the document using `appendChild` or similar.

```javascript
import { Component } from 'catwalk-ui';

class Greeting extends Component {
    constructor(options) {
        super(options);
        this.name = this.options.name || 'World';
        this.color = this.options.color || 'red';
    }

    createNode() {
        const node = document.createElement('h1');
        node.textContent = `Hello, ${this.name}!`;
        node.style.color = this.color;
        return node;
    }
};

const greeting = new Greeting({name: 'Bob'});

document.body.appendChild(greeting.node);
```

The HTML definition can be written using [JSX](https://react.dev/learn/writing-markup-with-jsx):

```javascript
import { Component } from 'catwalk-ui';

class Greeting extends Component {
    constructor(options) {
        super(options);
        this.name = this.options.name || 'World';
        this.color = this.options.color || 'red';
    }

    createNode() {
        return (
            <h1 style={{color: this.color}}>
                Hello, {this.name}!
            </h1>
        );
    }
};

const greeting = new Greeting({name: 'Bob'});

document.body.appendChild(greeting.node);
```

The `withOptions` method can be used to create a subclass with default options:

```javascript
const PurpleGreeting = Greeting.withOptions({color: 'purple'});

const greeting = new PurpleGreeting({name: 'Bob'});

document.body.appendChild(greeting.node);
```
