sap.ui.define([
    "sap/ui/base/Object",
    "../model/constants"
], 
function (BaseObject,constants) {
    "use strict";

        return BaseObject.extend("masterdetail.controller.GeoMapVbm", {

         /**
         * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
         */
        constructor: function (oComponent) {
            this._oComponent = oComponent;
            this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();

        //    this._oModel = oComponent.getModel("odataDetails");
        },

        onGeoMapButton: function (oEvent) {

            const oButton = oEvent ? oEvent.getSource() : undefined;
            const oView = oEvent.getSource();
            const oViewModel = oView.getModel("view");

            const sViewBindingPath = oView.getBindingContext().getPath();
            const oLongitudeInputField = oViewModel.getProperty("/Longitude");
            const oLatitudeInputField = oViewModel.getProperty("/Latitude")

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


                if (!this._oGeoPopover){
                    this._oGeoPopover = sap.ui.xmlfragment("masterdetail.view.fragment.DialogGeoMapPopover", this);
                    this._oGeoPopover.setTitle("Geo data");

                }

                if(this._oGeoPopover){
                    oView.addDependent(this._oGeoPopover);
                  }
                  this._oGeoPopover.openBy(oButton);


            /*     // create GEO popover (kein Dialog!!)
                if (!this._oGeoPopover) {                 // <= Promise
                    this._oGeoPopover = Fragment.load({
                        id: "idDialogGeoMapPopover",
                        name: "masterdetail.view.fragment.DialogGeoMapPopover",
                        controller: this
                    }).then((oPopover) => {
                        oView.addDependent(oPopover);  
                        return oPopover;
                    });
                }
    
                this._oGeoPopover.then((oPopover) => {
                    oPopover.openBy(oButton);
                }); */

        },
         
       
    
            onClickGeoMap: function (oEvent) {
    

                const oView = oEvent.getSource().getParent();
                const oViewModel = oView.getModel("view");
                const aPositions = oEvent.getParameter("pos").split(";");
    
                let sLongitude = aPositions[0];
                let sLatitude = aPositions[1];
    
                if (!oViewModel.getProperty("/editMode")) return;
    
                oViewModel.setProperty("/Latitude", sLatitude);
                oViewModel.setProperty("/Longitude", sLongitude);
    
    
            },
    
            onGeoMapPopoverClose: function(oEvent) {
    
              //  this._oGeoPopover.then((oPopover) => { oPopover.close() });  // <= Promise
              this._oGeoPopover.close();
            }
        }

    );
       

}); 
