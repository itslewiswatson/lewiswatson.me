/* 
 * zmgr: Manage noki.zorque.xyz web services
 * 
 * DEVELOPERS: Lewis Watson
 * DATE: 17.06.2018
 * PURPOSE: Faciliate the handling of files
 * FILE: file.js
 */

"use strict";

/**
 * Libraries
 */
let fs = require("fs");
let glob = require("glob");
let util = require("./util/util.js");

/**
 * File configs
 */
let baseURL = "https://noki.zorque.xyz";
let types = ["images", "files"];
let subDirs = {images: "i", files: "u"};
let fileAlgorithm = {images: "*.{png,jpg,gif}", files: "*.*"};

/**
 * Util function
 */
Array.prototype.sortBy = function(p) {
	return this.slice(0).sort(function(a, b) {
		return (a[p] < b[p]) ? 1 : (a[p] > b[p]) ? -1 : 0;
	});
};

/**
 * Formatting
 */
module.exports.formatList = function(type, dataList) {
	let formattedList = [];
	if (!types.includes(type)) {
		return null;
	}
	cache[type].totalSize = 0;

	for (let i = 0; i < dataList.length; i++) {
		let nameSplit = dataList[i].split("/");
		let fileName = nameSplit[nameSplit.length - 1];

		let size = fs.statSync(dataList[i]).size || 0;
		let fsize = util.tocomma(size);
		let usize = util.formatSize(size);

		let timeCreated = fs.statSync(dataList[i]).ctimeMs;
		let fullURL = baseURL + "/" + subDirs[type] + "/" + fileName;
		
		formattedList.push({
			uploaded: timeCreated,
			rsize: size,
			fsize: fsize,
			usize: usize,
			url: fullURL
		});

		cache[type].totalSize += size;
	}

	formattedList = formattedList.sortBy("uploaded");
	return formattedList;
};

/**
 * Gather files
 */
module.exports.findAll = function(params, cb) {
	if (!params || !types.includes(params.type)) {
		cb(new Error("Incorrect type specified"), null);
		return;
	}
	if ((+ new Date() - cache[params.type].updated) < 7200000) {
		cb(null, cache[params.type].data);
		return;
	}

	let scanDir = process.env.WORKING_DIR + "/" + subDirs[params.type] + "/" + fileAlgorithm[params.type];
	
	glob(scanDir, (err, data) => {
		if (err) {
			cb(err, null);
		}
		else {
			data = module.exports.formatList(params.type, data);
			cache[params.type].data = data;
			cache[params.type].updated = + new Date();
			cb(null, data);
		}
	});
};

/**
 * Caching
 */
let cache = {
	images: {
		totalSize: 0,
		updated: 0,
		data: null
	},
	files: {
		totalSize: 0,
		updated: 0,
		data: null
	}
};
module.exports.cache = cache;