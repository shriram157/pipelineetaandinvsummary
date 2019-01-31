var _thatSDR;
sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel',
], function (BaseController, JSONModel, ResourceModel) {
	"use strict";

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
			_thatSDR.getView().setModel(sap.ui.getCore().getModel("DropShipDataModel"), "DropShipDataModel");
			_thatSDR.getOwnerComponent().getRouter().attachRoutePatternMatched(_thatSDR._oShipToDealerResponseRoute, _thatSDR);
		},

		_oShipToDealerResponseRoute: function (oEvt) {
			_thatSDR.getView().setModel(sap.ui.getCore().getModel("DropShipDataModel"), "DropShipDataModel");
		},
		
		onNavigateToVL: function (oNavEvent) {
			this.getRouter().navTo("vehicleDetails", {
				OrderNumber: oNavEvent.getSource().getModel("DropShipDataModel").getProperty(oNavEvent.getSource().getBindingContext(
					"DropShipDataModel").sPath).VHCLE
			});
		},

		selectedScreen: function (oSelectedScreen) {
			var selectedScreenText = oSelectedScreen.getParameters().selectedItem.getText();
			if (selectedScreenText == "Master") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Pipeline ETA & Inventory Summary");
				_thatSDR.getRouter().navTo("Routemaster");
			} else if (selectedScreenText == "Details") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Details");
				_thatSDR.getRouter().navTo("details");
			} else if (selectedScreenText == "Vehicle Details") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Vehicle Details");
				_thatSDR.getRouter().navTo("vehicleDetails");
			} else if (selectedScreenText == "Order Change") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Order Change");
				_thatSDR.getRouter().navTo("orderChange");
			} else if (selectedScreenText == "Ship To Dealer") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Ship To Dealer");
				_thatSDR.getRouter().navTo("shipToDealer");
			} else if (selectedScreenText == "Ship To Dealer Response") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Ship To Dealer Response");
				_thatSDR.getRouter().navTo("shipToDealerResponse");
			} else if (selectedScreenText == "Assign Vehicles") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Assign Vehicles");
				_thatSDR.getRouter().navTo("assignVehicles");
			} else if (selectedScreenText == "Assign Vehicles Status") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Assign Vehicles Status");
				_thatSDR.getRouter().navTo("assignVehiclesStatus");
			} else if (selectedScreenText == "Change History") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Change History");
				_thatSDR.getRouter().navTo("changeHistory");
			}
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

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf pipelineInventory.view.shipToDealerResponse
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf pipelineInventory.view.shipToDealerResponse
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf pipelineInventory.view.shipToDealerResponse
		 */
		//	onExit: function() {
		//
		//	}

	});

});