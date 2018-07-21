/* 
 * zmgr: Manage noki.zorque.xyz web services
 * 
 * DEVELOPERS: Lewis Watson
 * DATE: 17.06.2018
 * PURPOSE: Serve as the application entry point
 * FILE: index.js
 */

/*
 * Libraries and config
 */
let QQ = require("../credentials.json");
let app = require("../index.js");
let auth = require("basic-auth");
let file = require("./file.js");
let constants = require("./util/constants.js")
let util = require("./util/util.js");
 
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
			let page = parseInt(req.query.page) || 1;
			let startRange = (page - 1) * constants.perPage;
			let endRange = startRange + constants.perPage;

			if (!images[startRange]) {
				startRange = 0;
				endRange = constants.perPage;
			}

			res.locals.numPage = page;
			res.locals.totalImg = util.tocomma(images.length) || 0;
			res.locals.totalPages = Math.ceil(images.length / constants.perPage);
			res.locals.images = images.slice(startRange, endRange);
			res.locals.moment = require("moment");
			res.render("images.pug");
		}
	});
});

// File route
app.get("/zmgr/files", (req, res) => {
	file.getFiles(null, (err, files) => {
		if (err) {
			res.send(err);
		}
		else {
			let page = parseInt(req.query.page) || 1;
			let startRange = (page - 1) * constants.perPage;
			let endRange = startRange + constants.perPage;

			if (!files[startRange]) {
				startRange = 0;
				endRange = constants.perPage;
			}

			res.locals.numPage = page;
			res.locals.perPage = constants.perPage;
			res.locals.totalFiles = util.tocomma(files.length) || 0;
			res.locals.totalPages = Math.ceil(files.length / constants.perPage);
			res.locals.files = files.slice(startRange, endRange);
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
			if (req.session.preAuthURL) {
				res.redirect(req.session.preAuthURL);
				return;
			}
			res.redirect("/zmgr/index");
		}
	}
});

