# Vanilla from Scratch

In this tutorial, we are going to build an application in Vanilla JS from complete scratch.

Step 1:
install webpack:

```js
npm install --save-dev webpack webpack-cli
```

install prettier:

```js
npm install --save-dev prettier
```

create a prettier config

install webpack-dev-server

```js
npm install --save-dev webpack-dev-server
```

create the public folder and stub out an index.html file

Install html-webpack-plugin

```js
npm install --save-dev html-webpack-plugin
```

add start to package.json

```js
"start": "webpack serve --open"
```

Start project and we should get a webpage

install MiniCssExtractPlugin

```js
npm install --save-dev mini-css-extract-plugin
```

add rule for .js file to webpack.config.js
install babel-loader and @babel/preset-env

```js
npm install --save-dev babel-loader @babel/preset-env
```

add rule for .css file to webpack.config.js
install css-loader

```js
npm install --save-dev css-loader
```

now our webpack.config.js should look like this:

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const EsLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    port: 3007,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Vanilla JS',
      template: 'public/index.html',
    }),
    new MiniCssExtractPlugin(),
    new EsLintPlugin(),
  ],
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
};

```

add styles.css
add google font to css and setup basic css styles
import into index.js and test out a background

here is our background:

```js
background: #7b0c6e;
background: -webkit-linear-gradient(top left, #7b0c6e, #626cbe);
background: -moz-linear-gradient(top left, #7b0c6e, #626cbe);
background: linear-gradient(to bottom right, #7b0c6e, #626cbe);
```

setup eslint

```js
npm install --save-dev eslint eslint-config-prettier eslint-plugin-import 
```

now we want to see linting error in webpack output so we need another plugin

```js
npm install eslint-webpack-plugin --save-dev
```

Next we create a .eslintrc.json file to hold our linting configuration:

```js
{
  "extends":[
    "eslint:recommended",
    "plugin:import/errors",
    "prettier"
  ],
  "rules":{
    "no-console": 0,
    "no-debugger": 1,
    "no-unused-vars": 1
  },
  "parserOptions": {
    "ecmaVersion": 2021,
    "sourceType": "module"
  },
  "env":{
    "es6":true,
    "browser": true,
    "node": true
  }
}
```

then lets add a linting script to our package.json

```js
"lint": "eslint src/*.js",
```

stub out our index.html

now we are going to add some data to our app:

```js
export const data = [
  { id: 1, name: 'apple', price: 0.99, size: 'each', category: 'fruit' },
  { id: 2, name: 'bananna', price: 1.1, size: 'each', category: 'fruit' },
  { id: 3, name: 'grapes', price: 1.99, size: 'bundle', category: 'fruit' },
  { id: 4, name: 'apple', price: 0.89, size: 'each', category: 'fruit' },
  {
    id: 5,
    name: 'Dr. Pepper',
    price: 1.09,
    size: '12 oz',
    category: 'beverages',
  },
  { id: 6, name: 'Mt. Dew', price: 4.99, size: '12 pk', category: 'beverages' },
  { id: 7, name: 'Coke', price: 1.79, size: '2 Liter', category: 'beverages' },
  { id: 8, name: 'Pepsi', price: 1.79, size: '2 Liter', category: 'beverages' },
  { id: 9, name: 'Tic Tacs', price: 2.99, size: '12 oz', category: 'candy' },
  { id: 10, name: 'Snickers', price: 1.59, size: 'bar', category: 'candy' },
  { id: 11, name: 'Almond Joy', price: 1.69, size: 'bar', category: 'candy' },
];

```

let's put that in a file data data.js in the src folder

now add a utils.js file and create a function called isValid to test that something is truthy

now we are going to set a placeholder for filteredData and create some state

now lets create a little style for our app

then we are going to add some state

then lets add a grid so we can see our data

then add a function to the Array prototype so we can get unique values
and after that we will be able to filter our grid by items in category

Next we will add a select field and have that filter the view of the grid, but keep the underlying data safe.

then we are going to create some functions to retrieve the most expensive and the cheapest items in our filtered data

then we are going to add the ability to delete some data

We will also create a formatter for money so it looks nicer

then we need to add a select field so when we create an item it can have a category assigned to it

then we are going to write the code to create an item and then clear our form when we are done

then we are going to add a total cell to the grid so we can see the total of all our items

finally we will add a svg transh icon for our delets

svg path:
M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z

If we want to use any async functions we will need another plugin

```js
npm install @babel/plugin-transform-runtime
```

then we are going to need a .babelrc file with this content

```js
{
  "presets": ["@babel/preset-env"],
  "plugins": ["@babel/transform-runtime"]
}
```

the last change we are going to make is to add an express server to our app to supply our data

for this we are going to need a few more packages

```js
npm install express cors avion
```

now we are going to create a server folder in the root and add a file server.js

it will look like this:

```js
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

const data = require('./data');

app.get('/', (req, res) => {
  res.send({ error: 0, success: true, data });
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
```

once we have that we need to add a start script to the package.json

```js
"server": "node server/server.js"
```

now we can get the data from our api we just built
