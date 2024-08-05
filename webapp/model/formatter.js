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

	const getImageUrl = (EmployeeID) => {
		const oModel = models.getODataModel(),
			sPath = oModel.createKey("/Employees", {
				EmployeeID:EmployeeID

			});

		return oModel.sServiceUrl + sPath + "/$value"; 
	};

	const formatPhoto = (oFoto) => {

		var oReuturn =  "data:image/jpg;base64," + oFoto;
		return oReuturn;
	};

	const formatPhotoPath = (sPhotoPath) => {

		//var oReuturn =  "data:image/jpg;base64," + sPhotoPath;

		 var testpic = "iVBORw0KGgoAAAANSUhEUgAAAEgAAAAoCAIAAADSeytKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADlSURBVGhD7ZS9DYMwEEZd0VBRUFDQMwBDMAQ1e3gPSlbICKzCHPEF/2EkhIiE8pHv9Ir4zpZ4usup11I/EoqhQTE0KIYGxdCgGBoUQ+Os2Kgz1ZdJ8gyXH37Jf4sNrfLR6OqTrKJkrt1N0bCRDXN8xz+8iYsd073yRym1xWh+z0UTSYYqzCiKgGmIr5bdepS86iafF+DEknCeruQHD04sHbktpoe2dQhi6x9JkK1wuAzkQhALD+/jrNhuxjYbz376lNujid3c/uhWhINiaFAMDYqhQTE0KIYGxdCgGBoUQ+OhYkv9Bnoy5jrS5HcwAAAAAElFTkSuQmCC";

var oReuturn = "data:image/bmp;base64," + testpic;

		return oReuturn;

	};


	return {

		getFormattedNumberForGeoCoordinates: getFormattedNumberForGeoCoordinates,
		formatDate:formatDate,
		getImageUrl:getImageUrl,
		formatPhoto:formatPhoto,
		formatPhotoPath: formatPhotoPath
	};

});