var _thatAV, SelectedDealerA;
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

			// _thatAV.oDealerDataModel = new JSONModel();
			_thatAV.getView().setModel(sap.ui.getCore().getModel("BusinessDataModel"), "BusinessDataModel");

			_thatAV.oAssignVehiclesModel = new JSONModel();
			_thatAV.getView().setModel(_thatAV.oAssignVehiclesModel, "AssignVehiclesModel");
			sap.ui.getCore().getModel(_thatAV.oAssignVehiclesModel, "AssignVehiclesModel");

			_thatAV._oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0,
				enableResubmitBtn: false
			});
			_thatAV.getView().setModel(_thatAV._oViewModel, "LocalModel");

			_thatAV.getOwnerComponent().getRouter().attachRoutePatternMatched(_thatAV._oAssignVehicleRoute, _thatAV);
		},

		_oAssignVehicleRoute: function (oEvent) {
			// window.onhashchange = function () {
			// 	if (window.innerDocClick != false) {
			// 		//Your own in-page mechanism triggered the hash change
			// 	} else {
			// 		//Browser back button was clicked
			// 		_thatAV.getView().setBusy(false);
			// 	}
			// };
			_thatAV.getView().setBusy(false);
			sap.ui.core.BusyIndicator.hide();
			if (oEvent.getParameters().arguments.vehicleData != undefined) {
				_thatAV.oAssignVehiclesModel.getData().results = [];
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
			// SelectedDealerA= oDealer.getParameters().selectedItem.getProperty("key");
			var SelectedDealerKey = oDealer.getParameters().selectedItem.getText().split("-")[0];
			if (_thatAV.getView().getModel("AssignVehiclesModel").getData().results.length > 0) {
				_thatAV._oViewModel.setProperty("/enableResubmitBtn", true);
			} else {
				_thatAV._oViewModel.setProperty("/enableResubmitBtn", false);
			}
			for (var d = 0; d < _thatAV.getView().getModel("BusinessDataModel").getData().DealerList.length; d++) {
				if (SelectedDealerKey == _thatAV.getView().getModel("BusinessDataModel").getData().DealerList[d].BusinessPartner) {
					SelectedDealerA = _thatAV.getView().getModel("BusinessDataModel").getData().DealerList[d].BusinessPartnerKey;
				}
			}
		},

		getResonseForSubmit: function () {
			console.log("SelectedDealerA", SelectedDealerA);

			_thatAV.oJSON = _thatAV.getView().getModel("AssignVehiclesModel").getData().results;
			_thatAV.responseData = [];
			var oModel = _thatAV.getOwnerComponent().getModel("DataModel");
			//new sap.ui.model.odata.v2.ODataModel(_thatAV.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV");
			oModel.setUseBatch(false);
			this._oToken = oModel.getHeaders()['x-csrf-token'];
			$.ajaxSetup({
				headers: {
					'X-CSRF-Token': this._oToken
				}
			});
			if (_thatAV.oJSON.length > 0) {
				for (var i = 0; i < _thatAV.oJSON.length; i++) {
					this.assignVehiclePost(oModel, _thatAV.oJSON[i]);
				}
			}
		},

		assignVehiclePost: function (oModel, oData) {
			var Obj = {};
			Obj.Dealer_To = SelectedDealerA;
			Obj.VHCLE = oData.VHCLE;
			Obj.Dealer = oData.Dealer;
			Obj.Model = oData.Model;
			Obj.Modelyear = oData.Modelyear;
			Obj.Suffix = oData.Suffix;
			Obj.ExteriorColorCode = oData.ExteriorColorCode;
			Obj.INTCOL = oData.INTCOL;

			oModel.create("/AssignVehicleSet", Obj, {
				success: $.proxy(function (oResponse) {
					console.log("AssignVehicleSetResponse", oResponse);
					_thatAV.responseData.push(oResponse.results);
					if (_thatAV.responseData.length > 0) {
						var data = _thatAV.oDropShipDataModel.getData().results;
						for (var i = 0; i < data.length; i++) {
							for (var j = 0; j < _thatAV.responseData.length; j++) {
								if (_thatAV.responseData[j].VHCLE == data[i].VHCLE) {
									data[i].Error = _thatAV.responseData[j].Error;
									data[i].Status = _thatAV.responseData[j].Status;
								}
								_thatAV.oDropShipDataModel.updateBindings(true);
								_thatAV.oDropShipDataModel.refresh(true);
							}
						}
						jQuery.sap.delayedCall(1000, _thatAV, function () {
							_thatAV.getRouter().navTo("assignVehiclesStatus", {
								data: JSON.stringify(data)
							});
						});
					}
				}, _thatAV),
				error: function (oError) {
					console.log("orderChangeError", oError);
				}
			});
		},

		onSubmitChanges: function () {
			_thatAV.getResonseForSubmit();
			// console.log("SelectedDealerA", SelectedDealerA);
			// _thatAV.getRouter().navTo("assignVehiclesStatus");
		},

		onMenuLinkPress: function (oLink) {
			var _oLinkPressed = oLink;
			var _oSelectedScreen = _oLinkPressed.getSource().getProperty("text");
			if (_oSelectedScreen == _thatAV.oI18nModel.getResourceBundle().getText("PageTitle")) {
				_thatAV.getRouter().navTo("Routemaster");
			} else if (_oSelectedScreen == _thatAV.oI18nModel.getResourceBundle().getText("VehicleDetails")) {
				_thatAV.getRouter().navTo("vehicleDetailsNodata");
			} else if (_oSelectedScreen == _thatAV.oI18nModel.getResourceBundle().getText("ChangeHistory")) {
				_thatAV.getRouter().navTo("changeHistory", {
					SelectedDealer: SelectedDealerA
				});
			}
		},
		onExit: function () {
			_thatAV.oAssignVehiclesModel.setData();
			_thatAV.oAssignVehiclesModel.updateBindings(true);
			_thatAV.oAssignVehiclesModel.refresh(true);
			_thatAV.responseData = [];
			_thatAV.destroy();
		}

	});

});