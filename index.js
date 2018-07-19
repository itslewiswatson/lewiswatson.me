/* 
 * zmgr: Manage noki.zorque.xyz web services
 * 
 * DEVELOPERS: Lewis Watson
 * DATE: 17.06.2018
 * PURPOSE: Serve as the application entry point
 * FILE: index.js
 */

"use strict";

/*
 * Node environment
 */
if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = "dev";
}
console.log("You are running in " + process.env.NODE_ENV + " environment");

/*
 * Configuration
 */
let constants = require("./logic/util/constants.js");
const port = process.env.PORT || 3000;

/*
 * Libraries
 */
let pug = require("pug");
let express = require("express");
let session = require("express-session");

/*
 * Express
 */
let app = module.exports = express();
app.use(session({
	secret: "eeima",
	saveUninitialized: false,
	resave: false
}));
app.engine("pug", pug.__express);
app.set("view engine", "pug");
app.use("/zmgr/i", express.static(constants.workingDir + "i"));
app.use("/zmgr/assets", express.static("assets"));

/*
 * Middleware
 */
app.use(require("./logic/middleware.js"));

/*
 * Routes
 */
require("./logic/routes.js");

/*
 * Listen
 */
app.listen(port, () => {
	console.log("Listening for incoming connections on port " + port);
});
