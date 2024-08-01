sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, formatter, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("masterdetail.controller.BaseController", {

		formatter: formatter,

		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getElementFromId: function (sId) {

			const oElement = sap.ui.getCore().byId(sId);
			if (!oElement) {

				const oElement = this.getView().byId(sId);
			}
			return oElement;

		},

		createPopup: function (iDalogName, callederCtr) {
			// Fragment als Dialog      
			switch (iDalogName) {
				case "DialogMessage":
					var oDialog = sap.ui.xmlfragment("masterdetail.view.fragment.DialogMessage", callederCtr);
					oDialog.setTitle("DialogMessage");
					break;
				case "DialogCarousel":
					var oDialog = sap.ui.xmlfragment("masterdetail.view.fragment.DialogCarousel", callederCtr);
					oDialog.setTitle("DialogCarousel");
					break;
					case "EmplImage":
						var oDialog = sap.ui.xmlfragment("masterdetail.view.fragment.DialogEmplImage", callederCtr);
						oDialog.setTitle("EmplImage");
						break;
					

				case "DialogOrder":
					var oDialog = sap.ui.xmlfragment("masterdetail.view.fragment.DialogOrder", callederCtr);
					oDialog.setTitle("Order");
					break;

				default:
					alert("unknown");
			}
			if (oDialog) {
				callederCtr.getView().addDependent(oDialog);
			}

			return oDialog;
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler  for navigating back.
		 * As the nav back button for the detail view is only visible on phone
		 * We always navigate back to the master view
		 * 
		 * @public
		 */
		onNavBack: function () {
			this.getRouter().navTo("master", {}, true);
		},

		/**
		 * Creates a Filter with functional locations for the overgiven String array
		 * 
		 * @param {Array.<String>} aFunctLocTokens The array with functional locations
		 * @returns {Array.<sap.ui.model.Filter>} The filter array with functional locations
		 * @public
		 */
		setFilterFromFunctLocTokens: function (aFunctLocTokens) {
			if (aFunctLocTokens) {
				this.aFunctLocFilter = [];
				aFunctLocTokens.forEach(oToken => {
					if (oToken.getText().startsWith("BL"))
						this.aFunctLocFilter.push(new Filter("SuperFunctLocation", FilterOperator.StartsWith, oToken.getText()));
					else
						this.aFunctLocFilter.push(new Filter("FunctLocation", FilterOperator.StartsWith, oToken.getText()));
				});
			}
		},
		getSimpleFilterEQ: function (sPath, sOperator, sValue) {

			return new Filter(sPath, sOperator, sValue);

		},

		/**
		 * Checks if the current Functional location Selection has only tranction power lines (BL)
		 * 
		 * @param {Array.<String>} aFunctLocTokens The array with functional locations
		 * @returns {Boolean} True when only tranction power lines are in current functional location selection
		 * @public
		 */
		areCurrentFuncLocsTractionPowerLines: function (aFunctLocTokens) {
			if (aFunctLocTokens && Array.isArray(aFunctLocTokens) && aFunctLocTokens.length > 0)
				return !aFunctLocTokens.find(x => !x.getText().startsWith("BL"));
			else return false;
		},
		appendMessage: function (sMessage) {
			let oMessageModel = this.getOwnerComponent().getModel("message");
			var aItems = [];
			const newItem = {
				datatime: "1",
				messtxt: sMessage
			};
			aItems = oMessageModel.getProperty("/MessagesList");
			if (!aItems.length) {
				var aItems = [];
			}
			oMessageModel.setProperty("/MessagesList", aItems.concat(newItem));


		},

		clearMessage: function (oEvent) {
			let oMessageModel = this.getOwnerComponent().getModel("message");

			oMessageModel.setProperty("/MessagesList", {});

		}
	});
});