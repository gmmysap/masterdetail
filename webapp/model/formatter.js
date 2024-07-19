sap.ui.define([
	"sap/ui/core/library",
	"sap/m/GroupHeaderListItem",
	"./constants",
	"./models",
	"sap/ui/core/format/NumberFormat"
], function (coreLibrary, GroupHeaderListItem, constants, models, NumberFormat) {
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

	return {

		getFormattedNumberForGeoCoordinates: getFormattedNumberForGeoCoordinates
	};

});