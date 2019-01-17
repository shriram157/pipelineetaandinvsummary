var _that, clicks, num, numpre;
sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/model/resource/ResourceModel',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/Filter',
	"sap/m/MessageBox"
], function (BaseController, ResourceModel, JSONModel, Filter, MessageBox) {
	"use strict";

	return BaseController.extend("pipelineInventory.controller.details", {
		onInit: function () {
			_that = this;
			clicks = 0;
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

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/pipelineInventory-dest";
			} else {
				this.sPrefix = "";
			}
			_that.nodeJsUrl = this.sPrefix + "/node";
			
			_that.oTable = this.getView().byId("Tab_vehicleDetails");
			_that.oTable.removeSelections();

			_that.getOwnerComponent().getRouter().attachRoutePatternMatched(_that._oDetailsRoute, _that);

		},

		_oDetailsRoute: function (oDetailsRoute) {
			sap.ui.core.BusyIndicator.show();
			_that.checkedData = [];
			_that.errorFlag = false;
			_that.oVehicleDetailsJSON = new JSONModel();
			
			_that.oTable = this.getView().byId("Tab_vehicleDetails");
			_that.oTable.removeSelections();

			if (oDetailsRoute.getParameters().arguments.tableFirst != undefined) {
				_that.routedData = JSON.parse(oDetailsRoute.getParameters().arguments.tableFirst);
				console.log("routedData", _that.routedData);

				var url = _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/InventoryDetailsSet?$filter=MATRIX eq '" + _that.routedData.MatrixVal +
					"' and Model eq '" + _that.routedData.Model + "' and Modelyear eq '" + _that.routedData.ModelYear + "'&$format=json";
				$.ajax({
					dataType: "json",
					url: url,
					type: "GET",
					success: function (oRowData) {
						console.log("oRowData", oRowData);
						_that.oVehicleDetailsJSON.setData(oRowData.d);
						_that.getView().setModel(_that.oVehicleDetailsJSON, "VehicleDetailsJSON");
						sap.ui.getCore().setModel(_that.oVehicleDetailsJSON, "VehicleDetailsJSON");
						_that.oVehicleDetailsJSON.updateBindings(true);
						sap.ui.core.BusyIndicator.hide();
					},
					error: function (oError) {
						sap.ui.core.BusyIndicator.hide();
						_that.errorFlag = true;
					}
				});
			}
			if (_that.errorFlag == true) {
				sap.m.MessageBox.error(
					_that.oI18nModel.getResourceBundle().getText("ErrorNoData")
				);
			}
		},
		/*Show Filtered data as per user input*/
		onApplyFilterBtn: function () {
			this.getView().setModel(_that.oVehicleDetailsJSON, "VehicleDetailsJSON");
			// this.getView().setModel((sap.ui.getCore().getModel("VehicleDetailsJSON")), "VehicleDetailsJSON");
		},

		/*Navigate to Vehicle Details page*/
		onNavigateToVL: function (oNavEvent) {
			this.getRouter().navTo("vehicleDetails", {
				OrderNumber: oNavEvent.getSource().getModel("VehicleDetailsJSON").getProperty(oNavEvent.getSource().getBindingContext(
					"VehicleDetailsJSON").sPath).VHCLE
			});
		},

		selectedScreen: function (oSelectedScreen) {
			var selectedScreenText = oSelectedScreen.getParameters().selectedItem.getText();
			if (selectedScreenText == "Master") {
				_that.oVehicleDetailsJSON.setData();
				_that.oVehicleDetailsJSON.updateBindings(true);
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

		/*Function for Routing/Navigating from menu option as per selection */
		onMenuLinkPress: function (oLink) {
			var _oLinkPressed = oLink;
			var _oSelectedScreen = _oLinkPressed.getSource().getProperty("text");
			if (_oSelectedScreen == _that.oI18nModel.getResourceBundle().getText("PageTitle")) {
				_that.oVehicleDetailsJSON.setData();
				_that.oVehicleDetailsJSON.updateBindings(true);
				_that.getRouter().navTo("Routemaster");
			} else if (_oSelectedScreen == _that.oI18nModel.getResourceBundle().getText("VehicleDetails")) {
				_that.getRouter().navTo("vehicleDetailsNodata");
			} else if (_oSelectedScreen == _that.oI18nModel.getResourceBundle().getText("ChangeHistory")) {
				_that.getRouter().navTo("changeHistory");
			}
		},

		vehicleSelect: function (oVUID) {
			oVUID.getParameters().listItem.getBindingContext("VehicleDetailsJSON").getProperty(oVUID.getParameters().listItem.getBindingContext(
				"VehicleDetailsJSON").getPath()).__metadata = "";
			_that.checkedData.push(oVUID.getParameters().listItem.getBindingContext("VehicleDetailsJSON").getProperty(oVUID.getParameters().listItem
				.getBindingContext("VehicleDetailsJSON").getPath()));
		},

		navToDropShipVehicles: function () {
			sap.ui.core.BusyIndicator.hide();
			_that.getRouter().navTo("shipToDealer", {
				vehicleData: JSON.stringify(_that.checkedData)
			});
		},
		navToAssignVehicles: function () {
			_that.getRouter().navTo("shipToDealer", {
				vehicleData: JSON.stringify(_that.checkedData)
			});
		},

		callPreviousRowCount: function () {
			clicks -= 1;
			if (clicks <= 0) {
				num = 0;
			} else {
				num = clicks * 5;
			}
			if (num < _that.count) {
				var Btn = _that.getView().byId("btnNext");
				Btn.setEnabled(true);
			}
			if (num === 0) {
				var Btn2 = _that.getView().byId("btnPrevious");
				Btn2.setEnabled(false);
			}
			this.data();

		},
		callNextRowCount: function () {
			if (clicks < 0) {
				clicks = 0;
				clicks += 1;
			} else {
				clicks += 1;
			}
			num = clicks * 5;
			// count1;		
			if (num === _that.count) {
				var Btn = _that.getView().byId("btnNext");
				Btn.setEnabled(false);
			}
			if (num >= 5) {
				var Btn2 = _that.getView().byId("btnPrevious");
				Btn2.setEnabled(true);
			}
			this.data();
		},

		data: function () {
			var url = _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/InventoryDetailsSet?$filter=MATRIX eq '" + _that.routedData.MatrixVal +
				"' and Model eq '" + _that.routedData.Model + "' and Modelyear eq '" + _that.routedData.ModelYear + "'&$top=5&$skip='" + Number(
					num) + "'";
			$.ajax({
				dataType: "json",
				url: url,
				type: "GET",
				success: function (oRowData) {
					console.log("oRowData", oRowData);
					_that.oVehicleDetailsJSON.setData(oRowData.d);
					_that.oVehicleDetailsJSON.updateBindings(true);
				},
				error: function (oError) {
					// sap.ui.core.BusyIndicator.hide();
					// _that.errorFlag = true;
				}
			});
		},

		onVTNChange: function (oVTNVal) {
			_that.oTable = _that.getView().byId("Tab_vehicleDetails");
			_that.oBinding = _that.oTable.getBinding("items");
			var aFilters = [];
			var sQuery = oVTNVal.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				aFilters = new Filter([
					new Filter("ZZVTN", sap.ui.model.FilterOperator.Contains, sQuery)
				], false);
				_that.oBinding.filter(aFilters);
			} else {
				_that.oBinding.filter([]);
			}
		},
		onVINChange: function (oVINVal) {
			// add filter for search
			// debugger;
			_that.oTable = _that.getView().byId("Tab_vehicleDetails");
			_that.oBinding = _that.oTable.getBinding("items");
			var aFilters = [];
			var sQuery = oVINVal.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				aFilters = new Filter([
					new Filter("VHVIN", sap.ui.model.FilterOperator.Contains, sQuery)
				], false);
				_that.oBinding.filter(aFilters);
			} else {
				_that.oBinding.filter([]);
			}
		},
		onWildCardSearch: function (oWildCardVal) {
			// add filter for search
			_that.oTable = _that.getView().byId("Tab_vehicleDetails");
			_that.oBinding = _that.oTable.getBinding("items");
			var aFilters = [];
			var sQuery = oWildCardVal.getSource().getValue();
			sQuery = sQuery.replace("*", "%");
				// debugger;
			if (sQuery && sQuery.length > 0) {
				aFilters = new Filter([
					new Filter("ZZDLR_REF_NO", sap.ui.model.FilterOperator.EQ, sQuery)
				], false);
				_that.oBinding.filter(aFilters);
			} else {
				_that.oBinding.filter([]);
			}

		},

		onDataExport: function (oEvent) {
			var data = _that.getView().getModel("VehicleDetailsJSON").getData();
			this.JSONToExcelConvertor(data, "Report", true);
		},
		JSONToExcelConvertor: function (JSONData, ReportTitle, ShowLabel) {
			var arrData = typeof JSONData.results != 'object' ? JSON.parse(JSONData.results) : JSONData.results;
			var CSV = "";
			if (ShowLabel) {
				var row = "";
				row = row.slice(0, -1);
			}
			row += '"Dealer",';
			row += '"ETA",';
			row += '"ETAFrom",';
			row += '"ETATo",';
			row += '"Colour EN",';
			row += '"Colour FR",';
			row += '"Model EN",';
			row += '"Model FR",';
			row += '"SUffix EN",';
			row += '"Suffix FR",';
			row += '"VIN",';
			row += '"Order Number",';
			row += '"Order Type",';
			row += '"VTN",';

			CSV += row + '\r\n';

			//loop is to extract each row
			for (var i = 0; i < arrData.length; i++) {
				var row = "";
				row += '"' + arrData[i].Dealer + '","' + arrData[i].ETA + '","' + arrData[i].ETAFrom + '","' + arrData[i].ETATo + '","' + arrData[
						i].ExteriorColorCode + "-" + arrData[i].EXTCOL_DESC_EN +
					'","' + arrData[i].ExteriorColorCode + "-" + arrData[i].EXTCOL_DESC_FR + '","' + arrData[i].Model + "-" + arrData[i].MODEL_DESC_EN +
					'","' + arrData[i].Model + "-" + arrData[i].MODEL_DESC_FR +
					'","' + arrData[i].Suffix + "-" + arrData[i].SUFFIX_DESC_EN + '","' + arrData[i].Suffix + "-" + arrData[i].SUFFIX_DESC_FR + '","' +
					arrData[i].VHVIN + '","' + arrData[i].ZZDLR_REF_NO +
					'","' + arrData[i].ZZORDERTYPE + '","' + arrData[i].ZZVTN + '",';
				//}
				row.slice(1, row.length);
				CSV += row + '\r\n';
			}
			if (CSV == "") {
				alert("Invalid data");
				return;
			}
			var fileName = "VehicleDetailsReport_";
			fileName += ReportTitle.replace(/ /g, "_");
			// Initialize file format you want csv or xls

			var blob = new Blob(["\ufeff" + CSV], {
				type: "text/csv;charset=utf-8,"
			});
			if (sap.ui.Device.browser.name === "ie" || sap.ui.Device.browser.name === "ed") { // IE 10+ , Edge (IE 12+)
				navigator.msSaveBlob(blob, "VehicleDetailsReport.csv");
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
		/*Exit Function for refreshing/resetting view */
		onExit: function () {
			_that.checkedData = [];
			_that.destroy();
			_that.oVehicleDetailsJSON.refresh();
		}
	});
});