sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/core/routing/History',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel',
	"sap/m/MessageBox"
], function (BaseController, History, JSONModel, ResourceModel, MessageBox) {
	"use strict";
	var _thatVD,sSelectedLocale;
	return BaseController.extend("pipelineInventory.controller.vehicleDetails", {
		onInit: function () {
			_thatVD = this;

			_thatVD.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatVD.getView().setModel(_thatVD.oI18nModel, "i18n");

			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				sSelectedLocale = "EN"; // default is english 
			}
			if (sSelectedLocale == "fr") {
				_thatVD.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				this.getView().setModel(_thatVD.oI18nModel, "i18n");
				this.sCurrentLocale = 'FR';
			} else {
				_thatVD.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(_thatVD.oI18nModel, "i18n");
				this.sCurrentLocale = 'EN';
			}

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/pipelineInventory-dest";
			} else {
				this.sPrefix = "";
			}
			_thatVD.nodeJsUrl = this.sPrefix + "/node";
			var _oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0
			});
			_thatVD.getView().setModel(_oViewModel, "LocalVDModel");

			// this.getView().setModel(sap.ui.getCore().getModel("SelectJSONModel"), "SelectJSONModel");
			_thatVD.getOwnerComponent().getRouter().attachRoutePatternMatched(_thatVD._oVehicleDetailsRoute, _thatVD);
		},

		formatDate: function (oDate) {
			if (oDate != "" && oDate != undefined) {
				var Year = oDate.substring(0, 4);
				var Month = oDate.substring(4, 6);
				var Day = oDate.substring(6, 8);
				var date = Year + "-" + Month + "-" + Day;
				return date;
				// jQuery.sap.require("sap.ui.core.format.DateFormat");
				// _thatVD.oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				// 	pattern: "yyyy-MM-dd"
				// });
				// return _thatVD.oDateFormat.format(new Date(date));
			}
		},

		onAPXChange: function (oNewApx) {
			_thatVD.newAPX = oNewApx.getParameters().selectedItem.getKey();
		},
		_oVehicleDetailsRoute: function (oEvent) {
			_thatVD.getView().setBusy(false);
			sap.ui.core.BusyIndicator.hide();

			_thatVD.getView().setModel(sap.ui.getCore().getModel("VehicleDetailsJSON"), "VehicleDetailsJSON");
			_thatVD.oVehicleDetailsJSON = _thatVD.getView().getModel("VehicleDetailsJSON");

			_thatVD.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatVD.getView().setModel(_thatVD.oI18nModel, "i18n");

			if (window.location.search == "?language=fr") {
				_thatVD.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				_thatVD.getView().setModel(_thatVD.oI18nModel, "i18n");
				_thatVD.sCurrentLocale = 'FR';
			} else {
				_thatVD.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				_thatVD.getView().setModel(_thatVD.oI18nModel, "i18n");
				_thatVD.sCurrentLocale = 'EN';
			}
			if (oEvent.getParameters().name != "orderChange") {
				if (oEvent.getParameters().name == "vehicleDetails2") {
					if (oEvent.getParameter("arguments").VCData2 != undefined) {
						var Data = JSON.parse(oEvent.getParameter("arguments").VCData2);
						Data.NewSuffix = Data.NewSuffix.replace("%2F", "/");
						Data.OldSuffix = Data.OldSuffix.replace("%2F", "/");

						_thatVD.oVehicleDetailsJSON = new sap.ui.model.json.JSONModel();
						_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData = [];
						_thatVD.oVehicleDetailsJSON.getData().AcceessoryData = [];
						_thatVD.oVehicleDetailsJSON.getData().DNCData = [];
						_thatVD.oVehicleDetailsJSON.getData().APXData = [];
						_thatVD.oVehicleDetailsJSON.getData().selectedCustomerData = [];
						_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData.push(Data);

						var _OrderNumber = _thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].VHCLE;
						var url = _thatVD.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/VehicleDetailsSet('" + _OrderNumber + "')";
						$.ajax({
							dataType: "json",
							url: url,
							type: "GET",
							success: function (oRowData) {
								console.log("CustomerData", oRowData);
								oRowData.d.KUNNR = oRowData.d.KUNNR.split("-")[0].slice(5,10)+"-"+oRowData.d.KUNNR.split("-")[1]
								_thatVD.oVehicleDetailsJSON.getData().selectedCustomerData = oRowData.d;
								_thatVD.oVehicleDetailsJSON.updateBindings(true);
							},
							error: function (oError) {
								sap.ui.core.BusyIndicator.hide();
								_thatVD.errorFlag = true;
							}
						});
						_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].Model = Data.NewModel;
						_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].Suffix = Data.NewSuffix;
						_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].APX = Data.NewAPX;
						_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].ExteriorColorCode = Data.NewColor;
						_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].AccessoriesInstalled = "";
						_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].DNCVehicle = "";
						_thatVD.oVehicleDetailsJSON.getData().AcceessoryData[0] = {
							"AccessoryInstalled": "Yes"
						};
						_thatVD.oVehicleDetailsJSON.getData().AcceessoryData[1] = {
							"AccessoryInstalled": "No"
						};

						_thatVD.oVehicleDetailsJSON.getData().DNCData[0] = {
							"DNCVehicle": ""
						};
						_thatVD.oVehicleDetailsJSON.getData().DNCData[1] = {
							"DNCVehicle": "DNC Vehicle"
						};
						_thatVD.oVehicleDetailsJSON.getData().DNCData[2] = {
							"DNCVehicle": "DNC Demo / Loaner Vehicle"
						};
						_thatVD.oVehicleDetailsJSON.updateBindings(true);
						_thatVD.oVehicleDetailsJSON.refresh(true);
						_thatVD.getView().setModel(_thatVD.oVehicleDetailsJSON, "VehicleDetailsJSON");
						var data = _thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0];
						$.ajax({
							dataType: "json",
							url: _thatVD.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_APX?$filter=zzmoyr eq '" + data.Modelyear +
								"' and zzmodel eq '" +
								data.Model + "' and zzsuffix eq '" + data.Suffix + "'",
							type: "GET",
							success: function (oRowData) {
								console.log("APXData", oRowData);
								_thatVD.oVehicleDetailsJSON.getData().APXData = oRowData.d.results;
								_thatVD.oVehicleDetailsJSON.updateBindings(true);
							},
							error: function (oError) {
								sap.ui.core.BusyIndicator.hide();
								_thatVD.errorFlag = true;
							}
						});
					}

				} else {
					if (oEvent.getParameter("arguments").VCData != undefined) {
						var Data = JSON.parse(oEvent.getParameter("arguments").VCData);
						Data.Suffix = Data.Suffix.replace("%2F", "/");
						// Data.OldSuffix = Data.OldSuffix.replace("%2F", "/");
						if (_thatVD.oVehicleDetailsJSON.getData().results.length > 0) {
							for (var i = 0; i < _thatVD.oVehicleDetailsJSON.getData().results.length; i++) {
								if (_thatVD.oVehicleDetailsJSON.getData().results[i].VHCLE == Data.VHCLE) {
									_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData = [];
									_thatVD.oVehicleDetailsJSON.getData().AcceessoryData = [];
									_thatVD.oVehicleDetailsJSON.getData().DNCData = [];
									_thatVD.oVehicleDetailsJSON.getData().APXData = [];
									_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData.push(_thatVD.oVehicleDetailsJSON.getData().results[i]);
									_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].AccessoriesInstalled = "";
									_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].DNCVehicle = "";
									_thatVD.oVehicleDetailsJSON.getData().AcceessoryData[0] = {
										"AccessoryInstalled": "Yes"
									};
									_thatVD.oVehicleDetailsJSON.getData().AcceessoryData[1] = {
										"AccessoryInstalled": "No"
									};

									_thatVD.oVehicleDetailsJSON.getData().DNCData[0] = {
										"DNCVehicle": ""
									};
									_thatVD.oVehicleDetailsJSON.getData().DNCData[1] = {
										"DNCVehicle": "DNC Vehicle"
									};
									_thatVD.oVehicleDetailsJSON.getData().DNCData[2] = {
										"DNCVehicle": "DNC Demo / Loaner Vehicle"
									};

									_thatVD.oVehicleDetailsJSON.updateBindings();

									var _OrderNumber = _thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].VHCLE;

									var url = _thatVD.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/VehicleDetailsSet('" + _OrderNumber + "')";
									$.ajax({
										dataType: "json",
										url: url,
										type: "GET",
										success: function (oRowData) {
											console.log("CustomerData", oRowData);
											oRowData.d.KUNNR = oRowData.d.KUNNR.split("-")[0].slice(5,10)+"-"+oRowData.d.KUNNR.split("-")[1]
											_thatVD.oVehicleDetailsJSON.getData().selectedCustomerData = oRowData.d;
											_thatVD.oVehicleDetailsJSON.updateBindings(true);
										},
										error: function (oError) {
											sap.ui.core.BusyIndicator.hide();
											_thatVD.errorFlag = true;
										}
									});
									var data = _thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0];

									$.ajax({
										dataType: "json",
										url: _thatVD.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_APX?$filter=zzmoyr eq '" + data.Modelyear +
											"' and zzmodel eq '" +
											data.Model + "' and zzsuffix eq '" + data.Suffix + "'",
										type: "GET",
										success: function (oRowData) {
											console.log("APXData", oRowData);
											_thatVD.oVehicleDetailsJSON.getData().APXData = oRowData.d.results;
											_thatVD.oVehicleDetailsJSON.updateBindings(true);
										},
										error: function (oError) {
											sap.ui.core.BusyIndicator.hide();
											_thatVD.errorFlag = true;
										}
									});
								}
							}
						}
					}
				}
			}
		},

		getAPXData: function (data) {
			$.ajax({
				dataType: "json",
				url: _thatVD.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_APX?$filter=zzmoyr eq '" + data.Modelyear + "' and zzmodel eq '" +
					data.Model + "' and zzsuffix eq '" + data.Suffix + "'",
				type: "GET",
				success: function (oRowData) {
					console.log("APXData", oRowData);
					_thatVD.oVehicleDetailsJSON.getData().APXData = oRowData.d.results;
					_thatVD.oVehicleDetailsJSON.updateBindings(true);
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					_thatVD.errorFlag = true;
				}
			});
		},
		getCustomerData: function (_OrderNumber) {
			var url = _thatVD.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/VehicleDetailsSet('" + _OrderNumber + "')";
			$.ajax({
				dataType: "json",
				url: url,
				type: "GET",
				success: function (oRowData) {
					console.log("CustomerData", oRowData);
					oRowData.d.KUNNR = oRowData.d.KUNNR.split("-")[0].slice(5,10)+"-"+oRowData.d.KUNNR.split("-")[1]
					_thatVD.oVehicleDetailsJSON.getData().selectedCustomerData = oRowData.d;
					_thatVD.oVehicleDetailsJSON.updateBindings(true);
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					_thatVD.errorFlag = true;
				}
			});
		},
		/*Back Navigation*/
		NavigateBack: function () {
			// this.getRouter().navTo("details", {});
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				//var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				var oRouter = sap.ui.core.UIComponent.getRouterFor(_thatVD);
				oRouter.navTo("details");
			}
		},

		/*Navigate to Order Change screen*/
		NavToOrderChange: function () {
			var obj = _thatVD.getView().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0];
			var oRouter = sap.ui.core.UIComponent.getRouterFor(_thatVD);
			if (obj.NewSuffix != undefined) {
				obj.NewSuffix = obj.NewSuffix.replace("/", "%2F");
			}
			if (obj.OldSuffix != undefined) {
				obj.OldSuffix = obj.OldSuffix.replace("/", "%2F");
			}
			if (obj.Suffix != undefined) {
				obj.Suffix = obj.Suffix.replace("/", "%2F");
			}
			oRouter.navTo("orderChange", {
				Data: JSON.stringify(obj)
			});
		},

		onMenuLinkPress: function (oLink) {
			var _oLinkPressed = oLink;
			var _oSelectedScreen = _oLinkPressed.getSource().getProperty("text");
			if (_oSelectedScreen == _thatVD.oI18nModel.getResourceBundle().getText("PageTitle")) {
				_thatVD.getRouter().navTo("Routemaster");
			} else if (_oSelectedScreen == _thatVD.oI18nModel.getResourceBundle().getText("VehicleDetails")) {
				_thatVD.getRouter().navTo("vehicleDetailsNodata");
			} else if (_oSelectedScreen == _thatVD.oI18nModel.getResourceBundle().getText("ChangeHistory")) {
				if (_thatVD.getView().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0].Dealer != undefined) {
					_thatVD.getRouter().navTo("changeHistory", {
						SelectedDealer: _thatVD.getView().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0].Dealer
					});
				}
			}
		},

		_DataValidate: function (oPost) {
			_thatVD.getView().byId("accessoryVal");

			var sUserInput = _thatVD.getView().byId("accessoryVal").getSelectedKey();
			var sUserInput2 = _thatVD.getView().byId("DNCVal").getSelectedKey();
			
			var oInputControl = _thatVD.getView().byId("accessoryVal");
			var oInputControl2 = _thatVD.getView().byId("DNCVal");
			if (sUserInput && sUserInput2) {
				oInputControl.setValueState(sap.ui.core.ValueState.Success);
				oInputControl2.setValueState(sap.ui.core.ValueState.Success);
				_thatVD.postVehicleUpdates(oPost);
			} else {
				oInputControl.setValueState(sap.ui.core.ValueState.Error);
				oInputControl2.setValueState(sap.ui.core.ValueState.Error);
			}
		},

		postVehicleUpdates: function (oPost) {
			var Obj = {};
			_thatVD.oVehicleDetailsJSON = _thatVD.getView().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0];
			Obj.VHCLE = _thatVD.oVehicleDetailsJSON.VHCLE;
			if (_thatVD.newAPX != "" && _thatVD.newAPX != undefined) {
				Obj.NewAPX = _thatVD.newAPX;
			}
			Obj.AccessoriesInstalled = _thatVD.getView().byId("accessoryVal").getSelectedKey(); //oVehicleDetailsJSON.AccessoriesInstalled;
			Obj.DNC = _thatVD.getView().byId("DNCVal").getSelectedKey(); //DNCVal //_thatVD.oVehicleDetailsJSON.DNCVehicle;
			Obj.Comments = _thatVD.oVehicleDetailsJSON.Comments;
			var oModel = _thatVD.getOwnerComponent().getModel("DataModel");
			//new sap.ui.model.odata.v2.ODataModel(_thatVD.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV");
			oModel.setUseBatch(false);
			oModel.create("/VehicleDetailsSet", Obj, {
				success: $.proxy(function (oResponse) {
					console.log(oResponse);
					if (oResponse.Error != "") {
						sap.m.MessageBox.error(oResponse.Error);
					} else {
						sap.m.MessageBox.success("Vehicle succesfully updated");
					}
				}, _thatVD),
				error: function (oError) {
					sap.m.MessageBox.error(
						"Error in data saving"
					);
				}
			});
		},

		navToSoldOrer: function () {
			var data = _thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0];
			var modelyear = data.Modelyear;
			var modelkey = data.Model;
			var serieskey = data.TCISeries;
			var suffixkey = data.Suffix;
			var apxkey = data.APX;
			var colorkey = data.ExteriorColorCode;
			var vtnn = data.ZZVTN;
			var todate = data.ETATo;
			var fromdate = data.ETAFrom;

			var keys = "/" + modelyear + "/" + modelkey + "/" + serieskey + "/" + suffixkey + "/" + apxkey + "/" + colorkey + "/" + vtnn + "/" +
				fromdate + "/" + todate + "/";
				
			window.location.href = "https://qa-soldorder.cfapps.us10.hana.ondemand.com/soldOrder/index.html#/page2" + keys;
		},
		onExit: function () {
			this.destroy();
		}

	});

});