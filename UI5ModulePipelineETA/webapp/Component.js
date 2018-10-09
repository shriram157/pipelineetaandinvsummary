sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"toyota/ca/xsaapp/PipelineETAInventSummary/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("toyota.ca.xsaapp.PipelineETAInventSummary.Component", {

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
			// jQuery.sap.require("jquery.sap.resources");
			// var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
			// var oBundle = jQuery.sap.resources({
			// 	url: "res/i18n.properties",
			// 	locale: sLocale
			// });

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		}
	});
});