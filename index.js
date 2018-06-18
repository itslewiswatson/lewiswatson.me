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
let QQ = {usr: "noki", passwd: "totallynotapassword"}
let workingDirectory = "E:/Projects/zmgr-testing/"; // "/var/www/noki.zorque.xyz/";
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
	secret: "amiee",
	saveUninitialized: false,
	resave: false
}));
app.engine("pug", pug.__express);
app.set("view engine", "pug");
app.use("/zmgr/i", express.static(workingDirectory + "i"));
app.use("/zmgr/assets", express.static("assets"));

/*
 * Modules
 */
let file = require("./file.js");

/*
 * Routes
 */

 // Main route
app.get("/zmgr", (req, res) => {
	if (!req.session.me) {
		res.redirect("/zmgr/auth");
	}
	else {
		async.parallel({
			images: function(callback) {
				file.getImages(null, (err, images) => {
					if (err) {
						callback(err, null);
					}
					else {
						callback(null, file.formatImages(images));
					}
				});
			},
			files: function(callback) {
				file.getFiles(null, (err, files) => {
					if (err) {
						callback(err, null);
					}
					else {
						callback(null, file.formatFiles(files));
					}
				});
			}
		}, function(err, results) {
			if (err) {
				res.send(err);
			}
			else {
				console.log(results)
				res.locals.moment = require("moment");
				res.locals.images = results.images;
				res.locals.files = results.files;
				res.render("index.pug");
			}
		});
	}
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
			res.redirect("/zmgr");
		}
	}
	else {
		res.redirect("/zmgr");
	}
});

app.listen(port, () => {
	console.log("Listening for incoming connections on port " + port);
});
