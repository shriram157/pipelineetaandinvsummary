sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/model/resource/ResourceModel',
	'sap/ui/model/json/JSONModel',
], function (BaseController, ResourceModel, JSONModel) {
	"use strict";
	var _thatAVS;
	return BaseController.extend("pipelineInventory.controller.assignVehiclesStatus", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf pipelineInventory.view.assignVehiclesStatus
		 */
		onInit: function () {
			_thatAVS = this;
			_thatAVS.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatAVS.getView().setModel(_thatAVS.oI18nModel, "i18n");

			if (window.location.search == "?language=fr") {
				_thatAVS.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				_thatAVS.getView().setModel(_thatAVS.oI18nModel, "i18n");
				_thatAVS.sCurrentLocale = 'FR';
			} else {
				_thatAVS.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				_thatAVS.getView().setModel(_thatAVS.oI18nModel, "i18n");
				_thatAVS.sCurrentLocale = 'EN';
			}
			
			var _oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0
			});
			_thatAVS.getView().setModel(_oViewModel, "LocalAVSModel");
			_thatAVS.getOwnerComponent().getRouter().attachRoutePatternMatched(_thatAVS._oAssignVehicleResponseRoute, _thatAVS);
		},

		_oAssignVehicleResponseRoute: function (oEvt) {
			_thatAVS.getView().setBusy(false);
			_thatAVS.oAssignVStatusModel = new sap.ui.model.json.JSONModel();
			_thatAVS.getView().setModel(_thatAVS.oAssignVStatusModel, "AssignVStatusModel");
			
			if (oEvt.getParameters().arguments.data != undefined) {
				var VUIdata = JSON.parse(oEvt.getParameters().arguments.data);
				_thatAVS.oAssignVStatusModel.getData().responseResults = [];
				for (var n = 0; n < VUIdata.length; n++) {
						_thatAVS.oAssignVStatusModel.getData().responseResults.push(VUIdata[n]);
						_thatAVS.oAssignVStatusModel.updateBindings(true);
				}
			}
		},
		
		onNavigateToVL: function (oNavEvent) {
			this.getRouter().navTo("vehicleDetails", {
				OrderNumber: oNavEvent.getSource().getModel("AssignVStatusModel").getProperty(oNavEvent.getSource().getBindingContext(
					"AssignVStatusModel").sPath).VHCLE
			});
		},
		onMenuLinkPress: function (oLink) {
			var _oLinkPressed = oLink;
			var _oSelectedScreen = _oLinkPressed.getSource().getProperty("text");
			if (_oSelectedScreen == _thatAVS.oI18nModel.getResourceBundle().getText("PageTitle")) {
				_thatAVS.getRouter().navTo("Routemaster");
			} else if (_oSelectedScreen == _thatAVS.oI18nModel.getResourceBundle().getText("VehicleDetails")) {
				_thatAVS.getRouter().navTo("vehicleDetailsNodata");
			} else if (_oSelectedScreen == _thatAVS.oI18nModel.getResourceBundle().getText("ChangeHistory")) {
				_thatAVS.getRouter().navTo("changeHistory");
			}
		}
	});

});