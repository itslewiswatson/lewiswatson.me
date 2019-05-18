let constants = require("../logic/util/constants.js")

/** paginate
 * 
 * @param int page
 * @param array lookupArray
 * 
 * @returns array
 */
module.exports.calc = (page, lookupArray) => {
	let startRange = (page - 1) * constants.perPage;
	let endRange = startRange + constants.perPage;

	if (lookupArray) {
		if (!lookupArray[startRange]) {
			startRange = 0;
			endRange = constants.perPage;
		}
	}

	return {
		startRange: startRange,
		endRange: endRange,
	};
};