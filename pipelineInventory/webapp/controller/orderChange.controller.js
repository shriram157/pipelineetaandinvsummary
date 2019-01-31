var _thatOC;
sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/core/routing/History',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel',
], function (BaseController, History, JSONModel, ResourceModel) {
	"use strict";

	return BaseController.extend("pipelineInventory.controller.orderChange", {

		onInit: function () {
			_thatOC = this;

			_thatOC.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatOC.getView().setModel(_thatOC.oI18nModel, "i18n");

			if (window.location.search == "?language=fr") {
				_thatOC.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				_thatOC.getView().setModel(_thatOC.oI18nModel, "i18n");
				_thatOC.sCurrentLocale = 'FR';
			} else {
				_thatOC.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				_thatOC.getView().setModel(_thatOC.oI18nModel, "i18n");
				_thatOC.sCurrentLocale = 'EN';
			}

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/pipelineInventory-dest";
			} else {
				this.sPrefix = "";
			}
			_thatOC.nodeJsUrl = this.sPrefix + "/node";

			_thatOC.getView().setModel(sap.ui.getCore().getModel("VehicleDetailsJSON"), "VehicleDetailsJSON");
			_thatOC.getOwnerComponent().getRouter().attachRoutePatternMatched(_thatOC._oOrderChangeRoute, _thatOC);
		},

		_oOrderChangeRoute: function (oEvent) {
			if (oEvent.getParameter("arguments").OrderNumber != undefined) {
				_thatOC.oVehicleDetailsJSON = _thatOC.getView().getModel("VehicleDetailsJSON");

				var _OrderNumber = oEvent.getParameter("arguments").OrderNumber;
				for (var i = 0; i < _thatOC.oVehicleDetailsJSON.getData().results.length; i++) {
					if (_thatOC.oVehicleDetailsJSON.getData().results[i].OrderNumber == _OrderNumber) {
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData = [];
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData.push(_thatOC.oVehicleDetailsJSON.getData().results[i]);
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].NewModel = "";
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].NewSuffix = "";
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].NewAPX = "";
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].NewColour = "";
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Guidelines = "";
						_thatOC.oVehicleDetailsJSON.updateBindings(true);
						_thatOC.oVehicleDetailsJSON.refresh(true);
					}
				}
			}
		},

		NavigateBack: function () {
			// this.getRouter().navTo("details", {});
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(_thatOC);
				oRouter.navTo("vehicleDetails");
			}
		},

		selectedScreen: function (oSelectedScreen) {
			var selectedScreenText = oSelectedScreen.getParameters().selectedItem.getText();
			if (selectedScreenText == "Master") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Pipeline ETA & Inventory Summary");
				_thatOC.getRouter().navTo("Routemaster");
			} else if (selectedScreenText == "Details") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Details");
				_thatOC.getRouter().navTo("details");
			} else if (selectedScreenText == "Vehicle Details") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Vehicle Details");
				_thatOC.getRouter().navTo("vehicleDetails");
			} else if (selectedScreenText == "Order Change") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Order Change");
				_thatOC.getRouter().navTo("orderChange");
			} else if (selectedScreenText == "Ship To Dealer") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Ship To Dealer");
				_thatOC.getRouter().navTo("shipToDealer");
			} else if (selectedScreenText == "Ship To Dealer Response") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Ship To Dealer Response");
				_thatOC.getRouter().navTo("shipToDealerResponse");
			} else if (selectedScreenText == "Assign Vehicles") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Assign Vehicles");
				_thatOC.getRouter().navTo("assignVehicles");
			} else if (selectedScreenText == "Assign Vehicles Status") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Assign Vehicles Status");
				_thatOC.getRouter().navTo("assignVehiclesStatus");
			} else if (selectedScreenText == "Change History") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Change History");
				_thatOC.getRouter().navTo("changeHistory");
			}
		},
		onMenuLinkPress: function (oLink) {
			var _oLinkPressed = oLink;
			var _oSelectedScreen = _oLinkPressed.getSource().getProperty("text");
			if (_oSelectedScreen == _thatOC.oI18nModel.getResourceBundle().getText("PageTitle")) {
				_thatOC.getRouter().navTo("Routemaster");
			} else if (_oSelectedScreen == _thatOC.oI18nModel.getResourceBundle().getText("VehicleDetails")) {
				_thatOC.getRouter().navTo("vehicleDetailsNodata");
			} else if (_oSelectedScreen == _thatOC.oI18nModel.getResourceBundle().getText("ChangeHistory")) {
				_thatOC.getRouter().navTo("changeHistory");
			}
		},

		onRequestChange: function (oPost) {
			var Obj = {};
			_thatOC.oOrderChangeJSON = _thatOC.getView().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0];
			Obj.VHCLE = _thatOC.oOrderChangeJSON.VHCLE;
			Obj.Dealer = _thatOC.oOrderChangeJSON.Dealer;
			if (_thatOC.oOrderChangeJSON.NewModel != undefined) {
				Obj.NewModel = _thatOC.oOrderChangeJSON.NewModel;
			}
			if (_thatOC.oOrderChangeJSON.NewColour != undefined) {
				Obj.NewColour = _thatOC.oOrderChangeJSON.NewColour;
			}

			// var oModel = new sap.ui.model.odata.v2.ODataModel(_thatOC.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV");
			var OrderChangeModel = _thatOC.getOwnerComponent().getModel("OrderChangeModel");
			// _thatOC.OrderChangeModel.setUseBatch(false);
			_thatOC._oToken = OrderChangeModel.getHeaders()['x-csrf-token'];
			$.ajaxSetup({
				headers: {
					'X-CSRF-Token': _thatOC._oToken
				}
			});
			OrderChangeModel.create("/OrderChangeSet", Obj, {
				success: $.proxy(function (oResponse) {
					console.log("orderChangeResponse", oResponse);
				}, _thatOC),
				error: function (oError) {
					console.log("orderChangeError", oError);
				}
			});
		},

		onExit: function () {
			this.destroy();
		}

	});

});