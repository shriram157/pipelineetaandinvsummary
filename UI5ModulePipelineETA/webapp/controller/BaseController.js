sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/Device"
], function (Controller, History, Device) {
	"use strict";

	return Controller.extend("toyota.ca.xsaapp.PipelineETAInventSummary.controller.BaseController", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getOwnerComponent().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			
			// jQuery.sap.require("jquery.sap.resources");
			// var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
			// var oBundle = jQuery.sap.resources({
			// 	url: "i18n/i18n.properties",
			// 	locale: sLocale
			// });
			// oBundle.oUrlInfo.url = "i18n/"+ oBundle.oUrlInfo.url.split("/")[1].split(".")[0]+"_"+oBundle.sLocale
			// debugger;
			// return oBundle; //
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		}

		/**
		 * Event handler for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		/*	onNavBack: function () {
				var oHistory, sPreviousHash;

				oHistory = History.getInstance();
				sPreviousHash = oHistory.getPreviousHash();

				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					this.getRouter().navTo("ApplicationList", {}, true);
				}
			}*/

		//getListRow: function(proId, control) {
		// 	//var oStandardListItem =control.getParent();

		// 	if (proId % 2 === 0) {

		// 		this.addStyleClass("evenClass");
		// 	}
		// 	else{
		// 		this.addStyleClass("oddClass");
		// 	}
		// 	return proId;
		// }

	});
});