/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "masterdetail/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("masterdetail.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                 // set the app wide view properties model
			    this.setModel(models.createAppModel(), "app");

                this.setModel(models.createMessageModel(), "message");

                // set the component's OData model als  Variable merken  => Erreichaber models.getODataModel(),
			models.setODataModel(this.getModel());
            }
        });
    }
);