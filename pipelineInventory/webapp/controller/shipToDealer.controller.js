sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel',
	"sap/ui/core/routing/History"
], function (BaseController, JSONModel, ResourceModel, History) {
	"use strict";
	var _thatSD, SelectedDealerS, sSelectedLocale, Division, localLang;
	return BaseController.extend("pipelineInventory.controller.shipToDealer", {

		onInit: function () {
			_thatSD = this;
			_thatSD.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatSD.getView().setModel(_thatSD.oI18nModel, "i18n");

			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				sSelectedLocale = "EN"; // default is english 
			}
			if (sSelectedLocale == "fr") {
				_thatSD.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				this.getView().setModel(_thatSD.oI18nModel, "i18n");
				this.sCurrentLocale = 'FR';
				localLang="F";
			} else {
				_thatSD.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(_thatSD.oI18nModel, "i18n");
				this.sCurrentLocale = 'EN';
				localLang="E";
			}

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/pipelineInventory-dest";
			} else {
				this.sPrefix = "";
			}
			_thatSD.nodeJsUrl = this.sPrefix + "/node";

			/*Logic for logo change depending upon Toyota and Lexus user*/
			var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			if (isDivisionSent) {
				Division = window.location.search.match(/Division=([^&]*)/i)[1];
				var currentImageSource;
				if (Division == '10') // set the toyoto logo
				{
					currentImageSource = this.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "images/toyota_logo_colour.png");
				} else { // set the lexus logo
					currentImageSource = this.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "images/Lexus.png");
				}
			}

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
		
		afterConfigLoad: function () {
			if (localLang === "F") {
				$(".sapMGrowingListTriggerText>.sapMSLITitle")[0].innerHTML = "Plus";
			} else {
				$(".sapMGrowingListTriggerText>.sapMSLITitle")[0].innerHTML = "More";
			}
		},

		_oShipToDealerRoute: function (oEvent) {
			_thatSD.getView().setBusy(false);
			sap.ui.core.BusyIndicator.hide();
			_thatSD.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatSD.getView().setModel(_thatSD.oI18nModel, "i18n");

			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				sSelectedLocale = "EN"; // default is english 
			}
			if (sSelectedLocale == "fr") {
				_thatSD.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				this.getView().setModel(_thatSD.oI18nModel, "i18n");
				this.sCurrentLocale = 'FR';
			} else {
				_thatSD.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(_thatSD.oI18nModel, "i18n");
				this.sCurrentLocale = 'EN';
			}
			_thatSD._oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0,
				enableResubmitBtn: false
			});
			_thatSD.getView().setModel(_thatSD._oViewModel, "LocalModel");

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/pipelineInventory-dest";
			} else {
				this.sPrefix = "";
			}
			_thatSD.nodeJsUrl = this.sPrefix + "/node";

			/*Logic for logo change depending upon Toyota and Lexus user*/
			var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			if (isDivisionSent) {
				Division = window.location.search.match(/Division=([^&]*)/i)[1];
				var currentImageSource;
				if (Division == '10') // set the toyoto logo
				{
					currentImageSource = this.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "images/toyota_logo_colour.png");
				} else { // set the lexus logo
					currentImageSource = this.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "images/Lexus.png");
				}
			}

			if (oEvent.getParameters().arguments.vehicleData != undefined) {
				var VUIdata = JSON.parse(oEvent.getParameters().arguments.vehicleData);
				console.log("preformatted data",VUIdata);
				_thatSD.oDropShipDataModel.getData().results = [];
				for (var n = 0; n < VUIdata.length; n++) {
					VUIdata[n].ORDERTYPE_DESC_EN = VUIdata[n].ORDERTYPE_DESC_EN.replace("%2F", "/");
					VUIdata[n].SERIES_DESC_EN = VUIdata[n].SERIES_DESC_EN.replace("%2F", "/");
					VUIdata[n].SERIES_DESC_FR = VUIdata[n].SERIES_DESC_FR.replace("%2F", "/");
					VUIdata[n].SUFFIX_DESC_EN = VUIdata[n].SUFFIX_DESC_EN.replace("%2F", "/");
					VUIdata[n].SUFFIX_DESC_FR = VUIdata[n].SUFFIX_DESC_FR.replace("%2F", "/");
					VUIdata[n].INTCOL_DESC_EN = VUIdata[n].INTCOL_DESC_EN.replace("%2F", "/");
					VUIdata[n].INTCOL_DESC_FR = VUIdata[n].INTCOL_DESC_FR.replace("%2F", "/");
					VUIdata[n].MODEL_DESC_EN = VUIdata[n].MODEL_DESC_EN.replace("%2F", "/");
					VUIdata[n].MODEL_DESC_FR = VUIdata[n].MODEL_DESC_FR.replace("%2F", "/");
					VUIdata[n].EXTCOL_DESC_EN = VUIdata[n].EXTCOL_DESC_EN.replace("%2F", "/");
					VUIdata[n].EXTCOL_DESC_FR = VUIdata[n].EXTCOL_DESC_FR.replace("%2F", "/");

					// VUIdata[n].SUFFIX_DESC_FR = VUIdata[n].SUFFIX_DESC_FR.replace("%2F", "/");
					// VUIdata[n].ORDERTYPE_DESC_EN = VUIdata[n].ORDERTYPE_DESC_EN.replace("%2F", "/");
					// VUIdata[n].SERIES_DESC_EN = VUIdata[n].SERIES_DESC_EN.replace("%2F", "/");
					// VUIdata[n].SUFFIX_DESC_EN = VUIdata[n].SUFFIX_DESC_EN.replace("%2F", "/");
					// VUIdata[n].SERIES_DESC_FR = VUIdata[n].SERIES_DESC_FR.replace("%2F", "/");
					console.log("% formatted data",VUIdata);
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
				VCData: oNavEvent.getSource().getModel("DropShipDataModel").getProperty(oNavEvent.getSource().getBindingContext(
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
			if (oDealer.getParameters().selectedItem.getText().split("-")[2] == "Zone All") {
				SelectedDealerKey = "-";
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
					oResponse.__metadata = "";
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
				if (SelectedDealerS != undefined) {
					_thatSD.getRouter().navTo("changeHistory", {
						SelectedDealer: SelectedDealerS
					});
				} else {
					_thatSD.getRouter().navTo("changeHistory2");
				}
			}
			// else if (_oSelectedScreen == _thatSD.oI18nModel.getResourceBundle().getText("ChangeHistory")) {
			// 	_thatSD.getRouter().navTo("changeHistory", {
			// 		SelectedDealer: SelectedDealerS
			// 	});
			// } 
			else if (_oSelectedScreen == _thatSD.oI18nModel.getResourceBundle().getText("Back")) {
				var oHistory = History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(_thatSD);
					oRouter.navTo("details");
				}
			}
		},
		formatDate: function (oDate) {
			if (oDate != "" && oDate != undefined) {
				var Year = oDate.substring(0, 4);
				var Month = oDate.substring(4, 6);
				var Day = oDate.substring(6, 8);
				var date = Year + "-" + Month + "-" + Day;
				return date;
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