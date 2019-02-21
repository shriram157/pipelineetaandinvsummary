sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel'
], function (BaseController, JSONModel, ResourceModel) {
	"use strict";
	var _thatSD, SelectedDealerS;
	return BaseController.extend("pipelineInventory.controller.shipToDealer", {

		onInit: function () {
			_thatSD = this;
			_thatSD.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatSD.getView().setModel(_thatSD.oI18nModel, "i18n");

			if (window.location.search == "?language=fr") {
				_thatSD.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				_thatSD.getView().setModel(_thatSD.oI18nModel, "i18n");
				_thatSD.sCurrentLocale = 'FR';
			} else {
				_thatSD.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				_thatSD.getView().setModel(_thatSD.oI18nModel, "i18n");
				_thatSD.sCurrentLocale = 'EN';
			}

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/pipelineInventory-dest";
			} else {
				this.sPrefix = "";
			}
			_thatSD.nodeJsUrl = this.sPrefix + "/node";

			// _thatSD.oDealerDataModel = new JSONModel();
			_thatSD.getView().setModel(sap.ui.getCore().getModel("BusinessDataModel"), "BusinessDataModel");

			_thatSD.oDropShipDataModel = new JSONModel();
			_thatSD.getView().setModel(_thatSD.oDropShipDataModel, "DropShipDataModel");
			sap.ui.getCore().getModel(_thatSD.oDropShipDataModel, "DropShipDataModel");

			_thatSD._oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0,
				enableResubmitBtn: false
			});
			_thatSD.getView().setModel(_thatSD._oViewModel, "LocalModel");

			_thatSD.getOwnerComponent().getRouter().attachRoutePatternMatched(_thatSD._oShipToDealerRoute, _thatSD);
		},

		_oShipToDealerRoute: function (oEvent) {
			_thatSD.getView().setBusy(false);
			sap.ui.core.BusyIndicator.hide();
			if (oEvent.getParameters().arguments.vehicleData != undefined) {
				var VUIdata = JSON.parse(oEvent.getParameters().arguments.vehicleData);
				_thatSD.oDropShipDataModel.getData().results = [];
				for (var n = 0; n < VUIdata.length; n++) {
					if (VUIdata[n].DropShip !== false) {
						_thatSD.oDropShipDataModel.getData().results.push(VUIdata[n]);
						_thatSD.oDropShipDataModel.updateBindings(true);
						_thatSD.getView().setModel(_thatSD.oDropShipDataModel, "DropShipDataModel");
					}
				}
			}
		},

		onNavigateToVL: function (oNavEvent) {
			this.getRouter().navTo("vehicleDetails", {
				OrderNumber: oNavEvent.getSource().getModel("DropShipDataModel").getProperty(oNavEvent.getSource().getBindingContext(
					"DropShipDataModel").sPath).VHCLE
			});
		},

		onDealerChange: function (oDealer) {
			var SelectedDealerKey = oDealer.getParameters().selectedItem.getText().split("-")[0];
			if (_thatSD.getView().getModel("DropShipDataModel").getData().results.length > 0) {
				_thatSD._oViewModel.setProperty("/enableResubmitBtn", true);
			} else {
				_thatSD._oViewModel.setProperty("/enableResubmitBtn", false);
			}
			for (var d = 0; d < _thatSD.getView().getModel("BusinessDataModel").getData().DealerList.length; d++) {
				if (SelectedDealerKey == _thatSD.getView().getModel("BusinessDataModel").getData().DealerList[d].BusinessPartner) {
					SelectedDealerS = _thatSD.getView().getModel("BusinessDataModel").getData().DealerList[d].BusinessPartnerKey;
				}
			}
		},

		getResonseForSubmit: function () {
			console.log("SelectedDealerS", SelectedDealerS);
			_thatSD.oJSON = _thatSD.getView().getModel("DropShipDataModel").getData().results;
			_thatSD.responseData = [];
			var DataModel = _thatSD.getOwnerComponent().getModel("DataModel");
			// var oModel = new sap.ui.model.odata.v2.ODataModel(_thatSD.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV");
			DataModel.setUseBatch(false);
			
			if (_thatSD.oJSON.length > 0) {
				for (var i = 0; i < _thatSD.oJSON.length; i++) {
					this.dropshipData(DataModel, _thatSD.oJSON[i]);
				}
			}
		},

		dropshipData: function (model, jsonData) {
			var Obj = {};
			Obj.Dealer_To = SelectedDealerS;
			Obj.VHCLE = jsonData.VHCLE;
			Obj.Dealer = jsonData.Dealer;
			Obj.Model = jsonData.Model;
			Obj.Modelyear = jsonData.Modelyear;
			Obj.Suffix = jsonData.Suffix;
			Obj.ExteriorColorCode = jsonData.ExteriorColorCode;
			Obj.INTCOL = jsonData.INTCOL;
			
			this._oToken = model.getHeaders()['x-csrf-token'];
			$.ajaxSetup({
				headers: {
					'X-CSRF-Token': this._oToken
				}
			});

			model.create("/DropShipSet", Obj, {
				success: $.proxy(function (oResponse) {
					console.log("Drop Ship Response", oResponse);
					_thatSD.responseData.push(oResponse);
					if (_thatSD.responseData.length > 0) {
						var data = _thatSD.oDropShipDataModel.getData().results;
						for (var i = 0; i < data.length; i++) {
							for (var j = 0; j < _thatSD.responseData.length; j++) {
							if (_thatSD.responseData[j].VHCLE == data[i].VHCLE) {
								data[i].Error = _thatSD.responseData[j].Error;
								data[i].Status = _thatSD.responseData[j].Status;
							}
							_thatSD.oDropShipDataModel.updateBindings(true);
							_thatSD.oDropShipDataModel.refresh(true);
							}
						}
						_thatSD.getRouter().navTo("shipToDealerResponse", {
							data: JSON.stringify(data)
						});
					}
				}, _thatSD),
				error: function (oError) {
					console.log("orderChangeError", oError);
				}
			});
		},

		onSubmitChanges: function () {
			_thatSD.getResonseForSubmit();
		},

		onMenuLinkPress: function (oLink) {
			var _oLinkPressed = oLink;
			var _oSelectedScreen = _oLinkPressed.getSource().getProperty("text");
			if (_oSelectedScreen == _thatSD.oI18nModel.getResourceBundle().getText("PageTitle")) {
				_thatSD.getRouter().navTo("Routemaster");
			} else if (_oSelectedScreen == _thatSD.oI18nModel.getResourceBundle().getText("VehicleDetails")) {
				_thatSD.getRouter().navTo("vehicleDetailsNodata");
			} else if (_oSelectedScreen == _thatSD.oI18nModel.getResourceBundle().getText("ChangeHistory")) {
				_thatSD.getRouter().navTo("changeHistory", {
					SelectedDealer: SelectedDealerS
				});
			}
		},

		onExit: function () {
			_thatSD.oDropShipDataModel.setData();
			_thatSD.oDropShipDataModel.updateBindings(true);
			_thatSD.oDropShipDataModel.refresh(true);
			_thatSD.responseData = [];
			_thatSD.destroy();
		}
	});
});