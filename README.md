# Shell- Drop Zone

The complete back end API of the Shell - drop zone application.

Technologies Used:

- JavaScript
- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- NPM Middlewares

Features:

- Enables users to Upload a file and generate a download link that can be accessable from anywhere.
- User authentication is provided via JWT tokens.
- Users can Sign up, Login, Create Links and get all there created links from the database.
- A Forgot password facility is provided via which users can get a token to access the forgot password URL link to there email which will be valid for 10 mins.

Security:

- NoSQL Query Injection attacks Security middleware provided.
- XSS attacks Security Middleware provided.
- Admin has special privalages to access specific routes which the regualr user does not.
- Authentication of routes is done before performing any actions.
- Only 100 reqs per hour allowed per ip address.
- Mongoose schema provided so the attacker can't add malicious entries.
- Password Protection provided via using bcrypt.
- Random password forgot tokens protection provided via Crypto Package
