/*
 * App-wide constants
 */

// Working directory
let env = process.env.NODE_ENV || "dev";
let workingDir;

switch (env) {
	case "dev":
		workingDir = "E:/Projects/zmgr-testing/";
	case "prod":
		workingDir = "/var/www/noki.zorque.xyz/";
}

module.exports.workingDir = workingDir;

// Per page number (for pagination)
let perPage = 20;

module.exports.perPage = perPage;

//