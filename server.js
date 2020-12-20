import http from 'http';
import nconf from 'nconf';
import express from 'express';
import {
  rawBodyParser,
  encodedBodyParser,
  jsonBodyParser,
  errorHandler,
  authenticateJWT,
} from './src/server/middleware';
import {
  userCtrl,
  staffCtrl,
} from './src/server/controllers';

nconf.argv().env().file({
  file: `${process.cwd()}/config.json`,
});

const app = express();
const env = nconf.get('env') || 'development';
const host = nconf.get('host') || 'localhost';
const protocol = nconf.get('protocol') || 'http';
const port = process.env.PORT || nconf.get('port');

// create http server
const httpServer = http.createServer(app);
const io = require('socket.io').listen(httpServer);

// attaching middlewares
app.use([rawBodyParser, encodedBodyParser, jsonBodyParser]);

// attaching routes for user
app.post('/user/signup',
  (req, res) => userCtrl.userSignup(req, res));
app.post('/user/login',
  (req, res) => userCtrl.userLogin(req, res));
app.post('/user/loan-request',
  authenticateJWT,
  (req, res) => userCtrl.createLoanRequest(req, res));
app.get('/user/view-requests',
  authenticateJWT,
  (req, res) => userCtrl.viewLoanRequestStatuses(req, res));

// attaching routes for staffs
app.post('/staff/login',
  (req, res) => staffCtrl.staffLogin(req, res));
app.get('/staff/view-requests',
  authenticateJWT,
  (req, res) => staffCtrl.viewLoanRequests(req, res));
app.post('/staff/act-on-request',
  authenticateJWT,
  (req, res) => {
    io.sockets.on('connection', (socket) => {
      socket.emit('server message', 'Loan Status Changed');
    });
    return staffCtrl.actOnLoanRequest(req, res);
  });

// error handling
app.use(errorHandler);

// start server
httpServer.listen(port, () => {
  console.info(`Server Config: ${env}`);
  console.info(`Server Port: ${port}`);
  console.info(`Server URL: ${protocol}://${host}:${port}`);
});
httpServer.timeout = 900000;
