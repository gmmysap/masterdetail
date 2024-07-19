sap.ui.define([
    "masterdetail/controller/BaseController",
    "sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/m/MessageBox",
	'sap/m/Token',
],
function (BaseController,Fragment,JSONModel,Filter,FilterOperator,FilterType,MessageBox,Token) {
    "use strict";

    const initialViewProperties = {
		busy: false,
		showExpandButton: true,
		showCollapseButton: false,
		mFilteredFunctLocations: {},
		pendingSyncRequests: false,
		enableButtonCreateFunctionalLocation: false,
		treeTableSet: false
	};

    return BaseController.extend("masterdetail.controller.Master", {
        onInit: function () {

            this.getView().setModel(new JSONModel(jQuery.extend({}, initialViewProperties)), "view");

        },
		onPressGoToDatailsPage1: function (oEvent) {
            const oItemMasterist = oEvent.getSource();

			this.getOwnerComponent().getModel("app").setProperty("/layout", "TwoColumnsMidExpanded");

            this.getOwnerComponent().getRouter().navTo("detail", { layout: "TwoColumnsMidExpanded",
                CustomerID: oItemMasterist.getBindingContext().getProperty("CustomerID")
            });

        }
    });
});
