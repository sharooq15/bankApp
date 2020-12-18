'use strict';

import path from 'path';
import http from 'http';
import nconf from 'nconf';
import express from 'express';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import attachRoutes from './lib/server/routes';
import * as middleware from './lib/server/middleware';

nconf.argv().env().file({
  file: `${process.cwd()}/config.json`
});

let app = express(),
    httpServer,
    buildDir = path.join(__dirname, 'build'),
    env = nconf.get('env') || 'development',
    host = nconf.get('host') || 'localhost',
    protocol = nconf.get('protocol') || 'http',
    port = process.env.PORT || nconf.get('port');

// attaching middlewares
app.use(cookieParser());
app.use([middleware.rawBodyParser, middleware.encodedBodyParser, middleware.jsonBodyParser]);

// attaching routes
attachRoutes(app);

// error handling
app.use(middleware.errorHandler);

//create http server
httpServer= http.createServer(app);

// start server
httpServer.listen(port, function() {
  console.info(`Server Config: ${env}`);
  console.info(`Server Port: ${port}`);
  console.info(`Server URL: ${protocol}://${host}:${port}`);
});
httpServer.timeout = 900000;
