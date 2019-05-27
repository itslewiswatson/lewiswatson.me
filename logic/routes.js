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
let app = require("../index.js");
let auth = require("basic-auth");
let file = require("./file.js");
let constants = require("./util/constants.js")
let util = require("./util/util.js");
let pagination = require("../lib/pagination.js");

// Main route
app.get("/", (req, res) => {
	res.render("index.pug")
});
 
 // zmgr index route
app.get(["/zmgr", "/zmgr/index"], (req, res) => {
	res.render("zmgr/index.pug");
});

// Image route
app.get("/zmgr/images", (req, res) => {
	ignoreCache = (req.query.cache === "false");
	file.findAll({type: "images", ignoreCache: ignoreCache}, (err, images) => {
		if (err) {
			res.send(err);
		}
		else {
			let page = req.query.page || 1;
			let pag = pagination.calc(page, images);
			let startRange = pag.startRange;
			let endRange = pag.endRange;

			res.locals = {
				totalImageSize: util.formatSize(file.cache["images"].totalSize),
				numPage: page,
				totalImages: util.tocomma(images.length) || 0,
				totalPages: Math.ceil(images.length / constants.perPage),
				images: images.slice(startRange, endRange),
				moment: require("moment")
			};

			res.render("zmgr/images.pug");
		}
	});
});

// File route
app.get("/zmgr/files", (req, res) => {
	ignoreCache = (req.query.cache === "false");
	file.findAll({type: "files", ignoreCache: ignoreCache}, (err, files) => {
		if (err) {
			res.send(err);
		}
		else {
			let page = req.query.page || 1;
			let pag = pagination.calc(page, files);
			let startRange = pag.startRange;
			let endRange = pag.endRange;

			res.locals = {
				totalFileSize: util.formatSize(file.cache["files"].totalSize),
				numPage: page,
				totalFiles: util.tocomma(files.length) || 0,
				totalPages: Math.ceil(files.length / constants.perPage),
				files: files.slice(startRange, endRange),
				moment: require("moment")
			};

			res.render("zmgr/files.pug");
		}
	});
});

// Auth route
app.get("/zmgr/auth", (req, res) => {
	if (!req.session.me) {
		let credentials = auth(req);

		let user = process.env.CONFIG_USER;
		let password = process.env.CONFIG_PASSWORD;

		let authorized = (!credentials || credentials.name !== user || credentials.pass !== password);

		if (authorized) {
			res.statusCode = 401;
			res.setHeader("WWW-Authenticate", "Basic realm='example'");
			res.end("No access for you!");
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

// Stats route
app.get("/zmgr/stats", (req, res) => {
	res.render("zmgr/stats.pug");
});