sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel',
], function (BaseController, JSONModel, ResourceModel) {
	"use strict";
	var _thatSDR;
	return BaseController.extend("pipelineInventory.controller.shipToDealerResponse", {

		onInit: function () {
			_thatSDR = this;
			_thatSDR.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatSDR.getView().setModel(_thatSDR.oI18nModel, "i18n");

			if (window.location.search == "?language=fr") {
				_thatSDR.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				_thatSDR.getView().setModel(_thatSDR.oI18nModel, "i18n");
				_thatSDR.sCurrentLocale = 'FR';
			} else {
				_thatSDR.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				_thatSDR.getView().setModel(_thatSDR.oI18nModel, "i18n");
				_thatSDR.sCurrentLocale = 'EN';
			}
			
			var _oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0
			});
			_thatSDR.getView().setModel(_oViewModel, "LocalSDRModel");
			// _thatSDR.getView().setModel(sap.ui.getCore().getModel("DropShipDataModel"), "DropShipDataModel");
			_thatSDR.getOwnerComponent().getRouter().attachRoutePatternMatched(_thatSDR._oShipToDealerResponseRoute, _thatSDR);
		},

		_oShipToDealerResponseRoute: function (oEvt) {
			_thatSDR.getView().setBusy(false);
			_thatSDR.oDropResponseModel = new sap.ui.model.json.JSONModel();
			_thatSDR.getView().setModel(_thatSDR.oDropResponseModel, "DropResponseModel");
			
			if (oEvt.getParameters().arguments.data != undefined) {
				var VUIdata = JSON.parse(oEvt.getParameters().arguments.data);
				_thatSDR.oDropResponseModel.getData().responseResults = [];
				for (var n = 0; n < VUIdata.length; n++) {
						_thatSDR.oDropResponseModel.getData().responseResults.push(VUIdata[n]);
						_thatSDR.oDropResponseModel.updateBindings(true);
				}
			}
		},
		
		onNavigateToVL: function (oNavEvent) {
			this.getRouter().navTo("vehicleDetails", {
				OrderNumber: oNavEvent.getSource().getModel("DropResponseModel").getProperty(oNavEvent.getSource().getBindingContext(
					"DropResponseModel").sPath).VHCLE
			});
		},

		onMenuLinkPress: function (oLink) {
			var _oLinkPressed = oLink;
			var _oSelectedScreen = _oLinkPressed.getSource().getProperty("text");
			if (_oSelectedScreen == _thatSDR.oI18nModel.getResourceBundle().getText("PageTitle")) {
				_thatSDR.getRouter().navTo("Routemaster");
			} else if (_oSelectedScreen == _thatSDR.oI18nModel.getResourceBundle().getText("VehicleDetails")) {
				_thatSDR.getRouter().navTo("vehicleDetailsNodata");
			} else if (_oSelectedScreen == _thatSDR.oI18nModel.getResourceBundle().getText("ChangeHistory")) {
				_thatSDR.getRouter().navTo("changeHistory");
			}
		}

	});

});