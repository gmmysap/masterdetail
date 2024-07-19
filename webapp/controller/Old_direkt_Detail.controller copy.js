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
		onMessagePopoverPress: function (oEvent) {
			const oSource = oEvent.getSource();

			
        if (!this._oDialogMessage) {
	      this._oDialogMessage = this.createPopup("DialogMessage", this);
}
        this._oDialogMessage.open();
		 
		 
		},

		onGeoMapButton: function (oEvent) {
			this._oGeoMapVbm.onGeoMapButton(oEvent);
		},
		onClickGeoMap: function (oEvent) {
			this._oGeoMapVbm.onClickGeoMap(oEvent);
		},
		onGeoMapPopoverClose: function(oEvent) {

			this._oGeoMapVbm.onGeoMapPopoverClose(oEvent);
		},

// Geo begin		

	/* 	onGeoMapButton: function (oEvent) { 
			const oButton = oEvent ? oEvent.getSource() : undefined;
			const oView = this.getView();
			const oViewModel = oView.getModel("view");

			const sViewBindingPath = this.getView().getBindingContext().getPath();
			const oLongitudeInputField = oView.byId("idLongitude").getValue();
			const oLatitudeInputField = oView.byId("idLatitude").getValue();

			if (oLongitudeInputField === '0.000000000000') {
				oViewModel.setProperty("/initialLongitude", constants.OTHER.GEO_MAP.INITIAL_DATA.LONGITUDE);
				oViewModel.setProperty("/initialLatitude", constants.OTHER.GEO_MAP.INITIAL_DATA.LATITUDE);
				oViewModel.setProperty("/geoMapZoomLevel", constants.OTHER.GEO_MAP.INITIAL_DATA.ZOOM_LEVEL);
			} else {
		
				oViewModel.setProperty("/initialLongitude", oLongitudeInputField);
				oViewModel.setProperty("/initialLatitude", oLatitudeInputField );
				oViewModel.setProperty("/geoMapZoomLevel", constants.OTHER.GEO_MAP.STANDARD_DATA.ZOOM_LEVEL); 

			}

			oViewModel.setProperty("/Longitude", oViewModel.getProperty("/initialLongitude"));
				oViewModel.setProperty("/Latitude", oViewModel.getProperty("/initialLatitude") );


				// create GEO popover (kein Dialog!!)
				if (!this._oGeoPopover) {                 // <= Promise
					this._oGeoPopover = Fragment.load({
						id: oView.getId(),
						name: "masterdetail.view.fragment.DialogGeoMapPopover",
						controller: this
					}).then((oPopover) => {
						oView.addDependent(oPopover);  
						return oPopover;
					});
				}
	
				this._oGeoPopover.then((oPopover) => {
					oPopover.openBy(oButton);
				});


		},

		onClickGeoMap: function (oEvent) {

			const oViewModel = this.getModel("view");
			const aPositions = oEvent.getParameter("pos").split(";");

			let sLongitude = aPositions[0];
			let sLatitude = aPositions[1];

			if (!oViewModel.getProperty("/editMode")) return;

			oViewModel.setProperty("/Latitude", sLatitude);
			oViewModel.setProperty("/Longitude", sLongitude);


		},

		onGeoMapPopoverClose: function(oEvent) {

			this._oGeoPopover.then((oPopover) => { oPopover.close() });  // <= Promise
		}, */

// Geo End


		/* createPopup: function (iDalogName, callederCtr) {
			// Fragment als Dialog      
				switch(iDalogName) {
					case "DialogMessage":
						var oDialog = sap.ui.xmlfragment("masterdetail.view.fragment.DialogMessage", callederCtr);
						oDialog.setTitle("DialogMessage");
					  break;
					case "Ursachencode":
						var oDialog = sap.ui.xmlfragment("masterdetail.view.fragment.CouseCodePopup", this);
						oDialog.setTitle("rsachencode");
					  break;
					default:
					  alert("unknown");
				  }
				if(oDialog){
				  callederCtr.getView().addDependent(oDialog);
				}

				return oDialog;
			}, */

			onDialogMessageConfirm: function (oEvent){
				const oSource = oEvent.getSource();

			},
			onDialogMessageCancel:function (oEvent){
				const oSource = oEvent.getSource();

				oSource.getParent().close();
			}

    });
});