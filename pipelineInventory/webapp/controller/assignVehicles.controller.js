var _thatAV, SelectedDealer;
sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel',
], function (BaseController, JSONModel, ResourceModel) {
	"use strict";

	return BaseController.extend("pipelineInventory.controller.assignVehicles", {
		onInit: function () {
			_thatAV = this;
			_thatAV.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatAV.getView().setModel(_thatAV.oI18nModel, "i18n");

			if (window.location.search == "?language=fr") {
				_thatAV.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				_thatAV.getView().setModel(_thatAV.oI18nModel, "i18n");
				_thatAV.sCurrentLocale = 'FR';
			} else {
				_thatAV.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				_thatAV.getView().setModel(_thatAV.oI18nModel, "i18n");
				_thatAV.sCurrentLocale = 'EN';
			}

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/pipelineInventory-dest";
			} else {
				this.sPrefix = "";
			}
			_thatAV.nodeJsUrl = this.sPrefix + "/node";

			_thatAV.oDealerDataModel = new JSONModel();
			_thatAV.getView().setModel(sap.ui.getCore().getModel("BusinessDataModel"), "BusinessDataModel");

			_thatAV.oAssignVehiclesModel = new JSONModel();
			_thatAV.getView().setModel(_thatAV.oAssignVehiclesModel, "AssignVehiclesModel");
			sap.ui.getCore().getModel(_thatAV.oAssignVehiclesModel, "AssignVehiclesModel");
			_thatAV.oAssignVehiclesModel.getData().results = [];

			_thatAV._oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0,
				enableResubmitBtn: false
			});
			_thatAV.getView().setModel(_thatAV._oViewModel, "LocalModel");

			_thatAV.getOwnerComponent().getRouter().attachRoutePatternMatched(_thatAV._oAssignVehicleRoute, _thatAV);
		},

		_oAssignVehicleRoute: function (oEvent) {
			sap.ui.core.BusyIndicator.hide();
			if (oEvent.getParameters().arguments.vehicleData != undefined) {
				var VUIdata = JSON.parse(oEvent.getParameters().arguments.vehicleData);
				for (var n = 0; n < VUIdata.length; n++) {
					if (VUIdata[n].AssignVehicle !== false) {
						_thatAV.oAssignVehiclesModel.getData().results.push(VUIdata[n]);
						_thatAV.oAssignVehiclesModel.updateBindings(true);
						_thatAV.getView().setModel(_thatAV.oAssignVehiclesModel, "AssignVehiclesModel");
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
			if (_thatAV.getView().setModel("AssignVehiclesModel").getData().results.length > 0) {
				_thatAV._oViewModel.setProperty("/enableResubmitBtn", true);
			}
		},
		
		getResonseForSubmit: function () {
			console.log("SelectedDealer", SelectedDealer);
			var Obj = {};
			_thatAV.oJSON = _thatAV.getView().setModel("AssignVehiclesModel").getData().results;
			_thatAV.responseData = [];
			if (_thatAV.oJSON.length > 0) {
				for (var i = 0; i < _thatAV.oJSON.length; i++) {

					Obj.Dealer_To = _thatAV.oJSON[i].Dealer_To;
					Obj.VHCLE = _thatAV.oJSON[i].KUNNR;
					Obj.Dealer = SelectedDealer;
					Obj.Model = _thatAV.oJSON[i].Model;
					Obj.Modelyear = _thatAV.oJSON[i].Modelyear;
					Obj.Suffix = _thatAV.oJSON[i].Suffix;
					Obj.ExteriorColorCode = _thatAV.oJSON[i].ExteriorColorCode;
					Obj.INTCOL = _thatAV.oJSON[i].INTCOL;

					var oModel = new sap.ui.model.odata.v2.ODataModel(_thatAV.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV");
					this._oToken = oModel.getHeaders()['x-csrf-token'];
					$.ajaxSetup({
						headers: {
							'X-CSRF-Token': this._oToken
						}
					});
					oModel.create("/AssignVehicleSet", Obj, {
						success: $.proxy(function (oResponse) {
							console.log("AssignVehicleSetResponse", oResponse);
							_thatAV.responseData.push(oResponse.results);
						}, _thatAV),
						error: function (oError) {
							console.log("orderChangeError", oError);
						}
					});
				}
			}
		},

		onSubmitChanges: function () {
			
			_thatAV.getResonseForSubmit();
			console.log("SelectedDealer", SelectedDealer);
			_thatAV.getRouter().navTo("assignVehiclesStatus");
		},

		selectedScreen: function (oSelectedScreen) {
			var selectedScreenText = oSelectedScreen.getParameters().selectedItem.getText();
			if (selectedScreenText == "Master") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Pipeline ETA & Inventory Summary");
				_thatAV.getRouter().navTo("Routemaster");
			} else if (selectedScreenText == "Details") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Details");
				_thatAV.getRouter().navTo("details");
			} else if (selectedScreenText == "Vehicle Details") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Vehicle Details");
				_thatAV.getRouter().navTo("vehicleDetails");
			} else if (selectedScreenText == "Order Change") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Order Change");
				_thatAV.getRouter().navTo("orderChange");
			} else if (selectedScreenText == "Ship To Dealer") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Ship To Dealer");
				_thatAV.getRouter().navTo("shipToDealer");
			} else if (selectedScreenText == "Ship To Dealer Response") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Ship To Dealer Response");
				_thatAV.getRouter().navTo("shipToDealerResponse");
			} else if (selectedScreenText == "Assign Vehicles") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Assign Vehicles");
				_thatAV.getRouter().navTo("assignVehicles");
			} else if (selectedScreenText == "Assign Vehicles Status") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Assign Vehicles Status");
				_thatAV.getRouter().navTo("assignVehiclesStatus");
			} else if (selectedScreenText == "Change History") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Change History");
				_thatAV.getRouter().navTo("changeHistory");
			}
		},
		onMenuLinkPress: function (oLink) {
			var _oLinkPressed = oLink;
			var _oSelectedScreen = _oLinkPressed.getSource().getProperty("text");
			if (_oSelectedScreen == _thatAV.oI18nModel.getResourceBundle().getText("PageTitle")) {
				_thatAV.getRouter().navTo("Routemaster");
			} else if (_oSelectedScreen == _thatAV.oI18nModel.getResourceBundle().getText("VehicleDetails")) {
				_thatAV.getRouter().navTo("vehicleDetailsNodata");
			} else if (_oSelectedScreen == _thatAV.oI18nModel.getResourceBundle().getText("ChangeHistory")) {
				_thatAV.getRouter().navTo("changeHistory");
			}
		},
		onExit: function () {
			_thatAV.destroy();
		}

	});

});