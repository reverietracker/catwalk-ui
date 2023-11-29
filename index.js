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

class Input extends Component {
    constructor(options) {
        super(options);

        this.property = this.options.property;
        this.changeEvent = this.options.changeEvent;
        this.label = this.options.label;

        this.model = null;
    }


    createNode() {
        const node = document.createElement("input");
        node.type = this.inputType;
        node.addEventListener("change", () => {
            this.writeValue(this.node.value);
        });
        return node;
    }

    writeValue(newValue) {
        if (!this.model) return;
        this.model[this.property] = newValue;
        // read back the value from the model, in case it was cleaned
        this.renderValue(this.model[this.property]);
    }

    trackModel(model) {
        this.model = model;
        this.model.on(this.changeEvent, (newValue) => {
            this.renderValue(newValue);
        })
        this.renderValue(this.model[this.property]);
    }

    renderValue(value) {
        this.node.value = value;
    }

    static getOptsFromField(field) {
        return {
            label: field.label,
            property: field.name,
            changeEvent: field.eventName,
        };
    }

    static forField(field, options) {
        return this.withOptions({
            ...this.getOptsFromField(field),
            ...options
        });
    }
}

class TextInput extends Input {
    inputType = "text";
}

class NumberInput extends Input {
    inputType = "number";

    constructor(options) {
        super(options);
        this.min = ('min' in this.options) ? this.options.min : null;
        this.max = ('max' in this.options) ? this.options.max : null;
    }

    createNode() {
        const node = super.createNode();
        if (this.min !== null) node.min = this.min;
        if (this.max !== null) node.max = this.max;
        return node;
    }

    static getOptsFromField(field) {
        return {
            ...super.getOptsFromField(field),
            min: field.min,
            max: field.max,
        };
    }
}

module.exports = { Component, NumberInput, TextInput };
