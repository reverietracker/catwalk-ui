# catwalk-ui

`catwalk-ui` is the UI layer for the [Catwalk](https://www.npmjs.com/package/catwalk) framework, allowing easy creation of user interfaces for viewing and editing a data model, that stay up to date with any changes in that model.

## Installation

```sh
npm install catwalk catwalk-ui
```

catwalk-ui works best when JSX support is set up, to allow defining UI components using HTML-like syntax. To do this on a Webpack-based project:

```sh
npm install --save-dev babel-loader @babel/core @babel/plugin-transform-react-jsx-development @babel/preset-env
```

Then, in webpack.config.js, add a rule for `.js` files with the `@babel/plugin-transform-react-jsx` plugin configured as follows:

```javascript
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-react-jsx",
                {
                  "importSource": "catwalk-ui",
                  "runtime": "automatic",
                }
              ]
            ],
          },
        },
      },
    ],
  },
```
