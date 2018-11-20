var _that;
sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel',
	'toyota/ca/xsaapp/PipelineETAInventSummary/controller/BaseController'
], function (Controller, JSONModel, ResourceModel, BaseController) {
	"use strict";
	return BaseController.extend("toyota.ca.xsaapp.PipelineETAInventSummary.controller.master", {
		/*Initialization of the page data*/
		onInit: function () {
			/* MAIN SERVICE https://tcid1gwapp1.tci.internal.toyota.ca:44300/sap/opu/odata/sap/Z_VEHICLE_MASTER_SRV/ */
			/*EntitySet for pulling series data- zc_mmfields*/
			/*EntitySet for pulling Model data- zc_model*/
			/*EntitySet for pulling series data- zc_exterior_trim*/
			/*for dealer list: https://tcipn1sap01.tci.internal.toyota.ca:51129/API_BUSINESS_PARTNER*/
			_that = this;
			/*Global Model initialization and mapping on view*/
			_that.oGlobalJSONModel = new JSONModel();
			_that.getView().setModel(_that.oGlobalJSONModel, "GlobalJSONModel");

			_that.oGlobalJSONModel.getData().seriesData = [];
			_that.oGlobalJSONModel.getData().modelData = [];
			_that.oGlobalJSONModel.getData().suffixData = [];
			_that.oGlobalJSONModel.getData().DealerList = [];
			_that.oGlobalJSONModel.getData().ModelYearList = [];

			$.ajax({
				dataType: "json",
				url: "/node/Z_VEHICLE_CATALOGUE_SRV/zc_model/?$format=json",
				type: "GET",
				success: function (oData) {
					console.log("Ajax data", oData.d.results);
					_that.oGlobalJSONModel.getData().modelData = oData.d.results;
					_that.oGlobalJSONModel.updateBindings();
				},
				error: function (oError) {}
			});
			$.ajax({
				dataType: "json",
				url: "/node/Z_VEHICLE_CATALOGUE_SRV/zc_mmfields/?$format=json",
				type: "GET",
				success: function (oData) {
					console.log("Ajax data", oData.d.results);
					_that.oGlobalJSONModel.getData().seriesData = oData.d.results;
					_that.oGlobalJSONModel.updateBindings();
				},
				error: function (oError) {}
			}); //Z_VEHICLE_CATALOGUE_TRIM suffixData

			$.ajax({
				dataType: "json",
				url: "/node/Z_VEHICLE_CATALOGUE_SRV/zc_exterior_trim/?$format=json",
				type: "GET",
				success: function (oData) {
					console.log("Ajax data", oData.d.results);
					_that.oGlobalJSONModel.getData().suffixData = oData.d.results;
					_that.oGlobalJSONModel.updateBindings();
				},
				error: function (oError) {}
			});

			var businessData = this.getOwnerComponent().getModel("businessPartnerData");
			console.log("businessData", businessData);
			var odatamodel = this.getOwnerComponent().getModel("odatamodel");
			console.log("odatamodel", odatamodel);

			//zc_exterior_trim  zc_mmfields
			// odatamodel.read("zc_model", {
			// 	success: $.proxy(function (data) {
			// 		console.log(data);
			// 		_that.oGlobalJSONModel.getData().modelData = data.results;
			// 		_that.oGlobalJSONModel.updateBindings();
			// 	}, this),
			// 	error: function (err) {
			// 		console.log(err);
			// 	}
			// });
			// odatamodel.read("/zc_mmfields", {
			// 	success: $.proxy(function (data) {
			// 		console.log(data);
			// 		_that.oGlobalJSONModel.getData().seriesData = data.results;
			// 		_that.oGlobalJSONModel.updateBindings();
			// 	}, this),
			// 	error: function (err) {
			// 		console.log(err);
			// 	}
			// });
			// odatamodel.read("/zc_exterior_trim", {
			// 	success: $.proxy(function (data) {
			// 		console.log(data);
			// 		_that.oGlobalJSONModel.getData().suffixData = data.results;
			// 		_that.oGlobalJSONModel.updateBindings();
			// 	}, this),
			// 	error: function (err) {
			// 		console.log(err);
			// 	}
			// });

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

			_that.oDataService = "/node";

			// 				urlParameters: {
			// 					"$select": "VehicleIdentificationNumber"
			// 				},

			var i18nModel = new ResourceModel({
				bundleName: "toyota.ca.xsaapp.PipelineETAInventSummary.i18n.i18n"
			});
			_that.getView().setModel(i18nModel, "i18nModel");

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

		// click: function () {
		// 	_that.getView().byId("multiheaderColumn").setHeaderSpan([3, 2, 1]);
		// },
		/*For Switching the Pages*/
		selectedScreen: function (oSelectedScreen) {
			var selectedScreenText = oSelectedScreen.getParameters().selectedItem.getText();
			if (selectedScreenText == "Master") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Pipeline ETA & Inventory Summary");
				_that.getRouter().navTo("Routemaster");
			} else if (selectedScreenText == "Details") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Details");
				_that.getRouter().navTo("details");
			} else if (selectedScreenText == "Vehicle Details") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Vehicle Details");
				_that.getRouter().navTo("vehicleDetails");
			} else if (selectedScreenText == "Order Change") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Order Change");
				_that.getRouter().navTo("orderChange");
			} else if (selectedScreenText == "Ship To Dealer") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Ship To Dealer");
				_that.getRouter().navTo("shipToDealer");
			} else if (selectedScreenText == "Ship To Dealer Response") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Ship To Dealer Response");
				_that.getRouter().navTo("shipToDealerResponse");
			} else if (selectedScreenText == "Assign Vehicles") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Assign Vehicles");
				_that.getRouter().navTo("assignVehicles");
			} else if (selectedScreenText == "Assign Vehicles Status") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Assign Vehicles Status");
				_that.getRouter().navTo("assignVehiclesStatus");
			} else if (selectedScreenText == "Change History") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Change History");
				_that.getRouter().navTo("changeHistory");
			}
		},

		/*Funtion to get the changed year*/
		handleYearChange: function (oYearEvent) {
			// oYearEvent.getSource().setMinDate(new Date("2017"));
			// oYearEvent.getSource().setMaxDate(new Date("2019"));
		}
	});
});