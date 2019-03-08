sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/model/resource/ResourceModel',
	'sap/ui/model/json/JSONModel',
	"sap/ui/core/routing/History"
], function (BaseController, ResourceModel, JSONModel, History) {
	"use strict";
	var _thatAVS, sSelectedLocale,Division;
	return BaseController.extend("pipelineInventory.controller.assignVehiclesStatus", {

		onInit: function () {
			_thatAVS = this;
			_thatAVS.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatAVS.getView().setModel(_thatAVS.oI18nModel, "i18n");

			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				sSelectedLocale = "EN"; // default is english 
			}
			if (sSelectedLocale == "fr") {
				_thatAVS.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				this.getView().setModel(_thatAVS.oI18nModel, "i18n");
				this.sCurrentLocale = 'FR';
			} else {
				_thatAVS.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(_thatAVS.oI18nModel, "i18n");
				this.sCurrentLocale = 'EN';
			}

			var _oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0
			});
			_thatAVS.getView().setModel(_oViewModel, "LocalAVSModel");
			/*Logic for logo change depending upon Toyota and Lexus user*/
			var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			if (isDivisionSent) {
				Division = window.location.search.match(/Division=([^&]*)/i)[1];
				var currentImageSource;
				if (Division == '10') // set the toyoto logo
				{
					currentImageSource = this.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "images/toyota_logo_colour.png");
				} else { // set the lexus logo
					currentImageSource = this.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "images/Lexus.png");
				}
			}

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
				VCData: oNavEvent.getSource().getModel("AssignVStatusModel").getProperty(oNavEvent.getSource().getBindingContext(
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
			} else if (_oSelectedScreen == _thatAVS.oI18nModel.getResourceBundle().getText("Back")) {
				var oHistory = History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				}
			}
		}
	});

});