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
- Types of files that can be uploaded : '.jpg', '.jpeg', '.png', '.gif', '.pdf', '.txt'
- Size of the file : 1024 * 1024 KB (2MB)
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

To Use Set up a config.env file with these specific environment variable names:
  NODE_ENV=
  MONGO_URL = 
  PORT = 
  
  JWT_SECRET=
  JWT_EXPIRES_IN=
  JWT_COOKIE_EXPIRES_IN=
  
  EMAIL_USERNAME=
  EMAIL_PASSWORD=
  EMAIL_HOST=
  EMAIL_PORT=
  
  FIREBASE_API_KEY=
  FIREBASE_AUTH_DOMAIN=
  FIREBASE_PROJECT_ID=
  FIREBASE_STORAGE_BUCKET=
  FIREBASE_MESSAGING_SENDER_ID=
  FIREBASE_APP_ID=
  FIREBASE_MEASUREMENT_ID=

ENDPOINTS:
Base URL:
http://127.0.0.1:{process.env.PORT}/api/v1/users

EndPoints:
1) http://127.0.0.1:{process.env.PORT}/api/v1/users/signup (POST)
-Creates an account for the user,issues JWT, payload JSON
{
  "name": "",
  "email": "",
  "password": "",
  ""passwordConfirm: "",
}

2) http://127.0.0.1:{process.env.PORT}/api/v1/users/login (POST)
-Logs User in, issues JWT, payload JSON
{
  "email": "",
  "password": "",
}

3) http://127.0.0.1:{process.env.PORT}/api/v1/users/forgotPassword (POST)
- Issues a temp token url sent to the email of user to reset there password, valid only for 10 mins, payload JSON
{
  "email": ""
}

4) http://127.0.0.1:{process.env.PORT}/api/v1/users/resetPassword/:token (PATCH)
- is triggered with the reset token, the url that is sent to the user's email
{
    "password": "newpassword",
    "passwordConfirm": "newpassword",
}

//Works after login, after the JWT Token has been issued
5) http://127.0.0.1:{process.env.PORT}/api/v1/users/updateMyPassword (PATCH)
-Loged in user updates there password, new JWT issued, old one expirese, Payload
{
    "passwordCurrent": "",
    "password": "",
    "passwordConfirm": "",
}

6) http://127.0.0.1:{process.env.PORT}/api/v1/users/updateMe (PATCH)
-Can be used for updated user's name and email, Payload
{
    "name": "",
    "email": ""
}
   
7) http://127.0.0.1:{process.env.PORT}/api/v1/users/deleteMe  (DELETE)
-User can delete there account, but in database the active property is set to inactive, no payload just trigger the endpoint

8) http://127.0.0.1:{process.env.PORT}/api/v1/users/uploadFile (POST)
-User can upload a form as the body with the file's name as 'filename' and can upload the file to firebase and the link is sotred in mongoDB database, payload:
Form Data
key: filename
file: -attach file-

9) http://127.0.0.1:{process.env.PORT}/api/v1/users/getMyLinks (GET)
- User can obtain all there uploaded files, no payload required

//ADMIN SPECIFIC ENDPOINTS:
10) http://127.0.0.1:{process.env.PORT}/api/v1/users (GET)
-Admin can get list of all users

11) http://127.0.0.1:{process.env.PORT}/api/v1/users (POST)
-Admin can create a new user without signing up, this will not issue a JWT token but the user will be created directly to the database, payload
{
  "name": "",
  "email": "",
  "password": "",
  ""passwordConfirm: "",
}

12) http://127.0.0.1:{process.env.PORT}/api/v1/users/:id (GET)
-Admin can get a specific user's details by specifing there id in params
    
13) http://127.0.0.1:{process.env.PORT}/api/v1/users/:id (PATCH)
-Admin can update a specific user's details by specifing there id in params

14) http://127.0.0.1:{process.env.PORT}/api/v1/users/:id (DELETE)
--Admin can delete a specific user's details by specifing there id in params. this action will completely delete the user from the database, contrast to the active property set to false
