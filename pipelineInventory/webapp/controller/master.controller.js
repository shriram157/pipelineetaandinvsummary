var _that;
sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel',
	'pipelineInventory/controller/BaseController'
], function (Controller, JSONModel, ResourceModel, BaseController) {
	"use strict";
	return BaseController.extend("pipelineInventory.controller.master", {
		/*Initialization of the page data*/
		onInit: function () {
			_that = this;

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
			/*Global Model initialization and mapping on view*/
			_that.oGlobalJSONModel = new JSONModel();
			_that.getView().setModel(_that.oGlobalJSONModel, "GlobalJSONModel");
			sap.ui.getCore().setModel(_that.oGlobalJSONModel, "CoreJSONModel");

			_that.oGlobalJSONModel.getData().seriesData = [];
			_that.oGlobalJSONModel.getData().modelData = [];
			_that.oGlobalJSONModel.getData().suffixData = [];
			_that.oGlobalJSONModel.getData().DealerList = [];
			_that.oGlobalJSONModel.getData().ModelYearList = [];

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
			_that.oGlobalJSONModel.getData().ModelYearList = _ObjModelYear.ModelYearList;
			_that.oGlobalJSONModel.updateBindings();
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
					_that.oGlobalJSONModel.getData().DealerList = dealerObj.DealerList;
					_that.oGlobalJSONModel.updateBindings();
					sap.ui.getCore().getModel("CoreJSONModel").updateBindings();
					// _that.getView().byId("multiheader").setHeaderSpan([3, 2, 1]);
				},
				error: function (oError) {}
			});

			$.ajax({
				dataType: "json",
				url: this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/zc_model",
				type: "GET",
				success: function (oData) {
					var modelObj = {
						results: []
					};
					$.each(oData.d.results, function (i, item) {
						if (item.ModelDescriptionEN !== "") {
							modelObj.results.push({
								"ModelDescriptionEN": item.ModelDescriptionEN
							});
						}
					});
					console.log("ModelDescriptionEN", modelObj.results);
					_that.oGlobalJSONModel.getData().modelData = modelObj.results;
					_that.oGlobalJSONModel.updateBindings();
				},
				error: function (oError) {}
			});
			$.ajax({
				dataType: "json",
				url: this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/zc_mmfields",
				type: "GET",
				success: function (oData) {
					var seriesObj = {
						results: []
					};
					$.each(oData.d.results, function (i, item) {
						if (item.TCISeriesDescriptionEN !== "") {
							seriesObj.results.push({
								"TCISeriesDescriptionEN": item.TCISeriesDescriptionEN
							});
						}
					});
					console.log("TCISeriesDescriptionEN", seriesObj.results);
					_that.oGlobalJSONModel.getData().seriesData = seriesObj.results;
					_that.oGlobalJSONModel.updateBindings();
				},
				error: function (oError) {}
			}); //Z_VEHICLE_CATALOGUE_TRIM suffixData

			$.ajax({
				dataType: "json",
				url: this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV/zc_exterior_trim",
				type: "GET",
				success: function (oData) {
					var suffixObj = {
						results: []
					};
					$.each(oData.d.results, function (i, item) {
						if (item.MarktgIntDescEN !== "") {
							suffixObj.results.push({
								"MarktgIntDescEN": item.MarktgIntDescEN,
								"ExteriorColorCode": item.ExteriorColorCode,
								"MarketingDescriptionEXTColorEN": item.MarketingDescriptionEXTColorEN
							});
						}
					});
					console.log("suffix Data", suffixObj.results);
					_that.oGlobalJSONModel.getData().suffixData = suffixObj.results;
					_that.oGlobalJSONModel.updateBindings();
				},
				error: function (oError) {}
			});

			_that.oSelectJSONModel = new JSONModel();
			_that.getView().setModel(_that.oSelectJSONModel, "SelectJSONModel");
			sap.ui.getCore().setModel(_that.oSelectJSONModel, "SelectJSONModel");
			_that.objList = {
				"ListCollection": [{
					DealerNumber: "01092",
					DealerText: "Units planned to arrive future calendar month[s]"
				}, {
					DealerNumber: "01093",
					DealerText: "Units planned to arrive next calendar month"
				}, {
					DealerNumber: "01094",
					DealerText: "Units planned to arrive this calendar month"
				}, {
					DealerNumber: "01093",
					DealerText: "Total Incoming Pipeline [Pre W/S]"
				}, {
					DealerNumber: "01093",
					DealerText: "Units Arrived today"
				}, {
					DealerNumber: "01093",
					DealerText: "Incoming units planned to arrive by: dd/mm/yyyy"
				}],
				"SeriesCollection": [{
					SeriesName: "Series1",
					Dimension: "4X4"
				}, {
					SeriesName: "Series2",
					Dimension: "4X6"
				}, {
					SeriesName: "Series3",
					Dimension: "4X2"
				}],
				"ModelCollection": [{
					ModelName: "Model1",
					Dimension: "4X4",
					SeriesName: "Series1"
				}, {
					ModelName: "Model2",
					Dimension: "4X6",
					SeriesName: "Series2"
				}, {
					ModelName: "Model3",
					Dimension: "4X2",
					SeriesName: "Series3"
				}],
				"ColorCollection": [{
					ColorCode: "000",
					Color: "Black"
				}, {
					ColorCode: "FFF",
					Color: "White"
				}],
				"APXCollection": [{
					APXValue: "00"
				}],
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

		/*Fetch data on apply filter click for all three tables*/
		applyFiltersBtn: function () {
			_that.oSelectJSONModel.setData(_that.objList);
			_that.oSelectJSONModel.updateBindings();
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

		/*Funtion to get the changed year*/
		handleYearChange: function (oYearEvent) {
			// oYearEvent.getSource().setMinDate(new Date("2017"));
			// oYearEvent.getSource().setMaxDate(new Date("2019"));
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

		/*Exit Function for refreshing/resetting view */
		onExit: function () {
			_that.destroy();
			_that.oSelectJSONModel.refresh();
			_that.oGlobalJSONModel.refresh();
		}
	});
});