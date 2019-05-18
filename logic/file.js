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

let baseURL = "https://noki.zorque.xyz";
let types = ["images", "files"];
let subDirs = {"images": "i", "files": "u"};

module.exports.__format = function(type, dataList) {
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
}

Array.prototype.sortBy = function(p) {
	return this.slice(0).sort(function(a, b) {
		return (a[p] < b[p]) ? 1 : (a[p] > b[p]) ? -1 : 0;
	});
};

/*
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
// Use this outside of this file
module.exports.cache = cache;

module.exports.getImages = function(params, cb) {
	if ((+ new Date() - cache["images"].updated) < 7200000) {
		cb(null, cache["images"].data);
		return;
	}
	glob(constants.workingDir + "/i/" + "*.{png,jpg,gif}", (err, images) => {
		if (err) {
			cb(err, null);
		}
		else {
			images = module.exports.__format("images", images);
			cache["images"].data = images;
			cache["images"].updated = + new Date();
			cb(null, images);
		}
	});
};

module.exports.getFiles = function(params, cb) {
	if ((+ new Date() - cache["files"].updated) < 7200000) {
		cb(null, cache["files"].data);
		return;
	}
	glob(constants.workingDir + "/u/" + "*.*", (err, files) => {
		if (err) {
			cb(err, null);
		}
		else {
			files = module.exports.__format("files", files);
			cache["files"].data = files;
			cache["files"].updated = + new Date();
			cb(null, files);
		}
	});
};