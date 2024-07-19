sap.ui.define(
    [
      "masterdetail/controller/BaseController",
        "sap/ui/model/json/JSONModel"
    ],
    function(BaseController,JSONModel) {
      "use strict";

      const initialViewProperties = {
        busy: false,
        delay: 0,
        midColumnFullScreen: false
      };
  
      return BaseController.extend("masterdetail.controller.App", {
        onInit: function() {

          this.getView().setModel(new JSONModel(jQuery.extend({}, initialViewProperties)), "appView");
        }
      });
    }
  );
  