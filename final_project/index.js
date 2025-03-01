const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    if (req.session.authorization) { // Get the authorization object stored in the session
        token = req.session.authorization['accessToken']; // Retrieve the token from authorization object
        jwt.verify(token, "access", (err, user) => { // Use JWT to verify token
            if (!err) {
                req.user = user;
                next();
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));




















// const express = require('express');
// const jwt = require('jsonwebtoken');
// const session = require('express-session');

// let users = [];

// // Function to check if the user exists
// const doesExist = (username) => {
//   let userswithsamename = users.filter((user) => {
//     return user.username === username;
//   });
//   return userswithsamename.length > 0;
// };

// // Function to check if the user is authenticated
// const authenticatedUser = (username, password) => {
//   let validusers = users.filter((user) => {
//     return user.username === username && user.password === password;
//   });
//   return validusers.length > 0;
// };


// app.use(session({ secret: "fingerpint" })); // Middleware to handle sessions

// // Route to handle user login
// app.post("/login", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   if (!username || !password) {
//     return res.status(404).json({ message: "Error logging in" });
//   }

//   if (authenticatedUser(username, password)) {
//     let accessToken = jwt.sign({
//       data: password
//     }, 'access', { expiresIn: 60 * 60 });

//     req.session.authorization = {
//       accessToken, username
//     };
//     return res.status(200).send("User successfully logged in");
//   } else {
//     return res.status(208).json({ message: "Invalid Login. Check username and password" });
//   }
// });

// // Route to handle user registration
// app.post("/register", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   if (username && password) {
//     if (!doesExist(username)) {
//       users.push({ "username": username, "password": password });
//       return res.status(200).json({ message: "User successfully registered. Now you can login" });
//     } else {
//       return res.status(404).json({ message: "User already exists!" });
//     }
//   }
//   return res.status(404).json({ message: "Unable to register user." });
// });

// // Main endpoint to be accessed by authenticated users
// app.get("/auth/get_message", (req, res) => {
//   return res.status(200).json({ message: "Hello, You are an authenticated user. Congratulations!" });
// });