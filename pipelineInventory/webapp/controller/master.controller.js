var _that, filteredData;
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
				pattern: "yyyy-MM-dd'T'HH:MM:ss"
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
			
			var userData={};
			userData = {
				userContext:{
					userAttributes:{
						DealerCode:["2400001132"],
						Language:["English"],
						UserType:["Z003"]
					}
				}
			};
			
			console.log("userData",userData);
			/*Global Model initialization and mapping on view*/
			_that.oGlobalJSONModel = new JSONModel();
			_that.oBusinessDataModel = new JSONModel();
			_that.oModelYearModel = new JSONModel();
			sap.ui.getCore().setModel(_that.oBusinessDataModel, "BusinessDataModel");
			_that.getView().setModel(_that.oBusinessDataModel, "BusinessDataModel");
			_that.getView().setModel(_that.oModelYearModel, "ModelYearModel");
			_that.getView().setModel(_that.oGlobalJSONModel, "GlobalJSONModel");

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

			// _that.oDataService = "/node";
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/pipelineInventory-dest";
			} else {
				this.sPrefix = "";
			}
			this.nodeJsUrl = this.sPrefix + "/node";

			if (_that.errorFlag == true) {
				sap.m.MessageBox.error(
					_that.oI18nModel.getResourceBundle().getText("ErrorNoData")
				);
			}

			/*Fetching data from Dealer Service */
			$.ajax({
				dataType: "json",
				url: this.nodeJsUrl +
					"/API_BUSINESS_PARTNER/A_BusinessPartner?&$filter=BusinessPartnerType eq 'Z001'&$orderby=BusinessPartnerName",
				type: "GET",
				success: function (oData) {
					// debugger;
					var dealerObj = {
						DealerList: []
					};
					$.each(oData.d.results, function (i, item) {
						var DataLength = item.BusinessPartner.length;
						dealerObj.DealerList.push({
							"BusinessPartner": item.BusinessPartner.substring(5, DataLength),
							"BusinessPartnerName": item.OrganizationBPName1 //item.BusinessPartnerFullName
						});
					});
					_that.oBusinessDataModel.setData(dealerObj);
					_that.oBusinessDataModel.updateBindings(true);
					sap.ui.getCore().getModel("BusinessDataModel").updateBindings();
					// _that.getView().byId("multiheader").setHeaderSpan([3, 2, 1]);
				},
				error: function (oError) {
					_that.errorFlag = true;
				}
			});

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
		},

		onDealerChange: function () {
			// _that.getView().setModel(_that.oGlobalJSONModel, "GlobalJSONModel");
			// _that.oGlobalJSONModel.updateBindings(true);
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
			filteredData = "?$filter=Model eq '" + _that.ID_model +
				"' and Modelyear eq '" + _that.ID_modelYearPicker + "' and TCISeries eq '" + _that.ID_seriesDesc +
				"' and Suffix eq 'AL' and ExteriorColorCode eq '" + _that.ID_ExteriorColorCode + "' and APX eq '" + _that.ID_APXValue +
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
				_that.getRouter().navTo("changeHistory");
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
			var tempNew=[];
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
								"MarktgIntDescEN": _that.temp1[m].int_desc_en,
								"compareField":_that.temp[n].Suffix+_that.temp1[m].int_desc_en
							});
							sap.ui.core.BusyIndicator.hide();
							_that.oGlobalJSONModel.updateBindings(true);
						}
					}
					var b=0;
					_that.oGlobalJSONModel.getData().suffixData.unshift({
						"Suffix": "",
						"SuffixDescriptionEN": "",
						"MarktgIntDescEN": "Please Select"
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
						"ExteriorColorCode": "",
						"MarketingDescriptionEXTColorEN": "Please Select",
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

		fetchMkrtDesc: function (Model, Modelyear, Suffix, SuffixDescriptionEN) {
			$.ajax({
				dataType: "json",
				url: _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/zc_exterior_trim?$filter=ModelYear eq '" + Modelyear +
					"' and Model eq '" + Model + "' and Suffix eq '" + Suffix + "'",
				type: "GET",
				success: function (oData) {
					_that.oGlobalJSONModel.getData().colorData = [];
					console.log("mrketingDesc Data", oData.d);
					// $.each(oData.d.results, function (i, item) {
					for (var n = 0; n < oData.d.results.length; n++) {
						_that.oGlobalJSONModel.getData().colorData.push({
							"Suffix": Suffix,
							"SuffixDescriptionEN": SuffixDescriptionEN,
							"MarktgIntDescEN": oData.d.results[n].MarktgIntDescEN,
							"ExteriorColorCode": oData.d.results[n].ExteriorColorCode,
							"MarketingDescriptionEXTColorEN": oData.d.results[n].MarketingDescriptionEXTColorEN,
							"ColorSelectionCode": oData.d.results[n].ColorSelectionCode
						});
						// });
					}
					sap.ui.core.BusyIndicator.hide();
					console.log(_that.oGlobalJSONModel.getData().colorData);
					_that.oGlobalJSONModel.getData().colorData.unshift({
						"Suffix": "",
						"SuffixDescriptionEN": "Please Select",
						"MarktgIntDescEN": "",
						"ExteriorColorCode": "",
						"MarketingDescriptionEXTColorEN": "Please Select",
						"ColorSelectionCode": ""
					});
					_that.oGlobalJSONModel.updateBindings(true);
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
						"Model": "",
						"ENModelDesc": "Please Select"
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
								sap.ui.core.BusyIndicator.hide();
								_that.oGlobalJSONModel.updateBindings(true);
							}
							b = 0;
						}
						_that.oGlobalJSONModel.updateBindings(true);
					},
					error: function (oError) {
						sap.ui.core.BusyIndicator.hide();
						_that.errorFlag = true;
					}
				});
			}
			_that.oGlobalJSONModel.getData().seriesData.unshift({
				"ModelSeriesNo": "",
				"TCISeriesDescriptionEN": "Please Select"
			});
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
				_that.getRouter().navTo("changeHistory");
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