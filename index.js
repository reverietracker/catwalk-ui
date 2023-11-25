class Input {
    constructor(opts) {
        this.property = opts.property;
        this.changeEvent = opts.changeEvent;
        this.label = opts.label;

        this._node = null;
        this.model = null;
    }

    get node() {
        if (!this._node) {
            this._node = this.createNode();
        }
        return this._node;
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

    followModel(model) {
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

    static forField(field, opts) {
        return new this({
            ...this.getOptsFromField(field),
            ...opts
        });
    }
}

class TextInput extends Input {
    inputType = "text";
}

class NumberInput extends Input {
    inputType = "number";

    constructor(opts) {
        super(opts);
        this.min = ('min' in opts) ? opts.min : null;
        this.max = ('max' in opts) ? opts.max : null;
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

module.exports = { NumberInput, TextInput };
