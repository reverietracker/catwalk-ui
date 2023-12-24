const { Component } = require('./components');

class Input extends Component {
    constructor(options) {
        super(options);

        this.property = this.options.property;
        this.label = this.options.label;
        this.id = this.options.id;

        this._labelNode = null;
        const changeEvent = this.options.changeEvent;
        if (this.property && changeEvent) {
            this.modelEventHandlers.push({
                property: this.property,
                changeEvent,
                callback: (newValue) => {
                    this.renderValue(newValue);
                }
            });
        }
    }

    createNode() {
        const node = document.createElement("input");
        node.type = this.inputType;
        node.id = this.id;
        if (this.property) {
            node.addEventListener("change", () => {
                this.writeValue(this.node.value);
            });
        }
        return node;
    }

    get labelNode() {
        if (!this._labelNode) {
            this._labelNode = document.createElement("label");
            this._labelNode.append(this.label);
            this._labelNode.htmlFor = this.id;
        }
        return this._labelNode;
    }

    writeValue(newValue) {
        if (!this.model) return;
        this.model[this.property] = newValue;
        // read back the value from the model, in case it was cleaned
        this.renderValue(this.model[this.property]);
    }

    renderValue(value) {
        this.node.value = value;
    }

    static getOptsFromField(field) {
        return {
            label: field.label,
            property: field.name,
            id: field.name,
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

class SelectInput extends Input {
    constructor(options) {
        super(options);
        this.choices = this.options.choices;
    }

    createNode() {
        const node = document.createElement("select");
        node.id = this.id;
        this.choices.forEach(([value, label]) => {
            const option = document.createElement("option");
            option.value = value;
            option.innerText = label;
            node.append(option);
        });
        node.addEventListener("change", () => {
            this.writeValue(this.node.value);
        });
        return node;
    }

    static getOptsFromField(field) {
        return {
            ...super.getOptsFromField(field),
            choices: field.choices,
        };
    }
}

module.exports = { Input, NumberInput, TextInput, SelectInput };
