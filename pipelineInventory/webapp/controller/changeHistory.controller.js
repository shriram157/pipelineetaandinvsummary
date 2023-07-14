sap.ui.define([
	'pipelineInventory/controller/BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel',
	'sap/ui/model/Filter',
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/model/Sorter",
	"sap/ui/core/BusyIndicator",
	"sap/m/Dialog"
], function (BaseController, JSONModel, ResourceModel, Filter, MessageBox, History, Sorter, BusyIndicator, Dialog) {
	"use strict";
	var _thatCH, SelectedDealerCH, sSelectedLocale, Division, DivUser, localLang;
	return BaseController.extend("pipelineInventory.controller.changeHistory", {

		onInit: function () {
			_thatCH = this;
			this._mViewSettingsDialogs = {};
			_thatCH.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatCH.getView().setModel(_thatCH.oI18nModel, "i18n");

			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				sSelectedLocale = "EN"; // default is english 
			}
			if (sSelectedLocale == "fr") {
				localLang = "F";
				_thatCH.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				_thatCH.getView().setModel(_thatCH.oI18nModel, "i18n");
				_thatCH.sCurrentLocale = 'FR';
			} else {
				localLang = "E";
				_thatCH.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				_thatCH.getView().setModel(_thatCH.oI18nModel, "i18n");
				_thatCH.sCurrentLocale = 'EN';
			}
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				_thatCH.sPrefix = "/pipelineInventory-dest";
			} else {
				_thatCH.sPrefix = "";
			}
			_thatCH.nodeJsUrl = _thatCH.sPrefix + "/node";
			/*Logic for logo change depending upon Toyota and Lexus user*/
			var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			if (isDivisionSent) {
				Division = window.location.search.match(/Division=([^&]*)/i)[1];
				var currentImageSource;
				if (Division == '10') // set the toyoto logo
				{
					DivUser = "TOY";
					currentImageSource = _thatCH.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "images/toyota_logo_colour.png");
				} else { // set the lexus logo
					DivUser = "LEX";
					currentImageSource = _thatCH.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "images/Lexus.png");
				}
			}

			_thatCH.oChangeHistoryModel = new JSONModel();
			_thatCH.getView().setModel(_thatCH.oChangeHistoryModel, "ChangeHistoryModel");

			_thatCH.oDealerDataModel = new JSONModel();
			_thatCH.getView().setModel(sap.ui.getCore().getModel("BusinessDataModel"), "BusinessDataModel");

			_thatCH._oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0,
				enablesubmitBtn: false
			});
			_thatCH.getView().setModel(_thatCH._oViewModel, "LocalModel");

			_thatCH.getOwnerComponent().getRouter().attachRoutePatternMatched(_thatCH._oChangeHistoryRoute, _thatCH);

		},
		afterConfigLoad: function () {
			if (localLang === "F") {
				$(".sapMGrowingListTriggerText>.sapMSLITitle")[0].innerHTML = "Plus";
			} else {
				$(".sapMGrowingListTriggerText>.sapMSLITitle")[0].innerHTML = "More";
			}
		},
		onAfterRendering: function () {
			_thatCH.afterConfigLoad();
			var user = _thatCH.getView().getModel("BusinessDataModel").getData().SamlList.UserType[0];
			//sap.ui.getCore().getModel('BusinessDataModel').getData().SamlList.UserType[0]
			if (user == "Zone") {
				_thatCH.getView().byId("dealerCH").getItems()[0].setEnabled(false);
			} else if (user == "National") {
				_thatCH.getView().byId("dealerCH").getItems()[0].setEnabled(false);
				_thatCH.getView().byId("dealerCH").getItems()[1].setEnabled(false);
				_thatCH.getView().byId("dealerCH").getItems()[2].setEnabled(false);
				_thatCH.getView().byId("dealerCH").getItems()[3].setEnabled(false);
				_thatCH.getView().byId("dealerCH").getItems()[4].setEnabled(false);
				_thatCH.getView().byId("dealerCH").getItems()[5].setEnabled(false);
				_thatCH.getView().byId("dealerCH").getItems()[6].setEnabled(false);
			}

		},
		_oChangeHistoryRoute: function (oEvent) {
			_thatCH.getView().setBusy(false);
			sap.ui.core.BusyIndicator.show();
			_thatCH.getView().setModel(_thatCH.oChangeHistoryModel, "ChangeHistoryModel");

			_thatCH.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatCH.getView().setModel(_thatCH.oI18nModel, "i18n");

			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				sSelectedLocale = "EN"; // default is english 
			}
			if (sSelectedLocale == "fr") {
				_thatCH.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				_thatCH.getView().setModel(_thatCH.oI18nModel, "i18n");
				_thatCH.sCurrentLocale = 'FR';
				localLang = "F";
			} else {
				_thatCH.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				_thatCH.getView().setModel(_thatCH.oI18nModel, "i18n");
				_thatCH.sCurrentLocale = 'EN';
				localLang = "E";
			}

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				_thatCH.sPrefix = "/pipelineInventory-dest";
			} else {
				_thatCH.sPrefix = "";
			}
			_thatCH.nodeJsUrl = _thatCH.sPrefix + "/node";
			/*Logic for logo change depending upon Toyota and Lexus user*/
			var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			if (isDivisionSent) {
				Division = window.location.search.match(/Division=([^&]*)/i)[1];
				var currentImageSource;
				if (Division == '10') // set the toyoto logo
				{
					DivUser = "TOY";
					currentImageSource = _thatCH.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "images/toyota_logo_colour.png");
				} else { // set the lexus logo
					DivUser = "LEX";
					currentImageSource = _thatCH.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "images/Lexus.png");
				}
			}

			if (oEvent.getParameters().arguments.SelectedDealer != undefined) {
				_thatCH.Dealer = oEvent.getParameters().arguments.SelectedDealer;
				_thatCH.btnResubmit = _thatCH.getView().byId("ResubmitBTN");
				var url = _thatCH.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ChangeHistorySet?$filter=Division eq ' " + DivUser +
					" ' and Dealer eq '" + _thatCH.Dealer + "'and LANGUAGE eq '" + localLang + "' &$format=json";
				$.ajax({
					dataType: "json",
					url: url,
					type: "GET",
					success: function (oChangeData) {
						//	var array = [];
						sap.ui.core.BusyIndicator.hide();
						var arrayNewData = [];
						var oTable, oBinding, aSorters;

						_thatCH._fnHistoryData(oChangeData, arrayNewData, oTable, oBinding, aSorters);

					},
					error: function (oError) {
						_thatCH.errorFlag = true;
					}
				});
			}
			else{
				sap.ui.core.BusyIndicator.hide();// INC0234626  14-July-23  Shriram When Vehicle Detail link is clicked it appears to never end and application restart is needed to proceed
			}
			/*	else {
					sap.ui.core.BusyIndicator.hide();
					_thatCH.Dealer = "";
					_thatCH.btnResubmit = _thatCH.getView().byId("ResubmitBTN");
					var url = _thatCH.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ChangeHistorySet?$filter=Division eq ' " + DivUser +
						" ' and Dealer eq '" + _thatCH.Dealer +
						"'&$format=json";
					$.ajax({
						dataType: "json",
						url: url,
						type: "GET",
						success: function (oChangeData) {
							sap.ui.core.BusyIndicator.hide();
							var arrayNewData = [];
							if (oChangeData.d.results.length > 0) {
								arrayNewData = _thatCH.newData(oChangeData.d.results);
								//	console.log(arrayNewData);
								_thatCH._oViewModel.setProperty("/enablesubmitBtn", true);
								//_thatCH.oChangeHistoryModel.setData(oChangeData.d);
								_thatCH.oChangeHistoryModel.setData(arrayNewData);
								_thatCH.oChangeHistoryModel.updateBindings(true);
								for (var n = 0; n < _thatCH.oChangeHistoryModel.getData().length; n++) {
									if (_thatCH.oChangeHistoryModel.getData()[n].Status !== "Rejected") {
										_thatCH.oChangeHistoryModel.getData()[n].visible = false;
									} else {
										_thatCH.oChangeHistoryModel.getData()[n].visible = true;
									}
								}
								_thatCH.afterConfigLoad();
								_thatCH.oChangeHistoryModel.updateBindings(true);
							} else {
								_thatCH._oViewModel.setProperty("/enablesubmitBtn", false);
								_thatCH.oChangeHistoryModel.setData();
								_thatCH.oChangeHistoryModel.updateBindings(true);
							}
							var oTable = _thatCH.getView().byId("configTable");
							var oBinding = oTable.getBinding("items");
							var aSorters = [];
							aSorters.push(new sap.ui.model.Sorter('DateSubmitted', true));
							oBinding.sort(aSorters);
							oTable.updateBindings(true);
						},
						error: function (oError) {
							_thatCH.errorFlag = true;
						}
					});
				}*/
		},
		_fnHistoryData: function (oChangeData, arrayNewData, oTable, oBinding, aSorters) {
			if (oChangeData.d.results.length > 0) {
				arrayNewData = _thatCH.newData(oChangeData.d.results);
				//	console.log(arrayNewData);
				_thatCH._oViewModel.setProperty("/enablesubmitBtn", true);
				_thatCH.oChangeHistoryModel.setData(arrayNewData);
				//	_thatCH.oChangeHistoryModel.setData(oChangeData.d);
				_thatCH.oChangeHistoryModel.updateBindings(true);
				for (var n = 0; n < _thatCH.oChangeHistoryModel.getData().length; n++) {
					if (_thatCH.oChangeHistoryModel.getData()[n].Status !== "Rejected") {
						_thatCH.oChangeHistoryModel.getData()[n].visible = false;
					} else {
						_thatCH.oChangeHistoryModel.getData()[n].visible = true;
					}
				}
				_thatCH.afterConfigLoad();
				_thatCH.oChangeHistoryModel.updateBindings(true);
				oTable = _thatCH.getView().byId("configTable");
				oBinding = oTable.getBinding("items");
				aSorters = [];
				aSorters.push(new sap.ui.model.Sorter('DateSubmitted', true));
				oBinding.sort(aSorters);
				oTable.updateBindings(true);
			} else {
				_thatCH._oViewModel.setProperty("/enablesubmitBtn", false);
				_thatCH.oChangeHistoryModel.setData();
				_thatCH.oChangeHistoryModel.updateBindings(true);
			}
		},
		newData: function (oData) {
			var modelData = [];
			//	var jsonModel = new sap.ui.model.json.JSONModel();
			if (oData != "" && oData != undefined) {
				//	console.log(oData);
				for (var i = 0; i < oData.length; i++) {
					var oDate = oData[i].DateSubmitted;
					var Year = oDate.substring(0, 4); // 2020; //
					var Month = oDate.substring(4, 6);
					var month = Month - 1;
					var Day = oDate.substring(6, 8);
					//var date[i] = Year + "-" + Month + "-" + Day;
					var Hours = oDate.substring(8, 10);
					var Minute = oDate.substring(10, 12);
					var Seconds = oDate.substring(12, 14);
					//var Time = Hours + ":" + Minute + ":" + Seconds;
					var X = parseInt("0");
					var d = new Date(Year, month, Day, Hours, Minute, Seconds, X);
					d.setDate(d.getDate());
					var submittedDate = d;
					var allowedDate = new Date();
					allowedDate.setDate(allowedDate.getDate() - 45);
					//console.log("submittedDate: " + i + " :" + submittedDate);
					//console.log("allowedDate:" + i + " :" + allowedDate);
					if (oData[i].Status == "Rejected" || oData[i].Status == "Accepted") {
						if (submittedDate < allowedDate) {
							//	console.log("The record has to be removed");
						} else {
							//	console.log("Show record: " + i);
							modelData.push(oData[i]);
						}
					} else {
						//	console.log("Show record from else : " + i);
						modelData.push(oData[i]);
					}
				}
			}
			//jsonModel.setData(modelData);
			console.log(modelData);
			return modelData;
		},
		/*	addDays: function (date) {
				var submittedDate = date;
				var allowedDate = new Date();
				allowedDate.setDate(allowedDate.getDate() - 45);
				console.log("submittedDate: " + submittedDate);
				console.log("allowedDate:" + allowedDate);
				if (submittedDate < allowedDate) {
					console.log("The record has to be removed");
				} else {
					console.log("Show record ");
					return submittedDate;
				}
			},*/
		onDealerChange: function (oDealer) {
			sap.ui.core.BusyIndicator.show();
			var BPDataMo = _thatCH.getView().getModel("BusinessDataModel");
			var SelectedDealer = oDealer.getParameters().selectedItem.getAdditionalText();
			_thatCH.btnResubmit = _thatCH.getView().byId("ResubmitBTN");

			var url = _thatCH.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ChangeHistorySet?$filter=Division eq '" + DivUser +
				"' and Dealer eq '" + SelectedDealer +
				"'&$format=json";
			$.ajax({
				dataType: "json",
				url: url,
				type: "GET",
				success: function (oChangeData) {
					sap.ui.core.BusyIndicator.hide();
					var arrayNewData = [];
					if (oChangeData.d.results.length > 0) {
						arrayNewData = _thatCH.newData(oChangeData.d.results);
						console.log(arrayNewData);
						_thatCH.oChangeHistoryModel.setData(arrayNewData);
						_thatCH._oViewModel.setProperty("/enablesubmitBtn", true);
						//_thatCH.oChangeHistoryModel.setData(oChangeData.d);
						_thatCH.oChangeHistoryModel.updateBindings(true);

						for (var n = 0; n < _thatCH.oChangeHistoryModel.getData().length; n++) {
							if (_thatCH.oChangeHistoryModel.getData()[n].Status !== "Rejected") {
								_thatCH.oChangeHistoryModel.getData()[n].visible = false;
							} else {
								_thatCH.oChangeHistoryModel.getData()[n].visible = true;
							}
						}
						_thatCH.afterConfigLoad();
						_thatCH.oChangeHistoryModel.updateBindings(true);
					} else {
						_thatCH._oViewModel.setProperty("/enablesubmitBtn", false);
						_thatCH.oChangeHistoryModel.setData();
						_thatCH.oChangeHistoryModel.updateBindings(true);
					}
				},
				error: function (oError) {
					_thatCH.oChangeHistoryModel.setData();
					_thatCH._oViewModel.setProperty("/enablesubmitBtn", false);
					sap.ui.core.BusyIndicator.hide();
					_thatCH.errorFlag = true;
				}
			});
		},
		onNavigateToVL: function (oNavEvent) {

			var obj = oNavEvent.getSource().getModel("ChangeHistoryModel").getProperty(oNavEvent.getSource().getBindingContext(
				"ChangeHistoryModel").sPath);
			obj.NewSuffix = obj.NewSuffix.replace("/", "%2F");
			obj.OldSuffix = obj.OldSuffix.replace("/", "%2F");
			obj.__metadata = "";
			_thatCH.getRouter().navTo("vehicleDetails2", {
				VCData2: JSON.stringify(obj)
			});
		},

		formatDate: function (oDate) {
			if (oDate != "" && oDate != undefined) {
			var Year = oDate.substring(0, 4);
				var Month = oDate.substring(4, 6);
				var Day = oDate.substring(6, 8);
				var date = Year + "-" + Month + "-" + Day;
				var Hours = oDate.substring(8, 10);
				var Minute = oDate.substring(10, 12);
				var Seconds = oDate.substring(12, 14);
				var Time = Hours + ":" + Minute + ":" + Seconds;
				var dateTime = date + " " + Time;
				//var zone1= "Canada/Eastern";
				//var FinalDate = moment.tz(dateTime, zone1).utc().format("YYYY-MM-DD HH:mm:ss");
				//var FinalDate = moment.utc(new Date(dateTime)).format("YYYY-MM-DD HH:mm:ss");
				var FinalDate = moment(moment.utc(dateTime).toDate()).local().format("YYYY-MM-DD HH:mm:ss")
				return FinalDate;
			}
		},
		formatDateForExcel: function (oDate) {
			if (oDate != "" && oDate != undefined) {
				var Year = oDate.substring(0, 4);
				var Month = oDate.substring(4, 6);
				var Day = oDate.substring(6, 8);
				var date = Year + "-" + Month + "-" + Day;
				var Hours = oDate.substring(8, 10);
				var Minute = oDate.substring(10, 12);
				var Seconds = oDate.substring(12, 14);
				var Time = Hours + ":" + Minute + ":" + Seconds;
				var dateTime = date + "/" + Time;
				return dateTime;
			}
		},
		onMenuLinkPress: function (oLink) {
			var _oLinkPressed = oLink;
			var _oSelectedScreen = _oLinkPressed.getSource().getProperty("text");
			if (_oSelectedScreen == _thatCH.oI18nModel.getResourceBundle().getText("PageTitle")) {
				_thatCH.getRouter().navTo("Routemaster");
			} else if (_oSelectedScreen == _thatCH.oI18nModel.getResourceBundle().getText("VehicleDetails")) {
				_thatCH.getRouter().navTo("vehicleDetailsNodata");
			} else if (_oSelectedScreen == _thatCH.oI18nModel.getResourceBundle().getText("Back")) {
				var oHistory = History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					_thatCH.getRouter().navTo("vehicleDetailsNodata");
				}
			}
		},
		handleSettingsConfirm: function (oEvent) {
			var oTable = _thatCH.getView().byId("configTable");

			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("items");
			var sPath;
			var bDescending;
			var vGroup;
			var aSorters = [];
			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				vGroup = _thatCH.mGroupFunctions[sPath];
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
			if (!_thatCH._oSettingsDialog) {
				_thatCH._oSettingsDialog = sap.ui.xmlfragment("pipelineInventory.view.fragments.filterSettingsForCH", _thatCH);
				_thatCH.getView().addDependent(_thatCH._oSettingsDialog);
				_thatCH._oSettingsDialog.open("filter");

				function removeDuplicateValues(PropertyName, JSONModel, JSONModelName) {
					var lookup = {};
					var items = _thatCH.oChangeHistoryModel.getData();
					//	console.log(items);
					var ModelArray = [];
					for (var item, i = 0; item = items[i++];) {
						var name = item[PropertyName];
						if (!(name in lookup)) {
							lookup[name] = 1;
							var ModelObj = {};
							/*if (JSONModelName == "FilterDateSubmittedFromJSON") {
								ModelObj.ETAFromText = name.slice(0, 4) + "-" + name.slice(4, 6) + "-" + name.slice(6, 8);
								ModelObj[PropertyName] = name;
							}*/
							ModelObj[PropertyName] = name;
							/*console.log(PropertyName);
							console.log(name);
							console.log(ModelObj);*/
							ModelArray.push(ModelObj);
						}
					}
					//	console.log(ModelArray);
					JSONModel.setData(ModelArray);
					_thatCH.setModel(JSONModel, JSONModelName);
				}
				removeDuplicateValues("NewModel", new sap.ui.model.json.JSONModel(), "FilterNewModelJSON");
				removeDuplicateValues("OldModel", new sap.ui.model.json.JSONModel(), "FilterOldModelJSON");
				removeDuplicateValues("TCISeries", new sap.ui.model.json.JSONModel(), "FilterSeriesJSON");
				removeDuplicateValues("Status", new sap.ui.model.json.JSONModel(), "FilterStatusJSON");
				removeDuplicateValues("Modelyear", new sap.ui.model.json.JSONModel(), "FilterModelyearJSON");
				removeDuplicateValues("ZZDLR_REF_NO", new sap.ui.model.json.JSONModel(), "FilterOrderNumberJSON");
				removeDuplicateValues("ZZVTN", new sap.ui.model.json.JSONModel(), "FilterVTNJSON");
				removeDuplicateValues("VHVIN", new sap.ui.model.json.JSONModel(), "FilterVINJSON");

				_thatCH.setModel(_thatCH.oChangeHistoryModel, "ChangeHistoryModel");
			}
			_thatCH._oSettingsDialog.open();
		},
		/*Show Filtered data as per user input*/
		onApplyFilterBtn: function () {
			var sQuery = {};
			sQuery.VTN = _thatCH.getView().byId("ID_VTNVal").getValue();
			sQuery.VIN = _thatCH.getView().byId("ID_VINVal").getValue();
			sQuery.tempFilter = (_thatCH.getView().byId("idWildSearch").getValue()).split("*");

			_thatCH.oTable = _thatCH.getView().byId("configTable");
			_thatCH.oBinding = _thatCH.oTable.getBinding("items");
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
					Query = _thatCH.getView().byId("idWildSearch").getValue();
					aFilters.push(new Filter("ZZDLR_REF_NO", sap.ui.model.FilterOperator.Contains, Query));
				}

				var oFilter = new sap.ui.model.Filter({
					aFilters: aFilters,
					bAnd: false,
					_bMultiFilter: true
				});

				_thatCH.oBinding.filter(oFilter);
			} else {
				_thatCH.oBinding.filter([]);
			}
		},
		onDataExport: function (oEvent) {
			var data;
			if (_thatCH.getView().getModel("ChangeHistoryModel") != undefined) {
				data = _thatCH.getView().getModel("ChangeHistoryModel").getData();
			} else {
				data = _thatCH.getView().byId("configTable").getModel("ChangeHistoryModel").getData();
			}
			_thatCH.JSONToExcelConvertor(data, "Report", true);
		},
		JSONToExcelConvertor: function (JSONData, ReportTitle, ShowLabel) {
			var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
			var CSV = "";
			if (ShowLabel) {
				var row = "";
				row = row.slice(0, -1);
			}

			row += _thatCH.oI18nModel.getResourceBundle().getText("OrderNumber") + ",";
			row += _thatCH.oI18nModel.getResourceBundle().getText("VTN") + ",";
			row += _thatCH.oI18nModel.getResourceBundle().getText("ModelYear") + ",";
			row += _thatCH.oI18nModel.getResourceBundle().getText("Series") + ",";
			row += _thatCH.oI18nModel.getResourceBundle().getText("OldModel") + ",";
			row += _thatCH.oI18nModel.getResourceBundle().getText("OldSuffix") + ",";
			row += _thatCH.oI18nModel.getResourceBundle().getText("OldColour") + ",";
			row += _thatCH.oI18nModel.getResourceBundle().getText("OldAPX") + ",";
			row += _thatCH.oI18nModel.getResourceBundle().getText("NewModel") + ",";
			row += _thatCH.oI18nModel.getResourceBundle().getText("NewSuffix") + ",";
			row += _thatCH.oI18nModel.getResourceBundle().getText("NewColour") + ",";
			row += _thatCH.oI18nModel.getResourceBundle().getText("NewAPX") + ",";
			row += _thatCH.oI18nModel.getResourceBundle().getText("SubmissionDateTime") + ",";
			row += _thatCH.oI18nModel.getResourceBundle().getText("Status") + ",";

			CSV += row + '\r\n';

			//loop is to extract each row
			for (var i = 0; i < arrData.length; i++) {
				var row = "";
				row += '="' + arrData[i].ZZDLR_REF_NO + '",="' +
					arrData[i].ZZVTN + '","' + arrData[i].Modelyear + '","' + arrData[i].TCISeries + '","' +
					arrData[i].OldModel + '","' + arrData[i].OldSuffix + '","' + arrData[i].OldColor + '","' + arrData[i].OldAPX +
					'","' + arrData[i].NewModel + '","' + arrData[i].NewSuffix + '","' + arrData[i].NewColor + '","' + arrData[i].NewAPX + '","' +
					_thatCH.formatDateForExcel(arrData[i].DateSubmitted) + '","' + arrData[i].Status + '",';
				//}
				row.slice(1, row.length);
				CSV += row + '\r\n';
			}
			if (CSV == "") {
				alert("Invalid data");
				return;
			}
			var fileName = _thatCH.oI18nModel.getResourceBundle().getText("ChangeHistory");
			fileName += ReportTitle.replace(/ /g, "_");
			// Initialize file format you want csv or xls

			var blob = new Blob(["\ufeff" + CSV], {
				type: "text/csv;charset=utf-8,"
			});
			if (sap.ui.Device.browser.name === "ie" || sap.ui.Device.browser.name === "ed") { // IE 10+ , Edge (IE 12+)
				navigator.msSaveBlob(blob, _thatCH.oI18nModel.getResourceBundle().getText("ChangeHistory") + ".csv");
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

		onWildCardSearch: function (oEvent) {
			_thatCH.sSearchQuery = oEvent.getSource().getValue();
			_thatCH.fnSuperSearch();
		},
		fnSuperSearch: function (oEvent) {
			var aFilters = [],
				aSorters = [];

			aSorters.push(new sap.ui.model.Sorter("DateSubmitted", true));

			if (_thatCH.sSearchQuery) {
				var oFilter = new Filter([
					new Filter("OldColor", sap.ui.model.FilterOperator.Contains, _thatCH.sSearchQuery),
					new Filter("NewColor", sap.ui.model.FilterOperator.Contains, _thatCH.sSearchQuery),
					new Filter("Dealer", sap.ui.model.FilterOperator.Contains, _thatCH.sSearchQuery),
					new Filter("Modelyear", sap.ui.model.FilterOperator.Contains, _thatCH.sSearchQuery),
					new Filter("NewModel", sap.ui.model.FilterOperator.Contains, _thatCH.sSearchQuery),
					new Filter("NewSuffix", sap.ui.model.FilterOperator.Contains, _thatCH.sSearchQuery),
					new Filter("ORDERTYPE_DESC_EN", sap.ui.model.FilterOperator.Contains, _thatCH.sSearchQuery),
					new Filter("ZZDLR_REF_NO", sap.ui.model.FilterOperator.Contains, _thatCH.sSearchQuery),
					new Filter("OldSuffix", sap.ui.model.FilterOperator.Contains, _thatCH.sSearchQuery),
					new Filter("OldModel", sap.ui.model.FilterOperator.Contains, _thatCH.sSearchQuery),
					new Filter("TCISeries", sap.ui.model.FilterOperator.Contains, _thatCH.sSearchQuery),
					new Filter("VGUID", sap.ui.model.FilterOperator.Contains, _thatCH.sSearchQuery),
					new Filter("VHCLE", sap.ui.model.FilterOperator.Contains, _thatCH.sSearchQuery),
					new Filter("VHVIN", sap.ui.model.FilterOperator.Contains, _thatCH.sSearchQuery),
					new Filter("Status", sap.ui.model.FilterOperator.Contains, _thatCH.sSearchQuery),
					new Filter("ZZORDERTYPE", sap.ui.model.FilterOperator.Contains, _thatCH.sSearchQuery),
					new Filter("ZZVTN", sap.ui.model.FilterOperator.Contains, _thatCH.sSearchQuery)
				], false);

				aFilters = new sap.ui.model.Filter([oFilter], false);
			}
			_thatCH.getView().byId("configTable").getBinding("items").filter(aFilters);
			_thatCH.byId("configTable").getBinding("items").filter(aFilters).sort(aSorters);
		},
		onWildCardSearch1: function (oWildCardVal) {
			// add filter for search
			_thatCH.oTable = _thatCH.getView().byId("configTable");
			_thatCH.oBinding = _thatCH.oTable.getBinding("items");
			var aFilters = [];
			var tempFilter = oWildCardVal.getSource().getValue();
			if (oWildCardVal.getParameters().newValue === "") {
				_thatCH.oBinding.filter([]);
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
						Query = _thatCH.getView().byId("idWildSearch").getValue();
						aFilters = new Filter([
							new Filter("ZZDLR_REF_NO", sap.ui.model.FilterOperator.Contains, Query)
						], false);
					}
					_thatCH.oBinding.filter(aFilters);
				} else {
					_thatCH.oBinding.filter([]);
				}
			}
		},

		//changes done for CR by Minakshi start
		onPressResubmit: function (oResubmit) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var data = oResubmit.getSource().getModel("ChangeHistoryModel").getProperty(oResubmit.getSource().getBindingContext(
								"ChangeHistoryModel").sPath);
			var dialog = new Dialog({
				title: oBundle.getText("ResubmitChanges"),
				type: "Message",
				content: new sap.m.Text({
					text: oBundle.getText("AreYouSuretoSubmit")
				}),

				buttons: [
					new sap.m.Button({
						text: oBundle.getText("Yes"),
						press: $.proxy(function () {
							dialog.close();
							BusyIndicator.show(500);
							

							var obj = {};
							data.__metadata = "";

							if (data.NewModel) {
								obj.NewModel = data.NewModel.split("-")[0];
							}
							if (data.NewSuffix) {
								obj.NewSuffix = data.NewSuffix.split("-")[0];
							}
							if (data.NewColor) {
								obj.NewColor = data.NewColor.split("-")[0];
							}

							if (data.VHCLE) {
								obj.VHCLE = data.VHCLE;
							}

							obj.Dealer = data.Dealer;
							obj.LANGUAGE = localLang;

							var OrderChangeModel = _thatCH.getOwnerComponent().getModel("DataModel");
							OrderChangeModel.setUseBatch(false);
							OrderChangeModel.create("/OrderChangeSet", obj, {
								success: $.proxy(function (oResponse) {
									BusyIndicator.hide();
									if (oResponse.Error !== "") {
										sap.m.MessageBox.show(oResponse.Error, {
											icon: sap.m.MessageBox.Icon.ERROR,
											title: _thatCH.oI18nModel.getResourceBundle().getText("Error"),
											actions: [sap.m.MessageBox.Action.OK],
											onClose: function (oAction) {}
										});
									} else {

										var url = _thatCH.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ChangeHistorySet?$filter=Division eq ' " +
											DivUser +
											" ' and Dealer eq '" + data.Dealer + "'and LANGUAGE eq '" + localLang + "' &$format=json";
										$.ajax({
											dataType: "json",
											url: url,
											type: "GET",
											success: function (oChangeData) {
												//	var array = [];
												BusyIndicator.hide();
												var arrayNewData = [];
												var oTable, oBinding, aSorters;

												_thatCH._fnHistoryData(oChangeData, arrayNewData, oTable, oBinding, aSorters);

											},
											error: function (oError) {
												_thatCH.errorFlag = true;
												BusyIndicator.hide();
											}
										});

										// _thatCH.getView().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0].Status = "Requested";
										// _thatCH.getView().getModel("VehicleDetailsJSON").updateBindings(true);
										sap.m.MessageBox.show(_thatCH.oI18nModel.getResourceBundle().getText("VehicleUpdated"), {
											icon: sap.m.MessageBox.Icon.SUCCESS,
											title: _thatCH.oI18nModel.getResourceBundle().getText("Success"),
											actions: [sap.m.MessageBox.Action.OK],
											onClose: function (oAction) {}
										});
									}
								}, _thatCH),
								error: function (oError) {
									BusyIndicator.hide();
									sap.m.MessageBox.show(_thatCH.oI18nModel.getResourceBundle().getText("ErrorInData"), {
										icon: sap.m.MessageBox.Icon.ERROR,
										title: _thatCH.oI18nModel.getResourceBundle().getText("Error"),
										actions: [sap.m.MessageBox.Action.OK],
										onClose: function (oAction) {}
									});
									// sap.m.MessageBox.error(
									// 	"Error in data posting"
									// );
								}
							});

						}, this)
					}),
					new sap.m.Button({
						text: oBundle.getText("No"),
						press: $.proxy(function () {
							BusyIndicator.hide();
							
							dialog.close();
						}, this)
					})

				],

				afterClose: function () {
					dialog.destroy();
				}
			});

			dialog.open();

		},
		// createViewSettingsDialog: function (sDialogFragmentName) {
		// 	var oDialog = this._mViewSettingsDialogs[sDialogFragmentName];

		// 	if (!oDialog) {
		// 		oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
		// 		this._mViewSettingsDialogs[sDialogFragmentName] = oDialog;
		// 		this.getView().addDependent(oDialog);
		// 	}

		// 	return oDialog;
		// },

		// handleSortButtonPressed: function () {
		// 	this.createViewSettingsDialog("pipelineInventory.view.fragments.sortItem").open();
		// },
		// handleSortDialogConfirm: function (oEvent) {
		// 	var oTable = this.byId("configTable"),
		// 		mParams = oEvent.getParameters(),
		// 		oBinding = oTable.getBinding("items"),
		// 		sPath,
		// 		bDescending,
		// 		aSorters = [];

		// 	sPath = mParams.sortItem.getKey();
		// 	bDescending = mParams.sortDescending;
		// 	aSorters.push(new Sorter(sPath, bDescending));

		// 	// apply the selected sort and group settings
		// 	oBinding.sort(aSorters);
		// },
		//changes done for CR by Minakshi end
		onExit: function () {
			SelectedDealerCH = "";
			_thatCH.getView().byId("configTable").destroy();
			_thatCH.getView().destroy();
		}

	});
});