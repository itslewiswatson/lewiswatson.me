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
let QQ = require("../config.json");
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
	file.getImages(null, (err, images) => {
		if (err) {
			res.send(err);
		}
		else {
			let page = req.query.page || 1;
			let pag = pagination.calc(page, images);
			let startRange = pag.startRange;
			let endRange = pag.endRange;

			res.locals = {
				totalImageSize: util.formatSize(file.imageCache.totalSize),
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
	file.getFiles(null, (err, files) => {
		if (err) {
			res.send(err);
		}
		else {
			let page = req.query.page || 1;
			let pag = pagination.calc(page, files);
			let startRange = pag.startRange;
			let endRange = pag.endRange;

			res.locals = {
				totalFileSize: util.formatSize(file.fileCache.totalSize),
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

		if (!credentials || credentials.name !== QQ.auth.usr || credentials.pass !== QQ.auth.passwd) {
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