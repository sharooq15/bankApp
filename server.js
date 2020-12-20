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

/*
While creating a new loan request it will create a new event
which will be caught in server to notify the CRM
*/

app.post('/user/loan-request',
  authenticateJWT,
  (req, res) => {
    io.on('connection', (socket) => {
      socket.emit('New Loan Request', req);
    });
    return userCtrl.createLoanRequest(req, res);
  });
app.get('/user/view-requests',
  authenticateJWT,
  (req, res) => userCtrl.viewLoanRequestStatuses(req, res));

/*
TODO: NotifyAssigned CRM is not implemented yet, but when an event is emitted from client
to this particular socket it catch and trigger that particular
api for notifying the CRM accordingly
*/

io.sockets.on('connection', (socket) => {
  socket.on('New Loan Request', 'notifyAssignedCRM(req, res)');
});

// attaching routes for staffs
app.post('/staff/login',
  (req, res) => staffCtrl.staffLogin(req, res));
app.get('/staff/view-requests',
  authenticateJWT,
  (req, res) => staffCtrl.viewLoanRequests(req, res));
app.post('/staff/act-on-request',
  authenticateJWT,
  (req, res) => staffCtrl.actOnLoanRequest(req, res));

// error handling
app.use(errorHandler);

// start server
httpServer.listen(port, () => {
  console.info(`Server Config: ${env}`);
  console.info(`Server Port: ${port}`);
  console.info(`Server URL: ${protocol}://${host}:${port}`);
});
httpServer.timeout = 900000;
