sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel',
	"sap/ui/core/routing/History"
], function (BaseController, JSONModel, ResourceModel, History) {
	"use strict";
	var _thatSDR, sSelectedLocale, Division, localLang;
	return BaseController.extend("pipelineInventory.controller.shipToDealerResponse", {

		onInit: function () {
			_thatSDR = this;
			_thatSDR.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatSDR.getView().setModel(_thatSDR.oI18nModel, "i18n");

			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				sSelectedLocale = "EN"; // default is english 
			}
			if (sSelectedLocale == "fr") {
				_thatSDR.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				this.getView().setModel(_thatSDR.oI18nModel, "i18n");
				this.sCurrentLocale = 'FR';
				localLang = "F";
			} else {
				_thatSDR.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(_thatSDR.oI18nModel, "i18n");
				this.sCurrentLocale = 'EN';
				localLang="E";
			}

			var _oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0
			});
			_thatSDR.getView().setModel(_oViewModel, "LocalSDRModel");
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

			// _thatSDR.getView().setModel(sap.ui.getCore().getModel("DropShipDataModel"), "DropShipDataModel");
			_thatSDR.getOwnerComponent().getRouter().attachRoutePatternMatched(_thatSDR._oShipToDealerResponseRoute, _thatSDR);
		},
		afterConfigLoad: function () {
			if (localLang === "F") {
				$(".sapMGrowingListTriggerText>.sapMSLITitle")[0].innerHTML = "Plus";
			} else {
				$(".sapMGrowingListTriggerText>.sapMSLITitle")[0].innerHTML = "More";
			}
		},

		_oShipToDealerResponseRoute: function (oEvt) {
			_thatSDR.getView().setBusy(false);
			_thatSDR.oDropResponseModel = new sap.ui.model.json.JSONModel();
			_thatSDR.getView().setModel(_thatSDR.oDropResponseModel, "DropResponseModel");
			_thatSDR.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatSDR.getView().setModel(_thatSDR.oI18nModel, "i18n");

			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				sSelectedLocale = "EN"; // default is english 
			}
			if (sSelectedLocale == "fr") {
				_thatSDR.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				this.getView().setModel(_thatSDR.oI18nModel, "i18n");
				this.sCurrentLocale = 'FR';
			} else {
				_thatSDR.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(_thatSDR.oI18nModel, "i18n");
				this.sCurrentLocale = 'EN';
			}

			var _oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0
			});
			_thatSDR.getView().setModel(_oViewModel, "LocalSDRModel");
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
				VCData: oNavEvent.getSource().getModel("DropResponseModel").getProperty(oNavEvent.getSource().getBindingContext(
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
			}
			// else if (_oSelectedScreen == _thatSDR.oI18nModel.getResourceBundle().getText("ChangeHistory")) {
			// 	_thatSDR.getRouter().navTo("changeHistory");
			// }
			else if (_oSelectedScreen == _thatSDR.oI18nModel.getResourceBundle().getText("ChangeHistory")) {
				_thatSDR.getRouter().navTo("changeHistory2");

			} else if (_oSelectedScreen == _thatSDR.oI18nModel.getResourceBundle().getText("Back")) {
				var oHistory = History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					_thatSDR.getRouter().navTo("vehicleDetailsNodata");
				}
			}
		}

	});

});