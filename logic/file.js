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
	totalSize: 0,
	updated: 0,
	data: null
};
let imageCache = {
	totalSize: 0,
	updated: 0,
	data: null
}
// Use this outside of this file
module.exports.fileCache = fileCache;
module.exports.imageCache = imageCache;

/*
 *
 * IMAGES
 * 
 */

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
module.exports.formatImages = function(images, params, cb) {
	imageCache.totalSize = 0; // Will get re-cached below
	let imageList = [];
	for (let i = 0; i < images.length; i++) {
		let nameSplit = images[i].split("/");
		let fileName = nameSplit[nameSplit.length - 1];

		let size = fs.statSync(images[i]).size || 0; // Raw size
		let fsize = util.tocomma(size); // Size (formatted)
		let usize = util.formatSize(size); // Unit size (formatted)

		imageCache.totalSize += size;

		let timeCreated = fs.statSync(images[i]).ctimeMs;
		let fullURL = "https://noki.zorque.xyz/i/" + fileName;

		imageList.push({
			uploaded: timeCreated,
			rsize: size,
			fsize: fsize,
			usize: usize,
			url: fullURL
		});
	}
	imageList = imageList.sortBy("uploaded");
	return imageList;
};

/*
 *
 * FILES
 * 
 */

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
	fileCache.totalSize = 0; // Will get re-cached below
	let fileList = [];
	for (let i = 0; i < files.length; i++) {
		let nameSplit = files[i].split("/");
		let fileName = nameSplit[nameSplit.length - 1];

		let timeCreated = fs.statSync(files[i]).ctimeMs || 0;

		// File size
		let size = fs.statSync(files[i]).size || 0; // Raw size
		let fsize = util.tocomma(size); // Size (formatted)
		let usize = util.formatSize(size); // Unit size (formatted)

		let fullURL = "https://noki.zorque.xyz/u/" + fileName;

		fileCache.totalSize += size;

		fileList.push({
			uploaded: timeCreated,
			url: fullURL,
			rsize: size,
			fsize: fsize,
			usize: usize
		});
	}
	fileList = fileList.sortBy("uploaded");
	return fileList;
};