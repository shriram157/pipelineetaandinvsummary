sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/core/routing/History',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel',
	"sap/m/MessageBox"
], function (BaseController, History, JSONModel, ResourceModel, MessageBox) {
	"use strict";
	var _thatVD, sSelectedLocale, Division, SelectedDNCVal;
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
				delay: 0,
				soldOrderEnabled: false,
				APXEnabled: false
			});
			_thatVD.getView().setModel(_oViewModel, "LocalVDModel");
			/*Logic for logo change depending upon Toyota and Lexus user*/
			var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			if (isDivisionSent) {
				Division = window.location.search.match(/Division=([^&]*)/i)[1];
				var currentImageSource;
				if (Division == '10') // set the toyoto logo
				{
					currentImageSource = this.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "images/toyota_logo_colour.png");
				} else { // set the lexus logo
					currentImageSource = this.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "images/Lexus.png");
				}
			}

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

			//Sold Order Button Visibility for Dealer login
			if (sap.ui.getCore().getModel("BusinessDataModel").getData().SamlList.UserType[0] == "Dealer") {
				this.getView().getModel("LocalVDModel").setProperty("/soldOrderEnabled", true);
			} else {
				this.getView().getModel("LocalVDModel").setProperty("/soldOrderEnabled", false);
			}
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
				delay: 0,
				soldOrderEnabled: false,
				APXEnabled: false
			});
			_thatVD.getView().setModel(_oViewModel, "LocalVDModel");
			/*Logic for logo change depending upon Toyota and Lexus user*/
			var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			if (isDivisionSent) {
				Division = window.location.search.match(/Division=([^&]*)/i)[1];
				var currentImageSource;
				if (Division == '10') // set the toyoto logo
				{
					currentImageSource = this.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "images/toyota_logo_colour.png");
				} else { // set the lexus logo
					currentImageSource = this.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "images/Lexus.png");
				}
			}
			this.oBundle = this.getView().getModel("i18n").getResourceBundle();
			if (oEvent.getParameters().name != "orderChange") {
				if (oEvent.getParameters().name == "vehicleDetails2") {
					if (oEvent.getParameter("arguments").VCData2 != undefined) {
						var Data = JSON.parse(oEvent.getParameter("arguments").VCData2);
						//Data.SUFFIX_DESC_FR = Data.SUFFIX_DESC_FR.replace("%2F", "/");
						Data.ORDERTYPE_DESC_EN = Data.ORDERTYPE_DESC_EN.replace("%2F", "/");
						Data.SERIES_DESC_EN = Data.SERIES_DESC_EN.replace("%2F", "/");
						Data.SERIES_DESC_FR = Data.SERIES_DESC_FR.replace("%2F", "/");
						//Data.SUFFIX_DESC_EN = Data.SUFFIX_DESC_EN.replace("%2F", "/");
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
								_thatVD.APX_ChangeFlag = oRowData.d.APX_ChangeFlag;
								if (_thatVD.APX_ChangeFlag == "X") {
									_thatVD.getView().getModel("LocalVDModel").setProperty("/APXEnabled", true);
								} else {
									_thatVD.getView().getModel("LocalVDModel").setProperty("/APXEnabled", false);
								}
								oRowData.d.KUNNR = oRowData.d.KUNNR.split("-")[0].slice(5, 10) + "-" + oRowData.d.KUNNR.split("-")[1];
								_thatVD.oVehicleDetailsJSON.getData().selectedCustomerData = oRowData.d;
								_thatVD.oVehicleDetailsJSON.updateBindings(true);
								/*Defect Number 9937 solution start*/
								_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].Comments = oRowData.d.Comments;
								_thatVD.getView().byId("apxVal").setSelectedKey(oRowData.d.NewAPX);
								_thatVD.getView().byId("accessoryVal").setSelectedKey(oRowData.d.AccessoriesInstalled);
								_thatVD.getView().byId("DNCVal").setSelectedKey(oRowData.d.DNC);

								/*Defect Number 9937 solution End*/
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
						/*Defect Number 12306 solution start*/
						/*_thatVD.oVehicleDetailsJSON.getData().DNCData[0] = {
							"DNCVehicle": ""
						};*/
						/*Defect Number 12306 solution start*/
						_thatVD.oVehicleDetailsJSON.getData().DNCData[0] = {
							"DNCVehicle": this.oBundle.getText("DNCStock")
						};
						_thatVD.oVehicleDetailsJSON.getData().DNCData[1] = {
							"DNCVehicle": this.oBundle.getText("DNDemoLoanerVehicle")
						};
						_thatVD.oVehicleDetailsJSON.getData().DNCData[2] = {
							"DNCVehicle": this.oBundle.getText("RemoveSelection")
						};
						_thatVD.oVehicleDetailsJSON.updateBindings(true);
						_thatVD.oVehicleDetailsJSON.refresh(true);
						_thatVD.getView().setModel(_thatVD.oVehicleDetailsJSON, "VehicleDetailsJSON");
						var data = _thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0];
						//debugger;
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
						Data.SUFFIX_DESC_FR = Data.SUFFIX_DESC_FR.replace("%2F", "/");
						Data.ORDERTYPE_DESC_EN = Data.ORDERTYPE_DESC_EN.replace("%2F", "/");
						Data.SERIES_DESC_EN = Data.SERIES_DESC_EN.replace("%2F", "/");
						Data.SERIES_DESC_FR = Data.SERIES_DESC_FR.replace("%2F", "/");
						Data.SUFFIX_DESC_EN = Data.SUFFIX_DESC_EN.replace("%2F", "/");
						Data.Suffix = Data.Suffix.replace("%2F", "/");
						// Data.OldSuffix = Data.OldSuffix.replace("%2F", "/");
						if (_thatVD.oVehicleDetailsJSON.getData().results.length > 0) {
							for (var i = 0; i < _thatVD.oVehicleDetailsJSON.getData().results.length; i++) {
								if (_thatVD.oVehicleDetailsJSON.getData().results[i].VHCLE == Data.VHCLE) {

									_thatVD.oVehicleDetailsJSON.getData().results[i].SUFFIX_DESC_FR = _thatVD.oVehicleDetailsJSON.getData().results[i].SUFFIX_DESC_FR
										.replace("%2F", "/");
									_thatVD.oVehicleDetailsJSON.getData().results[i].ORDERTYPE_DESC_EN = _thatVD.oVehicleDetailsJSON.getData().results[i].ORDERTYPE_DESC_EN
										.replace("%2F", "/");
									_thatVD.oVehicleDetailsJSON.getData().results[i].SERIES_DESC_EN = _thatVD.oVehicleDetailsJSON.getData().results[i].SERIES_DESC_EN
										.replace("%2F", "/");
									_thatVD.oVehicleDetailsJSON.getData().results[i].SERIES_DESC_FR = _thatVD.oVehicleDetailsJSON.getData().results[i].SERIES_DESC_FR
										.replace("%2F", "/");
									_thatVD.oVehicleDetailsJSON.getData().results[i].SUFFIX_DESC_EN = _thatVD.oVehicleDetailsJSON.getData().results[i].SUFFIX_DESC_EN
										.replace("%2F", "/");

									_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData = [];
									_thatVD.oVehicleDetailsJSON.getData().AcceessoryData = [];
									_thatVD.oVehicleDetailsJSON.getData().DNCData = [];
									_thatVD.oVehicleDetailsJSON.getData().APXData = [];
									_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData.push(_thatVD.oVehicleDetailsJSON.getData().results[i]);
									_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].AccessoriesInstalled = "";
									_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].DNCVehicle = "";
									_thatVD.oVehicleDetailsJSON.getData().AccessInstl_flag = Data.AccessInstl_flag;
									_thatVD.oVehicleDetailsJSON.getData().AcceessoryData[0] = {
										"AccessoryInstalled": "Yes"
									};
									_thatVD.oVehicleDetailsJSON.getData().AcceessoryData[1] = {
										"AccessoryInstalled": "No"
									};
									/*Defect Number 12306 solution start*/
									/*_thatVD.oVehicleDetailsJSON.getData().DNCData[0] = {
										"DNCVehicle": ""
									};*/
									/*Defect Number 12306 solution start*/
									_thatVD.oVehicleDetailsJSON.getData().DNCData[0] = {
										"DNCVehicle": this.oBundle.getText("DNCStock")
									};
									_thatVD.oVehicleDetailsJSON.getData().DNCData[1] = {
										"DNCVehicle": this.oBundle.getText("DNDemoLoanerVehicle")
									};

									// _thatVD.oVehicleDetailsJSON.getData().DNCData[0] = {
									// 	"DNCVehicle": "DNC Stock"
									// };
									// _thatVD.oVehicleDetailsJSON.getData().DNCData[1] = {
									// 	"DNCVehicle": "DNC Demo / Loaner Vehicle"
									// };
									/*Defect Number 12615 solution start*/
									_thatVD.oVehicleDetailsJSON.getData().DNCData[2] = {
										"DNCVehicle": this.oBundle.getText("RemoveSelection")
									};
									// _thatVD.oVehicleDetailsJSON.getData().DNCData[3] = {
									// 	"DNCVehicle": "Remove DNC Demo / Loaner Vehicle"
									// };
									/*Defect Number 12615 solution end*/
									_thatVD.oVehicleDetailsJSON.updateBindings();

									var _OrderNumber = _thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].VHCLE;

									var url = _thatVD.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/VehicleDetailsSet('" + _OrderNumber + "')";
									$.ajax({
										dataType: "json",
										url: url,
										type: "GET",
										success: function (oRowData) {
											_thatVD.APX_ChangeFlag = oRowData.d.APX_ChangeFlag;
											if (_thatVD.APX_ChangeFlag == "X") {
												_thatVD.getView().getModel("LocalVDModel").setProperty("/APXEnabled", true);
											} else {
												_thatVD.getView().getModel("LocalVDModel").setProperty("/APXEnabled", false);
											}
											console.log("CustomerData", oRowData);
											oRowData.d.KUNNR = oRowData.d.KUNNR.split("-")[0].slice(5, 10) + "-" + oRowData.d.KUNNR.split("-")[1];
											_thatVD.oVehicleDetailsJSON.getData().selectedCustomerData = oRowData.d;
											/*Defect Number 9937 solution start*/
											_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].Comments = oRowData.d.Comments;
											_thatVD.getView().byId("apxVal").setSelectedKey(oRowData.d.NewAPX);
											_thatVD.getView().byId("accessoryVal").setSelectedKey(oRowData.d.AccessoriesInstalled);
											_thatVD.getView().byId("DNCVal").setSelectedKey(oRowData.d.DNC);
											/*Defect Number 9937 solution End*/
											_thatVD.oVehicleDetailsJSON.updateBindings(true);
										},
										error: function (oError) {
											sap.ui.core.BusyIndicator.hide();
											_thatVD.errorFlag = true;
										}
									});
									var data = _thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0];
									//debugger;
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
					//debugger;
					_thatVD.APX_ChangeFlag = oRowData.d.APX_ChangeFlag;
					if (_thatVD.APX_ChangeFlag == "X") {
						_thatVD.getView().getModel("LocalVDModel").setProperty("/APXEnabled", true);
					} else {
						_thatVD.getView().getModel("LocalVDModel").setProperty("/APXEnabled", false);
					}
					console.log("CustomerData", oRowData);
					oRowData.d.KUNNR = oRowData.d.KUNNR.split("-")[0].slice(5, 10) + "-" + oRowData.d.KUNNR.split("-")[1]
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
		onDNCOptionSlection: function (oDNCVal) {
			// debugger;
			this.oBundle = this.getView().getModel("i18n").getResourceBundle();
			if (oDNCVal.getParameters().selectedItem != null) {
				var _oDNCVal = oDNCVal.getParameters().selectedItem.getText();
			}
			if (_oDNCVal == this.oBundle.getText("RemoveSelection")) {
				_thatVD.getView().byId("DNCVal").setSelectedKey("");
				SelectedDNCVal = "Remove Selection";
			} else if (_oDNCVal == this.oBundle.getText("DNDemoLoanerVehicle")) {
				SelectedDNCVal = "DNC Demo / Loaner Vehicle";
			} else if (_oDNCVal == this.oBundle.getText("DNCStock")) {
				SelectedDNCVal = "DNC Stock";
			}
		},

		/*Navigate to Order Change screen*/
		NavToOrderChange: function () {
			var obj = _thatVD.getView().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0];
			var oRouter = sap.ui.core.UIComponent.getRouterFor(_thatVD);
			obj.newAPXValues = [];
			for (var m = 0; m < _thatVD.oVehicleDetailsJSON.getData().APXData.length; m++) {
				obj.newAPXValues.push(_thatVD.oVehicleDetailsJSON.getData().APXData[m]);
				obj.newAPXValues[m].__metadata = "";
			}

			if (obj.NewSuffix != undefined) {
				obj.NewSuffix = obj.NewSuffix.replace("/", "%2F");
			}
			if (obj.OldSuffix != undefined) {
				obj.OldSuffix = obj.OldSuffix.replace("/", "%2F");
			}
			if (obj.Suffix != undefined) {
				obj.Suffix = obj.Suffix.replace("/", "%2F");
			}
			if (obj.SUFFIX_DESC_FR != undefined) {
				obj.SUFFIX_DESC_FR = obj.SUFFIX_DESC_FR.replace("/", "%2F");
			}
			if (obj.ORDERTYPE_DESC_EN != undefined) {
				obj.ORDERTYPE_DESC_EN = obj.ORDERTYPE_DESC_EN.replace("/", "%2F");
			}
			if (obj.SERIES_DESC_EN != undefined) {
				obj.SERIES_DESC_EN = obj.SERIES_DESC_EN.replace("/", "%2F");
			}
			if (obj.SUFFIX_DESC_EN != undefined) {
				obj.SUFFIX_DESC_EN = obj.SUFFIX_DESC_EN.replace("/", "%2F");
			}
			if (obj.SERIES_DESC_FR != undefined) {
				obj.SERIES_DESC_FR = obj.SERIES_DESC_FR.replace("/", "%2F");
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

			var oInputControl = _thatVD.getView().byId("accessoryVal");
			if (oInputControl.getVisible()) {
				if (sUserInput) {
					oInputControl.setValueState(sap.ui.core.ValueState.Success);
					_thatVD.postVehicleUpdates(oPost);
				} else {
					oInputControl.setValueState(sap.ui.core.ValueState.Error);
				}
			} 
			else if (!oInputControl.getVisible()){
				_thatVD.postVehicleUpdates(oPost);
			}
			// else {
			// 	if (sUserInput2) {
			// 		oInputControl2.setValueState(sap.ui.core.ValueState.Success);
			// 		
			// 	} else {
			// 		oInputControl2.setValueState(sap.ui.core.ValueState.Error);
			// 	}
			// }

		},

		postVehicleUpdates: function (oPost) {
			var Obj = {};
			_thatVD.oVehicleDetailsJSON = _thatVD.getView().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0];
			Obj.VHCLE = _thatVD.oVehicleDetailsJSON.VHCLE;
			if (_thatVD.newAPX != "" && _thatVD.newAPX != undefined) {
				Obj.NewAPX = _thatVD.newAPX;
			}
			Obj.AccessoriesInstalled = _thatVD.getView().byId("accessoryVal").getSelectedKey(); //oVehicleDetailsJSON.AccessoriesInstalled;
			Obj.DNC = SelectedDNCVal; //DNCVal //_thatVD.oVehicleDetailsJSON.DNCVehicle;
			Obj.Comments = _thatVD.oVehicleDetailsJSON.Comments;
			var oModel = _thatVD.getOwnerComponent().getModel("DataModel");
			//new sap.ui.model.odata.v2.ODataModel(_thatVD.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV");
			oModel.setUseBatch(false);
			oModel.create("/VehicleDetailsSet", Obj, {
				success: $.proxy(function (oResponse) {
					//debugger;
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

		//cross-navigation to sold order application
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

			var soldOrderAppUrl = sap.ui.getCore().getModel("configDataModel").getData().soldOrderAppUrl;
			// window.location.href = "https://qas-soldorder.cfapps.us10.hana.ondemand.com/soldOrder/index.html#/page2" + keys;
			// window.location.href = soldOrderAppUrl + "?Division="++"&Language="++"#/page2" + keys;
			var url = soldOrderAppUrl + "?&Division=" + Division + "&Language=" + sSelectedLocale + "#/page2" + keys;
			window.location.href = url;
			// win.focus();

			//https://qa-soldorder.cfapps.us10.hana.ondemand.com/soldOrder/index.html#/page2
			//https://tci-qas-soldorderandpp.cfapps.us10.hana.ondemand.com/soldorderandpp/index.html#/page2/2018/YZ3DCT/SIE/BB/00/0070/1234/20181212/20181224
		},

		// showDraftItemInfo: function (oEvent) {
		// 	var vModel = this.getModel();
		// 	// get the view model

		// 	var root = vModel.getProperty('/appLinkes/PARTS_AVAILIBILITY');
		// 	var lang = vModel.getProperty('/userProfile/language');
		// 	var div = vModel.getProperty('/userProfile/division');

		// 	var partsNumber = oEvent.getSource().getBindingContext('orderModel').getProperty('partNumber');

		// 	var url = root + "index.html?partNumber=" + partsNumber + "&Division=" + div + "&Language=" + lang;
		// 	var win = window.open(url, 'PartsAvailibility');
		// 	win.focus();
		// },

		onExit: function () {
			this.destroy();
		}

	});

});