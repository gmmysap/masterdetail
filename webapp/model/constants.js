sap.ui.define([], function () {
	"use strict";

	/**
	 * Component's constants
	 * 
	 * @returns {Object}
	 * @property {Object} BUSINESS_RULES
	 * @property {Object} ENTITYS
	 * @property {Object} TREE_TABLE
	 * @property {Object} OTHER
	 * @const
	 * @public
	 */
	return { 
		BUSINESS_RULES: {
			/** Maximal number of functional location that can be selected **/
			MAX_SELECTED_FUNLOCATION: 10,

			/** Functional location's length depending on level **/
			FUN_LOCATION_LENGTH: {
				LEVEL1: 1,
				LEVEL2: 6,
				LEVEL3: 10,
				LEVEL4: 15,
				LEVEL5: 21,
				LEVEL6: 26
			},

			/** Optional view's parameter  **/
			MODE_EDIT: "edit"
		},
		ENTITY: {
			FUNC_LOCATION: {
				TYPES: {
					TRACTION_POWER_LINE: "B"
				},
				ADDRESS_ACTIONS: {
					/** Address is inherited from super functional location **/
					INHERIT: "I",

					/** New Address is created **/
					CREATE: "C",

					/** Address is updated **/
					UPDATE: "U",

					/** Address of super functional location is also updated **/
					OVERWRITE: "O"
				},
				STATES: {
					NEW: "N",
					ACTIVE: "A",
					ACTIVE_DELETED: "AL",
					INACTIVE: "I",
					INACTIVE_DELETED: "IL"
				},
				PERMISSION_GROUPS: {
					GENERAL: "DBEA",
					OTAM_INTERNAL: "OTAM",
					OTAM_GENERAL: "OTLS"
				},
				SYSTEM_STATES:{
					CREATED: "ANGL",
					INACTIVE: "INAK",
					DELETION_FLAG: "LOVM",
					XDELETION_FLAG: "XLOVM"
				},
				/** Regex for valid URL **/
				SHAREPOINTLINK_REGEX: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi,
			},
			QS_MESSAGE: {
				OPERATION: {
					CREATE: "CREATE",
					UPDATE: "UPDATE",
					DELETE: "DELETE"
				},
				TYPE: {
					BOOLEAN: "BOOLEAN",
					TEXT: "TEXT",
					DATE: "DATE",
					NUMBER: "NUMBER",
					HELP: "HELP"
				}
			},
			CHARACT: {
				TYPE: {
					/** Character of type Help **/
					HELP: "HELP",

					/** Character of type Num **/
					NUM: "NUM",

					/** Character of type Char **/
					CHAR: "CHAR",

					/** Character of type Date **/
					DATE: "DATE"
				}
			},
			VALUE_HELP: {
				PATH: "masterdetail2.view.fragment.vh",
				SETS: [
					"PlanningPlantVHSet",
					"FunctLocationTypeVHSet",
					"AbcIndicatorVHSet",
					"MaintPlantVHSet",
					"PlanningGroupVHSet",
					"OperatingAreaVHSet",
					"RespWorkplaceVHSet",
					"HeaderFunctionalLocationSet",
					"ClassSet",
					"ClassGroupVHSet",
					"ConsttypeVHSet"
				]
			},
			MESSAGE: {
				PROPERTY: {
					/** Message property for new functional location **/
					NEW: "NEW",

					/** Message property for new added classes **/
					NEW_CLASS: "NEW_CLASS",

					/** Message property for new created classes **/
					CREATE: "CREATE",

					/** Message property for deleted classes **/
					DELETED_CLASS: "DELETED_CL", //Sadly, SAP domain fixed values are limited to 10 characters :(

					DELETED: "DELETE", 

					/** Message property for updated classes **/
					UPDATE: "UPDATE"
				},
				ENTITY:{
					CLASS_ASSIGNMENT: 'ClassAssignment',
					CLASS_FIELD_ENTRY: 'CLASS_FIELD_ENTRY'
				}
			}
		},
		TREE_TABLE: { /** Handling of tree table **/
			NODE_CLOSED: 'leaf',
			NODE_OPEN: 'expanded'
		},
		OTHER: {
			/** Google maps base url **/
			GOOGLE_MAPS_URL: "https://www.google.com/maps/search/?api=1&",

			/** Data protection url **/
			DATA_PROTECTION_URL: "https://datenschutz",

			GEO_MAP: {
				INITIAL_DATA: {
					LATITUDE: "51.069035091583544",
					LONGITUDE: "10.078582763671875",
					ZOOM_LEVEL: 6
				},
				STANDARD_DATA: {
					ZOOM_LEVEL: 9
				}
				
			}
		}

	};
});