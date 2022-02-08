# Vanilla from Scratch

In this tutorial, we are going to build an application in Vanilla JS from complete scratch.

Step 1:
install webpack:
npm install --save-dev webpack webpack-cli

install prettier:
npm install --save-dev prettier
create a prettier config

install webpack-dev-server
npm install --save-dev webpack-dev-server

create the public folder and stub out an index.html file

Install html-webpack-plugin
npm install --save-dev html-webpack-plugin

add start to package.json
"start": "webpack serve --open"
Start project and we should get a webpage

install MiniCssExtractPlugin
npm install --save-dev mini-css-extract-plugin

add rule for .js file to webpack.config.js
install babel-loader and @babel/preset-env
npm install --save-dev babel-loader @babel/preset-env

add rule for .css file to webpack.config.js
install css-loader
npm install --save-dev css-loader

add styles.css
add google font to css and setup basic css styles
import into index.js and test out a background

here is our background:
background: #7b0c6e;
background: -webkit-linear-gradient(top left, #7b0c6e, #626cbe);
background: -moz-linear-gradient(top left, #7b0c6e, #626cbe);
background: linear-gradient(to bottom right, #7b0c6e, #626cbe);

setup eslint
npm install --save-dev eslint eslint-config-prettier eslint-plugin-import 

now we want to see linting error in webpack output so we need another plugin
npm install eslint-webpack-plugin --save-dev

stub out our index.html

now we are going to add some data to out app:

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

``

let's put that in a file data data.js in the src folder

now add a utils.js file and create a function called isValid to test that something is truthy


now we are going to set a placeholder for filteredData and create some state


now lets create a little style for our app

then we are going to add some state

then lets add a grid so we can see our data

then add a function to the Array prototype so we can get unique values
and after that we will be able to filter our grid by items in category