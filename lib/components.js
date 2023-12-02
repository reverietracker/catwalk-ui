class Component {
    static options = {};

    constructor(options) {
        this.options = {
            ...this.constructor.options,
            ...options
        };

        this._node = null;
    }

    get node() {
        if (!this._node) {
            this._node = this.createNode();
        }
        return this._node;
    }

    createNode() {
        throw new Error("Not implemented");
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

class Container extends Component {
    static components = {};

    constructor(opts) {
        super(opts);
        for (const [name, cls] of Object.entries(this.constructor.components)) {
            this[name] = new cls();
        }
    }

    createNode() {
        const node = document.createElement("div");
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
        for (const name of Object.keys(this.constructor.components)) {
            if (this[name].trackModel) this[name].trackModel(model);
        }
    }
}

module.exports = { Component, Container };
