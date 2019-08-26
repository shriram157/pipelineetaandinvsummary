var selectedDDValues = [],
	seriesModel = "",
	salesOffice;
sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel',
	'pipelineInventory/controller/BaseController',
	"sap/m/MessageBox"
], function (Controller, JSONModel, ResourceModel, BaseController, MessageBox) {
	"use strict";

	var Division, DivUser, _that, filteredData, SelectedDealer, seriesdata = [],
		sSelectedLocale, scopesData, DivAttribute, URILang;
	return BaseController.extend("pipelineInventory.controller.master", {
		/*Initialization of the page data*/
		onInit: function () {
			_that = this;
			var _oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0,
				ForDealerOnly: false,
				noMYSelection: true
			});
			_that.getView().setModel(_oViewModel, "LocalOCModel"); //ForDealerOnly
			var fleetMatrix = new sap.ui.model.json.JSONModel({
				"FleetColnIndex": ""
			});
			sap.ui.getCore().setModel(fleetMatrix, "fleetMatrixModel");
			_that.errorFlag = false;
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			_that.oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyyMMdd"
			});

			_that.oDateFormatExcel = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "YYYY-MM-DD"
			});

			_that.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_that.getView().setModel(_that.oI18nModel, "i18n");

			_that.dialog = new sap.m.BusyDialog({
				text: _that.oI18nModel.getResourceBundle().getText("loadingData")
			});

			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				sSelectedLocale = "EN"; // default is english 
			}
			if (sSelectedLocale == "fr") {
				this.localLang = "F";
				URILang = "F";
				_that.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				this.getView().setModel(_that.oI18nModel, "i18n");
				this.sCurrentLocale = 'FR';
			} else {
				URILang = "E";
				this.localLang = "E";
				_that.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(_that.oI18nModel, "i18n");
				this.sCurrentLocale = 'EN';
			}

			var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			if (isDivisionSent) {
				Division = window.location.search.match(/Division=([^&]*)/i)[1];
				var currentImageSource;
				if (Division == '10') // set the toyoto logo
				{
					DivUser = "TOY";
					DivAttribute = "10";
					currentImageSource = this.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "images/toyota_logo_colour.png");

				} else { // set the lexus logo
					DivUser = "LEX";
					DivAttribute = "20";
					currentImageSource = this.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "images/Lexus.png");
				}
			}

			_that.BusinessPartnerData = new sap.ui.model.json.JSONModel();
			_that.BusinessPartnerData.setSizeLimit(750);
			_that.getView().setModel(_that.BusinessPartnerData, "BusinessDataModel");
			sap.ui.getCore().setModel(_that.BusinessPartnerData, "BusinessDataModel");

			//Local Testing
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/pipelineInventory-dest";

				var attributes = [{
					"Attribute": "",
					"BusinessPartner": "Zone Stock",
					"BusinessPartnerKey": "",
					"BusinessPartnerName": "Zone Stock",
					"BusinessPartnerType": "",
					"BPDivision": "",
					"SearchTerm2": ""
				}, {
					"Attribute": "01",
					"BusinessPartner": "42193",
					"BusinessPartnerKey": "2400042193",
					"BusinessPartnerName": "Bailey Toyota",
					"BusinessPartnerType": "Z001",
					"BPDivision": "10",
					"SearchTerm2": "42193"
				}, {
					"Attribute": "01",
					"BusinessPartner": "00000",
					"BusinessPartnerKey": "2400500000",
					"BusinessPartnerName": "",
					"BusinessPartnerType": "Z004",
					"BPDivision": "10",
					"SearchTerm2": "00000"
				}, {
					"Attribute": "01",
					"BusinessPartner": "TCI Total",
					"BusinessPartnerKey": "",
					"BusinessPartnerName": "TCI Total",
					"BusinessPartnerType": "Z004",
					"BPDivision": "10",
					"SearchTerm2": ""
				}, {
					"Attribute": "01",
					"BPDivision": "10",
					"BusinessPartner": "01116",
					"BusinessPartnerKey": "2400001116",
					"BusinessPartnerName": "Regency Toyota (Vancouver)..",
					"BusinessPartnerType": "Z001",
					"SearchTerm2": "01116"
				}, {
					"Attribute": "01",
					"BPDivision": "10",
					"BusinessPartner": "42120",
					"BusinessPartnerKey": "2400042120",
					"BusinessPartnerName": "Don Valley North Toyota - Shoaib 2",
					"BusinessPartnerType": "Z001",
					"SearchTerm2": "42120"
				}];

				var samlAttributes = {
					"Language": ["English"],
					"UserType": ["Dealer_User"]
						// ,
						// "Zone": ["4"]
				};
				salesOffice = "1000";
				_that.BusinessPartnerData.getData().DealerList = attributes;
				_that.BusinessPartnerData.getData().SamlList = samlAttributes;
				_that.BusinessPartnerData.updateBindings(true);
				_that.BusinessPartnerData.refresh(true);
				sap.ui.getCore().getModel("BusinessDataModel").getData()._TCIDealerUser = "DealerONLY"; //local testing
				_that.getView().getModel("LocalOCModel").setProperty("/ForDealerOnly", true); //local testing

			} else {
				//Cloud Deployment
				this.sPrefix = "";
			}
			this.nodeJsUrl = this.sPrefix + "/node";
			sap.ui.core.BusyIndicator.show();

			$.ajax({
				dataType: "json",
				url: "/userDetails/currentScopesForUser",
				type: "GET",
				success: function (scopesData) {
					scopesData = scopesData.loggedUserType[0];
					if (scopesData == "TCI_Zone_Admin" || scopesData == "TCI_User") {
						sap.ui.getCore().getModel("BusinessDataModel").getData()._TCIZoneAdmin = "AdminUser";
						_that.getView().getModel("LocalOCModel").setProperty("/ForDealerOnly", false);
					} else if (scopesData == "TCI_Zone_User") {
						sap.ui.getCore().getModel("BusinessDataModel").getData()._TCIZoneAdmin = "ZoneONLY";
						_that.getView().getModel("LocalOCModel").setProperty("/ForDealerOnly", false);
					} else if (scopesData == "Dealer_User") {
						sap.ui.getCore().getModel("BusinessDataModel").getData()._TCIDealerUser = "DealerONLY";
						_that.getView().getModel("LocalOCModel").setProperty("/ForDealerOnly", true);
					}
					sap.ui.getCore().getModel("BusinessDataModel").updateBindings(true);
				},
				error: function (oError) {}
			});

			$.ajax({
				dataType: "json",
				url: "/userDetails/attributes",
				type: "GET",
				success: function (userAttributes) {
					sap.ui.core.BusyIndicator.hide();
					console.log("User Attributes", userAttributes);
					_that.BusinessPartnerData.getData().Dealers = [];
					_that.BusinessPartnerData.getData().DealerList = [];
					_that.BusinessPartnerData.getData().SamlList = [];
					_that.BusinessPartnerData.getData().Dealers = userAttributes.attributes;
					_that.BusinessPartnerData.setSizeLimit(350);
					_that.BusinessPartnerData.getData().SamlList = userAttributes.samlAttributes;
					if (_that.BusinessPartnerData.getData().SamlList.UserType[0] == "Dealer") {
						_that.getView().getModel("LocalOCModel").setProperty("/noMYSelection", false);
						_that.BusinessPartnerData.getData().DealerList = userAttributes.attributes;
					} else {
						_that.getView().getModel("LocalOCModel").setProperty("/noMYSelection", true);
						var salesArr = userAttributes.sales;
						var SalesData = salesArr.filter(function (val) {
							return val.Division === DivAttribute;
						});
						console.log("SalesData", SalesData);
						var aBusinessPartnerKey = SalesData.reduce(function (obj, hash) {
							obj[hash.Customer] = true;
							return obj;
						}, {});
						for (var i = 0; i < _that.BusinessPartnerData.getData().Dealers.length; i++) {
							if (aBusinessPartnerKey[_that.BusinessPartnerData.getData().Dealers[i].BusinessPartnerKey]) {
								_that.BusinessPartnerData.getData().DealerList.push(_that.BusinessPartnerData.getData().Dealers[i]);
							}
						}
					}

					if (_that.BusinessPartnerData.getData().SamlList.UserType[0] == "Zone") {
						var zone = _that.BusinessPartnerData.getData().SamlList.Zone[0];
						if (zone === "1") {
							salesOffice = "1000";
						} else if (zone === "2") {
							salesOffice = "2000";
						} else if (zone === "3") {
							salesOffice = "3000";
						} else if (zone === "4") {
							salesOffice = "5000";
						} else if (zone === "5") {
							salesOffice = "4000";
						} else if (zone === "7") {
							salesOffice = "9000";
						}
						// salesOffice = _that.BusinessPartnerData.getData().SamlList.Zone[0] + "000";
						_that.BusinessPartnerData.getData().DealerList.unshift({
							BusinessPartner: "-",
							BusinessPartnerKey: "",
							BusinessPartnerName: "Zone Total",
							BusinessPartnerType: "",
							SearchTerm2: ""
						});
					} else if (_that.BusinessPartnerData.getData().SamlList.UserType[0] == "National") {
						if (DivAttribute == "20") {
							_that.BusinessPartnerData.getData().DealerList.unshift({
								BusinessPartner: "-",
								BusinessPartnerKey: "",
								BusinessPartnerName: "Lexus",
								BusinessPartnerType: "",
								SearchTerm2: ""
							});
						} else if (DivAttribute == "10") {
							_that.BusinessPartnerData.getData().DealerList.unshift({
								BusinessPartner: "-",
								BusinessPartnerKey: "",
								BusinessPartnerName: "Atlantic Zone",
								BusinessPartnerType: "",
								SearchTerm2: ""
							});
							_that.BusinessPartnerData.getData().DealerList.unshift({
								BusinessPartner: "-",
								BusinessPartnerKey: "",
								BusinessPartnerName: "Quebec Zone",
								BusinessPartnerType: "",
								SearchTerm2: ""
							});
							_that.BusinessPartnerData.getData().DealerList.unshift({
								BusinessPartner: "-",
								BusinessPartnerKey: "",
								BusinessPartnerName: "Central Zone",
								BusinessPartnerType: "",
								SearchTerm2: ""
							});
							_that.BusinessPartnerData.getData().DealerList.unshift({
								BusinessPartner: "-",
								BusinessPartnerKey: "",
								BusinessPartnerName: "Prairie Zone",
								BusinessPartnerType: "",
								SearchTerm2: ""
							});
							_that.BusinessPartnerData.getData().DealerList.unshift({
								BusinessPartner: "-",
								BusinessPartnerKey: "",
								BusinessPartnerName: "Pacific Zone",
								BusinessPartnerType: "",
								SearchTerm2: ""
							});
							_that.BusinessPartnerData.getData().DealerList.unshift({
								BusinessPartner: "-",
								BusinessPartnerKey: "",
								BusinessPartnerName: "National/Zone Stock",
								BusinessPartnerType: "",
								SearchTerm2: ""
							});
						}
						_that.BusinessPartnerData.getData().DealerList.unshift({
							BusinessPartner: "-",
							BusinessPartnerKey: "",
							BusinessPartnerName: "TCI Total",
							BusinessPartnerType: "",
							SearchTerm2: ""
						});
					} else {
						salesOffice = "";
					}
					sap.ui.core.BusyIndicator.hide();
					_that.BusinessPartnerData.updateBindings(true);
					_that.BusinessPartnerData.refresh(true);
					if (_that.BusinessPartnerData.oData.SamlList.UserType[0] == "Dealer") {
						_that.getView().getModel("LocalOCModel").setProperty("/noMYSelection", false);
						_that.getView().byId("ID_DealearPicker").setSelectedItem(_that.getView().byId("ID_DealearPicker").getItems()[0]);
						_that.getView().byId("id_BusinessPartnerName").setValue(_that.getView().byId("ID_DealearPicker").getItems()[0].getAdditionalText());
						_that.userType = "DDU";
						SelectedDealer = _that.BusinessPartnerData.getData().DealerList[0].BusinessPartnerKey;
						_that.intcolor = "";
						_that.getView().byId("ID_modelYearPicker").setValue("");
						_that.applyFiltersForDealerOnly();
					}
					else{
						_that.getView().getModel("LocalOCModel").setProperty("/noMYSelection", true);
					}
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
				}
			});

			/*Global Model initialization and mapping on view*/
			_that.oGlobalJSONModel = new JSONModel();
			_that.oUserModel = new JSONModel();
			_that.oModelYearModel = new JSONModel();
			_that.getView().setModel(_that.oModelYearModel, "ModelYearModel");
			_that.getView().setModel(_that.oGlobalJSONModel, "GlobalJSONModel");

			var userData = {};
			userData = {
				userContext: {
					userAttributes: {
						DealerCode: ["2400001132"],
						Language: ["English"],
						UserType: ["Z003"]
					}
				}
			};
			_that.oUserModel.setData(userData);
			_that.oUserModel.updateBindings(true);
			/*Getting Year dropdown data*/
			_that.modelYearPicker = this.getView().byId("ID_modelYearPicker");
			_that.currentYear = new Date().getFullYear();
			_that._pastYear = _that.currentYear - 1;
			// var _pastYear1 = _that.currentYear - 2;
			_that._futureYear = _that.currentYear + 1;
			_that._ObjModelYear = {
				"ModelYearList": [
					// 	{
					// 	ModelYear: _pastYear1
					// }, 
					{
						ModelYear: _that._pastYear
					}, {
						ModelYear: _that.currentYear
					}, {
						ModelYear: _that._futureYear
					}
				]
			};
			_that.oModelYearModel.setData(_that._ObjModelYear);
			_that.oModelYearModel.updateBindings();
			if (sap.ui.getCore().getModel("BusinessDataModel").getData().SamlList && sap.ui.getCore().getModel("BusinessDataModel").getData().SamlList
				.UserType[0] !== 'Dealer') {
				_that.modelYearPicker.setSelectedKey(_that.currentYear);
			} else {
				_that.modelYearPicker.setSelectedKey("");
			}

			if (_that.errorFlag == true) {
				sap.m.MessageBox.error(
					_that.oI18nModel.getResourceBundle().getText("ErrorNoData")
				);
			}

			_that.ModelYear = _that.getView().byId("ID_modelYearPicker").getSelectedKey();
			_that.Model = _that.getView().byId("ID_modelDesc").getSelectedKey();

			var url = _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_SERIES?$filter=Division eq '" + DivUser +
				"' and zzzadddata2 eq 'X'&$orderby=zzzadddata4 asc";

			$.ajax({
				dataType: "json",
				url: url,
				type: "GET",
				success: function (oModelData) {
					sap.ui.core.BusyIndicator.hide();
					_that.oGlobalJSONModel.getData().seriesData = [];
					if (oModelData.d.results.length > 0) {
						if (SelectedDealer == undefined) {
							var DealerVal = _that.getView().byId("ID_DealearPicker").getSelectedKey();
							for (var d = 0; d < _that.BusinessPartnerData.getData().DealerList.length; d++) {
								if (DealerVal == _that.BusinessPartnerData.getData().DealerList[d].BusinessPartner) {
									SelectedDealer = _that.BusinessPartnerData.getData().DealerList[d].BusinessPartnerKey;
								}
							}
						}
						if (SelectedDealer !== "2400029000" && SelectedDealer !== "2400049000" && SelectedDealer !== "2400500000" && SelectedDealer !==
							"TCI Total") {
							$.each(oModelData.d.results, function (key, value) {
								if (value.ModelSeriesNo === "L/C") {
									delete oModelData.d.results[key];
								}
							});
						} else {
							$.each(oModelData.d.results, function (key, value) {
								if (value.ModelSeriesNo !== "L/C" && SelectedDealer !== "2400500000" && SelectedDealer !== "TCI Total") {
									delete oModelData.d.results[key];
								}
							});
						}
						for (var i = 0; i < oModelData.d.results.length; i++) {
							if (oModelData.d.results[i] != undefined) {
								_that.oGlobalJSONModel.getData().seriesData.push({
									"ModelSeriesNo": oModelData.d.results[i].ModelSeriesNo,
									"TCISeriesDescriptionEN": oModelData.d.results[i].TCISeriesDescriptionEN,
									"localLang": URILang,
									"TCISeriesDescriptionFR": oModelData.d.results[i].TCISeriesDescriptionFR
								});
							}
						}
						_that.oGlobalJSONModel.getData().seriesData.unshift({
							"ModelSeriesNo": _that.oI18nModel.getResourceBundle().getText("PleaseSelect"),
							"TCISeriesDescriptionEN": _that.oI18nModel.getResourceBundle().getText("PleaseSelect"),
							"localLang": "",
							"TCISeriesDescriptionFR": _that.oI18nModel.getResourceBundle().getText("PleaseSelect")
						});
						_that.oGlobalJSONModel.updateBindings(true);

					} else {
						sap.ui.core.BusyIndicator.hide();
					}
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					_that.errorFlag = true;
				}
			});
			_that.oSelectJSONModel = new JSONModel();
			_that.getView().setModel(_that.oSelectJSONModel, "SelectJSONModel");
			sap.ui.getCore().setModel(_that.oSelectJSONModel, "SelectJSONModel");
			_that.objList = {
				"ModelYearList": [
					// 	{
					// 	ModelYear: _that._pastYear1
					// }, 
					{
						ModelYear: _that._pastYear
					}, {
						ModelYear: _that.currentYear
					}, {
						ModelYear: _that._futureYear
					}
				]
			};
			/*code change for defect number 9302*/
			_that.getView().byId("tableMultiHeader").getColumns()[1].setHeaderSpan([1, 1, 1]);
			_that.getView().byId("tableMultiHeader").getColumns()[2].setHeaderSpan([5, 1, 1]);
			_that.getView().byId("tableMultiHeader").getColumns()[3].setHeaderSpan([5, 4, 1]);

			_that.getView().byId("tableMultiHeader").getColumns()[7].setHeaderSpan([7, 2, 1]);
			_that.getView().byId("tableMultiHeader").getColumns()[8].setHeaderSpan([1, 1, 1]);
			_that.getView().byId("tableMultiHeader").getColumns()[9].setHeaderSpan([5, 5, 1]);
			_that.getView().byId("tableMultiHeader").getColumns()[15].setHeaderSpan([2, 2, 1]);

			_that.getView().byId("tableMultiHeader2").getColumns()[1].setHeaderSpan([1, 1, 1]);
			_that.getView().byId("tableMultiHeader2").getColumns()[2].setHeaderSpan([5, 1, 1]);
			_that.getView().byId("tableMultiHeader2").getColumns()[3].setHeaderSpan([5, 4, 1]);

			_that.getView().byId("tableMultiHeader2").getColumns()[7].setHeaderSpan([7, 2, 1]);
			_that.getView().byId("tableMultiHeader2").getColumns()[8].setHeaderSpan([1, 1, 1]);
			_that.getView().byId("tableMultiHeader2").getColumns()[9].setHeaderSpan([5, 5, 1]);
			_that.getView().byId("tableMultiHeader2").getColumns()[15].setHeaderSpan([2, 2, 1]);

			_that.getView().byId("tableMultiHeader3").getColumns()[1].setHeaderSpan([1, 1, 1]);
			_that.getView().byId("tableMultiHeader3").getColumns()[2].setHeaderSpan([5, 1, 1]);
			_that.getView().byId("tableMultiHeader3").getColumns()[3].setHeaderSpan([5, 4, 1]);

			_that.getView().byId("tableMultiHeader3").getColumns()[7].setHeaderSpan([7, 2, 1]);
			_that.getView().byId("tableMultiHeader3").getColumns()[8].setHeaderSpan([1, 1, 1]);
			_that.getView().byId("tableMultiHeader3").getColumns()[9].setHeaderSpan([5, 5, 1]);
			_that.getView().byId("tableMultiHeader3").getColumns()[15].setHeaderSpan([2, 2, 1]);

			for (var n = 1; n < _that.getView().byId("tableMultiHeader3").getRows()[2].getCells().length; n++) {
				_that.getView().byId("tableMultiHeader3").getRows()[2].getCells()[n].removeStyleClass("TabFontStyle");
			}
			for (var n = 1; n < _that.getView().byId("tableMultiHeader3").getRows()[5].getCells().length; n++) {
				_that.getView().byId("tableMultiHeader3").getRows()[5].getCells()[n].removeStyleClass("TabFontStyle");
			}
			/*Defect Number 10427 Code Start*/
			_that.getView().byId("id_ETADate").setMinDate(new Date());
			/*Defect Number 10427 Code End*/
		},

		applyFiltersForDealerOnly: function () {
			sap.ui.core.BusyIndicator.show();
			if (_that.getView().byId("ID_seriesDesc").getSelectedKey() != _that.oI18nModel.getResourceBundle().getText("PleaseSelect")) {
				_that.ID_seriesDesc = _that.getView().byId("ID_seriesDesc").getSelectedKey();
			} else _that.ID_seriesDesc = "";

			if (_that.getView().byId("ID_modelDesc").getSelectedKey() != _that.oI18nModel.getResourceBundle().getText("PleaseSelect")) {
				_that.ID_model = _that.getView().byId("ID_modelDesc").getSelectedKey();
			} else _that.ID_model = "";

			if (_that.getView().byId("ID_marktgIntDesc").getSelectedKey() != _that.oI18nModel.getResourceBundle().getText("PleaseSelect")) {
				_that.ID_marktgIntDesc = _that.getView().byId("ID_marktgIntDesc").getSelectedKey();
				if (_that.getView().byId("ID_marktgIntDesc").getSelectedItem() !== null) {
					var intcol = _that.getView().getModel("GlobalJSONModel").getProperty(_that.getView().byId("ID_marktgIntDesc").getSelectedItem().getBindingContext(
						"GlobalJSONModel").sPath).int_c;
					_that.intcolor = intcol;
				}
			} else {
				_that.ID_marktgIntDesc = "";
				_that.intcolor = "";
			}

			if (_that.getView().byId("ID_ExteriorColorCode").getSelectedKey() != _that.oI18nModel.getResourceBundle().getText("PleaseSelect")) {
				_that.ID_ExteriorColorCode = _that.getView().byId("ID_ExteriorColorCode").getSelectedKey();
			} else _that.ID_ExteriorColorCode = "";

			if (_that.getView().byId("ID_APXValue").getSelectedKey() != _that.oI18nModel.getResourceBundle().getText("PleaseSelect")) {
				_that.ID_APXValue = _that.getView().byId("ID_APXValue").getSelectedKey();
			} else _that.ID_APXValue = "";

			var ETADate = _that.getView().byId("id_ETADate").getValue();
			if (ETADate != _that.oI18nModel.getResourceBundle().getText("PleaseSelect")) {
				_that.ETADate = _that.oDateFormat.format(new Date(ETADate));
			} else _that.ETADate = "";
			selectedDDValues = [_that.getView().byId("ID_DealearPicker").getSelectedKey(), _that.ID_modelYearPicker, _that.ID_seriesDesc,
				_that.ID_model, _that.getView().byId("ID_marktgIntDesc").getSelectedKey(), _that.ID_ExteriorColorCode,
				_that.ID_APXValue, _that.getView().byId("id_ETADate").getValue(), _that.getView().byId("ID_DealearPicker").getSelectedItem(),
				_that.userType, _that.intcolor
			];
			seriesModel = _that.oGlobalJSONModel.getData();
			_that.oGlobalJSONModel.getData().ETAResults = [];
			_that.oGlobalJSONModel.getData().InventSumResults = [];
			_that.oGlobalJSONModel.getData().DeliveryResults = [];
			var count = 0;
			// if (count = 0) {
			// for (var n = 0; n < _that._ObjModelYear.ModelYearList.length; n++) {
			// _that.ID_modelYearPicker = ""; //_that._ObjModelYear.ModelYearList[n].ModelYear;
			var modelyear = "(Modelyear ge '" + _that._ObjModelYear.ModelYearList[0].ModelYear + "' and Modelyear le '" + _that._ObjModelYear.ModelYearList[
				2].ModelYear + "')";
			console.log("modelyear", modelyear);
			filteredData = "?$filter=Division eq '" + DivUser + "' and VKBUR eq '" + salesOffice + "' and UserType eq '" + _that.userType +
				"' and Dealer eq '" +
				SelectedDealer + "' and Model eq '" + _that.ID_model +
				"' and " + modelyear + " and TCISeries eq '" + _that.ID_seriesDesc + "' and Suffix eq '" + _that.ID_marktgIntDesc +
				"' and ExteriorColorCode eq '" + _that.ID_ExteriorColorCode + "' and APX eq '" +
				_that.ID_APXValue + "' and INTCOL eq '" + _that.intcolor + "' and ETA eq '" + _that.ETADate + "' and LANGUAGE eq '" + this.localLang +
				"' &$format=json";
			// count = 1;
			_that.fetchCountsforTablesDealerONLY(filteredData, count);
			// }
			// }
			console.log("_that.oGlobalJSONModel.getData()", _that.oGlobalJSONModel.getData());
		},

		fetchCountsforTablesDealerONLY: function (query) {
			// if (count == 1) {
			var ETACounturl = this.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/Pipeline_CountSet" + query;
			var InventCounturl = this.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/Inventory_CountSet" + query;
			var DelCounturl = this.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/Delivery_CountSet" + query;
			// if (_that.oGlobalJSONModel != undefined) {
			$.ajax({
				dataType: "json",
				url: ETACounturl,
				type: "GET",
				success: function (oCountData) {
					sap.ui.core.BusyIndicator.hide();
					for (var m = 0; m < oCountData.d.results.length; m++) {
						_that.oGlobalJSONModel.getData().ETAResults.push(oCountData.d.results[m]);
						// _that.oGlobalJSONModel.updateBindings(true);
					}
					// _that.oGlobalJSONModel.getData().ETAResults = oCountData.d.results;
					_that.oGlobalJSONModel.updateBindings();
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					_that.errorFlag = true;
				}
			});
			// }
			// if (_that.oGlobalJSONModel != undefined) {
			$.ajax({
				dataType: "json",
				url: InventCounturl,
				type: "GET",
				success: function (oCountData) {
					sap.ui.core.BusyIndicator.hide();
					for (var m = 0; m < oCountData.d.results.length; m++) {
						_that.oGlobalJSONModel.getData().InventSumResults.push(oCountData.d.results[m]);
						// _that.oGlobalJSONModel.getData().InventSumResults = oCountData.d.results;
						_that.oGlobalJSONModel.updateBindings();
					}
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					_that.errorFlag = true;
				}
			});
			// }

			// if (_that.oGlobalJSONModel != undefined) {
			$.ajax({
				dataType: "json",
				url: DelCounturl,
				type: "GET",
				success: function (oCountData) {
					sap.ui.core.BusyIndicator.hide();
					for (var m = 0; m < oCountData.d.results.length; m++) {
						_that.oGlobalJSONModel.getData().DeliveryResults.push(oCountData.d.results[m]);
						// _that.oGlobalJSONModel.getData().DeliveryResults = oCountData.d.results;
						_that.oGlobalJSONModel.updateBindings();
					}
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					_that.errorFlag = true;
				}
			});
			// }
		},

		getUpdatedSeries: function (SelectedDealer) {
			_that.ModelYear = _that.getView().byId("ID_modelYearPicker").getSelectedKey();
			_that.Model = _that.getView().byId("ID_modelDesc").getSelectedKey();

			var url = _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_SERIES?$filter=Division eq '" + DivUser +
				"' and zzzadddata2 eq 'X'&$orderby=zzzadddata4 asc";

			$.ajax({
				dataType: "json",
				url: url,
				type: "GET",
				success: function (oModelData) {
					sap.ui.core.BusyIndicator.hide();
					_that.oGlobalJSONModel.getData().seriesData = [];
					if (oModelData.d.results.length > 0) {
						if (SelectedDealer !== "2400029000" && SelectedDealer !== "2400049000" && SelectedDealer !== "2400500000" && SelectedDealer !==
							"TCI Total") {
							$.each(oModelData.d.results, function (key, value) {
								if (value.ModelSeriesNo === "L/C") {
									delete oModelData.d.results[key];
								}
							});
						} else {
							$.each(oModelData.d.results, function (key, value) {
								if (value.ModelSeriesNo !== "L/C" && SelectedDealer !== "2400500000" && SelectedDealer !== "TCI Total") {
									delete oModelData.d.results[key];
								}
							});
						}
						for (var i = 0; i < oModelData.d.results.length; i++) {
							if (oModelData.d.results[i] != undefined) {
								_that.oGlobalJSONModel.getData().seriesData.push({
									"ModelSeriesNo": oModelData.d.results[i].ModelSeriesNo,
									"TCISeriesDescriptionEN": oModelData.d.results[i].TCISeriesDescriptionEN,
									"localLang": URILang,
									"TCISeriesDescriptionFR": oModelData.d.results[i].TCISeriesDescriptionFR
								});
							}
						}
						_that.oGlobalJSONModel.getData().seriesData.unshift({
							"ModelSeriesNo": _that.oI18nModel.getResourceBundle().getText("PleaseSelect"),
							"TCISeriesDescriptionEN": _that.oI18nModel.getResourceBundle().getText("PleaseSelect"),
							"localLang": "",
							"TCISeriesDescriptionFR": _that.oI18nModel.getResourceBundle().getText("PleaseSelect")
						});
						_that.oGlobalJSONModel.updateBindings(true);

					} else {
						sap.ui.core.BusyIndicator.hide();
					}
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					_that.errorFlag = true;
				}
			});

		},
		onAfterRendering: function (evt) {
			_that.getOwnerComponent().getRouter().attachRoutePatternMatched(_that._oMasterRoute, _that);
			/*Defect number 9293 code start*/
			if (selectedDDValues.length != 0) {
				_that.oGlobalJSONModel.setData(seriesModel);
				_that.oGlobalJSONModel.updateBindings(true);
				_that.userType = selectedDDValues[selectedDDValues.length - 2];
				_that.intcolor = selectedDDValues[selectedDDValues.length - 1];
				_that.getView().byId("ID_DealearPicker").setSelectedItem(selectedDDValues[selectedDDValues.length - 3]);
				_that.getView().byId("id_BusinessPartnerName").setValue(selectedDDValues[selectedDDValues.length - 3].getAdditionalText());

				for (var i = 0; i < selectedDDValues.length; i++) {
					if (selectedDDValues[i] != "") {
						switch (i) {
						case 1:
							_that.modelYearPicker.setSelectedKey(selectedDDValues[i]);
							break;
						case 2:
							_that.getView().byId("ID_seriesDesc").setSelectedKey(selectedDDValues[i]);
							break;
						case 3:
							_that.getView().byId("ID_modelDesc").setSelectedKey(selectedDDValues[i]);
							break;
						case 4:
							_that.getView().byId("ID_marktgIntDesc").setSelectedKey(selectedDDValues[i]);
							break;
						case 5:
							_that.getView().byId("ID_ExteriorColorCode").setSelectedKey(selectedDDValues[i]);
							break;
						case 6:
							_that.getView().byId("ID_APXValue").setSelectedKey(selectedDDValues[i]);
							break;
						case 7:
							_that.getView().byId("id_ETADate").setValue(selectedDDValues[i]);
							break;
						}
					}
				}
			}
			/*Defect number 9293 code end*/
		},
		onDealerChange: function (oDealer) {
			_that.userType = "";
			_that.additionalText = oDealer.getParameters().selectedItem.getAdditionalText();
			if (oDealer.getParameters().selectedItem != undefined) {
				_that.getView().byId("ID_marktgIntDesc").setSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));
				_that.getView().byId("ID_modelDesc").setSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));
				_that.getView().byId("ID_seriesDesc").setSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));
				_that.getView().byId("ID_ExteriorColorCode").setSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));
				_that.getView().byId("ID_APXValue").setSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));
				_that.getView().byId("id_ETADate").setValue();

				_that.getView().byId("id_BusinessPartnerName").setValue(oDealer.getParameters().selectedItem.getAdditionalText());

				var SelectedDealerKey = oDealer.getParameters().selectedItem.getText();
				var SelectedDealerType = oDealer.getParameters().selectedItem.getProperty("key");
				if (oDealer.getParameters().selectedItem.getAdditionalText() == "TCI Total") {
					SelectedDealerKey = "TCI Total";
					SelectedDealer = "TCI Total";
				} else if (oDealer.getParameters().selectedItem.getAdditionalText() == "National/Zone Stock") {
					SelectedDealerKey = "National/Zone Stock";
					SelectedDealer = "";
				} else if (oDealer.getParameters().selectedItem.getAdditionalText() == "Zone Stock") {
					SelectedDealerKey = "Zone Stock";
					SelectedDealer = "";
				} else if (oDealer.getParameters().selectedItem.getAdditionalText() == "Zone Total") {
					SelectedDealerKey = "Zone Total";
					SelectedDealer = "";
				} else if (oDealer.getParameters().selectedItem.getAdditionalText() == "Lexus") {
					SelectedDealerKey = "Lexus";
					SelectedDealer = "";
				} else if (oDealer.getParameters().selectedItem.getAdditionalText() == "Atlantic Zone") {
					SelectedDealerKey = "Atlantic Zone";
					SelectedDealer = "";
				} else if (oDealer.getParameters().selectedItem.getAdditionalText() == "Quebec Zone") {
					SelectedDealerKey = "Quebec Zone";
					SelectedDealer = "";
				} else if (oDealer.getParameters().selectedItem.getAdditionalText() == "Central Zone") {
					SelectedDealerKey = "Central Zone";
					SelectedDealer = "";
				} else if (oDealer.getParameters().selectedItem.getAdditionalText() == "Pacific Zone") {
					SelectedDealerKey = "Pacific Zone";
					SelectedDealer = "";
				} else if (oDealer.getParameters().selectedItem.getAdditionalText() == "Prairie Zone") {
					SelectedDealerKey = "Prairie Zone";
					SelectedDealer = "";
				}
				if (_that.BusinessPartnerData.getData().SamlList.UserType[0] == "Zone") {
					var zone = _that.BusinessPartnerData.getData().SamlList.Zone[0];
					if (zone === "1") {
						salesOffice = "1000";
					} else if (zone === "2") {
						salesOffice = "2000";
					} else if (zone === "3") {
						salesOffice = "3000";
					} else if (zone === "4") {
						salesOffice = "5000";
					} else if (zone === "5") {
						salesOffice = "4000";
					} else if (zone === "7") {
						salesOffice = "9000";
					} else if (zone === "8") {
						salesOffice = "8000";
					}
					if (SelectedDealerKey == "Zone Total") {
						_that.userType = "ZZA";
					} else if (SelectedDealerKey == "Zone Stock") {
						_that.userType = "ZDD";
					} else if (SelectedDealerType == "Z004") {
						_that.userType = "ZZU";
					} else {
						_that.userType = "ZDU";
					}
				} else if (_that.BusinessPartnerData.getData().SamlList.UserType[0] == "Dealer") {
					_that.userType = "DDU";
					salesOffice = "";
				} else if (_that.BusinessPartnerData.getData().SamlList.UserType[0] == "National") {
					if (SelectedDealerKey == "TCI Total") {
						salesOffice = "";
						_that.userType = "NNA";
					} else if (SelectedDealerKey == "National/Zone Stock") {
						salesOffice = "";
						_that.userType = "NZZ";
					} else if (SelectedDealerKey == "Pacific Zone") {
						salesOffice = "1000";
						_that.userType = "NZA";
					} else if (SelectedDealerKey == "Prairie Zone") {
						salesOffice = "2000";
						_that.userType = "NZA";
					} else if (SelectedDealerKey == "Central Zone") {
						salesOffice = "3000";
						_that.userType = "NZA";
					} else if (SelectedDealerKey == "Atlantic Zone") {
						salesOffice = "5000";
						_that.userType = "NZA";
					} else if (SelectedDealerKey == "Quebec Zone") {
						salesOffice = "4000";
						_that.userType = "NZA";
					} else if (SelectedDealerKey == "Lexus") {
						salesOffice = "9000";
						_that.userType = "NZA";
					} else if (SelectedDealerType == "Z004") {
						_that.userType = "NZU";
					} else if (SelectedDealerType == "Z001") {
						_that.userType = "NDU";
					} else {
						_that.userType = "NNU";
					}
				}
				for (var d = 0; d < _that.BusinessPartnerData.getData().DealerList.length; d++) {
					if (SelectedDealerKey == "Zone Total") {
						SelectedDealer = "";
					} else if (SelectedDealerKey == _that.BusinessPartnerData.getData().DealerList[d].BusinessPartner) {
						SelectedDealer = _that.BusinessPartnerData.getData().DealerList[d].BusinessPartnerKey;
					}
				}

				_that.oGlobalJSONModel.getData().seriesData = [];
				_that.getUpdatedSeries(SelectedDealer);
			} else {
				_that.getView().byId("id_BusinessPartnerName").setValue(oDealer.getParameters().selectedItem.getAdditionalText());
			}
		},

		/*Fetch data on apply filter click for all three tables*/
		applyFiltersBtn: function () {
			if ((_that.getView().byId("ID_DealearPicker").getSelectedItem().getAdditionalText() == "TCI Total" || _that.getView().byId(
						"ID_DealearPicker").getSelectedItem().getAdditionalText() == "Zone Total" ||
					_that.getView().byId("ID_DealearPicker").getSelectedItem().getAdditionalText() == "Pacific Zone" || _that.getView().byId(
						"ID_DealearPicker").getSelectedItem().getAdditionalText() == "Central Zone" ||
					_that.getView().byId("ID_DealearPicker").getSelectedItem().getAdditionalText() == "Prairie Zone" || _that.getView().byId(
						"ID_DealearPicker").getSelectedItem().getAdditionalText() == "Atlantic Zone" ||
					_that.getView().byId("ID_DealearPicker").getSelectedItem().getAdditionalText() == "Quebec Zone" || _that.getView().byId(
						"ID_DealearPicker").getSelectedItem().getAdditionalText() == "Lexus") && _that.getView().byId(
					"ID_seriesDesc").getSelectedKey() == _that.oI18nModel.getResourceBundle().getText("PleaseSelect")) {
				MessageBox.show(_that.oI18nModel.getResourceBundle().getText("MandatorySeriesForNationalUser"), MessageBox.Icon.ERROR, "Error",
					MessageBox.Action.OK, null, null);

			} else {
				sap.ui.core.BusyIndicator.show();
				_that.ID_modelYearPicker = _that.getView().byId("ID_modelYearPicker").getValue();

				if (_that.getView().byId("ID_seriesDesc").getSelectedKey() != _that.oI18nModel.getResourceBundle().getText("PleaseSelect")) {
					_that.ID_seriesDesc = _that.getView().byId("ID_seriesDesc").getSelectedKey();
				} else _that.ID_seriesDesc = "";

				if (_that.getView().byId("ID_modelDesc").getSelectedKey() != _that.oI18nModel.getResourceBundle().getText("PleaseSelect")) {
					_that.ID_model = _that.getView().byId("ID_modelDesc").getSelectedKey();
				} else _that.ID_model = "";

				if (_that.getView().byId("ID_marktgIntDesc").getSelectedKey() != _that.oI18nModel.getResourceBundle().getText("PleaseSelect")) {
					_that.ID_marktgIntDesc = _that.getView().byId("ID_marktgIntDesc").getSelectedKey();
					if (_that.getView().byId("ID_marktgIntDesc").getSelectedItem() != null) {
						var intcol = _that.getView().getModel("GlobalJSONModel").getProperty(_that.getView().byId("ID_marktgIntDesc").getSelectedItem().getBindingContext(
							"GlobalJSONModel").sPath).int_c;
						_that.intcolor = intcol;
					}
				} else {
					_that.ID_marktgIntDesc = "";
					_that.intcolor = "";
				}

				if (_that.getView().byId("ID_ExteriorColorCode").getSelectedKey() != _that.oI18nModel.getResourceBundle().getText("PleaseSelect")) {
					_that.ID_ExteriorColorCode = _that.getView().byId("ID_ExteriorColorCode").getSelectedKey();
				} else _that.ID_ExteriorColorCode = "";

				if (_that.getView().byId("ID_APXValue").getSelectedKey() != _that.oI18nModel.getResourceBundle().getText("PleaseSelect")) {
					_that.ID_APXValue = _that.getView().byId("ID_APXValue").getSelectedKey();
				} else _that.ID_APXValue = "";

				var ETADate = _that.getView().byId("id_ETADate").getValue();
				if (ETADate != _that.oI18nModel.getResourceBundle().getText("PleaseSelect")) {
					_that.ETADate = _that.oDateFormat.format(new Date(ETADate));
				} else _that.ETADate = "";
				/*adding logic to store selected values from dropdown*/
				selectedDDValues = [_that.getView().byId("ID_DealearPicker").getSelectedKey(), _that.ID_modelYearPicker, _that.ID_seriesDesc,
					_that.ID_model, _that.getView().byId("ID_marktgIntDesc").getSelectedKey(), _that.ID_ExteriorColorCode,
					_that.ID_APXValue, _that.getView().byId("id_ETADate").getValue(), _that.getView().byId("ID_DealearPicker").getSelectedItem(),
					_that.userType, _that.intcolor
				];
				seriesModel = _that.oGlobalJSONModel.getData();
				// if (salesOffice == undefined) {
				// 	salesOffice = "";
				// }
				console.log(salesOffice);
				filteredData = "?$filter=Division eq '" + DivUser + "' and VKBUR eq '" + salesOffice + "' and UserType eq '" + _that.userType +
					"' and Dealer eq '" +
					SelectedDealer + "' and Model eq '" + _that.ID_model +
					"' and Modelyear eq '" + _that.ID_modelYearPicker + "' and TCISeries eq '" + _that.ID_seriesDesc + "' and Suffix eq '" + _that.ID_marktgIntDesc +
					"' and ExteriorColorCode eq '" + _that.ID_ExteriorColorCode + "' and APX eq '" +
					_that.ID_APXValue + "' and INTCOL eq '" + _that.intcolor + "' and ETA eq '" + _that.ETADate + "' and LANGUAGE eq '" + this.localLang +
					"' &$format=json";
				_that.fetchCountsforTables(filteredData);
			}
		},

		fetchCountsforTables: function (filteredData) {
			var ETACounturl = this.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/Pipeline_CountSet" + filteredData;
			if (_that.oGlobalJSONModel != undefined) {
				$.ajax({
					dataType: "json",
					url: ETACounturl,
					type: "GET",
					success: function (oCountData) {
						sap.ui.core.BusyIndicator.hide();
						_that.oGlobalJSONModel.getData().ETAResults = oCountData.d.results;
						_that.oGlobalJSONModel.updateBindings();
					},
					error: function (oError) {
						sap.ui.core.BusyIndicator.hide();
						_that.errorFlag = true;
					}
				});
			}
			var InventCounturl = this.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/Inventory_CountSet" + filteredData;
			if (_that.oGlobalJSONModel != undefined) {
				$.ajax({
					dataType: "json",
					url: InventCounturl,
					type: "GET",
					success: function (oCountData) {
						sap.ui.core.BusyIndicator.hide();
						_that.oGlobalJSONModel.getData().InventSumResults = oCountData.d.results;
						_that.oGlobalJSONModel.updateBindings();
					},
					error: function (oError) {
						sap.ui.core.BusyIndicator.hide();
						_that.errorFlag = true;
					}
				});
			}

			var DelCounturl = this.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/Delivery_CountSet" + filteredData;
			if (_that.oGlobalJSONModel != undefined) {
				$.ajax({
					dataType: "json",
					url: DelCounturl,
					type: "GET",
					success: function (oCountData) {
						sap.ui.core.BusyIndicator.hide();
						_that.oGlobalJSONModel.getData().DeliveryResults = oCountData.d.results;
						_that.oGlobalJSONModel.updateBindings();
					},
					error: function (oError) {
						sap.ui.core.BusyIndicator.hide();
						_that.errorFlag = true;
					}
				});
			}
		},
		//on Model Selection Change
		onModelSelectionChange: function (oModel) {
			_that.temp = [];
			_that.temp1 = [];
			_that.getView().byId("ID_marktgIntDesc").getSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));
			_that.getView().byId("ID_ExteriorColorCode").getSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));
			_that.getView().byId("ID_APXValue").getSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));
			sap.ui.core.BusyIndicator.show();
			_that.Modelyear = _that.modelYearPicker.getSelectedKey();
			_that.Model = oModel.getParameters("selectedItem").selectedItem.getKey();
			_that.oGlobalJSONModel.getData().suffixData = [];
			$.ajax({
				dataType: "json",
				url: _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_INTCOL?$filter=Model eq '" + _that.Model + "' and Modelyear eq '" +
					_that.Modelyear + "'&$orderby=Suffix asc",
				type: "GET",
				success: function (oData) {
					if (oData.d.results.length > 0) {
						$.each(oData.d.results, function (i, item) {
							_that.oGlobalJSONModel.getData().suffixData.push({
								"Model": item.Model,
								"Modelyear": item.Model,
								"Suffix": item.Suffix,
								"int_c": item.int_c,
								"SuffixDescriptionEN": item.SuffixDescriptionEN,
								"SuffixDescriptionFR": item.SuffixDescriptionFR,
								"mrktg_int_desc_en": item.mrktg_int_desc_en,
								"mrktg_int_desc_fr": item.mrktg_int_desc_fr,
								"localLang": URILang
							});
						});
						sap.ui.core.BusyIndicator.hide();
						_that.oGlobalJSONModel.getData().suffixData.unshift({
							"Model": "",
							"Modelyear": "",
							"Suffix": _that.oI18nModel.getResourceBundle().getText("PleaseSelect"),
							"int_c": "",
							"SuffixDescriptionEN": "",
							"SuffixDescriptionFR": "",
							"mrktg_int_desc_en": "",
							"mrktg_int_desc_fr": "",
							"localLang": ""
						});
						_that.oGlobalJSONModel.updateBindings(true);
					} else {
						sap.ui.core.BusyIndicator.hide();
					}
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					_that.errorFlag = true;
				}
			});
		},

		getAllSuffix: function () {
			var tempNew = [];
			_that.series = _that.getView().byId("ID_seriesDesc").getSelectedKey();
			_that.Modelyear = _that.modelYearPicker.getSelectedKey();
			var url = _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZVMS_INT_Color?$filter=model_year eq '" + _that.Modelyear +
				"' and tci_series eq '" + _that.series + "'";
			$.ajax({
				dataType: "json",
				url: url,
				type: "GET",
				success: function (oDataInner) {
					_that.temp1 = oDataInner.d.results;
					if (_that.temp1.length > 0) {
						for (var n = 0; n < _that.temp.length; n++) {
							for (var m = 0; m < _that.temp1.length; m++) {
								_that.oGlobalJSONModel.getData().suffixData.push({
									"Suffix": _that.temp[n].Suffix,
									"SuffixDescriptionEN": _that.temp[n].SuffixDescriptionEN,
									"SuffixDescriptionFE": _that.temp[n].SuffixDescriptionFR,
									"MarktgIntDescEN": _that.temp1[m].mrktg_int_desc_en,
									"MarktgIntDescFR": _that.temp1[m].mrktg_int_desc_fr,
									"intColorCode": _that.temp1[m].int_c,
									"localLang": URILang
								});
								sap.ui.core.BusyIndicator.hide();
								_that.oGlobalJSONModel.updateBindings(true);
							}
						}
						_that.oGlobalJSONModel.getData().suffixData.unshift({
							"Suffix": _that.oI18nModel.getResourceBundle().getText("PleaseSelect"),
							"SuffixDescriptionEN": "",
							"SuffixDescriptionFE": "",
							"MarktgIntDescEN": "",
							"MarktgIntDescFR": "",
							"intColorCode": "",
							"localLang": ""
						});
						_that.oGlobalJSONModel.updateBindings(true);
					} else {
						sap.ui.core.BusyIndicator.hide();
					}
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					_that.errorFlag = true;
				}
			});

		},

		onSuffixChange: function (oSuffixVal) {
			_that.getView().byId("ID_ExteriorColorCode").getSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));
			_that.getView().byId("ID_APXValue").getSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));
			sap.ui.core.BusyIndicator.show();
			var Modelyear = _that.modelYearPicker.getSelectedKey();
			var Suffix = oSuffixVal.getParameters("selectedItem").selectedItem.getKey();
			var Model = _that.getView().byId("ID_modelDesc").getSelectedKey();
			var series = _that.getView().byId("ID_seriesDesc").getSelectedKey();

			_that.oGlobalJSONModel.getData().colorData = [];
			$.ajax({
				dataType: "json",
				url: _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/zc_exterior_trim?$filter=ModelYear eq '" + Modelyear +
					"' and Model eq '" + Model + "' and Suffix eq '" + Suffix + "' and TCISeries eq '" + series + "'",
				type: "GET",
				success: function (oData) {
					if (oData.d.results.length > 0) {
						$.each(oData.d.results, function (i, item) {
							_that.oGlobalJSONModel.getData().colorData.push({
								"ExteriorColorCode": item.ExteriorColorCode,
								"MarketingDescriptionEXTColorEN": item.MarketingDescriptionEXTColorEN,
								"MarketingDescriptionEXTColorFR": item.MarketingDescriptionEXTColorFR,
								"localLang": URILang
							});
						});
						_that.oGlobalJSONModel.getData().colorData.unshift({
							"ExteriorColorCode": _that.oI18nModel.getResourceBundle().getText("PleaseSelect"),
							"MarketingDescriptionEXTColorEN": "",
							"MarketingDescriptionEXTColorFR": "",
							"localLang": ""
						});
						_that.oGlobalJSONModel.updateBindings(true);
						sap.ui.core.BusyIndicator.hide();
					} else {
						sap.ui.core.BusyIndicator.hide();
					}
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					_that.errorFlag = true;
				}
			});
		},

		//ON Series change
		onSeriesSelectionChange: function (oSeriesVal2) {
			sap.ui.core.BusyIndicator.show();
			_that.getView().byId("ID_marktgIntDesc").getSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));
			_that.getView().byId("ID_modelDesc").getSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));
			_that.getView().byId("ID_ExteriorColorCode").getSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));
			_that.getView().byId("ID_APXValue").getSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));

			var Modelyear = _that.modelYearPicker.getSelectedKey();
			if (oSeriesVal2.getParameters("selectedItem").selectedItem.getKey() !== undefined) {
				var oSeriesVal = oSeriesVal2.getParameters("selectedItem").selectedItem.getKey();
			} else {
				oSeriesVal = oSeriesVal2;
			}
			if (oSeriesVal !== _that.oI18nModel.getResourceBundle().getText("PleaseSelect")) {
				_that.oGlobalJSONModel.getData().modelData = [];
				$.ajax({
					dataType: "json",
					url: _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_MODEL_DETAILS?$filter=Modelyear eq '" + Modelyear +
						"' and TCISeries eq '" + oSeriesVal + "'",
					type: "GET",
					success: function (oData) {
						if (oData.d.results.length > 0) {
							var b = 0;
							for (var i = 0; i < oData.d.results.length; i++) {
								var oModel = oData.d.results[i].Model;
								for (var j = 0; j < _that.oGlobalJSONModel.getData().modelData.length; j++) {
									if (oModel != _that.oGlobalJSONModel.getData().modelData[j].Model) {
										b++;
									}
								}
								if (b == _that.oGlobalJSONModel.getData().modelData.length) {
									_that.oGlobalJSONModel.getData().modelData.push({
										"Model": oData.d.results[i].Model,
										"ENModelDesc": oData.d.results[i].ENModelDesc,
										"FRModelDesc": oData.d.results[i].FRModelDesc,
										"localLang": URILang
									});
									_that.oGlobalJSONModel.updateBindings(true);
								}
								b = 0;
							}
							sap.ui.core.BusyIndicator.hide();
							_that.oGlobalJSONModel.getData().modelData.unshift({
								"Model": _that.oI18nModel.getResourceBundle().getText("PleaseSelect"),
								"ENModelDesc": "",
								"FRModelDesc": "",
								"localLang": ""
							});

						} else {
							sap.ui.core.BusyIndicator.hide();
						}
						_that.oGlobalJSONModel.updateBindings(true);
					},
					error: function (oError) {
						sap.ui.core.BusyIndicator.hide();
						_that.errorFlag = true;
					}
				});
			} else {
				sap.ui.core.BusyIndicator.hide();
				_that.getView().byId("ID_marktgIntDesc").getSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));
				_that.getView().byId("ID_modelDesc").getSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));
				_that.getView().byId("ID_ExteriorColorCode").getSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));
				_that.getView().byId("ID_APXValue").getSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));
			}
		},

		onColorCodeChange: function (oModVal) {
			_that.getView().byId("ID_APXValue").getSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));
			sap.ui.core.BusyIndicator.show();
			var Modelyear = _that.modelYearPicker.getSelectedKey();
			var Suffix = _that.getView().byId("ID_marktgIntDesc").getSelectedKey();
			var Model = _that.getView().byId("ID_modelDesc").getSelectedKey();
			var ExteriorColorCode = oModVal.getParameters("ID_ExteriorColorCode").selectedItem.getKey();

			var url = _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_APX?$filter=zzmoyr eq '" + Modelyear + "' and zzmodel eq '" +
				Model + "' and zzsuffix eq '" + Suffix + "' and zzextcol eq '" + ExteriorColorCode + "'";
			$.ajax({
				dataType: "json",
				url: url,
				type: "GET",
				success: function (oAPXData) {
					if (oAPXData.d.results.length > 0) {
						var b = 0;
						_that.oGlobalJSONModel.getData().APXCollection = [];
						for (var i = 0; i < oAPXData.d.results.length; i++) {
							var zzapx = oAPXData.d.results[i].zzapx;
							for (var j = 0; j < _that.oGlobalJSONModel.getData().APXCollection.length; j++) {
								if (zzapx != _that.oGlobalJSONModel.getData().APXCollection[j].APX) {
									b++;
								}
							}
							if (b == _that.oGlobalJSONModel.getData().APXCollection.length) {
								_that.oGlobalJSONModel.getData().APXCollection.push({
									"APX": oAPXData.d.results[i].zzapx
								});
								_that.oGlobalJSONModel.updateBindings(true);
								sap.ui.core.BusyIndicator.hide();
							}
							b = 0;
						}
						_that.oGlobalJSONModel.getData().APXCollection.unshift({
							"APX": _that.oI18nModel.getResourceBundle().getText("PleaseSelect")
						});
						_that.oGlobalJSONModel.updateBindings(true);
					} else {
						sap.ui.core.BusyIndicator.hide();
					}
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					_that.errorFlag = true;
				}
			});
		},

		/*On Model Year Selection*/
		onModelYearChange: function (oModVal) {
			_that.getView().byId("ID_seriesDesc").getSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));
			_that.getView().byId("ID_modelDesc").getSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));
			_that.getView().byId("ID_marktgIntDesc").getSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));
			_that.getView().byId("ID_ExteriorColorCode").getSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));
			_that.getView().byId("ID_APXValue").getSelectedKey(_that.oI18nModel.getResourceBundle().getText("PleaseSelect"));

			sap.ui.core.BusyIndicator.show();
			if (!oModVal.getParameters("selectedItem").selectedItem) {
				_that.applyFiltersForDealerOnly();
				_that.getView().getModel("LocalOCModel").setProperty("/noMYSelection", false);
			} else {
				_that.getView().getModel("LocalOCModel").setProperty("/noMYSelection", true);
				var ModelYear = oModVal.getParameters("selectedItem").selectedItem.getKey();
				var url = _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_SERIES?$filter=Division eq '" + DivUser +
					"' and zzzadddata2 eq 'X'&$orderby=zzzadddata4 asc";

				$.ajax({
					dataType: "json",
					url: url,
					type: "GET",
					success: function (oModelData) {
						sap.ui.core.BusyIndicator.hide();
						_that.oGlobalJSONModel.getData().seriesData = [];
						if (oModelData.d.results.length > 0) {
							if (SelectedDealer == undefined) {
								var DealerVal = _that.getView().byId("ID_DealearPicker").getSelectedKey();
								for (var d = 0; d < _that.BusinessPartnerData.getData().DealerList.length; d++) {
									if (DealerVal == _that.BusinessPartnerData.getData().DealerList[d].BusinessPartner) {
										SelectedDealer = _that.BusinessPartnerData.getData().DealerList[d].BusinessPartnerKey;
									}
								}
							}
							if (SelectedDealer !== "2400029000" && SelectedDealer !== "2400049000") {
								$.each(oModelData.d.results, function (key, value) {
									if (value.ModelSeriesNo == "L/C") {
										delete oModelData.d.results[key];
									}
								});
							} else {
								$.each(oModelData.d.results, function (key, value) {
									if (value.ModelSeriesNo !== "L/C") {
										delete oModelData.d.results[key];
									}
								});
							}
							for (var i = 0; i < oModelData.d.results.length; i++) {
								if (oModelData.d.results[i] != undefined) {
									_that.oGlobalJSONModel.getData().seriesData.push({
										"ModelSeriesNo": oModelData.d.results[i].ModelSeriesNo,
										"TCISeriesDescriptionEN": oModelData.d.results[i].TCISeriesDescriptionEN,
										"localLang": URILang,
										"TCISeriesDescriptionFR": oModelData.d.results[i].TCISeriesDescriptionFR
									});
								}
							}
							_that.oGlobalJSONModel.getData().seriesData.unshift({
								"ModelSeriesNo": _that.oI18nModel.getResourceBundle().getText("PleaseSelect"),
								"TCISeriesDescriptionEN": _that.oI18nModel.getResourceBundle().getText("PleaseSelect"),
								"localLang": "",
								"TCISeriesDescriptionFR": _that.oI18nModel.getResourceBundle().getText("PleaseSelect")
							});
							_that.oGlobalJSONModel.updateBindings(true);
						} else {
							sap.ui.core.BusyIndicator.hide();
						}
					},
					error: function (oError) {
						sap.ui.core.BusyIndicator.hide();
						_that.errorFlag = true;
					}
				});
			}
		},

		fetchSeries: function (arrResults) {
			var series = seriesdata;
			for (var n = 0; n < arrResults.length; n++) {
				var TCiSeries = arrResults[n].TCISeries;
				var b = 0;
				for (var s = 0; s < series.length; s++) {
					if (series[s].ModelSeriesNo == TCiSeries) {
						var ModelSeriesNo = series[s].ModelSeriesNo;
						for (var j = 0; j < _that.oGlobalJSONModel.getData().seriesData.length; j++) {
							if (ModelSeriesNo != _that.oGlobalJSONModel.getData().seriesData[j].ModelSeriesNo) {
								b++;
							}
						}
						if (b == _that.oGlobalJSONModel.getData().seriesData.length) {
							_that.oGlobalJSONModel.getData().seriesData.push({
								"ModelSeriesNo": series[s].ModelSeriesNo,
								"TCISeriesDescriptionEN": series[s].TCISeriesDescriptionEN
							});
							_that.oGlobalJSONModel.updateBindings(true);
						}
					}
					b = 0;
				}
			}
			_that.oGlobalJSONModel.getData().seriesData.unshift({
				"ModelSeriesNo": _that.oI18nModel.getResourceBundle().getText("PleaseSelect"),
				"TCISeriesDescriptionEN": _that.oI18nModel.getResourceBundle().getText("PleaseSelect")
			});
			_that.oGlobalJSONModel.updateBindings(true);
		},

		/*Function for Routing/Navigating from menu option as per selection */
		onMenuLinkPress: function (oLink) {
			var _oLinkPressed = oLink;
			var _oSelectedScreen = _oLinkPressed.getSource().getProperty("text");
			if (_oSelectedScreen == _that.oI18nModel.getResourceBundle().getText("PageTitle")) {
				_that.getRouter().navTo("Routemaster");
			} else if (_oSelectedScreen == _that.oI18nModel.getResourceBundle().getText("VehicleDetails")) {
				_that.getRouter().navTo("vehicleDetailsNodata");
			} else if (_oSelectedScreen == _that.oI18nModel.getResourceBundle().getText("ChangeHistory")) {
				if (SelectedDealer == undefined || SelectedDealer == "") {
					_that.getRouter().navTo("changeHistory2");
				} else {
					_that.getRouter().navTo("changeHistory", {
						SelectedDealer: SelectedDealer
					});
				}
			}
		},

		onTable1Press: function (oTableClick) {
			if (oTableClick.getParameters().columnIndex.length < 2) {
				var ColumnIndex = "0" + oTableClick.getParameters().columnIndex;
			} else {
				ColumnIndex = oTableClick.getParameters().columnIndex;
				if (ColumnIndex == "15") {
					ColumnIndex = "14";
				}
				if (ColumnIndex == "16") {
					ColumnIndex = "15";
				}
			}
			sap.ui.getCore().getModel("fleetMatrixModel").setProperty("/FleetColnIndex", ColumnIndex);
			_that.RowIndex = (Number(oTableClick.getParameters().rowIndex) + 1).toString();
			var obj_first = {};
			obj_first.MatrixVal = "A" + _that.RowIndex + ColumnIndex;
			_that.getObjectData(obj_first);
			_that.getRouter().navTo("details", {
				tableFirst: JSON.stringify(obj_first)
			});
		},
		onTable2Press: function (oTableClick) {
			if (oTableClick.getParameters().columnIndex.length < 2) {
				var ColumnIndex = "0" + oTableClick.getParameters().columnIndex;
			} else {
				ColumnIndex = oTableClick.getParameters().columnIndex;
				if (ColumnIndex == "15") {
					ColumnIndex = "14";
				}
				if (ColumnIndex == "16") {
					ColumnIndex = "15";
				}
			}
			sap.ui.getCore().getModel("fleetMatrixModel").setProperty("/FleetColnIndex", ColumnIndex);
			_that.RowIndex = (Number(oTableClick.getParameters().rowIndex) + 1).toString();
			var obj_first = {};
			obj_first.MatrixVal = "B" + _that.RowIndex + ColumnIndex;
			_that.getObjectData(obj_first);
			_that.getRouter().navTo("details", {
				tableFirst: JSON.stringify(obj_first)
			});
		},
		onTable3Press: function (oTableClick) {
			if (oTableClick.getParameters().columnIndex.length < 2) {
				var ColumnIndex = "0" + oTableClick.getParameters().columnIndex;
			} else {
				ColumnIndex = oTableClick.getParameters().columnIndex;
				if (ColumnIndex == "15") {
					ColumnIndex = "14";
				}
				if (ColumnIndex == "16") {
					ColumnIndex = "15";
				}
			}
			sap.ui.getCore().getModel("fleetMatrixModel").setProperty("/FleetColnIndex", ColumnIndex);
			_that.RowIndex = (Number(oTableClick.getParameters().rowIndex) + 1).toString();
			var obj_first = {};
			obj_first.MatrixVal = "C" + _that.RowIndex + ColumnIndex;
			_that.getObjectData(obj_first);
			_that.getRouter().navTo("details", {
				tableFirst: JSON.stringify(obj_first)
			});
		},

		getObjectData: function (obj_first) {
			obj_first.Dealer = SelectedDealer;
			obj_first.userType = _that.userType;
			// if (salesOffice == undefined) {
			// 	salesOffice = "";
			// }
			obj_first.salesOffice = salesOffice;
			if (sap.ui.getCore().getModel("BusinessDataModel").getData()._TCIDealerUser == "DealerONLY" && _that.getView().byId(
					"ID_modelYearPicker").getSelectedKey() == "") {
				// _that.getView().byId("ID_modelYearPicker").setValue("");
				// _that.getView().byId("ID_modelYearPicker").setSelectedKey("");
				obj_first.ModelYear = _that._ObjModelYear.ModelYearList[0].ModelYear + "+" + _that._ObjModelYear.ModelYearList[2].ModelYear;
			} else {
				obj_first.ModelYear = _that.getView().byId("ID_modelYearPicker").getSelectedKey();
			}

			if (_that.getView().byId("ID_seriesDesc").getSelectedKey() != _that.oI18nModel.getResourceBundle().getText("PleaseSelect")) {
				obj_first.series = _that.getView().byId("ID_seriesDesc").getSelectedKey();
				// if (obj_first.match(/\\$/)) {
				obj_first.series = obj_first.series.replace("/", "%2F");
				// }
			} else obj_first.series = "";

			if (_that.getView().byId("ID_modelDesc").getSelectedKey() != _that.oI18nModel.getResourceBundle().getText("PleaseSelect")) {
				obj_first.Model = _that.getView().byId("ID_modelDesc").getSelectedKey();
			} else obj_first.Model = "";

			if (_that.getView().byId("ID_marktgIntDesc").getSelectedKey() != _that.oI18nModel.getResourceBundle().getText("PleaseSelect") &&
				_that.getView().byId("ID_marktgIntDesc").getSelectedKey() !=
				"") {
				obj_first.suffix = _that.getView().byId("ID_marktgIntDesc").getSelectedKey();
				var intcol = _that.getView().getModel("GlobalJSONModel").getProperty(_that.getView().byId("ID_marktgIntDesc").getSelectedItem().getBindingContext(
					"GlobalJSONModel").sPath).int_c;
				obj_first.intcolor = intcol;
			} else {
				obj_first.suffix = "";
				obj_first.intcolor = "";
			}
			if (_that.getView().byId("ID_ExteriorColorCode").getSelectedKey() != _that.oI18nModel.getResourceBundle().getText("PleaseSelect")) {
				obj_first.ExteriorColorCode = _that.getView().byId("ID_ExteriorColorCode").getSelectedKey();
			} else obj_first.ExteriorColorCode = "";

			if (_that.getView().byId("ID_APXValue").getSelectedKey() != _that.oI18nModel.getResourceBundle().getText("PleaseSelect")) {
				obj_first.APXValue = _that.getView().byId("ID_APXValue").getSelectedKey();
			} else obj_first.APXValue = "";

			var ETADate = _that.getView().byId("id_ETADate").getValue();
			if (ETADate != _that.oI18nModel.getResourceBundle().getText("PleaseSelect")) {
				obj_first.ETADate = _that.oDateFormat.format(new Date(ETADate));
			} else obj_first.ETADate = "";

		},

		// onBeforeRendering: function () {
		// 	_that.getOwnerComponent().getRouter().attachRoutePatternMatched(_that._oMasterRoute, _that);
		// },

		exportAllDealerData: function () {
			// return new Promise(function (resolve, reject) {
			_that.callFinsihed = false;
			var count = 0;
			_that.operationsCompleted = 0;
			_that.dialog.open();
			var objMatrix = [{
				"MatrixVal": "A401",
				"Modelyear": _that.currentYear
			}, {
				"MatrixVal": "A401",
				"Modelyear": _that._pastYear
			}, {
				"MatrixVal": "A401",
				"Modelyear": _that._futureYear
			}, {
				"MatrixVal": "B501",
				"Modelyear": _that.currentYear
			}, {
				"MatrixVal": "B501",
				"Modelyear": _that._pastYear
			}, {
				"MatrixVal": "B501",
				"Modelyear": _that._futureYear
			}];
			_that.tempArr = [];
			if (sap.ui.getCore().getModel("BusinessDataModel").getData()._TCIDealerUser == "DealerONLY") {
				if (count == 0) {
					for (var n = 0; n < objMatrix.length; n++) {
						var exportDataURL = _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/InventoryDetailsSet?$filter=Division eq '" + DivUser +
							"' and VKBUR eq '' and MATRIX eq '" + objMatrix[n].MatrixVal + "' and Model eq '' and INTCOL eq '' and Modelyear eq '" +
							objMatrix[n].Modelyear +
							"' and TCISeries eq '' and Suffix eq '' and ExteriorColorCode eq '' and APX eq '' and ETA eq '' and Dealer eq '" +
							SelectedDealer + "'and UserType eq '" + _that.userType + "' and LANGUAGE eq '" + _that.localLang + "' &$format=json";

						count = 1;
						this.callData(exportDataURL, count);
					}
				}
			}
			// });
		},

		callData: function (exportDataURL, count) {
			if (count == 1) {
				$.ajax({
					dataType: "json",
					url: exportDataURL,
					type: "GET",
					success: function (oRowData) {
						count = 0;
						$.each(oRowData.d.results, function (key, value) {
							if (value.AccessInstl_flag === true) {
								value.AccessInstl_flag2 = "Y";
							} else {
								//if (value.AccessInstl_flag === false) {
								value.AccessInstl_flag2 = "N";
							}
							_that.tempArr.push(oRowData.d.results[key]);
						});
					},
					error: function (oError) {
						_that.dialog.close();
					},
					complete: function () {
						_that.dialog.close();
						++_that.operationsCompleted;
						console.log("_that.tempArr", _that.tempArr);
						if (_that.operationsCompleted === 6) _that.JSONToExcelConvertor(_that.tempArr, "Report", true);
					}
				});
			}
		},

		dateConverter: function (_dVal) {
			if (_dVal !== null && _dVal !== undefined && _dVal != "") {
				var year = _dVal.substring(0, 4);
				var month = _dVal.substring(6, 4);
				var day = _dVal.substring(8, 6);
				return year + "-" + month + "-" + day;
			} else return "";
		},

		// _that.exportAllDealerData.then(function({
		// 	_that.JSONToExcelConvertor(_that.tempArr, "Report", true);
		// }));
		JSONToExcelConvertor: function (JSONData, ReportTitle, ShowLabel) {
			var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
			var CSV = "";
			if (ShowLabel) {
				var row = "";
				row = row.slice(0, -1);
			}

			row += _that.oI18nModel.getResourceBundle().getText("Dealer") + ",";
			row += _that.oI18nModel.getResourceBundle().getText("OrderNumber") + ",";
			row += _that.oI18nModel.getResourceBundle().getText("OrderType") + ",";
			row += _that.oI18nModel.getResourceBundle().getText("Status") + ",";
			row += _that.oI18nModel.getResourceBundle().getText("Accessory") + ",";
			row += _that.oI18nModel.getResourceBundle().getText("VTN") + ",";
			row += _that.oI18nModel.getResourceBundle().getText("VIN") + ",";
			row += _that.oI18nModel.getResourceBundle().getText("ModelYear") + ",";
			row += _that.oI18nModel.getResourceBundle().getText("Model") + ",";
			row += _that.oI18nModel.getResourceBundle().getText("Suffix") + ",";
			row += _that.oI18nModel.getResourceBundle().getText("Colour") + ",";
			row += _that.oI18nModel.getResourceBundle().getText("ETAFrom") + ",";
			row += _that.oI18nModel.getResourceBundle().getText("ETATo") + ",";

			CSV += row + '\r\n';

			//loop is to extract each row
			for (var i = 0; i < arrData.length; i++) {
				var row = "";
				row += '="' + arrData[i].Dealer.substring(5, arrData[i].Dealer.length) + '",="' + arrData[i].ZZDLR_REF_NO + '","' + arrData[i].ORDERTYPE_DESC_EN +
					'","' + arrData[i].ZMMSTA + '","' + arrData[i].AccessInstl_flag2 + '","' + arrData[i].ZZVTN + '","' + arrData[i].VHVIN + '","' +
					arrData[i].Modelyear + '","'+
					arrData[i].Model + "-" + arrData[i].MODEL_DESC_EN + '","' + arrData[i].Suffix + "-" + arrData[i].SUFFIX_DESC_EN + '","' + arrData[
						i].ExteriorColorCode + "-" + arrData[i].EXTCOL_DESC_EN + '",="' + _that.dateConverter(arrData[i].ETAFrom) +
					'",="' + _that.dateConverter(arrData[i].ETATo) + '",';
				//}
				row.slice(1, row.length);
				CSV += row + '\r\n';
			}
			if (CSV == "") {
				alert("Invalid data");
				return;
			}
			var fileName = _that.oI18nModel.getResourceBundle().getText("VehicleDetailsReport");
			fileName += ReportTitle.replace(/ /g, "_");
			// Initialize file format you want csv or xls

			var blob = new Blob(["\ufeff" + CSV], {
				type: "text/csv;charset=utf-8,"
			});
			if (sap.ui.Device.browser.name === "ie" || sap.ui.Device.browser.name === "ed") { // IE 10+ , Edge (IE 12+)
				navigator.msSaveBlob(blob, _that.oI18nModel.getResourceBundle().getText("VehicleDetailsReport") + ".csv");
			} else {
				var uri = 'data:text/csv;charset=utf-8,' + "\ufeff" + encodeURIComponent(CSV); //'data:application/vnd.ms-excel,' + escape(CSV);
				var link = document.createElement("a");

				link.href = uri;
				link.style = "visibility:hidden";
				link.download = fileName + ".csv";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		},

		_oMasterRoute: function (oEvent) {
			// debugger;
			console.log("salesoffice", salesOffice);
			if (oEvent.getParameters().name === "Routemaster") {
				_that.fetchCountsforTables(filteredData);
			}
			_that.getView().setBusy(false);
			sap.ui.core.BusyIndicator.hide();
		},

		/*Exit Function for refreshing/resetting view */
		onExit: function () {
			_that.destroy();
			_that.oSelectJSONModel.refresh();
			_that.oGlobalJSONModel.refresh();
		}
	});
});