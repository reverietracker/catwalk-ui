class NumberInput {
    constructor(opts) {
        this.property = opts.property;
        this.changeEvent = opts.changeEvent;
        this.min = ('min' in opts) ? opts.min : null;
        this.max = ('max' in opts) ? opts.max : null;

        this.node = this.createNode();
        this.model = null;
    }

    createNode() {
        const node = document.createElement("input");
        node.type = "number";
        node.addEventListener("change", () => {
            this.writeValue(this.node.value);
        });
        if (this.min !== null) node.min = this.min;
        if (this.max !== null) node.max = this.max;
        return node;
    }

    writeValue(newValue) {
        if (!this.model) return;
        this.model[this.property] = newValue;
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
}

module.exports = { NumberInput };
