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
	"../model/entity/EntityOperation",
	"./GeoMapVbm"
],
	function (BaseController, Fragment, JSONModel, Filter, FilterOperator, FilterType, MessageBox, Token, constants, EntityOperation, GeoMapVbm) {
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
			editDialogEntry: false,
			newDialogEntry: false,
			Latitude: "51.269035091583542",
			Longitude: "10.178582763671877"
		};

		const sOrdersEntitySet = "Orders";

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
				const sCustomerID = oArguments.CustomerID;
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

				oViewModel.setProperty("/CustomerID", sCustomerID);
				const sSelectedCustomerID = this.getModel("view").getProperty("/CustomerID");
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
					sSelectedCustomerID = this.getView().getModel("view").getProperty("/CustomerID"),
					oFilter = this.getSimpleFilterEQ("CustomerID", 'EQ', sSelectedCustomerID);
				//oSorter = filterAndSortProvider.getSortergetFilterOrders();

				mBindingParams.filters.push(oFilter);
				// mBindingParams.sorter.push(oSorter);
			},


			onPressCloseDetail: function () {
				this.getOwnerComponent().getRouter().navTo("master");
				this.getOwnerComponent().getModel("app").setProperty("/layout", "OneColumn");


			},

			onPressButton: function (oEvent) {

				let sIdAbsolut = oEvent.getSource().getId();
				let aIdAbsolut = sIdAbsolut.split("--");
				let sID = aIdAbsolut[1];
				if (!sID) {
					sID = aIdAbsolut[0];
				}

				switch (sID) {
					case "idLinkSetGeo":
						this.onGeoMapButton(oEvent);
						break;
					case "idButtonSetGeo":
						this.onGeoMapButton(oEvent);
						break;
					case "idMessagePopover":
						this.onMessagePopoverPress(oEvent);
						break;
					case "idNewOrder":
						this._onNewOrder(oEvent);
						break;
					case "idShowOrder":
						this._onShowOrder(oEvent);
						break;

					case "idonCancelOrder":
						this._onCancelDialogOrder(oEvent);
						break;
					case "idChangeOrder":
						this._onDialogOChangerder(oEvent);
						break;

					case "idonOrderInsert":
						this._onidonOrderInsert(oEvent);
						break;
					case "idonOrderChange":
						this._onidonOrderChange(oEvent);
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

			_onDialogOChangerder: function (oEvent) {

				const oSource = oEvent.getSource();

				this.getModel("view").setProperty("/editDialogEntry", true);
				this.getModel("view").setProperty("/newDialogEntry", false);

				var selectedRows = this.getView().byId("idMainTable").getSelectedItems();
				EntityOperation.readData(selectedRows[0].getBindingContext());

				if (!this._oDialogOrder) {
					this._oDialogOrder = this.createPopup("DialogOrder", this);

				}

				this._oDialogOrder.setBindingContext(selectedRows[0].getBindingContext());
				this._oDialogOrder.open();
			},

			_onShowOrder: function (oEvent) {

				const oSource = oEvent.getSource();

				this.getModel("view").setProperty("/editDialogEntry", false);
				this.getModel("view").setProperty("/newDialogEntry", false);

				var selectedRows = this.getView().byId("idMainTable").getSelectedItems();
				EntityOperation.readData(selectedRows[0].getBindingContext());

				if (!this._oDialogOrder) {
					this._oDialogOrder = this.createPopup("DialogOrder", this);

				}

				this._oDialogOrder.setBindingContext(selectedRows[0].getBindingContext());
				this._oDialogOrder.open();

			},

			_getOrderContext: function (sODataPath) {
				return new Promise((fnResolve) => {
					this.getModel().createBindingContext(sODataPath, null, null, fnResolve);
				});
			},

			_onNewOrder: function (oEvent) {

				const oSource = oEvent.getSource();
				let oModel = oSource.getModel();

				this.getModel("view").setProperty("/editDialogEntry", true);
				this.getModel("view").setProperty("/newDialogEntry", true);

				// neue Ordernr ermittelt (letzte + 1)
				let aItems = this.getView().byId("idMainTable").getItems();
				let sLastItemContext = aItems[aItems.length - 1].getBindingContext();
				let aOrdersEntity = oModel.getProperty(sLastItemContext.getPath());


				const oOrdersProperties = {
					properties: {
						"OrderID": aOrdersEntity.OrderID + 1,
						"CustomerID": aOrdersEntity.CustomerID
					}
				};

				if (!this._oDialogOrder) {
					this._oDialogOrder = this.createPopup("DialogOrder", this);
				}

				this._oDialogOrder.setBindingContext(EntityOperation.createEntry(oModel, sOrdersEntitySet, oOrdersProperties));


				this._oDialogOrder.open();



				/*          let sODataPath = oModel.createKey("/Orders", {OrderID : '10453'});
						 let oContext = { OrderID :  "10453",
							  CustomerID :"AROUT"
			 
							};
			 
						  var oModelNewOrder = new JSONModel({
							 OrderID :  "1122",
							  CustomerID :"AROUT"
			 
						 });
			 
						 if (!this._oDialogOrder) {
							 this._oDialogOrder = this.createPopup("DialogOrder", this);
						   } */

				//	  this._oDialogOrder.setModel(oModelNewOrder);
				//	   this._oDialogOrder.setBindingContext(oNewOrderContext);
				//this._oDialogOrder.bindElement(oContext);

				/* 	let aItems = this.getView().byId("idMainTable").getItems();
					let sLastItemContext = aItems[aItems.length-1].getBindingContext();
			
					let aOrdersEntity = oModel.getProperty(sLastItemContext.getPath());
			 */

				sap.ui.getCore().byId("idOrderID").setValue(aOrdersEntity.OrderID + 1);

				this._oDialogOrder.open();



				return;
				this._getOrderContext(sODataPath).then((oNewOrderContext) => {

					if (!this._oDialogOrder) {
						this._oDialogOrder = this.createPopup("DialogOrder", this);
					}

					this._oDialogOrder.setBindingContext(oNewOrderContext);

					this._oDialogOrder.open();



				})

					.catch(() => {

					});


				//     let oNewOrderContext = oModel.createBindingContext(sPath,oContext,null,null);




			},

			onPressGoToDatailsPage1: function (oEvent) {
				/* 
							const oSource = oEvent.getSource();
				
								
							if (!this._oDialogOrder) {
							  this._oDialogOrder = this.createPopup("DialogOrder", this);
							}
				
							Orders.readData(oSource.getBindingContext(),this._oDialogOrder);
							  this._oDialogOrder.setBindingContext(oSource.getBindingContext());
				
					
							this._oDialogOrder.open(); */

			},

			// Geo begin	
			onGeoMapButton: function (oEvent) {
				this._oGeoMapVbm.onGeoMapButton(oEvent);
			},
			onClickGeoMap: function (oEvent) {
				this._oGeoMapVbm.onClickGeoMap(oEvent);
			},
			onGeoMapPopoverClose: function (oEvent) {

				this._oGeoMapVbm.onGeoMapPopoverClose(oEvent);
			},
			// Geo end		



			onDialogMessageConfirm: function (oEvent) {
				const oSource = oEvent.getSource();

			},
			onDialogMessageCancel: function (oEvent) {
				const oSource = oEvent.getSource();

				oSource.getParent().close();
			},
			_onCancelDialogOrder: function (oEvent) {
				const oSource = oEvent.getSource();

				oSource.getParent().close();

			},
			_onidonOrderInsert: function (oEvent) {
				const oSource = oEvent.getSource();

				oSource.getParent().close();

				// let oTableOrders = this.getView().byId("idMainTable");
				let oTableOrders = this.getView().byId("LineItemsSmartTable");
				
				oTableOrders.rebindTable(true);
			},
			_onidonOrderChange : function (oEvent) {
				const oSource = oEvent.getSource();

				oSource.getParent().close();

				let oBindContextDialog = oSource.getParent().getBindingContext();
				let oDateModelBindContext = oSource.getParent().getModel().getProperty(oBindContextDialog.getPath());

				// let oTableOrders = this.getView().byId("idMainTable");
				let oTableOrders = this.getView().byId("LineItemsSmartTable");
				
				oTableOrders.rebindTable(true);

			}

		});
	});