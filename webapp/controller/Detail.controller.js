sap.ui.define([
    "masterdetail/controller/BaseController",
    "sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/m/MessageBox",
	'sap/m/Token',
	"../model/constants",
	"./GeoMapVbm"
],
function (BaseController,Fragment,JSONModel,Filter,FilterOperator,FilterType,MessageBox,Token,constants,GeoMapVbm) {
    "use strict";

    const initialViewProperties = {
		busy: false,
		showExpandButton: true,
		showCollapseButton: false,
		mFilteredFunctLocations: {},
		pendingSyncRequests: false,
		enableButtonCreateFunctionalLocation: false,
		treeTableSet: false,
		editMode: false,
		Latitude: "51.269035091583542",
        Longitude: "10.178582763671877"
	};

    return BaseController.extend("masterdetail.controller.Detail", {
        onInit: function () {

            this.getView().setModel(new JSONModel(jQuery.extend({}, initialViewProperties)), "view");

			this.getOwnerComponent().getRouter().getRoute("detail").attachPatternMatched(this._onDetailMatched, this);

			// this.getOwnerComponent().getModel("app").setProperty("/layout", "TwoColumnsMidExpanded");

			var oComponent = this.getOwnerComponent();
            this._oGeoMapVbm = new GeoMapVbm(oComponent);

        },
		_onDetailMatched: function (oEvent) {
			const oArguments = oEvent.getParameter("arguments");
			const sCustomerID = oArguments.CustomerID			;
			const oViewModel = this.getView().getModel("view");
			const oAppView = this.getView().getParent().getParent();
			const oMasterView = oAppView.getBeginColumnPages()[0];
			const oLineItemsSmartTable = this.getView().byId("LineItemsSmartTable");

			const sObjectPath = this.getView().getModel().createKey("Customers", {
				CustomerID: sCustomerID
			});
	//		this.getView()._bindView("/" + sObjectPath);

			this.getView().bindElement({
				path: "/" + sObjectPath
			});

	 		oViewModel.setProperty("/CustomerID",sCustomerID);
	 		const sSelectedCustomerID =  this.getModel("view").getProperty("/CustomerID");
			const oFilter = this.getSimpleFilterEQ("CustomerID", 'EQ', sSelectedCustomerID);

			const oOrders = this.getView().byId("LineItemsSmartTable");
			oOrders.rebindTable();
  
        },

		onPressEdit: function () {

			const oViewModel = this.getModel("view");
			const bOldMode = oViewModel.getProperty("/editMode");

			oViewModel.setProperty("/editMode", !bOldMode);

		/* 	if (this._arePendingChangesAvailable()) {
				this._confirmPendingChanges().then(() => {
					this._toggleEditMode();
				});
			} else {
				this._toggleEditMode();
			} */
		},

		onBeforeRebindTable: function (oEvent) {  
		 
			const mBindingParams = oEvent.getParameter("bindingParams"),
				sSelectedCustomerID =  this.getView().getModel("view").getProperty("/CustomerID"),
				oFilter = this.getSimpleFilterEQ("CustomerID", 'EQ', sSelectedCustomerID);
				//oSorter = filterAndSortProvider.getSortergetFilterOrders();

			mBindingParams.filters.push(oFilter);
			// mBindingParams.sorter.push(oSorter);
        },


		onPressCloseDetail: function () {
			this.getOwnerComponent().getRouter().navTo("master");
			this.getOwnerComponent().getModel("app").setProperty("/layout", "OneColumn");
		 
		
		},

onPressButton: function(oEvent) {

	let sIdAbsolut = oEvent.getSource().getId();
    let aIdAbsolut = sIdAbsolut.split("--");
    let sID = aIdAbsolut[1];

	switch(sID) {
		case "idLinkSetGeo":
		  this.onGeoMapButton(oEvent);
		  break;
		case "idButtonSetGeo":
			this.onGeoMapButton(oEvent);
		  break;
		case "idMessagePopover":
			this.onMessagePopoverPress(oEvent);
		  break;  
		default:
		  alert("Id unknown");
	  }



},


		onMessagePopoverPress: function (oEvent) {
			const oSource = oEvent.getSource();

			
        if (!this._oDialogMessage) {
	      this._oDialogMessage = this.createPopup("DialogMessage", this);
}
        this._oDialogMessage.open();
		 
		 
		},
  
		// Geo begin	
		onGeoMapButton: function (oEvent) {
			this._oGeoMapVbm.onGeoMapButton(oEvent);
		},
		onClickGeoMap: function (oEvent) {
			this._oGeoMapVbm.onClickGeoMap(oEvent);
		},
		onGeoMapPopoverClose: function(oEvent) {

			this._oGeoMapVbm.onGeoMapPopoverClose(oEvent);
		},
       // Geo end		

	

			onDialogMessageConfirm: function (oEvent){
				const oSource = oEvent.getSource();

			},
			onDialogMessageCancel:function (oEvent){
				const oSource = oEvent.getSource();

				oSource.getParent().close();
			}

    });
});