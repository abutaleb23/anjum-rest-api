const moment = require("moment");

function diff_to_GMT(dt) {
	return (
		(-dt.getTimezoneOffset() < 0 ? "-" : "+") +
		(Math.abs(dt.getTimezoneOffset() / 60) < 10 ? "0" : "") +
		Math.abs(dt.getTimezoneOffset() / 60) +
		"00"
	);
}

exports.utcDate = function(date) {
	// date object
	const difference = parseInt(diff_to_GMT(date));
	const addingHour = difference / 100;
	const utc = moment(date).add(addingHour, "hours");
	return utc.toDate()
};
