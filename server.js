import http from 'http';
import nconf from 'nconf';
import express from 'express';
import cookieParser from 'cookie-parser';
import * as middleware from './src/server/middleware';
import {
  userCtrl,
} from './src/server/controllers';

nconf.argv().env().file({
  file: `${process.cwd()}/config.json`,
});

const app = express();
const env = nconf.get('env') || 'development';
const host = nconf.get('host') || 'localhost';
const protocol = nconf.get('protocol') || 'http';
const port = process.env.PORT || nconf.get('port');

// attaching middlewares
app.use(cookieParser());
app.use([middleware.rawBodyParser, middleware.encodedBodyParser, middleware.jsonBodyParser]);

// attaching routes
app.post('/user/signup', (req, res) => userCtrl.userSignup(req, res));

// error handling
app.use(middleware.errorHandler);

// create http server
const httpServer = http.createServer(app);

// start server
httpServer.listen(port, () => {
  console.info(`Server Config: ${env}`);
  console.info(`Server Port: ${port}`);
  console.info(`Server URL: ${protocol}://${host}:${port}`);
});
httpServer.timeout = 900000;
