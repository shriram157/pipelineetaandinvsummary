var _thatVD;
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
			_thatVD = this;

			_thatVD.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatVD.getView().setModel(_thatVD.oI18nModel, "i18n");

			if (window.location.search == "?language=fr") {
				_thatVD.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				_thatVD.getView().setModel(_thatVD.oI18nModel, "i18n");
				_thatVD.sCurrentLocale = 'FR';
			} else {
				_thatVD.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				_thatVD.getView().setModel(_thatVD.oI18nModel, "i18n");
				_thatVD.sCurrentLocale = 'EN';
			}

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/pipelineInventory-dest";
			} else {
				this.sPrefix = "";
			}
			_thatVD.nodeJsUrl = this.sPrefix + "/node";
			// this.getView().setModel(sap.ui.getCore().getModel("SelectJSONModel"), "SelectJSONModel");
			_thatVD.getOwnerComponent().getRouter().attachRoutePatternMatched(_thatVD._oVehicleDetailsRoute, _thatVD);
		},

		formatDate: function (oDate) {
			if (oDate != "" && oDate != undefined) {
				var date = JSON.parse(oDate);
				jQuery.sap.require("sap.ui.core.format.DateFormat");
				_thatVD.oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd"
				});
				return _thatVD.oDateFormat.format(new Date(date));
			}
		},

		_oVehicleDetailsRoute: function (oEvent) {
			sap.ui.core.BusyIndicator.hide();
			this.getView().setModel(sap.ui.getCore().getModel("VehicleDetailsJSON"), "VehicleDetailsJSON");

			_thatVD.oVehicleDetailsJSON = _thatVD.getView().getModel("VehicleDetailsJSON");

			_thatVD.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatVD.getView().setModel(_thatVD.oI18nModel, "i18n");

			if (window.location.search == "?language=fr") {
				_thatVD.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				_thatVD.getView().setModel(_thatVD.oI18nModel, "i18n");
				_thatVD.sCurrentLocale = 'FR';
			} else {
				_thatVD.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				_thatVD.getView().setModel(_thatVD.oI18nModel, "i18n");
				_thatVD.sCurrentLocale = 'EN';
			}
			if (oEvent.getParameter("arguments").OrderNumber != undefined) {
				//console.log(oEvent.getParameter("arguments").data);

				var _OrderNumber = oEvent.getParameter("arguments").OrderNumber;

				var url = _thatVD.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/VehicleDetailsSet('" + _OrderNumber + "')";
				$.ajax({
					dataType: "json",
					url: url,
					type: "GET",
					success: function (oRowData) {
						console.log("CustomerData", oRowData);
						_thatVD.oVehicleDetailsJSON.getData().selectedCustomerData = [];
						_thatVD.oVehicleDetailsJSON.getData().selectedCustomerData = oRowData.d;
						_thatVD.oVehicleDetailsJSON.updateBindings(true);
					},
					error: function (oError) {
						sap.ui.core.BusyIndicator.hide();
						_thatVD.errorFlag = true;
					}
				});
				for (var i = 0; i < _thatVD.oVehicleDetailsJSON.getData().results.length; i++) {
					if (_thatVD.oVehicleDetailsJSON.getData().results[i].VHCLE == _OrderNumber) {
						_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData = [];
						_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData.push(_thatVD.oVehicleDetailsJSON.getData().results[i]);
						_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].AccessoriesInstalled = "";
						_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].DNCVehicle = "";
						_thatVD.oVehicleDetailsJSON.updateBindings();
					}
				}
			}

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
				var oRouter = sap.ui.core.UIComponent.getRouterFor(_thatVD);
				oRouter.navTo("details");
			}
		},

		/*Navigate to Order Change screen*/
		NavToOrderChange: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(_thatVD);
			oRouter.navTo("orderChange", {
				OrderNumber: sap.ui.getCore().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0].ProductId
			});
		},

		/*Routing to selected screens*/
		selectedScreen: function (oSelectedScreen) {
			var selectedScreenText = oSelectedScreen.getParameters().selectedItem.getText();
			if (selectedScreenText == "Master") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Pipeline ETA & Inventory Summary");
				_thatVD.getRouter().navTo("Routemaster");
			} else if (selectedScreenText == "Details") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Details");
				_thatVD.getRouter().navTo("details");
			} else if (selectedScreenText == "Vehicle Details") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Vehicle Details");
				_thatVD.getRouter().navTo("vehicleDetails");
			} else if (selectedScreenText == "Order Change") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Order Change");
				_thatVD.getRouter().navTo("orderChange");
			} else if (selectedScreenText == "Ship To Dealer") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Ship To Dealer");
				_thatVD.getRouter().navTo("shipToDealer");
			} else if (selectedScreenText == "Ship To Dealer Response") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Ship To Dealer Response");
				_thatVD.getRouter().navTo("shipToDealerResponse");
			} else if (selectedScreenText == "Assign Vehicles") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Assign Vehicles");
				_thatVD.getRouter().navTo("assignVehicles");
			} else if (selectedScreenText == "Assign Vehicles Status") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Assign Vehicles Status");
				_thatVD.getRouter().navTo("assignVehiclesStatus");
			} else if (selectedScreenText == "Change History") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Change History");
				_thatVD.getRouter().navTo("changeHistory");
			}
		},
		onMenuLinkPress: function (oLink) {
			var _oLinkPressed = oLink;
			var _oSelectedScreen = _oLinkPressed.getSource().getProperty("text");
			if (_oSelectedScreen == _thatVD.oI18nModel.getResourceBundle().getText("PageTitle")) {
				_thatVD.getRouter().navTo("Routemaster");
			} else if (_oSelectedScreen == _thatVD.oI18nModel.getResourceBundle().getText("VehicleDetails")) {
				_thatVD.getRouter().navTo("vehicleDetailsNodata");
			} else if (_oSelectedScreen == _thatVD.oI18nModel.getResourceBundle().getText("ChangeHistory")) {
				_thatVD.getRouter().navTo("changeHistory");
			}
		},

		postVehicleUpdates: function (oPost) {
			debugger;
			var Obj = {};
			_thatVD.oVehicleDetailsJSON = _thatVD.getView().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0];
			Obj.VHCLE = _thatVD.oVehicleDetailsJSON.VHCLE;
			Obj.NewAPX = _thatVD.oVehicleDetailsJSON.APX;
			Obj.AccessoriesInstalled = _thatVD.oVehicleDetailsJSON.AccessoriesInstalled;
			Obj.DNC = _thatVD.oVehicleDetailsJSON.DNCVehicle;
			Obj.Comments = _thatVD.oVehicleDetailsJSON.Comments;
			var oModel = new sap.ui.model.odata.v2.ODataModel(_thatVD.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV");
			oModel.setUseBatch(false);
			oModel.create("/VehicleDetailsSet", Obj, {
				success: $.proxy(function (oResponse) {
					console.log(oResponse);
				}, _thatVD),
				error: function (oError) {
					sap.m.MessageBox.error(
						"Error in data saving"
					);
				}
			});
		},

		onExit: function () {
			this.destroy();
		}

	});

});