var _thatCH;
sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel',
], function (BaseController, JSONModel, ResourceModel) {
	"use strict";

	return BaseController.extend("pipelineInventory.controller.changeHistory", {

		onInit: function () {
			_thatCH = this;
			_thatCH.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatCH.getView().setModel(_thatCH.oI18nModel, "i18n");

			if (window.location.search == "?language=fr") {
				_thatCH.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				_thatCH.getView().setModel(_thatCH.oI18nModel, "i18n");
				_thatCH.sCurrentLocale = 'FR';
			} else {
				_thatCH.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				_thatCH.getView().setModel(_thatCH.oI18nModel, "i18n");
				_thatCH.sCurrentLocale = 'EN';
			}

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/pipelineInventory-dest";
			} else {
				this.sPrefix = "";
			}
			_thatCH.nodeJsUrl = this.sPrefix + "/node";

			_thatCH.oChangeHistoryModel = new JSONModel();
			_thatCH.getView().setModel(_thatCH.oChangeHistoryModel, "ChangeHistoryModel");

			_thatCH.oDealerDataModel = new JSONModel();
			_thatCH.getView().setModel(sap.ui.getCore().getModel("BusinessDataModel"), "BusinessDataModel");

			_thatCH.getOwnerComponent().getRouter().attachRoutePatternMatched(_thatCH._oChangeHistoryRoute, _thatCH);
			// var err = JSON.parse(oError.response.body);
			// sap.m.MessageBox.error(err.error.message.value);
		},

		_oChangeHistoryRoute: function (oEvent) {
			sap.ui.core.BusyIndicator.hide();
			_thatCH.getView().setModel(_thatCH.oChangeHistoryModel, "ChangeHistoryModel");

			if (oEvent.getParameters().arguments.SelectedDealer != undefined) {
				_thatCH.Dealer = oEvent.getParameters().arguments.SelectedDealer;

				_thatCH._oViewModel = new sap.ui.model.json.JSONModel({
					busy: false,
					delay: 0,
					enableResubmitBtn: false
				});
				_thatCH.getView().setModel(_thatCH._oViewModel, "LocalModel");
				sap.ui.core.BusyIndicator.show();
				//ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ChangeHistorySet?$filter=Dealer eq '2400042193'&$format=json
				var url = _thatCH.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ChangeHistorySet?$filter=Dealer eq '" + _thatCH.Dealer +
					"'&$format=json";
				$.ajax({
					dataType: "json",
					url: url,
					type: "GET",
					success: function (oChangeData) {
						console.log("ChangeHistory Data", oChangeData);
						_thatCH.oChangeHistoryModel.setData(oChangeData.d);
						_thatCH.oChangeHistoryModel.updateBindings(true);
						for (var n = 0; n < _thatCH.oChangeHistoryModel.getData().results.length; n++) {
							if (_thatCH.oChangeHistoryModel.getData().results[n].Status == "Rejected") {
								_thatCH._oViewModel.setProperty("/enableResubmitBtn", true);
							} else {
								_thatCH._oViewModel.setProperty("/enableResubmitBtn", false);
							}
						}
					},
					error: function (oError) {
						_thatCH.errorFlag = true;
					}
				});
			}
		},

		onDealerChange: function (oDealer) {
			sap.ui.core.BusyIndicator.show();
			var SelectedDealer = oDealer.getParameters().selectedItem.getProperty("key");
			var url = _thatCH.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ChangeHistorySet?$filter=Dealer eq '" + SelectedDealer +
				"'&$format=json";
			$.ajax({
				dataType: "json",
				url: url,
				type: "GET",
				success: function (oChangeData) {
					sap.ui.core.BusyIndicator.hide();
					console.log("ChangeHistory Data", oChangeData);
					_thatCH.oChangeHistoryModel.setData(oChangeData.d);
					_thatCH.oChangeHistoryModel.updateBindings(true);
					for (var n = 0; n < _thatCH.oChangeHistoryModel.getData().results.length; n++) {
						if (_thatCH.oChangeHistoryModel.getData().results[n].Status == "Rejected") {
							_thatCH._oViewModel.setProperty("/enableResubmitBtn", true);
						} else {
							_thatCH._oViewModel.setProperty("/enableResubmitBtn", false);
						}
					}
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					_thatCH.errorFlag = true;
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
				_thatCH.getRouter().navTo("Routemaster");
			} else if (selectedScreenText == "Details") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Details");
				_thatCH.getRouter().navTo("details");
			} else if (selectedScreenText == "Vehicle Details") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Vehicle Details");
				_thatCH.getRouter().navTo("vehicleDetails");
			} else if (selectedScreenText == "Order Change") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Order Change");
				_thatCH.getRouter().navTo("orderChange");
			} else if (selectedScreenText == "Ship To Dealer") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Ship To Dealer");
				_thatCH.getRouter().navTo("shipToDealer");
			} else if (selectedScreenText == "Ship To Dealer Response") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Ship To Dealer Response");
				_thatCH.getRouter().navTo("shipToDealerResponse");
			} else if (selectedScreenText == "Assign Vehicles") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Assign Vehicles");
				_thatCH.getRouter().navTo("assignVehicles");
			} else if (selectedScreenText == "Assign Vehicles Status") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Assign Vehicles Status");
				_thatCH.getRouter().navTo("assignVehiclesStatus");
			} else if (selectedScreenText == "Change History") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Change History");
				_thatCH.getRouter().navTo("changeHistory");
			}
		},
		onMenuLinkPress: function (oLink) {
			var _oLinkPressed = oLink;
			var _oSelectedScreen = _oLinkPressed.getSource().getProperty("text");
			if (_oSelectedScreen == _thatCH.oI18nModel.getResourceBundle().getText("PageTitle")) {
				_thatCH.getRouter().navTo("Routemaster");
			} else if (_oSelectedScreen == _thatCH.oI18nModel.getResourceBundle().getText("VehicleDetails")) {
				_thatCH.getRouter().navTo("vehicleDetailsNodata");
			} else if (_oSelectedScreen == _thatCH.oI18nModel.getResourceBundle().getText("ChangeHistory")) {
				_thatCH.getRouter().navTo("changeHistory");
			}
		}
	});
});