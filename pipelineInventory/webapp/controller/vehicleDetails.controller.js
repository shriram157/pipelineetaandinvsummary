var _that;
sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/core/routing/History',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel',
], function (BaseController, History, JSONModel, ResourceModel) {
	"use strict";

	return BaseController.extend("pipelineInventory.controller.vehicleDetails", {
		onInit: function () {
			_that = this;

			// this.getView().setModel(sap.ui.getCore().getModel("SelectJSONModel"), "SelectJSONModel");
			_that.getOwnerComponent().getRouter().attachRoutePatternMatched(_that._oVehicleDetailsRoute, _that);
		},

		_oVehicleDetailsRoute: function (oEvent) {
			sap.ui.core.BusyIndicator.hide();
			this.getView().setModel(sap.ui.getCore().getModel("VehicleDetailsJSON"), "VehicleDetailsJSON");
			_that.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_that.getView().setModel(_that.oI18nModel, "i18n");

			if (window.location.search == "?language=fr") {
				_that.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				_that.getView().setModel(_that.oI18nModel, "i18n");
				_that.sCurrentLocale = 'FR';
			} else {
				_that.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				_that.getView().setModel(_that.oI18nModel, "i18n");
				_that.sCurrentLocale = 'EN';
			}

			//console.log(oEvent.getParameter("arguments").data);
			_that.oVehicleDetailsJSON = _that.getView().getModel("VehicleDetailsJSON")
			var _OrderNumber = oEvent.getParameter("arguments").OrderNumber;
			if (_that.oVehicleDetailsJSON !== undefined) {
				for (var i = 0; i < _that.oVehicleDetailsJSON.getData().results.length; i++) {
					if (_that.oVehicleDetailsJSON.getData().results[i].VHCLE == _OrderNumber) {
						_that.oVehicleDetailsJSON.getData().selectedVehicleData = [];
						_that.oVehicleDetailsJSON.getData().selectedVehicleData.push(_that.oVehicleDetailsJSON.getData().results[i]);
						_that.oVehicleDetailsJSON.updateBindings();
					}
				}
			}
			_that.oVehicleDetailsJSON.getData().selectedCustomerData = [];
			var url = _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/VehicleDetailsSet('"+_OrderNumber+"')";
				$.ajax({
					dataType: "json",
					url: url,
					type: "GET",
					success: function (oRowData) {
						_that.oVehicleDetailsJSON.getData().selectedCustomerData= oRowData.d.results;
						_that.oVehicleDetailsJSON.updateBindings();
					},
					error: function (oError) {
						sap.ui.core.BusyIndicator.hide();
						_that.errorFlag = true;
					}
				});

			//ZPIPELINE_ETA_INVENT_SUMMARY_SRV/VehicleDetailsSet('0000603687')
		},

		/*Back Navigation*/
		NavigateBack: function () {
			// this.getRouter().navTo("details", {});
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				//var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				var oRouter = sap.ui.core.UIComponent.getRouterFor(_that);
				oRouter.navTo("details");
			}
		},

		/*Navigate to Order Change screen*/
		NavToOrderChange: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(_that);
			oRouter.navTo("orderChange", {
				OrderNumber: sap.ui.getCore().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0].ProductId
			});
		},

		/*Routing to selected screens*/
		selectedScreen: function (oSelectedScreen) {
			var selectedScreenText = oSelectedScreen.getParameters().selectedItem.getText();
			if (selectedScreenText == "Master") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Pipeline ETA & Inventory Summary");
				_that.getRouter().navTo("Routemaster");
			} else if (selectedScreenText == "Details") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Details");
				_that.getRouter().navTo("details");
			} else if (selectedScreenText == "Vehicle Details") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Vehicle Details");
				_that.getRouter().navTo("vehicleDetails");
			} else if (selectedScreenText == "Order Change") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Order Change");
				_that.getRouter().navTo("orderChange");
			} else if (selectedScreenText == "Ship To Dealer") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Ship To Dealer");
				_that.getRouter().navTo("shipToDealer");
			} else if (selectedScreenText == "Ship To Dealer Response") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Ship To Dealer Response");
				_that.getRouter().navTo("shipToDealerResponse");
			} else if (selectedScreenText == "Assign Vehicles") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Assign Vehicles");
				_that.getRouter().navTo("assignVehicles");
			} else if (selectedScreenText == "Assign Vehicles Status") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Assign Vehicles Status");
				_that.getRouter().navTo("assignVehiclesStatus");
			} else if (selectedScreenText == "Change History") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Change History");
				_that.getRouter().navTo("changeHistory");
			}
		},
		onMenuLinkPress: function (oLink) {
			var _oLinkPressed = oLink;
			var _oSelectedScreen = _oLinkPressed.getSource().getProperty("text");
			if (_oSelectedScreen == _that.oI18nModel.getResourceBundle().getText("PageTitle")) {
				_that.getRouter().navTo("Routemaster");
			} else if (_oSelectedScreen == _that.oI18nModel.getResourceBundle().getText("VehicleDetails")) {
				_that.getRouter().navTo("vehicleDetailsNodata");
			} else if (_oSelectedScreen == _that.oI18nModel.getResourceBundle().getText("ChangeHistory")) {
				_that.getRouter().navTo("changeHistory");
			}
		},
		onExit: function () {
			this.destroy();
		}

	});

});