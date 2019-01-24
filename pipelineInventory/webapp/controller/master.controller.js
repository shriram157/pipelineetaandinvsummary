var _that, filteredData, SelectedDealer, seriesdata = [];
sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel',
	'pipelineInventory/controller/BaseController',
	"sap/m/MessageBox"
], function (Controller, JSONModel, ResourceModel, BaseController, MessageBox) {
	"use strict";
	return BaseController.extend("pipelineInventory.controller.master", {
		/*Initialization of the page data*/
		onInit: function () {
			_that = this;
			_that.errorFlag = false;
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			_that.oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyyMMdd"
			});

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

			// _that.oDataService = "/node";
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/pipelineInventory-dest";
			} else {
				this.sPrefix = "";
			}
			this.nodeJsUrl = this.sPrefix + "/node";

			$.ajax({
				dataType: "json",
				url: _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/zc_mmfields",
				type: "GET",
				success: function (oData) {
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
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					_that.errorFlag = true;
				}
			});

			/*Global Model initialization and mapping on view*/
			_that.oGlobalJSONModel = new JSONModel();
			_that.oBusinessDataModel = new JSONModel();
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

			var dealerCodes = {
				DealerList: [{
					"BusinessPartner": "2400053164",
					"SearchTerm2": "53164"
				}, {
					"BusinessPartner": "2400053183",
					"SearchTerm2": "53183"
				}, {
					"BusinessPartner": "2400042176",
					"SearchTerm2": "42176"
				}, {
					"BusinessPartner": "2400034030",
					"SearchTerm2": "34030"
				}, {
					"BusinessPartner": "2400053151",
					"SearchTerm2": "53151"
				}, {
					"BusinessPartner": "2400053006",
					"SearchTerm2": "53006"
				}, {
					"BusinessPartner": "2400042348",
					"SearchTerm2": "42348"
				}, {
					"BusinessPartner": "2400101190",
					"SearchTerm2": "01190"
				}, {
					"BusinessPartner": "2400095018",
					"SearchTerm2": "95018"
				}, {
					"BusinessPartner": "2400053171",
					"SearchTerm2": "53171"
				}, {
					"BusinessPartner": "2400053187",
					"SearchTerm2": "53187"
				}, {
					"BusinessPartner": "2400001082",
					"SearchTerm2": "01082"
				}, {
					"BusinessPartner": "2400042309",
					"SearchTerm2": "42309"
				}, {
					"BusinessPartner": "2400053070",
					"SearchTerm2": "53070"
				}, {
					"BusinessPartner": "2400042076",
					"SearchTerm2": "42076"
				}, {
					"BusinessPartner": "2400001050",
					"SearchTerm2": "01050"
				}, {
					"BusinessPartner": "2400101520",
					"SearchTerm2": "01520"
				}, {
					"BusinessPartner": "2400042352",
					"SearchTerm2": "42352"
				}, {
					"BusinessPartner": "2400053207",
					"SearchTerm2": "53207"
				}, {
					"SearchTerm2": "53178",
					"BusinessPartner": "2400053178"
				}, {
					"SearchTerm2": "01132",
					"BusinessPartner": "2400001132"
				}, {
					"SearchTerm2": "42120",
					"BusinessPartner": "2400042120"
				}, {
					"SearchTerm2": "14071",
					"BusinessPartner": "2400014071"
				}, {
					"SearchTerm2": "00014",
					"BusinessPartner": "2400100014"
				}, {
					"SearchTerm2": "01092",
					"BusinessPartner": "2400001092"
				}, {
					"SearchTerm2": "53167",
					"BusinessPartner": "2400053167"
				}, {
					"SearchTerm2": "53168",
					"BusinessPartner": "2400053168"
				}, {
					"SearchTerm2": "53170",
					"BusinessPartner": "2400053170"
				}, {
					"SearchTerm2": "00000",
					"BusinessPartner": "2400500000"
				}, {
					"SearchTerm2": "01049",
					"BusinessPartner": "2400001049"
				}, {
					"SearchTerm2": "14090",
					"BusinessPartner": "2400014090"
				}, {
					"SearchTerm2": "53185",
					"BusinessPartner": "2400053185"
				}, {
					"SearchTerm2": "01114",
					"BusinessPartner": "2400001114"
				}, {
					"SearchTerm2": "53014",
					"BusinessPartner": "2400053014"
				}, {
					"SearchTerm2": "42177",
					"BusinessPartner": "2400042177"
				}, {
					"SearchTerm2": "42178",
					"BusinessPartner": "2400042178"
				}, {
					"SearchTerm2": "14105",
					"BusinessPartner": "2400014105"
				}, {
					"SearchTerm2": "53053",
					"BusinessPartner": "2400053053"
				}, {
					"SearchTerm2": "53067",
					"BusinessPartner": "2400053067"
				}, {
					"SearchTerm2": "14073",
					"BusinessPartner": "2400014073"
				}, {
					"SearchTerm2": "42193",
					"BusinessPartner": "2400042193"
				}, {
					"SearchTerm2": "01088",
					"BusinessPartner": "2400001088"
				}, {
					"SearchTerm2": "42306",
					"BusinessPartner": "2400042306"
				}, {
					"SearchTerm2": "00158",
					"BusinessPartner": "2400200158"
				}, {
					"SearchTerm2": "00099",
					"BusinessPartner": "2400500099"
				}, {
					"SearchTerm2": "01003",
					"BusinessPartner": "2400001003"
				}, {
					"SearchTerm2": "85006",
					"BusinessPartner": "2400085006"
				}, {
					"SearchTerm2": "42270",
					"BusinessPartner": "2400542270"
				}, {
					"SearchTerm2": "01125",
					"BusinessPartner": "2400001125"
				}, {
					"SearchTerm2": "42360",
					"BusinessPartner": "2400042360"
				}, {
					"SearchTerm2": "42217",
					"BusinessPartner": "2400542217"
				}, {
					"SearchTerm2": "01572",
					"BusinessPartner": "2400101572"
				}, {
					"SearchTerm2": "95013",
					"BusinessPartner": "2400095013"
				}, {
					"SearchTerm2": "42999",
					"BusinessPartner": "2400042999"
				}, {
					"SearchTerm2": "42337",
					"BusinessPartner": "2400042337"
				}, {
					"SearchTerm2": "42327",
					"BusinessPartner": "2400042327"
				}, {
					"SearchTerm2": "53159",
					"BusinessPartner": "2400053159"
				}, {
					"SearchTerm2": "42069",
					"BusinessPartner": "2400042069"
				}, {
					"SearchTerm2": "01078",
					"BusinessPartner": "2400001078"
				}, {
					"SearchTerm2": "01075",
					"BusinessPartner": "2400001075"
				}, {
					"SearchTerm2": "01089",
					"BusinessPartner": "2400001089"
				}, {
					"SearchTerm2": "53013",
					"BusinessPartner": "2400053013"
				}, {
					"SearchTerm2": "00000",
					"BusinessPartner": "2400300000"
				}, {
					"SearchTerm2": "00422",
					"BusinessPartner": "2400100422"
				}, {
					"SearchTerm2": "85001",
					"BusinessPartner": "2400085001"
				}, {
					"SearchTerm2": "65431",
					"BusinessPartner": "2400065431"
				}, {
					"SearchTerm2": "53140",
					"BusinessPartner": "2400053140"
				}, {
					"SearchTerm2": "75003",
					"BusinessPartner": "2400075003"
				}, {
					"SearchTerm2": "53152",
					"BusinessPartner": "2400053152"
				}, {
					"SearchTerm2": "14082",
					"BusinessPartner": "2400014082"
				}, {
					"BusinessPartner": "2400099998",
					"SearchTerm2": "99998"
				}, {
					"BusinessPartner": "2400088888",
					"SearchTerm2": "88888"
				}, {
					"BusinessPartner": "2400042130",
					"SearchTerm2": "42130"
				}, {
					"BusinessPartner": "2400053144",
					"SearchTerm2": "53144"
				}, {
					"BusinessPartner": "2400053124",
					"SearchTerm2": "53124"
				}, {
					"BusinessPartner": "2400042361",
					"SearchTerm2": "42361"
				}, {
					"BusinessPartner": "2400042328",
					"SearchTerm2": "42328"
				}, {
					"BusinessPartner": "2400042366",
					"SearchTerm2": "42366"
				}, {
					"BusinessPartner": "2400001141",
					"SearchTerm2": "01141"
				}, {
					"BusinessPartner": "2400042353",
					"SearchTerm2": "42353"
				}, {
					"BusinessPartner": "2400014084",
					"SearchTerm2": "14084"
				}, {
					"SearchTerm2": "42051",
					"BusinessPartner": "2400042051"
				}, {
					"BusinessPartner": "2400001109",
					"SearchTerm2": "01109"
				}, {
					"BusinessPartner": "2400001115",
					"SearchTerm2": "01115"
				}, {
					"BusinessPartner": "2400001116",
					"SearchTerm2": "01116"
				}]
			}
			_that.oBusinessDataModel.getData().DealerList = dealerCodes.DealerList;
			console.log("dealerCodes", dealerCodes);
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

			// var Dealer = _that.oUserModel.getData().userContext.userAttributes.DealerCode[0];
			// for (var c = 0; c < dealerCodes.DealerList.length; c++) {
			// 	sap.ui.core.BusyIndicator.show();
			// 	var Dealer = dealerCodes.DealerList[c].DealerCode;
			// 	// (function (c) {
			// 	$.ajax({
			// 		dataType: "json",
			// 		async: true,
			// 		url: _that.nodeJsUrl +
			// 			"/API_BUSINESS_PARTNER/A_BusinessPartner?$filter=SearchTerm2 eq '" + Dealer +
			// 			"' and BusinessPartnerGrouping eq 'Z003'&$orderby=BusinessPartnerName",
			// 		type: "GET",
			// 		success: function (oDealerData) {
			// 			_that.DealerData = {};
			// 			$.each(oDealerData.d.results, function (i, item) {
			// 				_that.oBusinessDataModel.getData().DealerList.push({
			// 					"BusinessPartner": item.BusinessPartner,
			// 					"BusinessPartnerGrouping": item.BusinessPartnerGrouping,
			// 					"BusinessPartnerName": item.BusinessPartnerName,
			// 					"OrganizationBPName1": item.OrganizationBPName1,
			// 					"SearchTerm2": item.SearchTerm2,
			// 					"SearchTerm1": item.SearchTerm1
			// 				});
			// 			});
			// 			_that.oBusinessDataModel.updateBindings(true);

			// 			sap.ui.core.BusyIndicator.hide();
			// 			console.log("_that.oBusinessDataModel", _that.oBusinessDataModel);
			// 		},
			// 		error: function (oError) {
			// 			_that.errorFlag = true;
			// 		}
			// 	});
			// 	// })(c);
			// }

			_that.oBusinessDataModel.updateBindings(true);
			_that.oBusinessDataModel.refresh(true);
			sap.ui.getCore().setModel(_that.oBusinessDataModel, "BusinessDataModel");
			_that.getView().setModel(_that.oBusinessDataModel, "BusinessDataModel");

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
						_that.fetchinitialSeries(oModelData.d.results);
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
			SelectedDealer = oDealer.getParameters().selectedItem.getProperty("key");
		},

		/*Fetch data on apply filter click for all three tables*/
		applyFiltersBtn: function () {
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
			} else _that.ID_marktgIntDesc = "";

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

			//Model eq '"+_that.ID_model+"' and Modelyear eq '"+_that.ID_modelYearPicker+"' and TCISeries eq '"+_that.ID_seriesDesc+"' and Suffix eq 'AL' and ExteriorColorCode eq '"+_that.ID_ExteriorColorCode+"' and APX eq '"+_that.ID_APXValue+"' and ETA eq '"+_that.ETADate+"' &$format=json
			filteredData = "?$filter=Dealer eq '" + SelectedDealer + "' and Model eq '" + _that.ID_model +
				"' and Modelyear eq '" + _that.ID_modelYearPicker + "' and TCISeries eq '" + _that.ID_seriesDesc +
				"' and Suffix eq '" + _that.ID_marktgIntDesc + "' and ExteriorColorCode eq '" + _that.ID_ExteriorColorCode + "' and APX eq '" +
				_that.ID_APXValue +
				"' and ETA eq '" + _that.ETADate + "' &$format=json";
			_that.fetchCountsforTables(filteredData);
		},

		fetchCountsforTables: function (filteredData) {
			var ETACounturl = this.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/Pipeline_CountSet" + filteredData;
			console.log("queryString", filteredData);

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
			//ZPIPELINE_ETA_INVENT_SUMMARY_SRV/Inventory_CountSet?$filter=Model eq 'YZ3DCT' and Modelyear eq '2018'&$format=json
			var InventCounturl = this.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/Inventory_CountSet" + filteredData;

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

			//ZPIPELINE_ETA_INVENT_SUMMARY_SRV/Inventory_CountSet?$filter=Model eq 'YZ3DCT' and Modelyear eq '2018'&$format=json
			var DelCounturl = this.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/Delivery_CountSet" + filteredData;

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
		},

		/*For Switching the Pages*/
		selectedScreen: function (oSelectedScreen) {
			var selectedScreenText = oSelectedScreen.getParameters().selectedItem.getText();
			if (selectedScreenText == "Master") {
				_that.getRouter().navTo("Routemaster");
			} else if (selectedScreenText == "Details") {
				_that.getRouter().navTo("details");
			} else if (selectedScreenText == "Vehicle Details") {
				_that.getRouter().navTo("vehicleDetails");
			} else if (selectedScreenText == "Order Change") {
				_that.getRouter().navTo("orderChange");
			} else if (selectedScreenText == "Ship To Dealer") {
				_that.getRouter().navTo("shipToDealer");
			} else if (selectedScreenText == "Ship To Dealer Response") {
				_that.getRouter().navTo("shipToDealerResponse");
			} else if (selectedScreenText == "Assign Vehicles") {
				_that.getRouter().navTo("assignVehicles");
			} else if (selectedScreenText == "Assign Vehicles Status") {
				_that.getRouter().navTo("assignVehiclesStatus");
			} else if (selectedScreenText == "Change History") {
				_that.getRouter().navTo("changeHistory", {
					SelectedDealer: SelectedDealer
				});
			}
		},

		//on Model Selection Change
		onModelSelectionChange: function (oModel) {
			_that.temp = [];
			_that.temp1 = [];
			sap.ui.core.BusyIndicator.show();
			_that.Modelyear = _that.modelYearPicker.getSelectedKey();
			_that.Model = oModel.getParameters("selectedItem").selectedItem.getKey();
			_that.oGlobalJSONModel.getData().suffixData = [];
			$.ajax({
				dataType: "json",
				url: _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/zc_configuration?$filter=Model eq '" + _that.Model +
					"'and ModelYear eq '" + _that.Modelyear + "'",
				type: "GET",
				success: function (oData) {
					_that.temp = oData.d.results;
					// debugger;
					_that.getAllSuffix();
					_that.oGlobalJSONModel.updateBindings(true);
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

					for (var n = 0; n < _that.temp.length; n++) {
						for (var m = 0; m < _that.temp1.length; m++) {
							console.log("mapping", _that.temp1[m].Suffix);
							_that.oGlobalJSONModel.getData().suffixData.push({
								"Suffix": _that.temp[n].Suffix,
								"SuffixDescriptionEN": _that.temp[n].SuffixDescriptionEN,
								"MarktgIntDescEN": _that.temp1[m].mrktg_int_desc_en
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
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					_that.errorFlag = true;
				}
			});

		},

		onSuffixChange: function (oSuffixVal) {
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
					// debugger;
					$.each(oData.d.results, function (i, item) {
						_that.oGlobalJSONModel.getData().colorData.push({
							"ExteriorColorCode": item.ExteriorColorCode,
							"MarketingDescriptionEXTColorEN": item.MarketingDescriptionEXTColorEN,
							"ColorSelectionCode": item.ColorSelectionCode
						});
					});

					_that.oGlobalJSONModel.getData().colorData.unshift({
						"ExteriorColorCode": "Please Select",
						"MarketingDescriptionEXTColorEN": "",
						"ColorSelectionCode": ""
					});
					_that.oGlobalJSONModel.updateBindings(true);
					sap.ui.core.BusyIndicator.hide();
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
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					_that.errorFlag = true;
				}
			});
		},

		//zzmoyr eq '2018' and zzmodel eq 'LB71JZ' and zzsuffix eq '03'
		onColorCodeChange: function (oModVal) {
			sap.ui.core.BusyIndicator.show();
			var ModelYear = oModVal.getParameters("ID_modelYearPicker").selectedItem.getKey();
			var Model = oModVal.getParameters("ID_modelDesc").selectedItem.getKey();
			var suffix = oModVal.getParameters("ID_marktgIntDesc").selectedItem.getKey();
			var colorSelCode = oModVal.getParameters("ID_ExteriorColorCode").selectedItem.getKey();

			var url = _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_PIO_DIO?filter=zzmoyr eq '" + ModelYear + "' and zzmodel eq '" +
				Model + "' and zzsuffix eq '" + suffix + "' and col_sel_cd eq '" + colorSelCode + "'";
			$.ajax({
				dataType: "json",
				url: url,
				type: "GET",
				success: function (oAPXData) {
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
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					_that.errorFlag = true;
				}
			});
		},

		/*On Model Year Selection*/
		onModelYearChange: function (oModVal) {
			if (_that.getView().byId("ID_seriesDesc").getSelectedKey() != "Please Select") {
				_that.getView().byId("ID_seriesDesc").setValue();
			}
			if (_that.getView().byId("ID_modelDesc").getSelectedKey() != "Please Select") {
				_that.getView().byId("ID_modelDesc").setValue();
			}
			if (_that.getView().byId("ID_marktgIntDesc").getSelectedKey() != "Please Select") {
				_that.getView().byId("ID_marktgIntDesc").setValue();
			}
			if (_that.getView().byId("ID_ExteriorColorCode").getSelectedKey() != "Please Select") {
				_that.getView().byId("ID_ExteriorColorCode").setValue();
			}
			if (_that.getView().byId("ID_APXValue").getSelectedKey() != "Please Select") {
				_that.getView().byId("ID_APXValue").setValue();
			}

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

		fetchinitialSeries: function (arrResults) {
			var n;
			for (n = 0; n < arrResults.length; n++) {
				var TCiSeries = arrResults[n].TCISeries;
				$.ajax({
					dataType: "json",
					url: _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/zc_mmfields?$filter=ModelSeriesNo eq '" + TCiSeries +
						"'",
					type: "GET",
					success: function (oData) {
						console.log("Series Data", oData.d.results);
						var b = 0;
						for (var i = 0; i < oData.d.results.length; i++) {
							var ModelSeriesNo = oData.d.results[i].ModelSeriesNo;
							for (var j = 0; j < _that.oGlobalJSONModel.getData().seriesData.length; j++) {
								if (ModelSeriesNo != _that.oGlobalJSONModel.getData().seriesData[j].ModelSeriesNo) {
									b++;
								}
							}
							if (b == _that.oGlobalJSONModel.getData().seriesData.length) {
								_that.oGlobalJSONModel.getData().seriesData.push({
									"ModelSeriesNo": oData.d.results[i].ModelSeriesNo,
									"TCISeriesDescriptionEN": oData.d.results[i].TCISeriesDescriptionEN
								});

								_that.oGlobalJSONModel.updateBindings(true);
							}
							b = 0;
						}
						sap.ui.core.BusyIndicator.hide();
						_that.oGlobalJSONModel.updateBindings(true);
					},
					error: function (oError) {
						sap.ui.core.BusyIndicator.hide();
						_that.errorFlag = true;
					}
				});
			}

			_that.oGlobalJSONModel.getData().seriesData.unshift({
				"ModelSeriesNo": "Please Select",
				"TCISeriesDescriptionEN": ""
			});
			console.log("_that.oGlobalJSONModel.getData().seriesData", _that.oGlobalJSONModel.getData().seriesData);
			_that.oGlobalJSONModel.updateBindings(true);
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

			// var n;
			// for (n = 0; n < arrResults.length; n++) {
			// 	var TCiSeries = arrResults[n].TCISeries;
			// 	$.ajax({
			// 		dataType: "json",
			// 		url: _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/zc_mmfields?$filter=ModelSeriesNo eq '" + TCiSeries +
			// 			"'",
			// 		type: "GET",
			// 		success: function (oData) {
			// 			console.log("Series Data", oData.d.results);
			// 			var b = 0;
			// 			for (var i = 0; i < oData.d.results.length; i++) {
			// 				var ModelSeriesNo = oData.d.results[i].ModelSeriesNo;
			// 				for (var j = 0; j < _that.oGlobalJSONModel.getData().seriesData.length; j++) {
			// 					if (ModelSeriesNo != _that.oGlobalJSONModel.getData().seriesData[j].ModelSeriesNo) {
			// 						b++;
			// 					}
			// 				}
			// 				if (b == _that.oGlobalJSONModel.getData().seriesData.length) {
			// 					_that.oGlobalJSONModel.getData().seriesData.push({
			// 						"ModelSeriesNo": oData.d.results[i].ModelSeriesNo,
			// 						"TCISeriesDescriptionEN": oData.d.results[i].TCISeriesDescriptionEN
			// 					});

			// 					_that.oGlobalJSONModel.updateBindings(true);
			// 				}
			// 				b = 0;
			// 			}
			// 			jQuery.sap.delayedCall(8000, _that, function () {
			// 				sap.ui.core.BusyIndicator.hide();
			// 			});
			// 			_that.oGlobalJSONModel.updateBindings(true);
			// 		},
			// 		error: function (oError) {
			// 			sap.ui.core.BusyIndicator.hide();
			// 			_that.errorFlag = true;
			// 		}
			// 	});

			_that.oGlobalJSONModel.getData().seriesData.unshift({
				"ModelSeriesNo": "Please Select",
				"TCISeriesDescriptionEN": ""
			});
			console.log("_that.oGlobalJSONModel.getData().seriesData", _that.oGlobalJSONModel.getData().seriesData);
			_that.oGlobalJSONModel.updateBindings(true);
		},

		/*Funtion to get the changed year*/
		handleYearChange: function (oYearEvent) {
			// oYearEvent.getSource().setMinDate(new Date("2017"));
			// oYearEvent.getSource().setMaxDate(new Date("2019"));
			///ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_MODEL_DETAILS?$filter=Modelyear eq '2020'
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
				_that.getRouter().navTo("changeHistory", {
					SelectedDealer: SelectedDealer
				});
			}
		},

		onTable1Press: function (oTableClick) {
			if (oTableClick.getParameters().columnIndex.length == 1) {
				_that.ColumnIndex = "0" + oTableClick.getParameters().columnIndex;
			}
			_that.RowIndex = (Number(oTableClick.getParameters().rowIndex) + 1).toString();
			console.log(_that.RowIndex, _that.ColumnIndex);
			// _that.getRowDataTable1(_that.RowIndex, _that.ColumnIndex);
			var obj_first = {};
			obj_first.MatrixVal = "A" + _that.RowIndex + _that.ColumnIndex;
			obj_first.ModelYear = _that.getView().byId("ID_modelYearPicker").getSelectedKey();
			obj_first.Model = _that.getView().byId("ID_modelDesc").getSelectedKey();

			_that.getRouter().navTo("details", {
				tableFirst: JSON.stringify(obj_first)
			});
		},
		onTable2Press: function (oTableClick) {
			if (oTableClick.getParameters().columnIndex.length == 1) {
				_that.ColumnIndex = "0" + oTableClick.getParameters().columnIndex;
			}
			_that.RowIndex = (Number(oTableClick.getParameters().rowIndex) + 1).toString();
			console.log(_that.RowIndex, _that.ColumnIndex);
			// _that.getRowDataTable1(_that.RowIndex, _that.ColumnIndex);
			var obj_first = {};
			obj_first.MatrixVal = "B" + _that.RowIndex + _that.ColumnIndex;
			obj_first.ModelYear = _that.getView().byId("ID_modelYearPicker").getSelectedKey();
			obj_first.Model = _that.getView().byId("ID_modelDesc").getSelectedKey();

			_that.getRouter().navTo("details", {
				tableFirst: JSON.stringify(obj_first)
			});
		},
		onTable3Press: function (oTableClick) {
			if (oTableClick.getParameters().columnIndex.length == 1) {
				_that.ColumnIndex = "0" + oTableClick.getParameters().columnIndex;
			}
			_that.RowIndex = (Number(oTableClick.getParameters().rowIndex) + 1).toString();
			console.log(_that.RowIndex, _that.ColumnIndex);
			// _that.getRowDataTable1(_that.RowIndex, _that.ColumnIndex);
			var obj_first = {};
			obj_first.MatrixVal = "C" + _that.RowIndex + _that.ColumnIndex;
			obj_first.ModelYear = _that.getView().byId("ID_modelYearPicker").getSelectedKey();
			obj_first.Model = _that.getView().byId("ID_modelDesc").getSelectedKey();

			_that.getRouter().navTo("details", {
				tableFirst: JSON.stringify(obj_first)
			});
		},

		// onBeforeRendering: function () {
		// 	_that.getOwnerComponent().getRouter().attachRoutePatternMatched(_that._oMasterRoute, _that);
		// },

		// _oMasterRoute: function (oEvent) {

		// },

		/*Exit Function for refreshing/resetting view */
		onExit: function () {
			_that.destroy();
			_that.oSelectJSONModel.refresh();
			_that.oGlobalJSONModel.refresh();
		}
	});
});