sap.ui.define([], function () {
	"use strict";

	/**
	 * The name of the entity set this module belongs to
	 * 
	 * @type {string}
	 * @private
	 * @const
	 */
	

	/**
	 * Creates an entry with some default properties
	 * 
	 * @function
	 * @param {sap.ui.model.odata.v2.ODataModel} oODataModel The OData model
	 * @returns {sap.ui.model.Context} The context of the created entry
	 * @public
	 */
	const createEmptyEntry = (oODataModel,sEntitySet) => oODataModel.createEntry(sEntitySet, {
		properties: {
			"OrderID" : "",
			"CustomerID ": ""
		}
	});

	const createEntry = (oODataModel,sEntitySet,oProperties) => oODataModel.createEntry(sEntitySet, oProperties);

	/**
	 * Creates an object in backend
	 * 
	 * @function
	 * @param {sap.ui.model.Context} oEntityContext The Entity context
	 * @returns {Promise} The promise resolving the create request
	 * @public
	 */
	const create = (sEntitySet,oEntityContext) => {
		const oModel = oEntityContext.getModel();
		const oEntity = oEntityContext.getObject();

		return new Promise((fnResolve, fnReject) => {
			oModel.create("/" + sEntitySet, oEntity, {
				success: fnResolve,
				error: fnReject
			});
		});
	};

	/**
	 * Updates the functional location in backend
	 * 
	 * @function
	 * @param {sap.ui.model.Context} oEntityContext The Entity context
	 * @returns {Promise} Promise resolving the update request
	 * @public
	 */
	const update = (oEntityContext) => {
		const oModel = oEntityContext.getModel();

		return new Promise((fnResolve, fnReject) => {
			oModel.submitChanges({
				success: fnResolve,
				error: fnReject
			});
		})
	};

    const readData = (oEntityContext) => {
        const oModel = oEntityContext.getModel(); 

        oModel.read(oEntityContext.sPath, {
            success: function(oData, oResponse) {
                // we got ourselves some data
            
            },
            error: function(oError) {
                // something went terribly wrong
                that.handleTheError(oError);
            }
        });
    };
	const readDataPromise = (oODataModel,oEntityContextPath) => {
      //  const oModel = oEntityContext.getModel(); 

		return new Promise((fnResolve, fnReject) => {
			oODataModel.read(oEntityContextPath, {
				success: fnResolve,
				error: fnReject
			});
		});

        oModel.read(oEntityContext.sPath, {
            success: function(oData, oResponse) {
                // we got ourselves some data
            
            },
            error: function(oError) {
                // something went terribly wrong
                that.handleTheError(oError);
            }
        });
    };

	/**
	 * @returns {Object}
	 * @property {function} createEntry
	 * @property {function} create
	 * @property {function} update
	 * @public
	 */
	return {
		createEntry: createEntry,
		createEmptyEntry : createEmptyEntry,
		create: create,
		update: update,
        readData: readData,
		readDataPromise: readDataPromise
	};
});