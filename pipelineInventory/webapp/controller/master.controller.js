sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel',
	'pipelineInventory/controller/BaseController',
	"sap/m/MessageBox"
], function (Controller, JSONModel, ResourceModel, BaseController, MessageBox) {
	"use strict";
	var Division, DivUser, _that, filteredData, SelectedDealer, seriesdata = [],
		sSelectedLocale;
	return BaseController.extend("pipelineInventory.controller.master", {
		/*Initialization of the page data*/
		onInit: function () {
			_that = this;
			var _oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0
			});
			_that.getView().setModel(_oViewModel, "LocalOCModel");
			_that.errorFlag = false;
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			_that.oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyyMMdd"
			});

			_that.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_that.getView().setModel(_that.oI18nModel, "i18n");

			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				sSelectedLocale = "EN"; // default is english 
			}
			if (sSelectedLocale == "fr") {
				_that.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				this.getView().setModel(_that.oI18nModel, "i18n");
				this.sCurrentLocale = 'FR';
			} else {
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
					currentImageSource = this.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "images/toyota_logo_colour.png");

				} else { // set the lexus logo
					DivUser = "LEX";
					currentImageSource = this.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "images/Lexus.png");
				}
			}

			_that.BusinessPartnerData = new sap.ui.model.json.JSONModel();
			_that.getView().setModel(_that.BusinessPartnerData, "BusinessDataModel");
			sap.ui.getCore().setModel(_that.BusinessPartnerData, "BusinessDataModel");

			//Local Testing
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/pipelineInventory-dest";

				var attributes = [{
					"Attribute": "",
					"BusinessPartner": "Zone All",
					"BusinessPartnerKey": "",
					"BusinessPartnerName": "",
					"BusinessPartnerType": "",
					"Division": "",
					"SearchTerm2": ""
				}, {
					"Attribute": "02",
					"BusinessPartner": "01050",
					"BusinessPartnerKey": "2400001050",
					"BusinessPartnerName": "Kelowna Toyota Inc.1234",
					"BusinessPartnerType": "Z001",
					"Division": "10",
					"SearchTerm2": "01050"
				}, {
					"Attribute": "01",
					"BusinessPartner": "01002",
					"BusinessPartnerKey": "2400501002",
					"BusinessPartnerName": "",
					"BusinessPartnerType": "Z004",
					"Division": "10",
					"SearchTerm2": "01002"
				}];

				var samlAttributes = {
					"Language": ["English"],
					"UserType": ["Zone"],
					"Zone": ["1"]
				};
				_that.salesOffice = "1000";
				_that.BusinessPartnerData.getData().DealerList = attributes;
				_that.BusinessPartnerData.getData().SamlList = samlAttributes;
				_that.BusinessPartnerData.updateBindings(true);
				_that.BusinessPartnerData.refresh(true);

			} else {
				//Cloud Deployment
				this.sPrefix = "";
			}
			this.nodeJsUrl = this.sPrefix + "/node";
			// _that.getView().setModel(_that.BusinessPartnerData, "BusinessDataModel");
			sap.ui.core.BusyIndicator.show();
			$.ajax({
				dataType: "json",
				url: "/userDetails/attributes",
				type: "GET",
				success: function (userAttributes) {
					sap.ui.core.BusyIndicator.hide();
					_that.BusinessPartnerData.getData().Dealers = [];
					_that.BusinessPartnerData.getData().DealerList = [];
					_that.BusinessPartnerData.getData().SamlList = [];
					console.log("User Attributes", userAttributes);
					_that.BusinessPartnerData.getData().Dealers = userAttributes.attributes;
					_that.BusinessPartnerData.setSizeLimit(userAttributes.attributes.length);
					_that.BusinessPartnerData.getData().SamlList = userAttributes.samlAttributes;

					var aBusinessPartnerKey = userAttributes.sales.reduce(function (obj, hash) {
						obj[hash.Customer] = true;
						return obj;
					}, {});
					for (var i = 0; i < _that.BusinessPartnerData.getData().Dealers.length; i++) {
						if (aBusinessPartnerKey[_that.BusinessPartnerData.getData().Dealers[i].BusinessPartnerKey])
							_that.BusinessPartnerData.getData().DealerList.push(_that.BusinessPartnerData.getData().Dealers[i]);
					}
					if (_that.BusinessPartnerData.getData().SamlList.UserType[0] == "Zone") {
						_that.salesOffice = _that.BusinessPartnerData.getData().SamlList.Zone[0] + "000";
						_that.BusinessPartnerData.getData().DealerList.unshift({
							BusinessPartner: "Zone All",
							BusinessPartnerKey: "",
							BusinessPartnerName: "",
							BusinessPartnerType: "",
							SearchTerm2: ""
						});
					} else if (_that.BusinessPartnerData.getData().SamlList.UserType[0] == "National") {
						_that.BusinessPartnerData.getData().DealerList[0].unshift({
							BusinessPartner: "Zone Pacific",
							BusinessPartnerKey: "",
							BusinessPartnerName: "",
							BusinessPartnerType: "",
							SearchTerm2: ""
						});
						_that.BusinessPartnerData.getData().DealerList[1].unshift({
							BusinessPartner: "Zone Prairie",
							BusinessPartnerKey: "",
							BusinessPartnerName: "",
							BusinessPartnerType: "",
							SearchTerm2: ""
						});
						_that.BusinessPartnerData.getData().DealerList[2].unshift({
							BusinessPartner: "Zone Central",
							BusinessPartnerKey: "",
							BusinessPartnerName: "",
							BusinessPartnerType: "",
							SearchTerm2: ""
						});
						_that.BusinessPartnerData.getData().DealerList[3].unshift({
							BusinessPartner: "Zone Atlantic",
							BusinessPartnerKey: "",
							BusinessPartnerName: "",
							BusinessPartnerType: "",
							SearchTerm2: ""
						});
						_that.BusinessPartnerData.getData().DealerList[4].unshift({
							BusinessPartner: "Zone Quebec",
							BusinessPartnerKey: "",
							BusinessPartnerName: "",
							BusinessPartnerType: "",
							SearchTerm2: ""
						});
						_that.BusinessPartnerData.getData().DealerList[5].unshift({
							BusinessPartner: "Zone Lexus",
							BusinessPartnerKey: "",
							BusinessPartnerName: "",
							BusinessPartnerType: "",
							SearchTerm2: ""
						});
					} else {
						_that.salesOffice = "";
					}
					sap.ui.core.BusyIndicator.hide();
					_that.BusinessPartnerData.updateBindings(true);
					_that.BusinessPartnerData.refresh(true);
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
				}
			});
			$.ajax({
				dataType: "json",
				url: "/userDetails/currentScopesForUser",
				type: "GET",
				success: function (scopesData) {
					console.log("currentScopesForUser", scopesData);
				},
				error: function (oError) {}
			});

			$.ajax({
				dataType: "json",
				url: _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/zc_mmfields?$filter=Division eq '" + DivUser + "'",
				type: "GET",
				success: function (oData) {
					if (oData.d.results.length > 0) {
						var b = 0;
						for (var i = 0; i < oData.d.results.length; i++) {
							var ModelSeriesNo = oData.d.results[i].ModelSeriesNo;
							for (var j = 0; j < seriesdata.length; j++) {
								if (ModelSeriesNo != seriesdata[j].ModelSeriesNo) {
									b++;
								}
							}
							if (b == seriesdata.length) {
								seriesdata.push({
									"ModelSeriesNo": oData.d.results[i].ModelSeriesNo,
									"TCISeriesDescriptionEN": oData.d.results[i].TCISeriesDescriptionEN
								});
							}
							b = 0;
						}
						console.log("Series Data", seriesdata);
					} else {
						//
					}
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					_that.errorFlag = true;
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
			var _pastYear = _that.currentYear - 1;
			var _pastYear1 = _that.currentYear - 2;
			var _futureYear = _that.currentYear + 1;
			var _ObjModelYear = {
				"ModelYearList": [{
					ModelYear: _pastYear1
				}, {
					ModelYear: _pastYear
				}, {
					ModelYear: _that.currentYear
				}, {
					ModelYear: _futureYear
				}]
			};
			_that.oModelYearModel.setData(_ObjModelYear);
			_that.oModelYearModel.updateBindings();
			_that.modelYearPicker.setSelectedKey(_that.currentYear);

			if (_that.errorFlag == true) {
				sap.m.MessageBox.error(
					_that.oI18nModel.getResourceBundle().getText("ErrorNoData")
				);
			}

			_that.ModelYear = _that.getView().byId("ID_modelYearPicker").getSelectedKey();
			_that.Model = _that.getView().byId("ID_modelDesc").getSelectedKey();
			var url = _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_MODEL_DETAILS?$filter=Modelyear eq '" + _that.ModelYear + "'";
			$.ajax({
				dataType: "json",
				url: url,
				type: "GET",
				success: function (oModelData) {
					sap.ui.core.BusyIndicator.hide();
					_that.oGlobalJSONModel.getData().seriesData = [];
					if (oModelData.d.results.length > 0) {
						_that.fetchSeries(oModelData.d.results);
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
				"ModelYearList": [{
					ModelYear: _pastYear1
				}, {
					ModelYear: _pastYear
				}, {
					ModelYear: _that.currentYear
				}, {
					ModelYear: _futureYear
				}]
			};
			_that.getView().byId("tableMultiHeader").getColumns()[1].setHeaderSpan([6, 6, 1]);
			_that.getView().byId("tableMultiHeader").getColumns()[7].setHeaderSpan([7, 3, 1]);
			_that.getView().byId("tableMultiHeader").getColumns()[10].setHeaderSpan([7, 4, 1]);
			_that.getView().byId("tableMultiHeader").getColumns()[15].setHeaderSpan([2, 2, 1]);

			_that.getView().byId("tableMultiHeader2").getColumns()[1].setHeaderSpan([6, 6, 1]);
			_that.getView().byId("tableMultiHeader2").getColumns()[7].setHeaderSpan([7, 3, 1]);
			_that.getView().byId("tableMultiHeader2").getColumns()[10].setHeaderSpan([7, 4, 1]);
			_that.getView().byId("tableMultiHeader2").getColumns()[15].setHeaderSpan([2, 2, 1]);

			_that.getView().byId("tableMultiHeader3").getColumns()[1].setHeaderSpan([6, 6, 1]);
			_that.getView().byId("tableMultiHeader3").getColumns()[7].setHeaderSpan([7, 3, 1]);
			_that.getView().byId("tableMultiHeader3").getColumns()[10].setHeaderSpan([7, 4, 1]);
			_that.getView().byId("tableMultiHeader3").getColumns()[15].setHeaderSpan([2, 2, 1]);

			for (var n = 1; n < _that.getView().byId("tableMultiHeader3").getRows()[2].getCells().length; n++) {
				_that.getView().byId("tableMultiHeader3").getRows()[2].getCells()[n].removeStyleClass("TabFontStyle");
			}
			for (var n = 1; n < _that.getView().byId("tableMultiHeader3").getRows()[5].getCells().length; n++) {
				_that.getView().byId("tableMultiHeader3").getRows()[5].getCells()[n].removeStyleClass("TabFontStyle");
			}
		},

		onDealerChange: function (oDealer) {
			_that.userType = "";
			if (oDealer.getParameters().selectedItem != undefined) {
				_that.getView().byId("ID_marktgIntDesc").setSelectedKey("Please Select");
				_that.getView().byId("ID_modelDesc").setSelectedKey("Please Select");
				_that.getView().byId("ID_seriesDesc").setSelectedKey("Please Select");
				_that.getView().byId("ID_ExteriorColorCode").setSelectedKey("Please Select");
				_that.getView().byId("ID_APXValue").setSelectedKey("Please Select");
				_that.getView().byId("id_ETADate").setValue();

				var SelectedDealerKey = oDealer.getParameters().selectedItem.getText().split("-")[0];
				var SelectedDealerType = oDealer.getParameters().selectedItem.getProperty("key");
				if (_that.BusinessPartnerData.getData().SamlList.UserType[0] == "Zone") {
					if (SelectedDealerKey == "Zone All") {
						_that.userType = "ZZA";
					} else if (SelectedDealerType == "Z004") {
						_that.userType = "ZZU";
					} else {
						_that.userType = "ZDU";
					}
				} else if (_that.BusinessPartnerData.getData().SamlList.UserType[0] == "Dealer") {
					_that.userType = "ZDU";
				} else if (_that.BusinessPartnerData.getData().SamlList.UserType[0] == "National") {
					if (SelectedDealerKey == "National All") {
						_that.userType = "NNA";
					} else if (SelectedDealerKey == "Zone Pacific") {
						_that.salesOffice = "1000";
						_that.userType = "NZA";
					} else if (SelectedDealerKey == "Zone Prairie") {
						_that.salesOffice = "2000";
						_that.userType = "NZA";
					} else if (SelectedDealerKey == "Zone Central") {
						_that.salesOffice = "3000";
						_that.userType = "NZA";
					} else if (SelectedDealerKey == "Zone Atlantic") {
						_that.salesOffice = "5000";
						_that.userType = "NZA";
					} else if (SelectedDealerKey == "Zone Quebec") {
						_that.salesOffice = "4000";
						_that.userType = "NZA";
					} else if (SelectedDealerKey == "Zone Lexus") {
						_that.salesOffice = "9000";
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
					if (SelectedDealerKey == "Zone All") {
						SelectedDealer = "";
					} else if (SelectedDealerKey == _that.BusinessPartnerData.getData().DealerList[d].BusinessPartner) {
						SelectedDealer = _that.BusinessPartnerData.getData().DealerList[d].BusinessPartnerKey;
					}
				}
			}
		},

		/*Fetch data on apply filter click for all three tables*/
		applyFiltersBtn: function () {
			// _that.getView().byId("ID_APXValue").getItems()[0].setEnabled(false);
			sap.ui.core.BusyIndicator.show();
			_that.ID_modelYearPicker = _that.getView().byId("ID_modelYearPicker").getValue();

			if (_that.getView().byId("ID_seriesDesc").getSelectedKey() != "Please Select") {
				_that.ID_seriesDesc = _that.getView().byId("ID_seriesDesc").getSelectedKey();
			} else _that.ID_seriesDesc = "";

			if (_that.getView().byId("ID_modelDesc").getSelectedKey() != "Please Select") {
				_that.ID_model = _that.getView().byId("ID_modelDesc").getSelectedKey();
			} else _that.ID_model = "";

			if (_that.getView().byId("ID_marktgIntDesc").getSelectedKey() != "Please Select") {
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

			if (_that.getView().byId("ID_ExteriorColorCode").getSelectedKey() != "Please Select") {
				_that.ID_ExteriorColorCode = _that.getView().byId("ID_ExteriorColorCode").getSelectedKey();
			} else _that.ID_ExteriorColorCode = "";

			if (_that.getView().byId("ID_APXValue").getSelectedKey() != "Please Select") {
				_that.ID_APXValue = _that.getView().byId("ID_APXValue").getSelectedKey();
			} else _that.ID_APXValue = "";

			var ETADate = _that.getView().byId("id_ETADate").getValue();
			if (ETADate != "Please Select") {
				_that.ETADate = _that.oDateFormat.format(new Date(ETADate));
			} else _that.ETADate = "";
			//VKBUR
			filteredData = "?$filter=VKBUR eq '" + _that.salesOffice + "' and UserType eq '" + _that.userType + "' and Dealer eq '" +
				SelectedDealer + "' and Model eq '" + _that.ID_model +
				"' and Modelyear eq '" + _that.ID_modelYearPicker + "' and TCISeries eq '" + _that.ID_seriesDesc + "' and Suffix eq '" + _that.ID_marktgIntDesc +
				"' and ExteriorColorCode eq '" + _that.ID_ExteriorColorCode + "' and APX eq '" +
				_that.ID_APXValue + "' and INTCOL eq '" + _that.intcolor + "' and ETA eq '" + _that.ETADate + "' &$format=json";
			_that.fetchCountsforTables(filteredData);
		},

		fetchCountsforTables: function (filteredData) {
			var ETACounturl = this.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/Pipeline_CountSet" + filteredData;
			console.log("queryString", filteredData);
			if (_that.oGlobalJSONModel != undefined) {
				$.ajax({
					dataType: "json",
					url: ETACounturl,
					type: "GET",
					success: function (oCountData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("ETA Count Data", oCountData.d.results);
						_that.oGlobalJSONModel.getData().ETAResults = oCountData.d.results;
						_that.oGlobalJSONModel.updateBindings();
					},
					error: function (oError) {
						sap.ui.core.BusyIndicator.hide();
						_that.errorFlag = true;
					}
				});
			}
			//ZPIPELINE_ETA_INVENT_SUMMARY_SRV/Inventory_CountSet?$filter=Model eq 'YZ3DCT' and Modelyear eq '2018'&$format=json
			var InventCounturl = this.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/Inventory_CountSet" + filteredData;
			if (_that.oGlobalJSONModel != undefined) {
				$.ajax({
					dataType: "json",
					url: InventCounturl,
					type: "GET",
					success: function (oCountData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("Invent Count Data", oCountData.d.results);
						//oCountData.d.results
						_that.oGlobalJSONModel.getData().InventSumResults = oCountData.d.results;
						_that.oGlobalJSONModel.updateBindings();
					},
					error: function (oError) {
						sap.ui.core.BusyIndicator.hide();
						_that.errorFlag = true;
					}
				});
			}

			//ZPIPELINE_ETA_INVENT_SUMMARY_SRV/Inventory_CountSet?$filter=Model eq 'YZ3DCT' and Modelyear eq '2018'&$format=json
			var DelCounturl = this.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/Delivery_CountSet" + filteredData;
			if (_that.oGlobalJSONModel != undefined) {
				$.ajax({
					dataType: "json",
					url: DelCounturl,
					type: "GET",
					success: function (oCountData) {
						sap.ui.core.BusyIndicator.hide();
						console.log("Del Count Data", oCountData.d.results);
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
			// _that.getView().byId("ID_modelDesc").getItems()[0].setEnabled(false);
			_that.getView().byId("ID_marktgIntDesc").getSelectedKey("Please Select");
			_that.getView().byId("ID_ExteriorColorCode").getSelectedKey("Please Select");
			_that.getView().byId("ID_APXValue").getSelectedKey("Please Select");
			sap.ui.core.BusyIndicator.show();
			_that.Modelyear = _that.modelYearPicker.getSelectedKey();
			_that.Model = oModel.getParameters("selectedItem").selectedItem.getKey();
			_that.oGlobalJSONModel.getData().suffixData = [];
			//ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_INTCOL?$filter=Model eq '"+ _that.Model +"' and Modelyear eq '"+ _that.Modelyear +"'
			$.ajax({
				dataType: "json",
				url: _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_INTCOL?$filter=Model eq '" + _that.Model + "' and Modelyear eq '" +
					_that.Modelyear + "'",
				type: "GET",
				success: function (oData) {
					if (oData.d.results.length > 0) {
						_that.oGlobalJSONModel.getData().suffixData = oData.d.results;
						sap.ui.core.BusyIndicator.hide();
						_that.oGlobalJSONModel.getData().suffixData.unshift({
							"Model": "",
							"Modelyear": "",
							"Suffix": "Please Select",
							"int_c": "",
							"SuffixDescriptionEN": "",
							"SuffixDescriptionFR": "",
							"mrktg_int_desc_en": "",
							"mrktg_int_desc_fr": ""
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
					console.log("oDataInner.results", oDataInner.d.results);
					console.log("suffixes", _that.temp1);
					_that.temp1 = oDataInner.d.results;
					if (_that.temp1.length > 0) {
						for (var n = 0; n < _that.temp.length; n++) {
							for (var m = 0; m < _that.temp1.length; m++) {
								console.log("mapping", _that.temp1[m].Suffix);
								_that.oGlobalJSONModel.getData().suffixData.push({
									"Suffix": _that.temp[n].Suffix,
									"SuffixDescriptionEN": _that.temp[n].SuffixDescriptionEN,
									"MarktgIntDescEN": _that.temp1[m].mrktg_int_desc_en,
									"intColorCode": _that.temp1[m].int_c
								});
								sap.ui.core.BusyIndicator.hide();
								_that.oGlobalJSONModel.updateBindings(true);
							}
						}
						// var b = 0;
						_that.oGlobalJSONModel.getData().suffixData.unshift({
							"Suffix": "Please Select",
							"SuffixDescriptionEN": "",
							"MarktgIntDescEN": ""
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
			_that.getView().byId("ID_ExteriorColorCode").getSelectedKey("Please Select");
			_that.getView().byId("ID_APXValue").getSelectedKey("Please Select");
			sap.ui.core.BusyIndicator.show();
			var Modelyear = _that.modelYearPicker.getSelectedKey();
			var Suffix = oSuffixVal.getParameters("selectedItem").selectedItem.getKey();
			var Model = _that.getView().byId("ID_modelDesc").getSelectedKey();
			var series = _that.getView().byId("ID_seriesDesc").getSelectedKey();

			_that.oGlobalJSONModel.getData().colorData = [];
			$.ajax({
				dataType: "json",
				url: _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV//zc_exterior_trim?$filter=ModelYear eq '" + Modelyear +
					"' and Model eq '" + Model + "' and Suffix eq '" + Suffix + "' and TCISeries eq '" + series + "'",
				type: "GET",
				success: function (oData) {
					if (oData.d.results.length > 0) {
						$.each(oData.d.results, function (i, item) {
							_that.oGlobalJSONModel.getData().colorData.push({
								"ExteriorColorCode": item.ExteriorColorCode,
								"MarketingDescriptionEXTColorEN": item.MarketingDescriptionEXTColorEN
							});
						});

						_that.oGlobalJSONModel.getData().colorData.unshift({
							"ExteriorColorCode": "Please Select",
							"MarketingDescriptionEXTColorEN": ""
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
		onSeriesSelectionChange: function (oSeriesVal) {
			sap.ui.core.BusyIndicator.show();
			_that.getView().byId("ID_marktgIntDesc").getSelectedKey("Please Select");
			_that.getView().byId("ID_modelDesc").getSelectedKey("Please Select");
			_that.getView().byId("ID_ExteriorColorCode").getSelectedKey("Please Select");
			_that.getView().byId("ID_APXValue").getSelectedKey("Please Select");

			var Modelyear = _that.modelYearPicker.getSelectedKey();
			var oSeriesVal = oSeriesVal.getParameters("selectedItem").selectedItem.getKey();
			console.log("oSeriesVal", oSeriesVal);
			_that.oGlobalJSONModel.getData().modelData = [];
			//?$filter=Modelyear%20eq%20%272020%27%20and%20TCISeries%20eq%20%27RXH%27
			$.ajax({
				dataType: "json",
				url: _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_MODEL_DETAILS?$filter=Modelyear eq '" + Modelyear +
					"' and TCISeries eq '" + oSeriesVal + "'",
				type: "GET",
				success: function (oData) {
					if (oData.d.results.length > 0) {
						var b = 0;
						console.log("Model Data", oData.d.results);
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
									"ENModelDesc": oData.d.results[i].ENModelDesc
								});
								_that.oGlobalJSONModel.updateBindings(true);
							}
							b = 0;
						}
						sap.ui.core.BusyIndicator.hide();
						_that.oGlobalJSONModel.getData().modelData.unshift({
							"Model": "Please Select",
							"ENModelDesc": ""
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

		//zzmoyr eq '2018' and zzmodel eq 'LB71JZ' and zzsuffix eq '03'
		onColorCodeChange: function (oModVal) {
			_that.getView().byId("ID_APXValue").getSelectedKey("Please Select");
			sap.ui.core.BusyIndicator.show();
			var Modelyear = _that.modelYearPicker.getSelectedKey();
			var Suffix = _that.getView().byId("ID_marktgIntDesc").getSelectedKey();
			var Model = _that.getView().byId("ID_modelDesc").getSelectedKey();
			var ExteriorColorCode = oModVal.getParameters("ID_ExteriorColorCode").selectedItem.getKey();

			//var url = _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_APX?filter=zzmoyr eq '2018' and zzmodel eq 'YZ3DCT' and zzsuffix eq 'BB' and zzextcol eq '0070'

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
							"APX": "Please Select"
						});
						_that.oGlobalJSONModel.updateBindings(true);
						console.log(_that.oGlobalJSONModel.getData().APXCollection);
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
			_that.getView().byId("ID_seriesDesc").getSelectedKey("Please Select");
			_that.getView().byId("ID_modelDesc").getSelectedKey("Please Select");
			_that.getView().byId("ID_marktgIntDesc").getSelectedKey("Please Select");
			_that.getView().byId("ID_ExteriorColorCode").getSelectedKey("Please Select");
			_that.getView().byId("ID_APXValue").getSelectedKey("Please Select");

			sap.ui.core.BusyIndicator.show();
			var ModelYear = oModVal.getParameters("selectedItem").selectedItem.getKey();
			var url = _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_MODEL_DETAILS?$filter=Modelyear eq '" + ModelYear + "'";
			$.ajax({
				dataType: "json",
				url: url,
				type: "GET",
				success: function (oModelData) {
					sap.ui.core.BusyIndicator.hide();
					_that.oGlobalJSONModel.getData().seriesData = [];
					if (oModelData.d.results.length > 0) {
						_that.fetchSeries(oModelData.d.results);
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

		fetchSeries: function (arrResults) {
			// debugger;
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
				"ModelSeriesNo": "Please Select",
				"TCISeriesDescriptionEN": "Please Select"
			});
			_that.oGlobalJSONModel.updateBindings(true);
		},

		/*Funtion to get the changed year*/
		handleYearChange: function (oYearEvent) {
			//code goes here
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
					sap.m.MessageBox.information("Please Select Dealer");
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
			obj_first.salesOffice = _that.salesOffice;
			obj_first.ModelYear = _that.getView().byId("ID_modelYearPicker").getSelectedKey();

			if (_that.getView().byId("ID_seriesDesc").getSelectedKey() != "Please Select") {
				obj_first.series = _that.getView().byId("ID_seriesDesc").getSelectedKey();
			} else obj_first.series = "";

			if (_that.getView().byId("ID_modelDesc").getSelectedKey() != "Please Select") {
				obj_first.Model = _that.getView().byId("ID_modelDesc").getSelectedKey();
			} else obj_first.Model = "";

			if (_that.getView().byId("ID_marktgIntDesc").getSelectedKey() != "Please Select") {
				obj_first.suffix = _that.getView().byId("ID_marktgIntDesc").getSelectedKey();
				var intcol = _that.getView().getModel("GlobalJSONModel").getProperty(_that.getView().byId("ID_marktgIntDesc").getSelectedItem().getBindingContext(
					"GlobalJSONModel").sPath).int_c;
				obj_first.intcolor = intcol;
			} else {
				obj_first.suffix = "";
				obj_first.intcolor = "";
			}
			if (_that.getView().byId("ID_ExteriorColorCode").getSelectedKey() != "Please Select") {
				obj_first.ExteriorColorCode = _that.getView().byId("ID_ExteriorColorCode").getSelectedKey();
			} else obj_first.ExteriorColorCode = "";

			if (_that.getView().byId("ID_APXValue").getSelectedKey() != "Please Select") {
				obj_first.APXValue = _that.getView().byId("ID_APXValue").getSelectedKey();
			} else obj_first.APXValue = "";

			var ETADate = _that.getView().byId("id_ETADate").getValue();
			if (ETADate != "Please Select") {
				obj_first.ETADate = _that.oDateFormat.format(new Date(ETADate));
			} else obj_first.ETADate = "";

		},

		onBeforeRendering: function () {
			_that.getOwnerComponent().getRouter().attachRoutePatternMatched(_that._oMasterRoute, _that);
		},

		_oMasterRoute: function (oEvent) {
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