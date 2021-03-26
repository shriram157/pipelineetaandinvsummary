sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/Device"
], function (Controller, History, Device) {
	"use strict";

	return Controller.extend("pipelineInventory.controller.BaseController", {
		
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		getModel: function (sName) {
			return this.getOwnerComponent().getModel(sName);
		},

		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		fnGetLoggedInUserId : function(callback){
			
				$.ajax({
				dataType: "json",
				url: "/userDetails/attributes",
				type: "GET",
				success: function (userAttributes) {
					callback(userAttributes.userProfile.id);
				},
				error : function(error){
					callback(undefined);
				}
				});
		}
	});
});