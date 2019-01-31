var _thatAVS;
sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/model/resource/ResourceModel',
	'sap/ui/model/json/JSONModel',
], function (BaseController, ResourceModel, JSONModel) {
	"use strict";

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
			_thatAVS.getView().setModel(sap.ui.getCore().getModel( "AssignVehiclesModel"), "AssignVehiclesModel");
			_thatAVS.getOwnerComponent().getRouter().attachRoutePatternMatched(_thatAVS._oAssignVehicleResponseRoute, _thatAVS);
		},

		_oAssignVehicleResponseRoute: function (oEvt) {
			_thatAVS.getView().setModel(sap.ui.getCore().getModel( "AssignVehiclesModel"), "AssignVehiclesModel");
		},
		
		onNavigateToVL: function (oNavEvent) {
			this.getRouter().navTo("vehicleDetails", {
				OrderNumber: oNavEvent.getSource().getModel("AssignVehiclesModel").getProperty(oNavEvent.getSource().getBindingContext(
					"AssignVehiclesModel").sPath).VHCLE
			});
		},
		
		selectedScreen: function (oSelectedScreen) {
			var selectedScreenText = oSelectedScreen.getParameters().selectedItem.getText();
			if (selectedScreenText == "Master") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Pipeline ETA & Inventory Summary");
				_thatAVS.getRouter().navTo("Routemaster");
			} else if (selectedScreenText == "Details") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Details");
				_thatAVS.getRouter().navTo("details");
			} else if (selectedScreenText == "Vehicle Details") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Vehicle Details");
				_thatAVS.getRouter().navTo("vehicleDetails");
			} else if (selectedScreenText == "Order Change") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Order Change");
				_thatAVS.getRouter().navTo("orderChange");
			} else if (selectedScreenText == "Ship To Dealer") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Ship To Dealer");
				_thatAVS.getRouter().navTo("shipToDealer");
			} else if (selectedScreenText == "Ship To Dealer Response") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Ship To Dealer Response");
				_thatAVS.getRouter().navTo("shipToDealerResponse");
			} else if (selectedScreenText == "Assign Vehicles") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Assign Vehicles");
				_thatAVS.getRouter().navTo("assignVehicles");
			} else if (selectedScreenText == "Assign Vehicles Status") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Assign Vehicles Status");
				_thatAVS.getRouter().navTo("assignVehiclesStatus");
			} else if (selectedScreenText == "Change History") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Change History");
				_thatAVS.getRouter().navTo("changeHistory");
			}
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

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf pipelineInventory.view.assignVehiclesStatus
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf pipelineInventory.view.assignVehiclesStatus
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf pipelineInventory.view.assignVehiclesStatus
		 */
		//	onExit: function() {
		//
		//	}

	});

});