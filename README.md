# webpack-express-middleware

> Sweet express and webpack integration.

```bash
npm install --save webpack-express-middleware
```

Set up a webpack server using [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) and [webpack-hot-middleware](https://github.com/glenjamin/webpack-hot-middleware) that also support production mode and a sweet terminal output inspired by [create-react-app](https://github.com/facebookincubator/create-react-app).

![Screenshot](https://dl.dropboxusercontent.com/u/2012417/Screen%20Shot%202016-09-23%20at%2015.54.01.png)

An example [`webpack.config.js` can be found here](https://github.com/Hanse/hot-redux-chassis/blob/master/webpack/webpack.config.babel.js). (Full-fledged including HMR, Babel, PostCSS, dev + prod builds, code splitting)

```js
const express = require('express');
const createWebpackMiddleware = require('express-webpack-middleware');
const app = express();
const config = require('./webpack.config.js');
const compiler = require('webpack')(config);

app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST || '0.0.0.0');

const webpackMiddleware = createWebpackMiddleware(compiler, config);
webpackMiddleware(app);

app.listen(app.get('port'), app.get('host'), webpackMiddleware.listen);
```

## Why
You want better output in your terminal and a server that just works, both for development and simple production scenarios (e.g need to run the app on Heroku).

The module will only setup the development features when `NODE_ENV !== 'production'`. In production mode, whatever is defined as `output.path` in your webpack config will be served using `express.static()`.

Using this server setup, an app can be deployed instantly to Heroku and just work. See also [hot-redux-chassis](https://github.com/Hanse/hot-redux-chassis).

## License
MIT
