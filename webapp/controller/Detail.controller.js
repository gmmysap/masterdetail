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
					case "idShowEmployees":
						this.onDialogEmployeePress(oEvent);
						break;
					case "idNewOrder":
						this._onDialogOrder(oEvent, "Insert");
						break;
					case "idShowOrder":
						this._onDialogOrder(oEvent, "Show");
						break;

					case "idonCancelOrder":
						this._onCancelDialogOrder(oEvent);
						break;
					case "idChangeOrder":
						this._onDialogOrder(oEvent, "Change");
						break;

					case "idonOrderInsert":
						this._onidonOrderConfirm(oEvent);
						break;
					case "idonOrderChange":
						this._onidonOrderConfirm(oEvent);
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

			onDialogEmplImage: function (oContext) {
				//	const oSource = oEvent.getSource();


				if (!this._oEmplImage) {
					this._oEmplImage = this.createPopup("EmplImage", this);
				}

				//			this._oEmplImage.setBindingContext(oSource.getBindingContext());  // /Orders(10970)/Employee
				this._oEmplImage.setBindingContext(oContext);  // /Orders(10970)/Employee
				this._oEmplImage.open();


			},

			onDialogEmployeePress: function (oEvent) {
				const oSource = oEvent.getSource();


				if (!this._oEmployee) {
					this._oEmployee = this.createPopup("DialogCarousel", this);
				}

				this._oEmployee.setBindingContext(oSource.getBindingContext());  // /Orders(10970)/Employee
				this._oEmployee.open();


			},

			_onDialogOrder: function (oEvent, sOperation) {

				const oSource = oEvent.getSource();
				let oBindingContext = {};
				let sTittle = "";
				let oModel = oSource.getModel();

				switch (sOperation) {

					case "Show":
						this.getModel("view").setProperty("/editDialogEntry", false);
						this.getModel("view").setProperty("/newDialogEntry", false);
						var selectedRows = this.getView().byId("idMainTable").getSelectedItems();
						EntityOperation.readData(selectedRows[0].getBindingContext());  // <= nachlesen, weil SmartTable nicht alle Daten aus OData zieht
						oBindingContext = selectedRows[0].getBindingContext();
						sTittle = "Show Order";
						break;


					case "Change":

						this.getModel("view").setProperty("/editDialogEntry", true);
						this.getModel("view").setProperty("/newDialogEntry", false);

						var selectedRows = this.getView().byId("idMainTable").getSelectedItems();
						EntityOperation.readData(selectedRows[0].getBindingContext()); // <= nachlesen, weil SmartTable nicht alle Daten aus OData zieht

						oBindingContext = selectedRows[0].getBindingContext();
						sTittle = "Change Order";
						break;

					case "Insert":
						// Buttons und Felder freischalten/ editierbar
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

						oBindingContext = EntityOperation.createEntry(oModel, sOrdersEntitySet, oOrdersProperties);
						sTittle = "New Order";
						break;

				}



				if (!this._oDialogOrder) {
					this._oDialogOrder = this.createPopup("DialogOrder", this);

				}

				this._oDialogOrder.setBindingContext(oBindingContext);
				this._oDialogOrder.setTitle(sTittle);
				this._oDialogOrder.open();
			},

			_createContext: function (sODataPath) {
				return new Promise((fnResolve) => {
					this.getModel().createBindingContext(sODataPath, null, null, fnResolve);
				});
			},



			onPressGoToDatailsPage1: function (oEvent) {

				const oSource = oEvent.getSource();

				let sODataPath = oSource.getBindingContext().getPath();

				this._createContext(sODataPath).then((oContext) => {
					this.onDialogEmplImage(oContext);
				});


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



			onDialogMessageClear: function (oEvent) {
				const oSource = oEvent.getSource();

				this.clearMessage();

			},
			onDialogMessageCancel: function (oEvent) {
				const oSource = oEvent.getSource();

				oSource.getParent().close();
			},
			_onCancelDialogOrder: function (oEvent) {
				const oSource = oEvent.getSource();

				let oContextPathToReset = oEvent.getSource().getParent().getBindingContext().getPath();
				let aResetChanges = [];

				aResetChanges.push(oContextPathToReset);

				if (oSource.getParent().getModel().hasPendingChanges()) {  // Änderungen da
					oSource.getParent().getModel().resetChanges(aResetChanges); // nur Änderungen zu dem Aufruf reseten

				}

				oSource.getParent().close();

			},

			_onidonOrderConfirm: function (oEvent) {
				const oSource = oEvent.getSource();
				let that = this;

				if (oSource.getParent().getModel().hasPendingChanges()) { // Änderungen da
					oSource.getParent().getModel().submitChanges({
						success: function (oData, oResponse) {
							if (oData.__batchResponses[0].__changeResponses[0].response.statusCode >= 400) {
								// sap.m.MessageToast.show(oData.__batchResponses[0].__changeResponses[0].response.body);

								that.appendMessage(oData.__batchResponses[0].__changeResponses[0].message);
							}
						},
						error: function (oError) {
							sap.m.MessageToast.show(oError.responseText);
						}
					});
					// Änderungen commit, OData call zum Backend

				}

				oSource.getParent().close();

			}

		});
	});