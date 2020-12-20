### Tech

- A Node.js, Express.js based application
- Uses babel to transform to ES5

### TECHNOLOGIES USED

- Node.js
- Express.js
- AWS Dynamodb

### PACKAGES USED

- ESLint - For Linting and Identation
- Prettier - For Identation and Formatting
- Aws-sdk - For Connecting server with dynamodb
- bcrypt - For Encrypting and decrypting passwords
- body-parser - Parse incoming request bodies in a middleware
- njwt - Node package for generating JWT tokens
- jwt_decode - For decoding JWT tokens
- nconf - For configuring environment variables hierarchically
- socket.io - For communication between client and server
- uuid - For generating universally unique identifiers

### TABLE STRUCTURE

- user(id[unique identifier], un[username], pw[hashed password])
- staff(id[unique identifier], un[username], pw[hashed password], lra[loan request assigned], d[designation])
- loan(id[unique identifier], un[username], la[loan amount], cId[CRM id], st1[status 1], st2[status 2])

### TESTING

For Starting the app

```sh
$ yarn
$ yarn start
```

URL's and Parameters

```sh
NOTE: Choose Bearer Token for authorization and Body as raw JSON
```
USER
  * POST http://localhost:3000/user/signup (username,password)
  * POST http://localhost:3000/user/login (username,password)
  * POST http://localhost:3000/user/loan-request (loanAmount) (jwt token)
  * GET http://localhost:3000/user/view-requests () (jwt token)

STAFF
  * POST http://localhost:3000/staff/login(username,password)
  * GET http://localhost:3000/staff/view-requests () (jwt token)
  * POST http://localhost:3000/staff/act-on-request (status, loanId) (jwt token)