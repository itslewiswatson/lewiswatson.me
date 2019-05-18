
module.exports = function(req, res, next) {
	let path = req.baseUrl + req.path;
	if (!req.session.me) {
		// Only require auth for /zmgr/* routes
		if (path !== "/zmgr/auth" && path.substring(0, 5) === "/zmgr") {
			// Store requested URL
			req.session.preAuthURL = path;
			res.redirect("/zmgr/auth");
		}
		else {
			next();
		}
	}
	else {
		// Don't allow re-auth (it's not needed)
		if (path === "/zmgr/auth") {
			res.redirect("/zmgr/index");
		}
		else {
			next();
		}
	}
};