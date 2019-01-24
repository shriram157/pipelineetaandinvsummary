var _that;
sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel',
], function (BaseController, JSONModel, ResourceModel) {
	"use strict";

	return BaseController.extend("pipelineInventory.controller.changeHistory", {

		onInit: function () {
			_that = this;
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

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/pipelineInventory-dest";
			} else {
				this.sPrefix = "";
			}
			_that.nodeJsUrl = this.sPrefix + "/node";

			_that.oChangeHistoryModel = new JSONModel();
			_that.getView().setModel(_that.oChangeHistoryModel, "ChangeHistoryModel");

			_that.oDealerDataModel = new JSONModel();
			_that.getView().setModel(sap.ui.getCore().getModel("BusinessDataModel"), "BusinessDataModel");

			_that.getOwnerComponent().getRouter().attachRoutePatternMatched(_that._oChangeHistoryRoute, _that);
			// var err = JSON.parse(oError.response.body);
			// sap.m.MessageBox.error(err.error.message.value);
		},

		_oChangeHistoryRoute: function (oEvent) {
			sap.ui.core.BusyIndicator.hide();
			_that.getView().setModel(_that.oChangeHistoryModel, "ChangeHistoryModel");

			if (oEvent.getParameters().arguments.SelectedDealer != undefined) {
				_that.Dealer = oEvent.getParameters().arguments.SelectedDealer;

				_that._oViewModel = new sap.ui.model.json.JSONModel({
					busy: false,
					delay: 0,
					enableResubmitBtn: false
				});
				_that.getView().setModel(_that._oViewModel, "LocalModel");
				sap.ui.core.BusyIndicator.show();
				//ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ChangeHistorySet?$filter=Dealer eq '2400042193'&$format=json
				var url = _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ChangeHistorySet?$filter=Dealer eq '" + _that.Dealer +
					"'&$format=json";
				$.ajax({
					dataType: "json",
					url: url,
					type: "GET",
					success: function (oChangeData) {
						console.log("ChangeHistory Data", oChangeData);
						_that.oChangeHistoryModel.setData(oChangeData.d);
						_that.oChangeHistoryModel.updateBindings(true);
						for (var n = 0; n < _that.oChangeHistoryModel.getData().results.length; n++) {
							if (_that.oChangeHistoryModel.getData().results[n].Status == "Rejected") {
								_that._oViewModel.setProperty("/enableResubmitBtn", true);
							} else {
								_that._oViewModel.setProperty("/enableResubmitBtn", false);
							}
						}
					},
					error: function (oError) {
						_that.errorFlag = true;
					}
				});
			}
		},

		onDealerChange: function (oDealer) {
			sap.ui.core.BusyIndicator.show();
			var SelectedDealer = oDealer.getParameters().selectedItem.getProperty("key");
			var url = _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ChangeHistorySet?$filter=Dealer eq '" + SelectedDealer +
				"'&$format=json";
			$.ajax({
				dataType: "json",
				url: url,
				type: "GET",
				success: function (oChangeData) {
					sap.ui.core.BusyIndicator.hide();
					console.log("ChangeHistory Data", oChangeData);
					_that.oChangeHistoryModel.setData(oChangeData.d);
					_that.oChangeHistoryModel.updateBindings(true);
					for (var n = 0; n < _that.oChangeHistoryModel.getData().results.length; n++) {
						if (_that.oChangeHistoryModel.getData().results[n].Status == "Rejected") {
							_that._oViewModel.setProperty("/enableResubmitBtn", true);
						} else {
							_that._oViewModel.setProperty("/enableResubmitBtn", false);
						}
					}
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					_that.errorFlag = true;
				}
			});
		},
		
		onNavigateToVL: function (oNavEvent) {
			this.getRouter().navTo("vehicleDetails", {
				OrderNumber: oNavEvent.getSource().getModel("ChangeHistoryModel").getProperty(oNavEvent.getSource().getBindingContext(
					"ChangeHistoryModel").sPath).VHCLE
			});
		},
		onNavigateToOC: function (oResubmit){
			this.getRouter().navTo("orderChange", {
				OrderNumber: oResubmit.getSource().getModel("ChangeHistoryModel").getProperty(oResubmit.getSource().getBindingContext(
					"ChangeHistoryModel").sPath).VHCLE
			});
			
		},

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
		}
	});
});