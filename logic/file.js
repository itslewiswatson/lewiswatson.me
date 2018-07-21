/* 
 * zmgr: Manage noki.zorque.xyz web services
 * 
 * DEVELOPERS: Lewis Watson
 * DATE: 17.06.2018
 * PURPOSE: Faciliate the handling of files
 * FILE: file.js
 */

"use strict";

let fs = require("fs");
let glob = require("glob");
let constants = require("./util/constants.js");
let util = require("./util/util.js");

Array.prototype.sortBy = function(p) {
	return this.slice(0).sort(function(a, b) {
		return (a[p] < b[p]) ? 1 : (a[p] > b[p]) ? -1 : 0;
	});
};

/*
 * Caching
 */
let fileCache = {
	updated: 0,
	data: null
};
let imageCache = {
	updated: 0,
	data: null
}

/*
 * error err, object listing getImages(object params, function cb)
 * 
 * params -> {
 *      amount: number (default: 10)
 *      
 * }
 */
module.exports.getImages = function(params, cb) {
	if ((+ new Date() - imageCache.updated) < 7200000) {
		cb(null, imageCache.data);
		return;
	}
	glob(constants.workingDir + "/i/" + "*.{png,jpg,gif}", (err, images) => {
		if (err) {
			cb(err, null);
		}
		else {
			images = module.exports.formatImages(images);
			imageCache.data = images;
			imageCache.updated = + new Date();
			cb(null, images);
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
	if ((+ new Date() - fileCache.updated) < 7200000) {
		cb(null, fileCache.data);
		return;
	}
	glob(constants.workingDir + "/u/" + "*.*", (err, files) => {
		if (err) {
			cb(err, null);
		}
		else {
			files = module.exports.formatFiles(files);
			fileCache.data = files;
			fileCache.updated = + new Date();
			cb(null, files);
		}
	});
};

module.exports.formatFiles = function(files, params, cb) {
	let fileList = [];
	for (let i = 0; i < files.length; i++) {
		let nameSplit = files[i].split("/");
		let fileName = nameSplit[nameSplit.length - 1];

		let timeCreated = fs.statSync(files[i]).ctimeMs || 0;
		let size = fs.statSync(files[i]).size || 0;
		let fsize = util.tocomma(size);
		let fullURL = "https://noki.zorque.xyz/u/" + fileName;

		fileList.push({
			uploaded: timeCreated,
			url: fullURL,
			rsize: size,
			fsize: fsize
		});
	}
	fileList = fileList.sortBy("uploaded");
	return fileList;
};