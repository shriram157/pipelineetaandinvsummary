var _thatDT, clicks, num, numpre;
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
			_thatDT = this;
			clicks = 0;
			_thatDT.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatDT.getView().setModel(_thatDT.oI18nModel, "i18n");

			if (window.location.search == "?language=fr") {
				_thatDT.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				_thatDT.getView().setModel(_thatDT.oI18nModel, "i18n");
				_thatDT.sCurrentLocale = 'FR';
			} else {
				_thatDT.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				_thatDT.getView().setModel(_thatDT.oI18nModel, "i18n");
				_thatDT.sCurrentLocale = 'EN';
			}

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/pipelineInventory-dest";
			} else {
				this.sPrefix = "";
			}
			_thatDT.nodeJsUrl = this.sPrefix + "/node";

			_thatDT.oTable = this.getView().byId("Tab_vehicleDetails");
			_thatDT.oTable.removeSelections();
			_thatDT._oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0,
				enableDropShipBtn: false,
				enableAssignVehicleBtn: false
			});
			_thatDT.getView().setModel(_thatDT._oViewModel, "DetailsLocalModel");
			_thatDT.getOwnerComponent().getRouter().attachRoutePatternMatched(_thatDT._oDetailsRoute, _thatDT);

		},

		_oDetailsRoute: function (oDetailsRoute) {
			sap.ui.core.BusyIndicator.show();
			_thatDT.checkedData = [];
			_thatDT.errorFlag = false;
			_thatDT.oVehicleDetailsJSON = new JSONModel();
			_thatDT.oVehicleDetailsJSON.setData();
			_thatDT.oTable.setModel(_thatDT.oVehicleDetailsJSON, "VehicleDetailsJSON");
			_thatDT.oVehicleDetailsJSON.updateBindings(true);

			_thatDT.oTable = this.getView().byId("Tab_vehicleDetails");
			_thatDT.oTable.removeSelections();

			if (oDetailsRoute.getParameters().arguments.tableFirst != undefined) {
				_thatDT.routedData = JSON.parse(oDetailsRoute.getParameters().arguments.tableFirst);
				console.log("routedData", _thatDT.routedData);

				var url = _thatDT.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/InventoryDetailsSet?$filter=MATRIX eq '" + _thatDT.routedData.MatrixVal +
					"' and Model eq '" + _thatDT.routedData.Model + "' and Modelyear eq '" + _thatDT.routedData.ModelYear + "'and TCISeries eq '" +
					_thatDT
					.routedData.series + "'and Suffix eq '" + _thatDT.routedData.suffix + "'and ExteriorColorCode eq '" + _thatDT.routedData.ExteriorColorCode +
					"'and APX eq '" + _thatDT.routedData.APXValue + "'and ETA eq '" + _thatDT.routedData.ETADate + "'and Dealer eq '" + _thatDT.routedData
					.Dealer +
					"'&$format=json";
				$.ajax({
					dataType: "json",
					url: url,
					type: "GET",
					success: function (oRowData) {
						console.log("oRowData", oRowData);
						sap.ui.core.BusyIndicator.hide();
						_thatDT.oVehicleDetailsJSON.setData(oRowData.d);
						_thatDT.getView().setModel(_thatDT.oVehicleDetailsJSON, "VehicleDetailsJSON");
						sap.ui.getCore().setModel(_thatDT.oVehicleDetailsJSON, "VehicleDetailsJSON");
						_thatDT.oTable.setModel(_thatDT.oVehicleDetailsJSON, "VehicleDetailsJSON");
						_thatDT.oVehicleDetailsJSON.updateBindings(true);

					},
					error: function (oError) {
						sap.ui.core.BusyIndicator.hide();
						_thatDT.errorFlag = true;
					}
				});
			}
			if (_thatDT.errorFlag == true) {
				sap.m.MessageBox.error(
					_thatDT.oI18nModel.getResourceBundle().getText("ErrorNoData")
				);
			}
		},

		formatDate: function (oDate) {
			if (oDate != "" && oDate != undefined) {
				var date = JSON.parse(oDate);
				jQuery.sap.require("sap.ui.core.format.DateFormat");
				_thatDT.oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd"
				});
				return _thatDT.oDateFormat.format(new Date(date));
			}
		},
		/*Show Filtered data as per user input*/
		onApplyFilterBtn: function () {
			// debugger;
			var sQuery = {};
			sQuery.VTN = _thatDT.getView().byId("ID_VTNVal").getValue();
			sQuery.VIN = _thatDT.getView().byId("ID_VINVal").getValue();
			sQuery.tempFilter = (_thatDT.getView().byId("ID_OrderNoVal").getValue()).split("*");
			// if (tempFilter[0] == "*") {
			// 	sQuery.OrderNumberEW = tempFilter[1];
			// } else if (tempFilter[1] == "*") {
			// 	sQuery.OrderNumberSW = tempFilter[0];
			// } else {
			// 	sQuery.OrderNumber = _thatDT.getView().byId("ID_OrderNoVal").getValue();
			// }

			_thatDT.oTable = _thatDT.getView().byId("Tab_vehicleDetails");
			_thatDT.oBinding = _thatDT.oTable.getBinding("items");
			var aFilters = [];
			var newQuery = sQuery.tempFilter;

			// debugger;
			if (sQuery) {
				aFilters.push(new Filter("ZZVTN", sap.ui.model.FilterOperator.Contains, sQuery.VTN));
				aFilters.push(new Filter("VHVIN", sap.ui.model.FilterOperator.Contains, sQuery.VIN));
				var Query;

				if (newQuery[0] == "") {
					Query = newQuery[1];
					aFilters.push(new Filter("ZZDLR_REF_NO", sap.ui.model.FilterOperator.StartsWith, Query));
				} else if (newQuery[1] == "") {
					Query = newQuery[0];
					aFilters.push(new Filter("ZZDLR_REF_NO", sap.ui.model.FilterOperator.EndsWith, Query));
				} else {
					Query = _thatDT.getView().byId("ID_OrderNoVal").getValue();
					aFilters.push(new Filter("ZZDLR_REF_NO", sap.ui.model.FilterOperator.Contains, Query));
				}
				// aFilters = new Filter([
				// 	new Filter("ZZDLR_REF_NO", sap.ui.model.FilterOperator.Contains, sQuery.OrderNumber)
				// ], false);
				// aFilters = new Filter([
				// 	new Filter("ZZDLR_REF_NO", sap.ui.model.FilterOperator.EndsWith, sQuery.OrderNumberEW)
				// ], false);
				// aFilters = new Filter([
				// 	new Filter("ZZDLR_REF_NO", sap.ui.model.FilterOperator.StartsWith, sQuery.OrderNumberSW)
				// ], false);

				var oFilter = new sap.ui.model.Filter({
					aFilters: aFilters,
					bAnd: true,
					_bMultiFilter: true
				});

				_thatDT.oBinding.filter(oFilter);
			} else {
				_thatDT.oBinding.filter([]);
			}
			// var sQuery = sQuery.length;
			// if (sQuery && sQuery.length > 0) {
			// 	aFilters = new Filter([
			// 		new Filter("ZZVTN", sap.ui.model.FilterOperator.Contains, sQuery)
			// 	], false);
			// 	_thatDT.oBinding.filter(aFilters);
			// } else {
			// 	_thatDT.oBinding.filter([]);
			// }
			// _thatDT.getView().setModel(_thatDT.oVehicleDetailsJSON, "VehicleDetailsJSON");
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
				// _thatDT.oVehicleDetailsJSON.setData();
				_thatDT.oVehicleDetailsJSON.refresh(true);
				_thatDT.getRouter().navTo("Routemaster");
			} else if (selectedScreenText == "Details") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Details");
				_thatDT.getRouter().navTo("details");
			} else if (selectedScreenText == "Vehicle Details") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Vehicle Details");
				_thatDT.getRouter().navTo("vehicleDetails");
			} else if (selectedScreenText == "Order Change") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Order Change");
				_thatDT.getRouter().navTo("orderChange");
			} else if (selectedScreenText == "Ship To Dealer") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Ship To Dealer");
				_thatDT.getRouter().navTo("shipToDealer");
			} else if (selectedScreenText == "Ship To Dealer Response") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Ship To Dealer Response");
				_thatDT.getRouter().navTo("shipToDealerResponse");
			} else if (selectedScreenText == "Assign Vehicles") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Assign Vehicles");
				_thatDT.getRouter().navTo("assignVehicles");
			} else if (selectedScreenText == "Assign Vehicles Status") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Assign Vehicles Status");
				_thatDT.getRouter().navTo("assignVehiclesStatus");
			} else if (selectedScreenText == "Change History") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Change History");
				_thatDT.getRouter().navTo("changeHistory");
			}
		},

		/*Function for Routing/Navigating from menu option as per selection */
		onMenuLinkPress: function (oLink) {
			var _oLinkPressed = oLink;
			var _oSelectedScreen = _oLinkPressed.getSource().getProperty("text");
			if (_oSelectedScreen == _thatDT.oI18nModel.getResourceBundle().getText("PageTitle")) {
				_thatDT.oVehicleDetailsJSON.setData();
				_thatDT.oVehicleDetailsJSON.updateBindings(true);
				_thatDT.getRouter().navTo("Routemaster");
			} else if (_oSelectedScreen == _thatDT.oI18nModel.getResourceBundle().getText("VehicleDetails")) {
				_thatDT.getRouter().navTo("vehicleDetailsNodata");
			} else if (_oSelectedScreen == _thatDT.oI18nModel.getResourceBundle().getText("ChangeHistory")) {
				_thatDT.getRouter().navTo("changeHistory");
			}
		},

		vehicleSelect: function (oVUID) {
			oVUID.getParameters().listItem.getBindingContext("VehicleDetailsJSON").getProperty(oVUID.getParameters().listItem.getBindingContext(
				"VehicleDetailsJSON").getPath()).__metadata = "";
			_thatDT.checkedData.push(oVUID.getParameters().listItem.getBindingContext("VehicleDetailsJSON").getProperty(oVUID.getParameters().listItem
				.getBindingContext("VehicleDetailsJSON").getPath()));
		},

		navToDropShipVehicles: function () {
			sap.ui.core.BusyIndicator.hide();
			_thatDT.getRouter().navTo("shipToDealer", {
				vehicleData: JSON.stringify(_thatDT.checkedData)
			});
		},
		navToAssignVehicles: function () {
			_thatDT.getRouter().navTo("shipToDealer", {
				vehicleData: JSON.stringify(_thatDT.checkedData)
			});
		},

		callPreviousRowCount: function () {
			clicks -= 1;
			if (clicks <= 0) {
				num = 0;
			} else {
				num = clicks * 5;
			}
			if (num < _thatDT.count) {
				var Btn = _thatDT.getView().byId("btnNext");
				Btn.setEnabled(true);
			}
			if (num === 0) {
				var Btn2 = _thatDT.getView().byId("btnPrevious");
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
			if (num === _thatDT.count) {
				var Btn = _thatDT.getView().byId("btnNext");
				Btn.setEnabled(false);
			}
			if (num >= 5) {
				var Btn2 = _thatDT.getView().byId("btnPrevious");
				Btn2.setEnabled(true);
			}
			this.data();
		},

		data: function () {
			var url = _thatDT.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/InventoryDetailsSet?$filter=MATRIX eq '" + _thatDT.routedData.MatrixVal +
				"' and Model eq '" + _thatDT.routedData.Model + "' and Modelyear eq '" + _thatDT.routedData.ModelYear + "'&$top=5&$skip='" +
				Number(
					num) + "'";
			$.ajax({
				dataType: "json",
				url: url,
				type: "GET",
				success: function (oRowData) {
					console.log("oRowData", oRowData);
					_thatDT.oVehicleDetailsJSON.setData(oRowData.d);
					_thatDT.oVehicleDetailsJSON.updateBindings(true);
				},
				error: function (oError) {
					// sap.ui.core.BusyIndicator.hide();
					// _thatDT.errorFlag = true;
				}
			});
		},

		onVTNChange: function (oVTNVal) {
			_thatDT.oTable = _thatDT.getView().byId("Tab_vehicleDetails");
			_thatDT.oBinding = _thatDT.oTable.getBinding("items");
			var aFilters = [];
			var sQuery = oVTNVal.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				aFilters = new Filter([
					new Filter("ZZVTN", sap.ui.model.FilterOperator.Contains, sQuery)
				], false);
				_thatDT.oBinding.filter(aFilters);
			} else {
				_thatDT.oBinding.filter([]);
			}
		},
		onVINChange: function (oVINVal) {
			// add filter for search
			// debugger;
			_thatDT.oTable = _thatDT.getView().byId("Tab_vehicleDetails");
			_thatDT.oBinding = _thatDT.oTable.getBinding("items");
			var aFilters = [];
			var sQuery = oVINVal.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				aFilters = new Filter([
					new Filter("VHVIN", sap.ui.model.FilterOperator.Contains, sQuery)
				], false);
				_thatDT.oBinding.filter(aFilters);
			} else {
				_thatDT.oBinding.filter([]);
			}
		},
		onWildCardSearch: function (oWildCardVal) {
			// add filter for search
			_thatDT.oTable = _thatDT.getView().byId("Tab_vehicleDetails");
			_thatDT.oBinding = _thatDT.oTable.getBinding("items");
			var aFilters = [];
			var tempFilter = oWildCardVal.getSource().getValue();

			var sQuery = tempFilter.split("*");
			var Query;
			if (sQuery.length > 0) {
				if (sQuery[0] == "") {
					Query = sQuery[1];
					aFilters = new Filter([
						new Filter("ZZDLR_REF_NO", sap.ui.model.FilterOperator.StartsWith, Query)
					], false);
				} else if (sQuery[1] == "") {
					Query = sQuery[0];
					aFilters = new Filter([
						new Filter("ZZDLR_REF_NO", sap.ui.model.FilterOperator.EndsWith, Query)
					], false);
				} else {
					Query = _thatDT.getView().byId("ID_OrderNoVal").getValue();
					aFilters = new Filter([
						new Filter("ZZDLR_REF_NO", sap.ui.model.FilterOperator.Contains, Query)
					], false);
				}
				_thatDT.oBinding.filter(aFilters);
			} else {
				_thatDT.oBinding.filter([]);
			}

			// sQuery = sQuery.replace("*", "%");
			// debugger;
			// if (sQuery && sQuery.length > 0) {
			// 	aFilters = new Filter([
			// 		new Filter("ZZDLR_REF_NO", sap.ui.model.FilterOperator.EQ, sQuery)
			// 	], false);
			// 	_thatDT.oBinding.filter(aFilters);
			// } else {
			// 	_thatDT.oBinding.filter([]);
			// }
		},

		onDataExport: function (oEvent) {
			var data = _thatDT.getView().getModel("VehicleDetailsJSON").getData();
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
			_thatDT.oVehicleDetailsJSON.refresh();
			this.destroy();
		}
	});
});