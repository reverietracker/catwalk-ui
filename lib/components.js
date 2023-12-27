class Component {
    static options = {};

    constructor(options) {
        this.options = {
            ...this.constructor.options,
            ...options
        };

        this.model = null;
        this.modelEventHandlers = [];
    }

    get node() {
        Object.defineProperty(this, 'node', { value: this.createNode() });
        return this.node;
    }

    createNode() {
        throw new Error("Not implemented");
    }

    trackModel(model) {
        if (this.model) {
            for (const handler of this.modelEventHandlers) {
                this.model.removeListener(handler.changeEvent, handler.callback);
            }
        }
        this.model = model;
        for (const handler of this.modelEventHandlers) {
            this.model.on(handler.changeEvent, handler.callback);
            handler.callback(this.model[handler.property]);
        }
    }

    trackField(field, updateCallback) {
        this.modelEventHandlers.push({
            property: field.name,
            changeEvent: field.eventName,
            callback: updateCallback,
        })
    }

    static withOptions(options) {
        const newOptions = {
            ...this.options,
            ...options
        };

        return class extends this {
            static options = newOptions;
        }
    }
}

class Container extends Component.withOptions({baseElementName: 'div'}) {
    static components = {};

    constructor(opts) {
        super(opts);
        for (const [name, cls] of Object.entries(this.constructor.components)) {
            this[name] = new cls();
        }
    }

    createNode() {
        const node = document.createElement(this.options.baseElementName);
        for (const name of Object.keys(this.constructor.components)) {
            const child = this[name];
            if ('labelNode' in child) {
                const childContainer = document.createElement("div");
                childContainer.append(child.labelNode);
                childContainer.append(child.node);
                node.append(childContainer);
            } else {
                node.append(child.node);
            }
        }
        return node;
    }

    trackModel(model) {
        super.trackModel(model);
        for (const name of Object.keys(this.constructor.components)) {
            this[name].trackModel(model);
        }
    }
}

class Fieldset extends Container.withOptions({baseElementName: 'fieldset'}) {
    createNode() {
        const node = super.createNode();
        if (this.options.legend) {
            const legend = document.createElement("legend");
            legend.innerText = this.options.legend;
            node.prepend(legend);
        }
        return node;
    }
}

module.exports = { Component, Container, Fieldset };
