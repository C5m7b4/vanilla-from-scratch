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