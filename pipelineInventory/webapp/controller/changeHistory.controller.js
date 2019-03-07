sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel',
	"sap/ui/core/routing/History"
], function (BaseController, JSONModel, ResourceModel,History) {
	"use strict";
	var _thatCH, SelectedDealerCH,sSelectedLocale;
	return BaseController.extend("pipelineInventory.controller.changeHistory", {

		onInit: function () {
			_thatCH = this;
			_thatCH.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatCH.getView().setModel(_thatCH.oI18nModel, "i18n");

			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				sSelectedLocale = "EN"; // default is english 
			}
			if (sSelectedLocale == "fr") {
				_thatCH.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				this.getView().setModel(_thatCH.oI18nModel, "i18n");
				this.sCurrentLocale = 'FR';
			} else {
				_thatCH.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(_thatCH.oI18nModel, "i18n");
				this.sCurrentLocale = 'EN';
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

			_thatCH._oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0,
				enablesubmitBtn: false
			});
			_thatCH.getView().setModel(_thatCH._oViewModel, "LocalModel");

			_thatCH.getOwnerComponent().getRouter().attachRoutePatternMatched(_thatCH._oChangeHistoryRoute, _thatCH);
			// var err = JSON.parse(oError.response.body);
			// sap.m.MessageBox.error(err.error.message.value);
		},

		_oChangeHistoryRoute: function (oEvent) {
			_thatCH.getView().setBusy(false);
			sap.ui.core.BusyIndicator.show();
			_thatCH.getView().setModel(_thatCH.oChangeHistoryModel, "ChangeHistoryModel");

			if (oEvent.getParameters().arguments.SelectedDealer != undefined) {
				_thatCH.Dealer = oEvent.getParameters().arguments.SelectedDealer;
				_thatCH.btnResubmit = _thatCH.getView().byId("ResubmitBTN");
				//ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ChangeHistorySet?$filter=Dealer eq '2400042193'&$format=json
				var url = _thatCH.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ChangeHistorySet?$filter=Dealer eq '" + _thatCH.Dealer +
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
						// $.each(_thatCH.oChangeHistoryModel.getData().results, function (i, item) {
						// 	if (item.Status !== "Rejected") {
						// 		_thatCH.btnResubmit.setVisible(false);
						// 	} else {
						// 		_thatCH.btnResubmit.setVisible(true);
						// 	}
						// });
						for (var n = 0; n < _thatCH.oChangeHistoryModel.getData().results.length; n++) {
							if (_thatCH.oChangeHistoryModel.getData().results[n].Status !== "Rejected") {
								_thatCH.oChangeHistoryModel.getData().results[n].visible = false;
							} else {
								_thatCH.oChangeHistoryModel.getData().results[n].visible = true;
							}
						}
						_thatCH.oChangeHistoryModel.updateBindings(true);
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
			_thatCH.btnResubmit = _thatCH.getView().byId("ResubmitBTN");
			_thatCH._oViewModel.setProperty("/enablesubmitBtn", true);
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
					// $.each(_thatCH.oChangeHistoryModel.getData().results, function (i, item) {
					// 	if (item.Status !== "Rejected") {
					// 		_thatCH.btnResubmit.setVisible(false);
					// 	} else {
					// 		_thatCH.btnResubmit.setVisible(true);
					// 	}
					// });
					for (var n = 0; n < _thatCH.oChangeHistoryModel.getData().results.length; n++) {
						if (_thatCH.oChangeHistoryModel.getData().results[n].Status !== "Rejected") {
							_thatCH.oChangeHistoryModel.getData().results[n].visible = false;
						} else {
							_thatCH.oChangeHistoryModel.getData().results[n].visible = true;
						}
					}
					_thatCH.oChangeHistoryModel.updateBindings(true);
				},
				error: function (oError) {
					_thatCH._oViewModel.setProperty("/enablesubmitBtn", false);
					sap.ui.core.BusyIndicator.hide();
					_thatCH.errorFlag = true;
				}
			});
		},

		onNavigateToVL: function (oNavEvent) {
			var obj = oNavEvent.getSource().getModel("ChangeHistoryModel").getProperty(oNavEvent.getSource().getBindingContext(
				"ChangeHistoryModel").sPath);
			obj.NewSuffix = obj.NewSuffix.replace("/", "%2F");
			obj.OldSuffix = obj.OldSuffix.replace("/", "%2F");
			obj.__metadata = "";
			this.getRouter().navTo("vehicleDetails2", {
				VCData2: JSON.stringify(obj)
			});
		},
		onNavigateToOC: function (oResubmit) {
			var data = oResubmit.getSource().getModel("ChangeHistoryModel").getProperty(oResubmit.getSource().getBindingContext(
				"ChangeHistoryModel").sPath);
			data.NewSuffix = data.NewSuffix.replace("/", "%2F");
			data.OldSuffix = data.OldSuffix.replace("/", "%2F");
			data.__metadata = "";
			this.getRouter().navTo("orderChange2", {
				Data2: JSON.stringify(data)
			});

		},
		formatDate: function (oDate) {
			if (oDate != "" && oDate != undefined) {
				var Year = oDate.substring(0, 4);
				var Month = oDate.substring(4, 6);
				var Day = oDate.substring(6, 8);
				var date = Year + "-" + Month + "-" + Day;
				var Hours = oDate.substring(8, 10);
				var Minute = oDate.substring(10, 12);
				var Seconds = oDate.substring(12, 14);
				var Time = Hours + ":" + Minute + ":" + Seconds;
				var dateTime = date + "\n/" + Time;
				return dateTime;
				// jQuery.sap.require("sap.ui.core.format.DateFormat");
				// _thatDT.oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				// 	pattern: "yyyy-MM-dd"
				// });
				// return _thatDT.oDateFormat.format(new Date(date));
			}
		},

		onMenuLinkPress: function (oLink) {
			var _oLinkPressed = oLink;
			var _oSelectedScreen = _oLinkPressed.getSource().getProperty("text");
			if (_oSelectedScreen == _thatCH.oI18nModel.getResourceBundle().getText("PageTitle")) {
				_thatCH.getRouter().navTo("Routemaster");
			} else if (_oSelectedScreen == _thatCH.oI18nModel.getResourceBundle().getText("VehicleDetails")) {
				_thatCH.getRouter().navTo("vehicleDetailsNodata");
			}else if (_oSelectedScreen == _thatCH.oI18nModel.getResourceBundle().getText("Back")) {
				var oHistory = History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				}else{
						_thatCH.getRouter().navTo("vehicleDetailsNodata");
				}
			}
		}
	});
});