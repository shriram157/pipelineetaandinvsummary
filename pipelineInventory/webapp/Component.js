sap.ui.define([
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"pipelineInventory/model/models"
], function (Dialog, Text, UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("pipelineInventory.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			var that=this;
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// Get resource bundle
			var bundle = this.getModel('i18n').getResourceBundle();

			// Attach XHR event handler to detect 401 error responses for handling as timeout
			var sessionExpDialog = new Dialog({
				title: bundle.getText('SESSION_EXP_TITLE'),
				type: 'Message',
				state: 'Warning',
				content: new Text({
					text: bundle.getText('SESSION_EXP_TEXT')
				})
			});
			var origOpen = XMLHttpRequest.prototype.open;
			XMLHttpRequest.prototype.open = function () {
				this.addEventListener('load', function (event) {
					// TODO Compare host name in URLs to ensure only app resources are checked
					if (event.target.status === 401) {
						if (!sessionExpDialog.isOpen()) {
							sessionExpDialog.open();
						}
					}
				});
				origOpen.apply(this, arguments);
			};

			var configDataModel = new sap.ui.model.json.JSONModel();
			sap.ui.getCore().setModel(configDataModel,"configDataModel");
			
			//START: comment before deploying
			// var configData ={"soldOrderAppUrl":"https://tci-dev-soldorderandpp.cfapps.us10.hana.ondemand.com/soldorderandpp/index.html"};
			// configDataModel.setData(configData);
			// configDataModel.updateBindings(true);
			// console.log("configDataModel",sap.ui.getCore().getModel("configDataModel"));
			//END: comment before deploying
			
			$.ajax({
				dataType: "json",
				url: "/app-config",
				type: "GET",
				success: function (configData) {
					console.log("configData",configData);
					configDataModel.setData(configData);
					configDataModel.updateBindings(true);
				},
				error: function (oError) {
					console.log("oError",oError);
				}
			});
			
			// this.loadConfiguration(function(configurationData){
			// 	var appLinkes = {};
			// 	appLinkes.loaded = true;
			// 	if (!!configurationData && !!configurationData.api.APPLINKS ){
			// 		console.log("appLinkes",appLinkes);
			// 		// appLinkes.PARTS_AVAILIBILITY = configurationData.api.APPLINKS.PARTS_AVAILIBILITY;
			// 		// appMode.setProperty("/appLinkes", appLinkes);
			// 	}
			// 	if (that.isAppModelLoaded() ){
			// 		sap.ui.core.BusyIndicator.hide();
			// 	}				
			// });
		}
		// ,
		// loadConfiguration: function (callbackFunc) {
		// 	var that = this;
		// 	$.ajax({
		// 		url: "/node/userDetails/configuration",
		// 		type: "GET",
		// 		dataType: "json",
		// 		success: function (oData, a, b) {
		// 			callbackFunc(oData);
		// 		},
		// 		error: function (response) {
		// 			callbackFunc(response);
		// 		}
		// 	});
		// },
	});
});