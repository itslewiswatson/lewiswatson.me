/* 
 * zmgr: Manage noki.zorque.xyz web services
 * 
 * DEVELOPERS: Lewis Watson
 * DATE: 17.06.2018
 * PURPOSE: Faciliate the handling of files
 * FILE: file.js
 */

let fs = require("fs");
let glob = require("glob");
let workingDirectory = "E:/Projects/zmgr-testing"; // "/var/www/noki.zorque.xyz/";

Array.prototype.sortBy = function(p) {
	return this.slice(0).sort(function(a, b) {
		return (a[p] < b[p]) ? 1 : (a[p] > b[p]) ? -1 : 0;
	});
};

/*
 * error err, object listing getImages(object params, function cb)
 * 
 * params -> {
 *      amount: number (default: 10)
 *      
 * }
 */
module.exports.getImages = function(params, cb) {
	glob(workingDirectory + "/i/" + "*.{png,jpg,gif}", (err, files) => {
		if (err) {
			cb(err, null);
		}
		else {
			cb(null, files);
		}
	});
};

// sortby date, limiting etc
module.exports.formatImages = function(files, params, cb) {
	let fileList = [];
	for (let i = 0; i < files.length; i++) {
		let nameSplit = files[i].split("/");
		let fileName = nameSplit[nameSplit.length - 1];

		let timeCreated = fs.statSync(files[i]).ctimeMs;
		let fullURL = "https://noki.zorque.xyz/i/" + fileName;

		fileList.push({
			uploaded: timeCreated,
			url: fullURL
		});
	}
	fileList = fileList.sortBy("uploaded");
	return fileList;
};

module.exports.getFiles = function(params, cb) {
	glob(workingDirectory + "/u/" + "*.*", (err, files) => {
		if (err) {
			cb(err, null);
		}
		else {
			cb(null, files);
		}
	});
};

module.exports.formatFiles = function(files, params, cb) {
	let fileList = [];
	for (let i = 0; i < files.length; i++) {
		let nameSplit = files[i].split("/");
		let fileName = nameSplit[nameSplit.length - 1];

		let timeCreated = fs.statSync(files[i]).ctimeMs;
		let fullURL = "https://noki.zorque.xyz/u/" + fileName;

		fileList.push({
			uploaded: timeCreated,
			url: fullURL
		});
	}
	fileList = fileList.sortBy("uploaded");
	return fileList;
};