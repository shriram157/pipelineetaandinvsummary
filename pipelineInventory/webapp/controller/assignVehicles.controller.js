var _that, SelectedDealer;
sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel',
], function (BaseController, JSONModel, ResourceModel) {
	"use strict";

	return BaseController.extend("pipelineInventory.controller.assignVehicles", {
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

			_that.oDealerDataModel = new JSONModel();
			_that.getView().setModel(sap.ui.getCore().getModel("BusinessDataModel"), "BusinessDataModel");

			_that.oAssignVehiclesModel = new JSONModel();
			_that.getView().setModel(_that.oAssignVehiclesModel, "AssignVehiclesModel");
			sap.ui.getCore().getModel(_that.oAssignVehiclesModel, "AssignVehiclesModel");
			_that.oAssignVehiclesModel.getData().results = [];

			_that._oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0,
				enableResubmitBtn: false
			});
			_that.getView().setModel(_that._oViewModel, "LocalModel");

			_that.getOwnerComponent().getRouter().attachRoutePatternMatched(_that._oAssignVehicleRoute, _that);
		},

		_oAssignVehicleRoute: function (oEvent) {
			sap.ui.core.BusyIndicator.hide();
			if (oEvent.getParameters().arguments.vehicleData != undefined) {
				var VUIdata = JSON.parse(oEvent.getParameters().arguments.vehicleData);
				for (var n = 0; n < VUIdata.length; n++) {
					if (VUIdata[n].AssignVehicle !== false) {
						_that.oAssignVehiclesModel.getData().results.push(VUIdata[n]);
						_that.oAssignVehiclesModel.updateBindings(true);
						_that.getView().setModel(_that.oAssignVehiclesModel, "AssignVehiclesModel");
					}
				}
			}
		},

		onNavigateToVL: function (oNavEvent) {
			this.getRouter().navTo("vehicleDetails", {
				OrderNumber: oNavEvent.getSource().getModel("AssignVehiclesModel").getProperty(oNavEvent.getSource().getBindingContext(
					"AssignVehiclesModel").sPath).VHCLE
			});
		},

		onDealerChange: function (oDealer) {
			SelectedDealer = oDealer.getParameters().selectedItem.getProperty("key");
			if (_that.getView().setModel("AssignVehiclesModel").getData().results.length > 0) {
				_that._oViewModel.setProperty("/enableResubmitBtn", true);
			}
		},
		
		getResonseForSubmit: function () {
			console.log("SelectedDealer", SelectedDealer);
			var Obj = {};
			_that.oJSON = _that.getView().setModel("AssignVehiclesModel").getData().results;
			_that.responseData = [];
			if (_that.oJSON.length > 0) {
				for (var i = 0; i < _that.oJSON.length; i++) {

					Obj.Dealer_To = _that.oJSON[i].Dealer_To;
					Obj.VHCLE = _that.oJSON[i].KUNNR;
					Obj.Dealer = SelectedDealer;
					Obj.Model = _that.oJSON[i].Model;
					Obj.Modelyear = _that.oJSON[i].Modelyear;
					Obj.Suffix = _that.oJSON[i].Suffix;
					Obj.ExteriorColorCode = _that.oJSON[i].ExteriorColorCode;
					Obj.INTCOL = _that.oJSON[i].INTCOL;

					var oModel = new sap.ui.model.odata.v2.ODataModel(_that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV");
					this._oToken = oModel.getHeaders()['x-csrf-token'];
					$.ajaxSetup({
						headers: {
							'X-CSRF-Token': this._oToken
						}
					});
					oModel.create("/AssignVehicleSet", Obj, {
						success: $.proxy(function (oResponse) {
							console.log("AssignVehicleSetResponse", oResponse);
							_that.responseData.push(oResponse.results);
						}, _that),
						error: function (oError) {
							console.log("orderChangeError", oError);
						}
					});
				}
			}
		},

		onSubmitChanges: function () {
			
			_that.getResonseForSubmit();
			console.log("SelectedDealer", SelectedDealer);
			_that.getRouter().navTo("assignVehiclesStatus");
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
		},
		onExit: function () {
			_that.destroy();
		}

	});

});