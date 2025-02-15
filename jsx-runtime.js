// const { Component } = require('.');

function addChild(parent, child) {
    if (typeof(child) == 'object') {
        if ('node' in child) {
            parent.appendChild(child.node);
        } else {
            parent.appendChild(child);
        }
    } else {
        parent.appendChild(document.createTextNode(child));
    }
}

function jsxs(name, attrs) {
    let elem = document.createElement(name);
    for (const[attr, value] of Object.entries(attrs)) {
        if (attr == 'children') {
            if (Array.isArray(value)) {
                value.forEach((child) => {addChild(elem, child);});
            } else {
                addChild(elem, value);
            }
        } else if (attr.startsWith('on')) {
            elem.addEventListener(attr.substring(2), value);
        } else if (attr == 'style' && typeof(value) == 'object') {
            for (const [styleName, styleValue] of Object.entries(value)) {
                elem.style[styleName] = styleValue;
            }
        } else if (attr == 'className') {
            if (Array.isArray(value)) {
                elem.classList.add(...value);
            } else {
                elem.classList.add(value);
            }
        } else {
            elem.setAttribute(attr, value);
        }
    }
    return elem;
}

let jsx = jsxs;

function Fragment() {
    console.log('Fragment', arguments);
    throw 'unimplemented';
}

module.exports = { jsx, jsxs, Fragment };
