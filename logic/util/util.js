module.exports.tocomma = (x) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// rawSize should be in bytes
module.exports.formatSize = (rawSize) => {
	let formatSize = rawSize / 1000000;
	let unit = "MB";
	if (formatSize < 1) {
		formatSize = rawSize / 1000;
		unit = "KB";
	}
	return module.exports.tocomma(
		Math.round((formatSize + 0.00001) * 100) / 100
		) 
	+ " " + unit;
}

