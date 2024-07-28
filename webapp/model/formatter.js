sap.ui.define([
	"sap/ui/core/library",
	"sap/m/GroupHeaderListItem",
	"./constants",
	"./models",
	"sap/ui/core/format/NumberFormat",
	"sap/ui/core/format/DateFormat",
], function (coreLibrary, GroupHeaderListItem, constants, models, NumberFormat,DateFormat) {
	"use strict";

	// shortcut for sap.ui.core.ValueState
	const ValueState = coreLibrary.ValueState;

	const DefaultNumberFormatOptions = {
		groupingSeparator: '.',
		minFractionDigits: 2,
		maxFractionDigits: 2,
		decimalSeparator: ',',
		groupingEnabled: true
	};

	const GEOFormatOptions = {
		decimalSeparator: '.',
		minFractionDigits: 2,
		maxFractionDigits: 12,
		decimals: 12,
		groupingEnabled: false
	};
	
	const getFormattedNumberForGeoCoordinates = (fNumber) => {
		return NumberFormat.getFloatInstance(GEOFormatOptions).format(fNumber);
	};

	const  formatDate = (oDate) => {
		if (oDate) {
			var iHours = oDate.getHours(),
				iMinutes = oDate.getMinutes(),
				iSeconds = oDate.getSeconds();

			if (iHours !== 0 || iMinutes !== 0 || iSeconds !== 0) {
				return DateFormat.getDateTimeInstance({ style: "medium" }).format(oDate);
			} else  {
				return DateFormat.getDateInstance({ style: "medium" }).format(oDate);
			}
		}
	};


	return {

		getFormattedNumberForGeoCoordinates: getFormattedNumberForGeoCoordinates,
		formatDate:formatDate
	};

});