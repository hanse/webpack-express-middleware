const path = require('path');
const express = require('express');
const chalk = require('chalk');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const clearConsole = require('react-dev-utils/clearConsole');

const isDevelopment = process.env.NODE_ENV !== 'production';

function printMessage(message, app) {
  if (!isDevelopment) {
    console.log(message);
    return;
  }

  clearConsole();
  console.log(`
  The app is running at ${chalk.blue(`http://localhost:${app.get('port')}`)}!
  NODE_ENV=${chalk.green(process.env.NODE_ENV)}
  ${message}
  `);
}

function createWebpackMiddleware(compiler, config) {
  let appRef;
  const webpackMiddleware = (app) => {
    appRef = app;
    if (isDevelopment) {
      compiler.plugin('invalid', () => {
        printMessage(chalk.yellow('Compiling assets...'), app);
      });

      compiler.plugin('done', (stats) => {
        const messages = formatWebpackMessages(stats.toJson({}, true));
        const hasErrors = messages.errors.length;
        const hasWarnings = messages.warnings.length;

        if (!hasErrors && !hasWarnings) {
          printMessage(chalk.green(`Assets compiled successfully in ${stats.endTime - stats.startTime} ms :-)`), app);
          return;
        }

        if (hasErrors) {
          printMessage(chalk.red('Failed to compile assets :-('), app);
          messages.errors.forEach((message) => {
            console.log(message);
            console.log();
          });
          return;
        }

        if (hasWarnings) {
          printMessage(chalk.yellow(`Compiled assets with warnings in ${stats.endTime - stats.startTime} ms :/`), app);
          messages.warnings.forEach((message) => {
            console.log(message);
            console.log();
          });
        }
      });

      app.use(require('webpack-dev-middleware')(compiler, {
        publicPath: config.output.publicPath,
        quiet: true
      }));

      app.use(require('webpack-hot-middleware')(compiler, {
        log: false
      }));

      app.use(express.static(config.output.path));
      app.use((req, res, next) => {
        const filename = path.join(compiler.outputPath, 'index.html');
        compiler.outputFileSystem.readFile(filename, (err, result) => {
          if (err) {
            next(err);
            return;
          }

          res.set('Content-Type', 'text/html');
          res.send(result);
        });
      });
    } else {
      app.use(express.static(config.output.path));
      app.use((req, res) => {
        res.sendFile(`${config.output.path}/index.html`);
      });
    }
  }

  webpackMiddleware.listen = (err) => {
    if (err) {
      console.error(err);
    } else {
      printMessage(chalk.green('Go to your browser :-)'), appRef);

      if (!process.env.NODE_ENV) {
        printMessage(
          chalk.red(`NODE_ENV is not set. Please put ${chalk.cyan('export NODE_ENV=development')} in your shell config.`),
          appRef
        );
      }
    }
  };

  return webpackMiddleware;
}

module.exports = createWebpackMiddleware;
