sap.ui.define([
	'pipelineInventory/controller/BaseController',
	'sap/ui/model/resource/ResourceModel',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/Filter',
	"sap/ui/core/routing/History",
	"sap/m/MessageBox"
], function (BaseController, ResourceModel, JSONModel, Filter, History, MessageBox) {
	"use strict";
	var _thatDT, clicks, num, numpre, sSelectedLocale, Division, DivUser, localLang;
	return BaseController.extend("pipelineInventory.controller.details", {
		onInit: function () {
			_thatDT = this;
			clicks = 0;
			_thatDT.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatDT.getView().setModel(_thatDT.oI18nModel, "i18n");

			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				sSelectedLocale = "EN"; // default is english 
			}
			if (sSelectedLocale == "fr") {
				_thatDT.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				this.getView().setModel(_thatDT.oI18nModel, "i18n");
				this.sCurrentLocale = 'FR';
				localLang = "F";
			} else {
				_thatDT.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(_thatDT.oI18nModel, "i18n");
				this.sCurrentLocale = 'EN';
				localLang = "E";
			}

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				_thatDT.sPrefix = "/pipelineInventory-dest";
			} else {
				_thatDT.sPrefix = "";
			}
			_thatDT.nodeJsUrl = _thatDT.sPrefix + "/node";
			/*Logic for logo change depending upon Toyota and Lexus users*/
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

			_thatDT.oTable = _thatDT.getView().byId("Tab_vehicleDetails");
			_thatDT.oTable.removeSelections();
			_thatDT._oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0,
				enableDropShipBtn: false,
				enableAssignVehicleBtn: false,
				visibleForZoneOnly: false
			});

			_thatDT.getView().setModel(_thatDT._oViewModel, "DetailsLocalModel");
			_thatDT.getOwnerComponent().getRouter().attachRoutePatternMatched(_thatDT._oDetailsRoute, _thatDT);

		},

		afterConfigLoad: function () {
			if (localLang === "F") {
				$(".sapMGrowingListTriggerText>.sapMSLITitle")[0].innerHTML = "Plus";
			} else {
				$(".sapMGrowingListTriggerText>.sapMSLITitle")[0].innerHTML = "More";
			}
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
			_thatDT.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatDT.getView().setModel(_thatDT.oI18nModel, "i18n");

			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				sSelectedLocale = "EN"; // default is english 
			}
			if (sSelectedLocale == "fr") {
				_thatDT.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				this.getView().setModel(_thatDT.oI18nModel, "i18n");
				this.sCurrentLocale = 'FR';
			} else {
				_thatDT.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(_thatDT.oI18nModel, "i18n");
				this.sCurrentLocale = 'EN';
			}

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				_thatDT.sPrefix = "/pipelineInventory-dest";
			} else {
				_thatDT.sPrefix = "";
			}
			_thatDT.nodeJsUrl = _thatDT.sPrefix + "/node";
			/*Logic for logo change depending upon Toyota and Lexus users*/
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

			_thatDT.oTable = _thatDT.getView().byId("Tab_vehicleDetails");
			_thatDT.oTable.removeSelections();

			var dealerData = sap.ui.getCore().getModel("BusinessDataModel").getData();
			console.log("dealerData", dealerData);
			if (dealerData._TCIZoneAdmin == "AdminUser") {
				_thatDT._oViewModel.setProperty("/enableAssignVehicleBtn", true);
				_thatDT._oViewModel.setProperty("/visibleForZoneOnly", true);
				_thatDT._oViewModel.setProperty("/enableDropShipBtn", true);
			} else if (dealerData._TCIZoneAdmin == "ZoneONLY") {
				_thatDT._oViewModel.setProperty("/enableAssignVehicleBtn", true);
				_thatDT._oViewModel.setProperty("/visibleForZoneOnly", true);
				_thatDT._oViewModel.setProperty("/enableDropShipBtn", false);
			} else {
				_thatDT._oViewModel.setProperty("/enableAssignVehicleBtn", false);
				_thatDT._oViewModel.setProperty("/visibleForZoneOnly", false);
				_thatDT._oViewModel.setProperty("/enableDropShipBtn", false);
			}

			if (oDetailsRoute.getParameters().arguments.tableFirst != undefined) {
				_thatDT.routedData = JSON.parse(oDetailsRoute.getParameters().arguments.tableFirst);

				_thatDT.SelectedDealer = _thatDT.routedData.Dealer;
				_thatDT.routedData.series = _thatDT.routedData.series.replace("%2F", "/");
				_thatDT.UserType = _thatDT.routedData.userType;
				_thatDT.salesOffice = _thatDT.routedData.salesOffice;

				function removeDuplicates(array) {
					var obj = {};
					for (var i = 0, len = array.values.length; i < len; i++)
						obj[array.values[i]['AccessInstl_flag2']] = array.values[i];

					array.values = new Array();
					for (var key in obj)
						array.values.push(obj[key]);
					return array;
				}
				var modelYear = "";

				if (sap.ui.getCore().getModel("BusinessDataModel").getData()._TCIDealerUser == "DealerONLY" && _thatDT.routedData.ModelYear.indexOf(
						"+") > -1) {
					var modelyearString = _thatDT.routedData.ModelYear.split("+");
					modelYear = "(Modelyear ge '" + modelyearString[0] + "' and Modelyear le '" + modelyearString[1] + "')";
				} else {
					modelYear = "Modelyear eq '" + _thatDT.routedData.ModelYear + "'";
				}

				var url = _thatDT.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/InventoryDetailsSet?$filter=Division eq '" + DivUser +
					"' and VKBUR eq '" + _thatDT.salesOffice +
					"' and MATRIX eq '" + _thatDT.routedData.MatrixVal +
					"' and Model eq '" + _thatDT.routedData.Model + "' and INTCOL eq '" + _thatDT.routedData.intcolor + "' and " + modelYear +
					" and TCISeries eq '" +
					_thatDT.routedData.series + "'and Suffix eq '" + _thatDT.routedData.suffix + "'and ExteriorColorCode eq '" + _thatDT.routedData.ExteriorColorCode +
					"'and APX eq '" + _thatDT.routedData.APXValue + "'and ETA eq '" + _thatDT.routedData.ETADate + "'and Dealer eq '" + _thatDT.routedData
					.Dealer +
					"'and UserType eq '" + _thatDT.UserType + "' and LANGUAGE eq '" + localLang + "' &$format=json";
				$.ajax({
					dataType: "json",
					url: url,
					type: "GET",
					success: function (oRowData) {
						sap.ui.core.BusyIndicator.hide();
						$.each(oRowData.d.results, function (key, value) {
							if (value.AccessInstl_flag === true) {
								value.AccessInstl_flag2 = "Y";
							} else {
								//if (value.AccessInstl_flag == false) {
								value.AccessInstl_flag2 = "N";
							}
						});
						console.log("rowdata", oRowData.d);
						_thatDT.oVehicleDetailsJSON.setData(oRowData.d);
						_thatDT.oVehicleDetailsJSON.getData().accessoryFilter = oRowData.d.results;
						// removeDuplicates(_thatDT.oVehicleDetailsJSON.getData().accessoryFilter);
						console.log("_thatDT.oVehicleDetailsJSON", _thatDT.oVehicleDetailsJSON);
						_thatDT.getView().setModel(_thatDT.oVehicleDetailsJSON, "VehicleDetailsJSON");
						sap.ui.getCore().setModel(_thatDT.oVehicleDetailsJSON, "VehicleDetailsJSON");
						_thatDT.oTable.setModel(_thatDT.oVehicleDetailsJSON, "VehicleDetailsJSON");

						var obj = {};

						for (var i = 0, len = _thatDT.oVehicleDetailsJSON.getData().accessoryFilter.length; i < len; i++)
							obj[_thatDT.oVehicleDetailsJSON.getData().accessoryFilter[i]['AccessInstl_flag2']] = _thatDT.oVehicleDetailsJSON.getData().accessoryFilter[
								i];
						_thatDT.oVehicleDetailsJSON.getData().accessoryFilter = new Array();
						for (var key in obj)
							_thatDT.oVehicleDetailsJSON.getData().accessoryFilter.push(obj[key]);
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

		formatDealer: function (dealerCode) {
			if (dealerCode !== null && dealerCode != undefined && dealerCode != "") {
				dealerCode = dealerCode.substring(5, dealerCode.length);
				return dealerCode;
			}
		},

		formatAccessoryFlag: function (accessoryFlag) {
			if (accessoryFlag !== null && accessoryFlag != undefined && accessoryFlag != "") {
				if (accessoryFlag == true) {
					accessoryFlag = "Y";
				} else if (accessoryFlag == false) {
					accessoryFlag = "N";
				}
				return accessoryFlag;
			}
		},

		handleSettingsConfirm: function (oEvent) {
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
			var sOperator;
			jQuery.each(mParams.filterItems, function (i, oItem) {
				sOperator = "StartsWith";
				var sPath2 = oItem.getKey();
				var sValue1 = oItem.getText();
				var sValue2 = oItem.getText();
				if (sPath2.indexOf("-") != -1) {
					sPath2 = oItem.getKey().split("-")[0];
					sValue1 = oItem.getKey().split("-")[1];
					sValue2 = oItem.getKey().split("-")[1];
				}

				var oFilter = new Filter(sPath2, sOperator, sValue1, sValue2);
				aFilters.push(oFilter);

			});
			oBinding.filter(aFilters);
		},
		handleFiltersDialog: function (oDialogEvent) {
			if (!_thatDT._oSettingsDialog) {
				_thatDT._oSettingsDialog = sap.ui.xmlfragment("pipelineInventory.view.fragments.filterSettings", _thatDT);
				_thatDT.getView().addDependent(_thatDT._oSettingsDialog);
				_thatDT._oSettingsDialog.open("filter");

				function removeDuplicateValues(PropertyName, JSONModel, JSONModelName) {
					var lookup = {};
					var items = _thatDT.oVehicleDetailsJSON.getData().results;
					var ModelArray = [];
					for (var item, i = 0; item = items[i++];) {
						var name = item[PropertyName];
						if (!(name in lookup)) {
							lookup[name] = 1;
							var ModelObj = {};
							if (JSONModelName == "FilterETAFromJSON") {
								ModelObj.ETAFromText = name.slice(0, 4) + "-" + name.slice(4, 6) + "-" + name.slice(6, 8);
								ModelObj[PropertyName] = name;
							} else if (JSONModelName == "FilterETAToJSON") {
								ModelObj.ETAToText = name.slice(0, 4) + "-" + name.slice(4, 6) + "-" + name.slice(6, 8);
								ModelObj[PropertyName] = name;
							}
							ModelObj[PropertyName] = name;
							ModelArray.push(ModelObj);
						}
					}
					JSONModel.setData(ModelArray);
					_thatDT.setModel(JSONModel, JSONModelName);
				}
				removeDuplicateValues("SERIES_DESC_EN", new sap.ui.model.json.JSONModel(), "FilterSeriesJSON");
				removeDuplicateValues("Model", new sap.ui.model.json.JSONModel(), "FilterModelJSON");
				removeDuplicateValues("Suffix", new sap.ui.model.json.JSONModel(), "FilterSuffixJSON");
				removeDuplicateValues("ORDERTYPE_DESC_EN", new sap.ui.model.json.JSONModel(), "FilterOrderTypeJSON");
				removeDuplicateValues("Status", new sap.ui.model.json.JSONModel(), "FilterStatusJSON");					//changes for DMND0003551 by swetha replaced ZMMSTA with Status 
				removeDuplicateValues("ExteriorColorCode", new sap.ui.model.json.JSONModel(), "FilterColourJSON");
				removeDuplicateValues("ETAFrom", new sap.ui.model.json.JSONModel(), "FilterETAFromJSON");
				removeDuplicateValues("ETATo", new sap.ui.model.json.JSONModel(), "FilterETAToJSON");

				_thatDT.setModel(_thatDT.VehicleDetailsJSON, "VehicleDetailsJSON");
			}
			_thatDT._oSettingsDialog.open();
		},

		/*Show Filtered data as per user input*/
		onApplyFilterBtn: function () {
			var sQuery = {};
			sQuery.VTN = _thatDT.getView().byId("ID_VTNVal").getValue();
			sQuery.VIN = _thatDT.getView().byId("ID_VINVal").getValue();
			sQuery.tempFilter = (_thatDT.getView().byId("ID_OrderNoVal").getValue()).split("*");

			_thatDT.oTable = _thatDT.getView().byId("Tab_vehicleDetails");
			_thatDT.oBinding = _thatDT.oTable.getBinding("items");
			var aFilters = [];
			var newQuery = sQuery.tempFilter;

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

				var oFilter = new sap.ui.model.Filter({
					aFilters: aFilters,
					bAnd: false,
					_bMultiFilter: true
				});
				_thatDT.oBinding.filter(oFilter);
			} else {
				_thatDT.oBinding.filter([]);
			}
		},

		/*Navigate to Vehicle Details page*/
		onNavigateToVL: function (oNavEvent) {
			var Data = oNavEvent.getSource().getModel("VehicleDetailsJSON").getProperty(oNavEvent.getSource().getBindingContext(
				"VehicleDetailsJSON").sPath);
			Data.Suffix = Data.Suffix.replace("/", "%2F");
			//Data.DNC_Comment = Data.DNC_Comment.replace(/\//g, "%2F");
			Data.DNC_Comment = Data.DNC_Comment.replace(/[^\w\s]+/g, "%2F");
			Data.TCISeries = Data.TCISeries.replace("/", "%2F");
			Data.ORDERTYPE_DESC_EN = Data.ORDERTYPE_DESC_EN.replace("/", "%2F");
			Data.SERIES_DESC_EN = Data.SERIES_DESC_EN.replace("/", "%2F");
			Data.SERIES_DESC_FR = Data.SERIES_DESC_FR.replace("/", "%2F");
			//INC0221487 Shriram 14-10-22 Navigation to Vehilce detail page issue: Two forward slash (/)was not handled   Code Start
			Data.SUFFIX_DESC_EN = Data.SUFFIX_DESC_EN.replaceAll("/", "%2F");
			Data.SUFFIX_DESC_FR = Data.SUFFIX_DESC_FR.replaceAll("/", "%2F");
			Data.INTCOL_DESC_EN = Data.INTCOL_DESC_EN.replaceAll("/", "%2F");
			Data.INTCOL_DESC_FR = Data.INTCOL_DESC_FR.replaceAll("/", "%2F");
			//INC0221487 Shriram 14-10-22 Navigation to Vehilce detail page issue. Code End
			Data.MODEL_DESC_EN = Data.MODEL_DESC_EN.replace("/", "%2F");
			Data.MODEL_DESC_FR = Data.MODEL_DESC_FR.replace("/", "%2F");
			Data.EXTCOL_DESC_EN = Data.EXTCOL_DESC_EN.replace("/", "%2F");
			Data.EXTCOL_DESC_FR = Data.EXTCOL_DESC_FR.replace("/", "%2F");
			Data.CustomerName = Data.CustomerName.replace(/\//g, "%2F");
			Data.ZZDLR_REF_NO = Data.ZZDLR_REF_NO.replaceAll("/", "%2F"); //INC0228962 When dealer clicks on VTN 0800120 they are unable to view any information -goes back to home screen@@forward slash (/)was not handled   Shriram 22-Mar-2023  
			Data.ZZDLR_REF_NO = Data.ZZDLR_REF_NO.replaceAll("?", "%3F");//INC0228962 ?
			
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
				} else {
					sap.m.MessageBox.information(_thatDT.oI18nModel.getResourceBundle().getText("PleaseSelectDealer"));
					//_thatDT.getRouter().navTo("changeHistory2");
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
			var checkedItem;
			if (oVUID.getParameters().selected && oVUID.getParameter("selectAll")) {
				_thatDT.checkedData = [];
				for (var l = 0; l < oVUID.getParameters().listItems.length; l++) {
					oVUID.getParameters().listItems[l].getBindingContext("VehicleDetailsJSON").getProperty(oVUID.getParameters().listItems[
						l].getBindingContext("VehicleDetailsJSON").getPath()).__metadata = "";
					checkedItem = oVUID.getParameters().listItems[l].getBindingContext("VehicleDetailsJSON").getProperty(oVUID.getParameters().listItems[
						l].getBindingContext("VehicleDetailsJSON").getPath());

					_thatDT.checkedData.push(oVUID.getParameters().listItems[l].getBindingContext("VehicleDetailsJSON").getProperty(oVUID.getParameters()
						.listItems[l].getBindingContext("VehicleDetailsJSON").getPath()));
				}
			} else if (oVUID.getParameters().selected === true) {
				oVUID.getParameters().listItem.getBindingContext("VehicleDetailsJSON").getProperty(oVUID.getParameters().listItem.getBindingContext(
					"VehicleDetailsJSON").getPath()).__metadata = "";

				checkedItem = oVUID.getParameters().listItem.getBindingContext("VehicleDetailsJSON").getProperty(oVUID.getParameters().listItem
					.getBindingContext("VehicleDetailsJSON").getPath());

				_thatDT.checkedData.push(oVUID.getParameters().listItem.getBindingContext("VehicleDetailsJSON").getProperty(oVUID.getParameters()
					.listItem
					.getBindingContext("VehicleDetailsJSON").getPath()));
			}
		},

		navToDropShipVehicles: function () {
			sap.ui.core.BusyIndicator.hide();
			for (var i = 0; i < _thatDT.checkedData.length; i++) {
				//_thatDT.checkedData[i].DNC_Comment = _thatDT.checkedData[i].DNC_Comment.replace(/\//g, "%2F");
				_thatDT.checkedData[i].DNC_Comment = _thatDT.checkedData[i].DNC_Comment.replace(/[^\w\s]+/g, "%2F");
				_thatDT.checkedData[i].ORDERTYPE_DESC_EN = _thatDT.checkedData[i].ORDERTYPE_DESC_EN.replace("/", "%2F");
				_thatDT.checkedData[i].MODEL_DESC_EN = _thatDT.checkedData[i].MODEL_DESC_EN.replace("/", "%2F");
				_thatDT.checkedData[i].MODEL_DESC_FR = _thatDT.checkedData[i].MODEL_DESC_FR.replace("/", "%2F");
				_thatDT.checkedData[i].SUFFIX_DESC_EN = _thatDT.checkedData[i].SUFFIX_DESC_EN.replace("/", "%2F");
				_thatDT.checkedData[i].SUFFIX_DESC_FR = _thatDT.checkedData[i].SUFFIX_DESC_FR.replace("/", "%2F");
				_thatDT.checkedData[i].SERIES_DESC_EN = _thatDT.checkedData[i].SERIES_DESC_EN.replace("/", "%2F");
				_thatDT.checkedData[i].SERIES_DESC_FR = _thatDT.checkedData[i].SERIES_DESC_FR.replace("/", "%2F");
				_thatDT.checkedData[i].INTCOL_DESC_EN = _thatDT.checkedData[i].INTCOL_DESC_EN.replace("/", "%2F");
				_thatDT.checkedData[i].INTCOL_DESC_FR = _thatDT.checkedData[i].INTCOL_DESC_FR.replace("/", "%2F");
				_thatDT.checkedData[i].EXTCOL_DESC_EN = _thatDT.checkedData[i].EXTCOL_DESC_EN.replace("/", "%2F");
				_thatDT.checkedData[i].EXTCOL_DESC_FR = _thatDT.checkedData[i].EXTCOL_DESC_FR.replace("/", "%2F");
			}
			_thatDT.getRouter().navTo("shipToDealer", {
				vehicleData: JSON.stringify(_thatDT.checkedData)
			});
		},
		navToAssignVehicles: function () {
			for (var i = 0; i < _thatDT.checkedData.length; i++) {
				//_thatDT.checkedData[i].DNC_Comment = _thatDT.checkedData[i].DNC_Comment.replace(/\//g, "%2F");
				_thatDT.checkedData[i].DNC_Comment = _thatDT.checkedData[i].DNC_Comment.replace(/[^\w\s]+/g, "%2F");
				_thatDT.checkedData[i].ORDERTYPE_DESC_EN = _thatDT.checkedData[i].ORDERTYPE_DESC_EN.replace("/", "%2F");
				_thatDT.checkedData[i].MODEL_DESC_EN = _thatDT.checkedData[i].MODEL_DESC_EN.replace("/", "%2F");
				_thatDT.checkedData[i].MODEL_DESC_FR = _thatDT.checkedData[i].MODEL_DESC_FR.replace("/", "%2F");
				_thatDT.checkedData[i].SUFFIX_DESC_EN = _thatDT.checkedData[i].SUFFIX_DESC_EN.replace("/", "%2F");
				_thatDT.checkedData[i].SUFFIX_DESC_FR = _thatDT.checkedData[i].SUFFIX_DESC_FR.replace("/", "%2F");
				_thatDT.checkedData[i].SERIES_DESC_EN = _thatDT.checkedData[i].SERIES_DESC_EN.replace("/", "%2F");
				_thatDT.checkedData[i].SERIES_DESC_FR = _thatDT.checkedData[i].SERIES_DESC_FR.replace("/", "%2F");
				_thatDT.checkedData[i].INTCOL_DESC_EN = _thatDT.checkedData[i].INTCOL_DESC_EN.replace("/", "%2F");
				_thatDT.checkedData[i].INTCOL_DESC_FR = _thatDT.checkedData[i].INTCOL_DESC_FR.replace("/", "%2F");
				_thatDT.checkedData[i].EXTCOL_DESC_EN = _thatDT.checkedData[i].EXTCOL_DESC_EN.replace("/", "%2F");
				_thatDT.checkedData[i].EXTCOL_DESC_FR = _thatDT.checkedData[i].EXTCOL_DESC_FR.replace("/", "%2F");
			}
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
			var url = _thatDT.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/InventoryDetailsSet?$filter=Division eq '" + DivUser +
				"' and MATRIX eq '" + _thatDT.routedData.MatrixVal +
				"' and Model eq '" + _thatDT.routedData.Model + "' and Modelyear eq '" + _thatDT.routedData.ModelYear + "'&$top=5&$skip='" +
				Number(
					num) + "'";
			$.ajax({
				dataType: "json",
				url: url,
				type: "GET",
				success: function (oRowData) {
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
			if (oWildCardVal.getParameters().newValue === "") {
				_thatDT.oBinding.filter([]);
			} else {
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
		dateConverter: function (_dVal) {
			if (_dVal !== null && _dVal !== undefined && _dVal != "") {
				var year = _dVal.substring(0, 4);
				var month = _dVal.substring(6, 4);
				var day = _dVal.substring(8, 6);
				return year + "-" + month + "-" + day;
			} else return "";
		},

		JSONToExcelConvertor: function (JSONData, ReportTitle, ShowLabel) {
			var arrData = typeof JSONData.results != 'object' ? JSON.parse(JSONData.results) : JSONData.results;
			var CSV = "";
			if (ShowLabel) {
				var row = "";
				row = row.slice(0, -1);
			}

			row += _thatDT.oI18nModel.getResourceBundle().getText("Dealer") + ",";
			row += _thatDT.oI18nModel.getResourceBundle().getText("OrderNumber") + ",";
			row += _thatDT.oI18nModel.getResourceBundle().getText("OrderType") + ",";
			row += _thatDT.oI18nModel.getResourceBundle().getText("Status") + ",";

			row += _thatDT.oI18nModel.getResourceBundle().getText("VTN") + ",";
			row += _thatDT.oI18nModel.getResourceBundle().getText("VIN") + ",";
			row += _thatDT.oI18nModel.getResourceBundle().getText("ModelYear") + ",";
			row += _thatDT.oI18nModel.getResourceBundle().getText("Series") + ",";
			row += _thatDT.oI18nModel.getResourceBundle().getText("Model") + ",";
			row += _thatDT.oI18nModel.getResourceBundle().getText("Suffix") + ",";
			row += _thatDT.oI18nModel.getResourceBundle().getText("Colour") + ",";
			row += _thatDT.oI18nModel.getResourceBundle().getText("Accessory") + ",";
			row += _thatDT.oI18nModel.getResourceBundle().getText("ETAFrom") + ",";
			row += _thatDT.oI18nModel.getResourceBundle().getText("ETATo") + ",";
			row += _thatDT.oI18nModel.getResourceBundle().getText("CustomerName") + ",";
			row += _thatDT.oI18nModel.getResourceBundle().getText("Comments") + ",";

			CSV += row + '\r\n';

			//loop is to extract each row
			for (var i = 0; i < arrData.length; i++) {
				var row = "";
				row += '="' + arrData[i].Dealer.substring(5, arrData[i].Dealer.length) + '",="' + arrData[i].ZZDLR_REF_NO + '","' + arrData[i].ORDERTYPE_DESC_EN +
					'","' + arrData[i].Status + '","' + arrData[i].ZZVTN + '","' + arrData[i].VHVIN + '","' +
					arrData[i].Modelyear + '","' + arrData[i].SERIES_DESC_EN + '","' + arrData[i].Model + "-" + arrData[i].MODEL_DESC_EN + '","' +
					arrData[i].Suffix + "-" + arrData[i].SUFFIX_DESC_EN + "/" + arrData[i].INTCOL_DESC_EN +'","' + arrData[i].ExteriorColorCode + "-" + arrData[i].EXTCOL_DESC_EN + '","' + arrData[i].AccessInstl_flag2 +
					'",="' + _thatDT.dateConverter(
						arrData[i].ETAFrom) + '",="' + _thatDT.dateConverter(arrData[i].ETATo) + '","' + arrData[i].CustomerName + '","' + arrData[i].DNC_Comment +
					'",';
				//}
				row.slice(1, row.length);
				CSV += row + '\r\n';
			}
			if (CSV == "") {
				alert("Invalid data");
				return;
			}
			var fileName = _thatDT.oI18nModel.getResourceBundle().getText("VehicleDetailsReport");
			fileName += ReportTitle.replace(/ /g, "_");
			// Initialize file format you want csv or xls

			var blob = new Blob(["\ufeff" + CSV], {
				type: "text/csv;charset=utf-8,"
			});
			if (sap.ui.Device.browser.name === "ie" || sap.ui.Device.browser.name === "ed") { // IE 10+ , Edge (IE 12+)
				navigator.msSaveBlob(blob, _thatDT.oI18nModel.getResourceBundle().getText("VehicleDetailsReport") + ".csv");
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