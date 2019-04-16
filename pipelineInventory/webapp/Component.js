sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"pipelineInventory/model/models"
], function (UIComponent, Device, models) {
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