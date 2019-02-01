var _thatSD, SelectedDealer;
sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel'
], function (BaseController, JSONModel, ResourceModel) {
	"use strict";

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

			_thatSD.oDealerDataModel = new JSONModel();
			_thatSD.getView().setModel(sap.ui.getCore().getModel("BusinessDataModel"), "BusinessDataModel");

			_thatSD.oDropShipDataModel = new JSONModel();
			_thatSD.getView().setModel(_thatSD.oDropShipDataModel, "DropShipDataModel");
			sap.ui.getCore().getModel(_thatSD.oDropShipDataModel, "DropShipDataModel");
			_thatSD.oDropShipDataModel.getData().results = [];

			_thatSD._oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0,
				enableResubmitBtn: false
			});
			_thatSD.getView().setModel(_thatSD._oViewModel, "LocalModel");

			_thatSD.getOwnerComponent().getRouter().attachRoutePatternMatched(_thatSD._oShipToDealerRoute, _thatSD);
		},

		_oShipToDealerRoute: function (oEvent) {
			sap.ui.core.BusyIndicator.hide();
			if (oEvent.getParameters().arguments.vehicleData != undefined) {
				var VUIdata = JSON.parse(oEvent.getParameters().arguments.vehicleData);
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
			SelectedDealer = oDealer.getParameters().selectedItem.getProperty("key");
			if (_thatSD.getView().setModel("DropShipDataModel").getData().results.length > 0) {
				_thatSD._oViewModel.setProperty("/enableResubmitBtn", true);
			}
		},

		getResonseForSubmit: function () {
			console.log("SelectedDealer", SelectedDealer);
			var Obj = {};
			_thatSD.oJSON = _thatSD.getView().setModel("DropShipDataModel").getData().results;
			_thatSD.responseData = [];
			if (_thatSD.oJSON.length > 0) {
				for (var i = 0; i < _thatSD.oJSON.length; i++) {

					Obj.Dealer_To = _thatSD.oJSON[i].Dealer_To;
					Obj.VHCLE = _thatSD.oJSON[i].KUNNR;
					Obj.Dealer = SelectedDealer;
					Obj.Model = _thatSD.oJSON[i].Model;
					Obj.Modelyear = _thatSD.oJSON[i].Modelyear;
					Obj.Suffix = _thatSD.oJSON[i].Suffix;
					Obj.ExteriorColorCode = _thatSD.oJSON[i].ExteriorColorCode;
					Obj.INTCOL = _thatSD.oJSON[i].INTCOL;

					var oModel = new sap.ui.model.odata.v2.ODataModel(_thatSD.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV");
					this._oToken = oModel.getHeaders()['x-csrf-token'];
					$.ajaxSetup({
						headers: {
							'X-CSRF-Token': this._oToken
						}
					});
					oModel.create("/DropShipSet", Obj, {
						success: $.proxy(function (oResponse) {
							console.log("Drop Ship Response", oResponse);
							_thatSD.responseData.push(oResponse.results);
						}, _thatSD),
						error: function (oError) {
							console.log("orderChangeError", oError);
						}
					});
				}
			}
		},

		onSubmitChanges: function () {
			_thatSD.getResonseForSubmit();
			_thatSD.getRouter().navTo("shipToDealerResponse", {
				// data:JSON.stringify(_thatSD.responseData);
			});
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
					SelectedDealer: SelectedDealer
				});
			}
		},

		onExit: function () {
			this.destroy();
		}
	});
});