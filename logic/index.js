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
 * Configuration
 */
//let QQ = {usr: "noki", passwd: ""};
let QQ = require("../credentials.json");
let constants = require("./util/constants.js");
const port = process.env.PORT || 3000;

/*
 * Libraries
 */
let async = require("async");
let pug = require("pug");
let auth = require("basic-auth");
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
 * Modules
 */
let file = require("./file.js");

/*
 * Middleware
 */
app.use(require("./middleware.js"));

/*
 * Routes
 */

 // Main route
app.get(["/zmgr", "/zmgr/index"], (req, res) => {
	res.render("index.pug");
});

// Image route
app.get("/zmgr/images", (req, res) => {
	file.getImages(null, (err, images) => {
		if (err) {
			res.send(err);
		}
		else {
			images = file.formatImages(images);
			res.locals.images = images;
			res.locals.moment = require("moment");
			res.render("images.pug");
		}
	});
});

// File route
app.get("/zmgr/files", (req, res) => {
	file.getImages(null, (err, files) => {
		if (err) {
			res.send(err);
		}
		else {
			files = file.formatImages(files);
			res.locals.files = files;
			res.locals.moment = require("moment");
			res.render("files.pug");
		}
	});
});

// Auth route
app.get("/zmgr/auth", (req, res) => {
	if (!req.session.me) {
		let credentials = auth(req);

		if (!credentials || credentials.name !== QQ.usr || credentials.pass !== QQ.passwd) {
			res.statusCode = 401;
			res.setHeader("WWW-Authenticate", "Basic realm='example'");
			res.end("sorry sweetie x");
		}
		else {
			req.session.me = true;
			res.redirect("/zmgr/index");
		}
	}
	else {
		res.redirect("/zmgr/index");
	}
});

app.listen(port, () => {
	console.log("Listening for incoming connections on port " + port);
});
