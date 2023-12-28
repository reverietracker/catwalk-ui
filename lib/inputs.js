const Emitter = require('component-emitter');

const { Component } = require('./components');

class Input extends Component {
    constructor(options) {
        super(options);
        Emitter(this);

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
                    this.showValue(newValue);
                }
            });
        }
        if (this.property) {
            this.on("change", (newValue) => {
                this.writeValue(newValue);
            });
        }
    }

    createNode() {
        const node = document.createElement("input");
        node.type = this.inputType;
        node.id = this.id;
        if ('value' in this.options) {
            node.value = this.options.value;
        }
        if ('attributes' in this.options) {
            for (const [name, value] of Object.entries(this.options.attributes)) {
                node.setAttribute(name, value);
            }
        }
        node.addEventListener("change", () => {
            this.emit("change", node.value);
        });
        return node;
    }

    get labelNode() {
        const labelNode = document.createElement("label");
        labelNode.append(this.label);
        labelNode.htmlFor = this.id;
        Object.defineProperty(this, 'labelNode', { value: labelNode });
        return labelNode;
    }

    writeValue(newValue) {
        if (!this.model) return;
        this.model[this.property] = newValue;
        // read back the value from the model, in case it was cleaned
        this.showValue(this.model[this.property]);
    }

    showValue(value) {
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

class RangeInput extends NumberInput {
    inputType = "range";
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
        if ('value' in this.options) {
            node.value = this.options.value;
        }
        node.addEventListener("change", () => {
            this.emit("change", node.value);
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

class InputList extends Component {
    constructor(options) {
        super(options);
        Emitter(this);

        this.startIndex = this.options.startIndex || 0;
        this.changeHandler = (i, val) => {
            this.elementInputs[i - this.startIndex].showValue(val);
        }

        if (this.options.setterName) {
            this.on('change', (index, newValue) => {
                if (this.model) {
                    this.model[this.options.setterName](index, newValue);
                    // read back the value from the model, in case it was cleaned
                    this.showValue(index, this.model[this.options.property][index]);
                }
            });
        }
    }

    get elementInputs() {
        const elementInputs = [];
        for (let i = 0; i < this.options.elementCount; i++) {
            elementInputs[i] = this.createElementInput(i);
        }
        Object.defineProperty(this, 'elementInputs', { value: elementInputs });
        return elementInputs;
    }

    createNode() {
        const ul = document.createElement("ul");
        for (let i = 0; i < this.elementInputs.length; i++) {
            const li = document.createElement("li");
            li.appendChild(this.elementInputs[i].node);
            ul.appendChild(li);
        }
        return ul;
    }

    createElementInput(i) {
        const input = new this.options.elementInputClass();
        input.on('change', (newValue) => {
            this.emit('change', i + this.startIndex, newValue);
        });
        return input;
    }

    showValue(index, value) {
        this.elementInputs[index - this.startIndex].showValue(value);
    }

    trackModel(model) {
        if (this.model) {
            this.model.removeListener(this.options.changeEvent, this.changeHandler);
        }
        super.trackModel(model);
        for (let i = 0; i < this.options.elementCount; i++) {
            this.elementInputs[i].showValue(model[this.options.property][i + this.startIndex]);
        }
        model.on(this.options.changeEvent, this.changeHandler);
    }

    static getOptsFromField(field) {
        return {
            property: field.name,
            changeEvent: field.eventName,
            setterName: field.setterName,
            elementCount: field.length,
            startIndex: field.startIndex,
        };
    }

    static forField(field, options) {
        return this.withOptions({
            ...this.getOptsFromField(field),
            ...options
        });
    }
}

module.exports = { Input, InputList, NumberInput, RangeInput, TextInput, SelectInput };
