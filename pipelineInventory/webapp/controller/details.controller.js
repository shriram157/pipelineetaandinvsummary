var _thatDT, clicks, num, numpre;
sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/model/resource/ResourceModel',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/Filter',
	"sap/ui/core/routing/History",
	"sap/m/MessageBox"
], function (BaseController, ResourceModel, JSONModel, Filter, History, MessageBox) {
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
				_thatDT.sPrefix = "/pipelineInventory-dest";
			} else {
				_thatDT.sPrefix = "";
			}
			_thatDT.nodeJsUrl = _thatDT.sPrefix + "/node";

			_thatDT.oTable = _thatDT.getView().byId("Tab_vehicleDetails");
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
			_thatDT.getView().setBusy(false);
			sap.ui.core.BusyIndicator.show();
			_thatDT.checkedData = [];
			_thatDT.errorFlag = false;
			_thatDT.oVehicleDetailsJSON = new JSONModel();
			_thatDT.oVehicleDetailsJSON.setData();
			_thatDT.oTable.setModel(_thatDT.oVehicleDetailsJSON, "VehicleDetailsJSON");
			_thatDT.oVehicleDetailsJSON.updateBindings(true);

			_thatDT.oTable = _thatDT.getView().byId("Tab_vehicleDetails");
			_thatDT.oTable.removeSelections();

			if (oDetailsRoute.getParameters().arguments.tableFirst != undefined) {
				_thatDT.routedData = JSON.parse(oDetailsRoute.getParameters().arguments.tableFirst);
				console.log("routedData", _thatDT.routedData);

				_thatDT.SelectedDealer = _thatDT.routedData.Dealer;
				_thatDT.UserType = _thatDT.routedData.userType;

				var url = _thatDT.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/InventoryDetailsSet?$filter=MATRIX eq '" + _thatDT.routedData.MatrixVal +
					"' and Model eq '" + _thatDT.routedData.Model + "' and Modelyear eq '" + _thatDT.routedData.ModelYear + "'and TCISeries eq '" +
					_thatDT.routedData.series + "'and Suffix eq '" + _thatDT.routedData.suffix + "'and ExteriorColorCode eq '" + _thatDT.routedData.ExteriorColorCode +
					"'and APX eq '" + _thatDT.routedData.APXValue + "'and ETA eq '" + _thatDT.routedData.ETADate + "'and Dealer eq '" + _thatDT.routedData
					.Dealer +
					"'and UserType eq '" + _thatDT.UserType + "' &$format=json";
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
				var Year = oDate.substring(0, 4);
				var Month = oDate.substring(4, 6);
				var Day = oDate.substring(6, 8);
				var date = Year + "-" + Month + "-" + Day;
				return date;
			}
		},

		handleSettingsConfirm: function (oEvent) {
			//debugger;
			var oTable = _thatDT.getView().byId("Tab_vehicleDetails");

			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("items");
			var sPath;
			var bDescending;
			var vGroup;
			var aSorters = [];
			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				vGroup = _thatDT.mGroupFunctions[sPath];
				aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, vGroup));
			}

			if (mParams.sortItem) {
				sPath = mParams.sortItem.getKey();
				bDescending = mParams.sortDescending;
				aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
			}
			oBinding.sort(aSorters);

			// apply filters to binding
			var aFilters = [];
			//debugger;
			var sOperator;
			jQuery.each(mParams.filterItems, function (i, oItem) {
				sOperator = "Contains";
				//console.log(that.oTable.getBinding().oList);
				var sPath2 = oItem.getKey();
				var sValue1 = oItem.getText();
				var sValue2 = oItem.getText();
				var oFilter = new Filter(sPath2, sOperator, sValue1, sValue2);
				aFilters.push(oFilter);

			});
			oBinding.filter(aFilters);
			// oView.byId("invFilterBar").setVisible(aFilters.length > 0);
			// oView.byId("invFilterLabel").setText(mParams.filterString);
		},
		// closeNotifBar: function () {
		// 	var oTable = _thatDT.getView().byId("Tab_vehicleDetails");
		// 	_thatDT.getView().byId("invFilterBar").setVisible(false);
		// 	var oBinding = oTable.getBinding("items");
		// 	oBinding.filter([]);
		// },
		handleFiltersDialog: function (oDialogEvent) {
			if (!_thatDT._oSettingsDialog) {
				_thatDT._oSettingsDialog = sap.ui.xmlfragment("pipelineInventory.view.fragments.filterSettings", _thatDT);
				_thatDT.getView().addDependent(_thatDT._oSettingsDialog);
				_thatDT.setModel(_thatDT.VehicleDetailsJSON, "VehicleDetailsJSON");
			}
			_thatDT._oSettingsDialog.open();
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
					bAnd: false,
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
			// _thatDT.getView().setModel((sap.ui.getCore().getModel("VehicleDetailsJSON")), "VehicleDetailsJSON");
		},

		/*Navigate to Vehicle Details page*/
		onNavigateToVL: function (oNavEvent) {
			var Data = oNavEvent.getSource().getModel("VehicleDetailsJSON").getProperty(oNavEvent.getSource().getBindingContext(
				"VehicleDetailsJSON").sPath);
			Data.Suffix = Data.Suffix.replace("/", "%2F");
			Data.__metadata = "";
			_thatDT.getRouter().navTo("vehicleDetails", {
				VCData: JSON.stringify(Data)

			});
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
				if (_thatDT.SelectedDealer != undefined) {
					_thatDT.getRouter().navTo("changeHistory", {
						SelectedDealer: _thatDT.SelectedDealer
					});
				}
			} else if (_oSelectedScreen == _thatDT.oI18nModel.getResourceBundle().getText("Back")) {
				var oHistory = History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					_thatDT.getRouter().navTo("Routemaster");
				}
			}
		},

		vehicleSelect: function (oVUID) {
			if (oVUID.getParameters().selected == true) {
				oVUID.getParameters().listItem.getBindingContext("VehicleDetailsJSON").getProperty(oVUID.getParameters().listItem.getBindingContext(
					"VehicleDetailsJSON").getPath()).__metadata = "";

				var checkedItem = oVUID.getParameters().listItem.getBindingContext("VehicleDetailsJSON").getProperty(oVUID.getParameters().listItem
					.getBindingContext("VehicleDetailsJSON").getPath());
				if (checkedItem.DropShip == true) {
					_thatDT._oViewModel.setProperty("/enableDropShipBtn", true);
				} else {
					_thatDT._oViewModel.setProperty("/enableDropShipBtn", false);
				}
				if (checkedItem.AssignVehicle == true) {
					_thatDT._oViewModel.setProperty("/enableAssignVehicleBtn", true);
				} else {
					_thatDT._oViewModel.setProperty("/enableAssignVehicleBtn", false);
				}
			} else {
				_thatDT._oViewModel.setProperty("/enableDropShipBtn", false);
				_thatDT._oViewModel.setProperty("/enableAssignVehicleBtn", false);
			}
			// enableDropShipBtn: false,
			// enableAssignVehicleBtn: false

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
			_thatDT.getRouter().navTo("assignVehicles", {
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
			_thatDT.data();

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
			_thatDT.data();
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
		},

		onDataExport: function (oEvent) {
			var data;
			if (_thatDT.getView().getModel("VehicleDetailsJSON") != undefined) {
				data = _thatDT.getView().getModel("VehicleDetailsJSON").getData();
			} else {
				data = _thatDT.getView().byId("Tab_vehicleDetails").getModel("VehicleDetailsJSON").getData();
			}
			_thatDT.JSONToExcelConvertor(data, "Report", true);
		},
		JSONToExcelConvertor: function (JSONData, ReportTitle, ShowLabel) {
			var arrData = typeof JSONData.results != 'object' ? JSON.parse(JSONData.results) : JSONData.results;
			var CSV = "";
			if (ShowLabel) {
				var row = "";
				row = row.slice(0, -1);
			}

			row += '"Dealer",';
			row += '"Order Number",';
			row += '"Order Type",';
			row += '"Status",';
			row += '"VIN",';
			row += '"VTN",';
			row += '"Model EN",';
			row += '"Suffix EN",';
			row += '"Colour EN",';
			row += '"ETAFrom",';
			row += '"ETATo",';

			CSV += row + '\r\n';

			//loop is to extract each row
			for (var i = 0; i < arrData.length; i++) {
				var row = "";
				row += '"' + arrData[i].Dealer + '","' + arrData[i].ZZDLR_REF_NO + '","' + arrData[i].ZZORDERTYPE + "-" + arrData[i].ORDERTYPE_DESC_EN +
					'","' + arrData[i].ZMMSTA + '","' + arrData[i].ZZVTN + '","' + arrData[i].VHVIN + '","' + arrData[i].Model + "-" + arrData[i].MODEL_DESC_EN +
					'","' + arrData[i].Suffix +
					"-" + arrData[i].SUFFIX_DESC_EN + '","' + arrData[i].ExteriorColorCode + "-" + arrData[i].EXTCOL_DESC_EN + '","' + arrData[i].ETAFrom +
					'","' + arrData[i].ETATo + '",';
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
			_thatDT.destroy();
		}
	});
});