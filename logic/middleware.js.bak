
module.exports = function(req, res, next) {
	let path = req.baseUrl + req.path;
	if (!req.session.me && path !== "/zmgr/auth") {
		// Store requested URL
		req.session.preAuthURL = path;
		res.redirect("/zmgr/auth");
	}
	else if (req.session.me && path == "/zmgr/auth") {
		res.redirect("/zmgr/index");
	}
	else {
		next();
	}
};