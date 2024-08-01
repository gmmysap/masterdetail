sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
],
    function (JSONModel, Device) {
        "use strict";

        return {
            /**
             * Provides runtime info for the device the UI5 app is running on as JSONModel
             */
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },
            createAppModel: function () {
                var oAppModel = new JSONModel({
                    busy: false,
                    delay: 0
                });

                return oAppModel;
            },
            createMessageModel: function () {
                var oAppModel = new JSONModel({
                    "MessagesList": [
                        {
                            datatime: "1",
                            messtxt: "Chuu"
                        },
                        {
                            datatime: "2",
                            messtxt: "Kuuur"
                        }
                    ]
                });

                return oAppModel;
            }
        };

    });