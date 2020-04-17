var 	TradingInd,LoggedInDealerCode1,Dealer_Name ;
sap.ui.define([
	'pipelineInventory/controller/BaseController',
	'sap/ui/core/routing/History',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel',
	"sap/m/MessageBox"
], function (BaseController, History, JSONModel, ResourceModel, MessageBox) {
	"use strict";
	var _thatVD, sSelectedLocale, Division, SelectedDNCVal, localLang;
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
				localLang = "F";
			} else {
				_thatVD.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(_thatVD.oI18nModel, "i18n");
				this.sCurrentLocale = 'EN';
				localLang = "E";
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
			
			var _oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0,
				soldOrderEnabled: false,
				APXEnabled: false,
				DNCEnabled: true
			});
			_thatVD.getView().setModel(_oViewModel, "LocalVDModel");

			_thatVD.getView().setModel(sap.ui.getCore().getModel("VehicleDetailsJSON"), "VehicleDetailsJSON");
			_thatVD.oVehicleDetailsJSON = _thatVD.getView().getModel("VehicleDetailsJSON");

			_thatVD.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatVD.getView().setModel(_thatVD.oI18nModel, "i18n");

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
				localLang = "F";
			} else {
				_thatVD.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(_thatVD.oI18nModel, "i18n");
				this.sCurrentLocale = 'EN';
				localLang = "E";
			}

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/pipelineInventory-dest";
			} else {
				this.sPrefix = "";
			}
			_thatVD.nodeJsUrl = this.sPrefix + "/node";

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
						sap.ui.core.BusyIndicator.hide();
						var Data = JSON.parse(oEvent.getParameter("arguments").VCData2);
						Data.TCISeries = Data.TCISeries.replace("%2F", "/");
						Data.ORDERTYPE_DESC_EN = Data.ORDERTYPE_DESC_EN.replace("%2F", "/");
						Data.SERIES_DESC_EN = Data.SERIES_DESC_EN.replace("%2F", "/");
						Data.SERIES_DESC_FR = Data.SERIES_DESC_FR.replace("%2F", "/");
						Data.NewSuffix = Data.NewSuffix.replace("%2F", "/");
						Data.OldSuffix = Data.OldSuffix.replace("%2F", "/");
						Data.OldColor = Data.OldColor.replace("%2F", "/");
						Data.NewColor = Data.NewColor.replace("%2F", "/");
						Data.NewModel = Data.NewModel.replace("%2F", "/");
						Data.OldModel = Data.OldModel.replace("%2F", "/");

						_thatVD.oVehicleDetailsJSON = new sap.ui.model.json.JSONModel();
						_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData = [];
						_thatVD.oVehicleDetailsJSON.getData().AcceessoryData = [];
						_thatVD.oVehicleDetailsJSON.getData().DNCData = [];
						_thatVD.oVehicleDetailsJSON.getData().APXData = [];
						_thatVD.oVehicleDetailsJSON.getData().selectedCustomerData = [];
						_thatVD.oVehicleDetailsJSON.getData().AccessoryInfoData = [];
						_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData.push(Data);

						var _OrderNumber = _thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].VHCLE;
						var MatrixVal = _thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].MATRIX;

						//To Get accessory informtion
						$.ajax({
							dataType: "json",
							url: _thatVD.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/AccessoryInfoSet?$filter=VHCLE eq '" + _OrderNumber +
								"' and LANGUAGE eq '" + localLang + "'",
							type: "GET",
							success: function (oAccessoryData) {
								_thatVD.oVehicleDetailsJSON.getData().AccessoryInfoData = oAccessoryData.d.results;
								_thatVD.oVehicleDetailsJSON.updateBindings(true);
							},
							error: function (oError) {
								_thatVD.errorFlag = true;
							}
						});

						var url = _thatVD.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/VehicleDetailsSet(VHCLE='" + _OrderNumber + "',MATRIX='0000')";
						$.ajax({
							dataType: "json",
							url: url,
							type: "GET",
							success: function (oRowData) {
								sap.ui.core.BusyIndicator.hide();
								_thatVD.APX_ChangeFlag = oRowData.d.APX_ChangeFlag;
								if (_thatVD.APX_ChangeFlag == "X") {
									_thatVD.getView().getModel("LocalVDModel").setProperty("/APXEnabled", true);
								} else {
									_thatVD.getView().getModel("LocalVDModel").setProperty("/APXEnabled", false);
								}
								console.log("HOLD", oRowData.d.HOLD);
								if (oRowData.d.HOLD !== "No") {
									_thatVD.getView().byId("id_holdVehicle").addStyleClass("HighlightRed");
								} else {
									_thatVD.getView().byId("id_holdVehicle").removeStyleClass("HighlightRed");
								}
								_thatVD.SoldOrderBlock = oRowData.d.SoldOrderBlock;
								if (sap.ui.getCore().getModel("BusinessDataModel").getData().SamlList.UserType[0] !== "Dealer") {
									_thatVD.getView().getModel("LocalVDModel").setProperty("/soldOrderEnabled", false);
								} else if (sap.ui.getCore().getModel("BusinessDataModel").getData().SamlList.UserType[0] == "Dealer") {
									_thatVD.getView().getModel("LocalVDModel").setProperty("/soldOrderEnabled", true);
								}
								oRowData.d.KUNNR = oRowData.d.KUNNR.substring(5); //oRowData.d.KUNNR.split("-")[0].slice(5) + "-" + oRowData.d.KUNNR.split("-")[1];
								_thatVD.oVehicleDetailsJSON.getData().selectedCustomerData = oRowData.d;
										Dealer_Name = 	_thatVD.oVehicleDetailsJSON.getData().selectedCustomerData.KUNNR;

								_thatVD.oVehicleDetailsJSON.updateBindings(true);

								_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].Comments = oRowData.d.Comments;
								_thatVD.getView().byId("apxVal").setSelectedKey(oRowData.d.NewAPX);
								_thatVD.getView().byId("accessoryVal").setSelectedKey(oRowData.d.AccessoriesInstalled);
								_thatVD.getView().byId("DNCVal").setSelectedKey(oRowData.d.DNC);
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
							"AccessoryInstalled": this.oBundle.getText("Yes")
						};
						_thatVD.oVehicleDetailsJSON.getData().AcceessoryData[1] = {
							"AccessoryInstalled": this.oBundle.getText("No")
						};

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

						$.ajax({
							dataType: "json",
							url: _thatVD.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_APX?$filter=zzmoyr eq '" + data.Modelyear +
								"' and zzmodel eq '" +
								data.Model + "' and zzsuffix eq '" + data.Suffix + "'",
							type: "GET",
							success: function (oRowData) {
								sap.ui.core.BusyIndicator.hide();
								_thatVD.oVehicleDetailsJSON.getData().APXData = oRowData.d.results;
								_thatVD.oVehicleDetailsJSON.updateBindings(true);
									if(((_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].ZZORDERTYPE == "SO")||(_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].ZZORDERTYPE == "SR"))&&((sap.ui.getCore().getModel("BusinessDataModel").getData().SamlList.UserType[0]=="Dealer")||(sap.ui.getCore().getModel("BusinessDataModel").getData().SamlList.UserType[0]=="Dealer_User")))
			{
				_thatVD.getView().byId("btn_pushtrade").setVisible(true);
							_thatVD.populateDealer();

			}
			else{
								_thatVD.getView().byId("btn_pushtrade").setVisible(false);

			}
							},
							error: function (oError) {
								sap.ui.core.BusyIndicator.hide();
								_thatVD.errorFlag = true;
									if(((_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].ZZORDERTYPE == "SO")||(_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].ZZORDERTYPE == "SR"))&&((sap.ui.getCore().getModel("BusinessDataModel").getData().SamlList.UserType[0]=="Dealer")||(sap.ui.getCore().getModel("BusinessDataModel").getData().SamlList.UserType[0]=="Dealer_User")))
			{
				_thatVD.getView().byId("btn_pushtrade").setVisible(true);
							_thatVD.populateDealer();

			}
			else{
								_thatVD.getView().byId("btn_pushtrade").setVisible(false);

			}
							}
							
						});
					}
				} else {
					if (oEvent.getParameter("arguments").VCData != undefined) {
						var Data = JSON.parse(oEvent.getParameter("arguments").VCData);
						if (_thatVD.oVehicleDetailsJSON.getData().results.length > 0) {
							sap.ui.core.BusyIndicator.hide();
							for (var i = 0; i < _thatVD.oVehicleDetailsJSON.getData().results.length; i++) {
								if (_thatVD.oVehicleDetailsJSON.getData().results[i].VHCLE == Data.VHCLE) {
									_thatVD.oVehicleDetailsJSON.getData().results[i].TCISeries = Data.TCISeries.replace("%2F", "/");
									_thatVD.oVehicleDetailsJSON.getData().results[i].ORDERTYPE_DESC_EN = _thatVD.oVehicleDetailsJSON.getData().results[i].ORDERTYPE_DESC_EN
										.replace("%2F", "/");
									_thatVD.oVehicleDetailsJSON.getData().results[i].SERIES_DESC_EN = _thatVD.oVehicleDetailsJSON.getData().results[i].SERIES_DESC_EN
										.replace("%2F", "/");
									_thatVD.oVehicleDetailsJSON.getData().results[i].SERIES_DESC_FR = _thatVD.oVehicleDetailsJSON.getData().results[i].SERIES_DESC_FR
										.replace("%2F", "/");
									_thatVD.oVehicleDetailsJSON.getData().results[i].SUFFIX_DESC_EN = _thatVD.oVehicleDetailsJSON.getData().results[i].SUFFIX_DESC_EN
										.replace("%2F", "/");
									_thatVD.oVehicleDetailsJSON.getData().results[i].SUFFIX_DESC_FR = _thatVD.oVehicleDetailsJSON.getData().results[i].SUFFIX_DESC_FR
										.replace("%2F", "/");
									_thatVD.oVehicleDetailsJSON.getData().results[i].INTCOL_DESC_EN = _thatVD.oVehicleDetailsJSON.getData().results[i].INTCOL_DESC_EN
										.replace("%2F", "/");
									_thatVD.oVehicleDetailsJSON.getData().results[i].INTCOL_DESC_FR = _thatVD.oVehicleDetailsJSON.getData().results[i].INTCOL_DESC_FR
										.replace("%2F", "/");
									_thatVD.oVehicleDetailsJSON.getData().results[i].MODEL_DESC_EN = _thatVD.oVehicleDetailsJSON.getData().results[i].MODEL_DESC_EN
										.replace("%2F", "/");
									_thatVD.oVehicleDetailsJSON.getData().results[i].MODEL_DESC_FR = _thatVD.oVehicleDetailsJSON.getData().results[i].MODEL_DESC_FR
										.replace("%2F", "/");
									_thatVD.oVehicleDetailsJSON.getData().results[i].EXTCOL_DESC_EN = _thatVD.oVehicleDetailsJSON.getData().results[i].EXTCOL_DESC_EN
										.replace("%2F", "/");
									_thatVD.oVehicleDetailsJSON.getData().results[i].EXTCOL_DESC_FR = _thatVD.oVehicleDetailsJSON.getData().results[i].EXTCOL_DESC_FR
										.replace("%2F", "/");
									_thatVD.oVehicleDetailsJSON.getData().results[i].Suffix = _thatVD.oVehicleDetailsJSON.getData().results[i].Suffix.replace(
										"%2F", "/");

									_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData = [];
									_thatVD.oVehicleDetailsJSON.getData().AcceessoryData = [];
									_thatVD.oVehicleDetailsJSON.getData().DNCData = [];
									_thatVD.oVehicleDetailsJSON.getData().APXData = [];
									_thatVD.oVehicleDetailsJSON.getData().AccessoryInfoData = [];
									_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData.push(_thatVD.oVehicleDetailsJSON.getData().results[i]);
									_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].AccessoriesInstalled = "";
									_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].DNCVehicle = "";
									_thatVD.oVehicleDetailsJSON.getData().AccessInstl_flag = Data.AccessInstl_flag;
									_thatVD.DNCFlag = Data.DNC_flag;

									if (!_thatVD.DNCFlag) {
										console.log("DNCFlag", _thatVD.DNCFlag);
										_thatVD.getView().getModel("LocalVDModel").setProperty("/DNCEnabled", false);
									} else {
										console.log("DNCFlag", _thatVD.DNCFlag);
										_thatVD.getView().getModel("LocalVDModel").setProperty("/DNCEnabled", true);
									}

									_thatVD.oVehicleDetailsJSON.getData().AcceessoryData[0] = {
										"AccessoryInstalled": this.oBundle.getText("Yes")
									};
									_thatVD.oVehicleDetailsJSON.getData().AcceessoryData[1] = {
										"AccessoryInstalled": this.oBundle.getText("No")
									};
									_thatVD.oVehicleDetailsJSON.getData().DNCData[0] = {
										"DNCVehicle": this.oBundle.getText("DNCStock")
									};
									_thatVD.oVehicleDetailsJSON.getData().DNCData[1] = {
										"DNCVehicle": this.oBundle.getText("DNDemoLoanerVehicle")
									};
									_thatVD.oVehicleDetailsJSON.getData().DNCData[2] = {
										"DNCVehicle": this.oBundle.getText("RemoveSelection")
									};
									var UserType = sap.ui.getCore().getModel("BusinessDataModel").getData().SamlList.UserType[0];
									// if (UserType == "National") {
									// 	this.getView().getModel("LocalVDModel").setProperty("/DNCEnabled", true);
									// } else {
									// 	this.getView().getModel("LocalVDModel").setProperty("/DNCEnabled", false);
									// }
									_thatVD.oVehicleDetailsJSON.updateBindings();

									var _OrderNumber = _thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].VHCLE;
									var MatrixVal = _thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].MATRIX;

									//To Get accessory informtion
									$.ajax({
										dataType: "json",
										url: _thatVD.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/AccessoryInfoSet?$filter=VHCLE eq '" + _OrderNumber +
											"' and LANGUAGE eq '" + localLang + "'",
										type: "GET",
										success: function (oAccessoryData) {
											_thatVD.oVehicleDetailsJSON.getData().AccessoryInfoData = oAccessoryData.d.results;
											_thatVD.oVehicleDetailsJSON.updateBindings(true);
										},
										error: function (oError) {
											_thatVD.errorFlag = true;
										}
									});
									var url = _thatVD.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/VehicleDetailsSet(VHCLE='" + _OrderNumber + "',MATRIX='" +
										MatrixVal + "')";
									// var url = _thatVD.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/VehicleDetailsSet('" + _OrderNumber + "')";
									$.ajax({
										dataType: "json",
										url: url,
										type: "GET",
										success: function (oRowData) {
											sap.ui.core.BusyIndicator.hide();
											_thatVD.APX_ChangeFlag = oRowData.d.APX_ChangeFlag;
											SelectedDNCVal = oRowData.d.DNC;

											console.log("HOLD", oRowData.d.HOLD);
											if (oRowData.d.HOLD !== "No") {
												_thatVD.getView().byId("id_holdVehicle").addStyleClass("HighlightRed");
											} else {
												_thatVD.getView().byId("id_holdVehicle").removeStyleClass("HighlightRed");
											}
											if (_thatVD.APX_ChangeFlag == "X") {
												_thatVD.getView().getModel("LocalVDModel").setProperty("/APXEnabled", true);
											} else {
												_thatVD.getView().getModel("LocalVDModel").setProperty("/APXEnabled", false);
											}
											_thatVD.SoldOrderBlock = oRowData.d.SoldOrderBlock;
											if (_thatVD.SoldOrderBlock == "X" && (sap.ui.getCore().getModel("BusinessDataModel").getData().SamlList.UserType[0] !==
													"Dealer") && _thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].ZZORDERTYPE == "RS") {
												_thatVD.getView().getModel("LocalVDModel").setProperty("/soldOrderEnabled", false);
											} else if (_thatVD.SoldOrderBlock == "" && (sap.ui.getCore().getModel("BusinessDataModel").getData().SamlList.UserType[0] ==
													"Dealer") && _thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].ZZORDERTYPE !== "RS") {
												_thatVD.getView().getModel("LocalVDModel").setProperty("/soldOrderEnabled", true);
											}
											oRowData.d.KUNNR = oRowData.d.KUNNR.substring(5); // oRowData.d.KUNNR.split("-")[0].slice(5, 10) + "-" + oRowData.d.KUNNR.split("-")[1];
											_thatVD.oVehicleDetailsJSON.getData().selectedCustomerData = oRowData.d;

											_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].Comments = oRowData.d.Comments;
											_thatVD.getView().byId("apxVal").setSelectedKey(oRowData.d.NewAPX);
											_thatVD.getView().byId("accessoryVal").setSelectedKey(oRowData.d.AccessoriesInstalled);
											_thatVD.getView().byId("DNCVal").setSelectedKey(oRowData.d.DNC);

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
											sap.ui.core.BusyIndicator.hide();
											_thatVD.oVehicleDetailsJSON.getData().APXData = oRowData.d.results;
											_thatVD.oVehicleDetailsJSON.updateBindings(true);
												if(((_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].ZZORDERTYPE == "SO")||(_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].ZZORDERTYPE == "SR"))&&((sap.ui.getCore().getModel("BusinessDataModel").getData().SamlList.UserType[0]=="Dealer")||(sap.ui.getCore().getModel("BusinessDataModel").getData().SamlList.UserType[0]=="Dealer_User")))
			{
				_thatVD.getView().byId("btn_pushtrade").setVisible(true);
							_thatVD.populateDealer();

			}
			else{
								_thatVD.getView().byId("btn_pushtrade").setVisible(false);

			}
										},
										error: function (oError) {
											sap.ui.core.BusyIndicator.hide();
											_thatVD.errorFlag = true;
												if(((_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].ZZORDERTYPE == "SO")||(_thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].ZZORDERTYPE == "SR"))&&((sap.ui.getCore().getModel("BusinessDataModel").getData().SamlList.UserType[0]=="Dealer")||(sap.ui.getCore().getModel("BusinessDataModel").getData().SamlList.UserType[0]=="Dealer_User")))
			{
				_thatVD.getView().byId("btn_pushtrade").setVisible(true);
							_thatVD.populateDealer();

			}
			else{
								this.getView().byId("btn_pushtrade").setVisible(false);

			}
										}
									});
								}
							}
						}
					}
				}
			}
		
		},
		populateDealer:function(){
			var that = this;
						var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
		this.attributeUrl = "/API_BUSINESS_PARTNER/A_BusinessPartner?$expand=to_Customer/to_CustomerSalesArea&$filter=(BusinessPartnerType%20eq%20%27Z001%27%20or%20BusinessPartnerType%20eq%20%27Z004%27)%20and%20zstatus%20ne%20%27X%27%20&$orderby=BusinessPartner%20asc%20&select=BusinessPartner,BusinessPartnerName,BusinessPartnerType,OrganizationBPName1,SearchTerm2,to_Customer/Attribute1,to_Customer/to_CustomerSalesArea/SalesOffice,to_Customer/to_CustomerSalesArea/Customer,to_Customer/to_CustomerSalesArea/SalesOrganization,to_Customer/to_CustomerSalesArea/DistributionChannel,to_Customer/to_CustomerSalesArea/Division,to_Customer/to_CustomerSalesArea/SalesGroup,to_Customer/to_CustomerSalesArea/ProductAttribute1";


			if (sLocation_conf == 0) {
				this.sPrefix = "/pipelineInventory-dest/node"; // the destination
				// this.attributeUrl = "/userDetails/attributesforlocaltesting";
				// this.currentScopeUrl = "/userDetails/currentScopesForUserLocaltesting";

				// this.sPrefix = "";
				// this.attributeUrl = "/userDetails/attributes";

				// this.currentScopeUrl = "/userDetails/currentScopesForUser";

			} else {
				this.sPrefix = "/node";
				// this.attributeUrl = "/userDetails/attributes";

				// this.currentScopeUrl = "/userDetails/currentScopesForUser";

			}
			$.ajax({
				url: this.sPrefix + this.attributeUrl,
				type: "GET",
				dataType: "json",

				success: function (oData) {
					var BpDealer = [];
					var userAttributes = [];
					// var userLoginDetails = [];
					var bpResults= oData.d.results;
						bpResults = bpResults.filter(o => {
						if (!o.to_Customer) {
							return false;
						}
						var customerSalesArea = o.to_Customer.to_CustomerSalesArea;
						if (!customerSalesArea) {
							return false;
						}
						var filtered = false;
						for (var i = 0; i < customerSalesArea.results.length; i++) {
							if ((customerSalesArea.results[i].SalesOffice === "1000" || customerSalesArea.results[i].SalesOffice === "2000" ||
									customerSalesArea.results[i].SalesOffice === "3000" || customerSalesArea.results[i].SalesOffice === "4000" ||
									customerSalesArea.results[i].SalesOffice === "5000" || customerSalesArea.results[i].SalesOffice === "7000" ||
									customerSalesArea.results[i].SalesOffice === "9000" || customerSalesArea.results[i].SalesOffice === "8000") && ((
									customerSalesArea.results[i].SalesOrganization == "6000") && (customerSalesArea.results[i].DistributionChannel == "10" &&
									customerSalesArea.results[i].SalesGroup != "T99"))) {
								filtered = true;
							}
						}
						return filtered;
					});
					var bpAttributes,toCustomerAttr1,attributes=[];
					for (var i = 0; i < bpResults.length; i++) {
					var bpLength = bpResults[i].BusinessPartner.length;
					if (bpResults[i].BusinessPartner === "2400029000" || bpResults[i].BusinessPartner === "2400049000" ||
					    bpResults[i].BusinessPartner === "2400500078" || bpResults[i].BusinessPartner === "2400542217"    ) {
					continue;	
					}
					bpAttributes = {
						BusinessPartnerName: bpResults[i].OrganizationBPName1,
						BusinessPartnerKey: bpResults[i].BusinessPartner,
						BusinessPartner: bpResults[i].BusinessPartner.substring(5, bpLength),
						BusinessPartnerType: bpResults[i].BusinessPartnerType,
						SearchTerm2: bpResults[i].SearchTerm2
					};
					
					try {
						toCustomerAttr1 = bpResults[i].to_Customer.Attribute1;
					} catch (e) {
						console.log("The Data is sent without Attribute value for the BP: %s", bpResults[i].BusinessPartner);
					}

					if (toCustomerAttr1 === "01") {
						// Toyota dealer
						bpAttributes.Division = "10";
						bpAttributes.Attribute = "01";
					} else if (toCustomerAttr1 === "02") {
						// Lexus dealer
						bpAttributes.Division = "20";
						bpAttributes.Attribute = "02";
					} else if (toCustomerAttr1 === "03") {
						// Dual (Toyota + Lexus) dealer
						bpAttributes.Division = "Dual";
						bpAttributes.Attribute = "03";
					} else if (toCustomerAttr1 === "04") {
						bpAttributes.Division = "10";
						bpAttributes.Attribute = "04";
					} else if (toCustomerAttr1 === "05") {
						bpAttributes.Division = "Dual";
						bpAttributes.Attribute = "05";
					} else {
						// Set as Toyota dealer as fallback
						bpAttributes.Division = "10";
						bpAttributes.Attribute = "01";
					}
attributes.push(bpAttributes);
				
				}
	//  lets also get the logged in userid details so we can push the same to SAP. 
	                	// $.each(oData.userProfile, function (i, item) {
	                	// userLoginDetails.push({
	                	
	                	//   "userId": oData.userProfile.id
	                		
	                	// });
	                	
					// sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(userLoginDetails), "userIDDetails");

					$.each(attributes, function (i, item) {
					// $.each(oData.attributes, function (i, item) {

						//if it is a zone user, then put the first record as Zone User	
					

						// for toyota login show only toyota dealers, for lexus show only lexus. 

						if (item.Division == Division || item.Division == "Dual") {

							BpDealer.push({
								"BusinessPartnerKey": item.BusinessPartnerKey,
								"BusinessPartner": item.BusinessPartner, //.substring(5, BpLength),
								"BusinessPartnerName": item.BusinessPartnerName, //item.OrganizationBPName1 //item.BusinessPartnerFullName
								"Division": item.Division,
								"BusinessPartnerType": item.BusinessPartnerType,
								"searchTermReceivedDealerName": item.SearchTerm2

							});
						} // TODO: enable this before migration

					});

					var sLocation = window.location.host;
					var sLocation_conf = sLocation.search("webide");
					if (sLocation_conf == 0 && that.userTypeReceived != "Zone_User" && that.userTypeReceived != "National") {
						var BpDealer2 = [];

						BpDealer2.push({
							"BusinessPartnerKey": "2400042120",
							"BusinessPartner": "42120",

							"BusinessPartnerName": "Don Valley North Toyota...", //item.OrganizationBPName1 //item.BusinessPartnerFullName
							"Division": "10",
							"BusinessPartnerType": "Z001",
							"searchTermReceivedDealerName": "42120"
						});

						// Lexus dealer test

						// 						BpDealer.push({
						// 	"BusinessPartnerKey": "2400042357",
						// 	"BusinessPartner": "42357",

						// 	"BusinessPartnerName": "Lexus Dealer...", //item.OrganizationBPName1 //item.BusinessPartnerFullName
						// 	"Division": "20",
						// 	"BusinessPartnerType": "Z001",
						// 	"searchTermReceivedDealerName": "42357"
						// });

						// BpDealer.push({
						// 	"BusinessPartnerKey": "2400042193",
						// 	"BusinessPartner": "42193",

						// 	"BusinessPartnerName": "Bailey toyota...", //item.OrganizationBPName1 //item.BusinessPartnerFullName
						// 	"Division": "10",
						// 	"BusinessPartnerType": "Z001",
						// 	"searchTermReceivedDealerName": "42193"
						// });

					}

					if (BpDealer.length == 0) {
						sap.m.MessageBox.error(
							"The Dealer data not received,  check the URL Division, Logged in ID, clear the Browser Cache, Pick the Right ID and Retry"
						);
					}


             
					//  set your model or use the model below - 
					// if (that.userTypeReceived != "National") {

					// 	that.getView().setModel(new sap.ui.model.json.JSONModel(BpDealer), "BpDealerModel");
					// 	sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(BpDealer), "LoginBpDealerModel");
					
					// 	this._oViewModel.setProperty("/visibleForNational", false);
					// } else {
						// var BpDealerTemp = [...BpDealer];
						var BpDealerTemp = BpDealer.slice();
						var confirmStockCode = "";
						for (var i = 0; i < BpDealerTemp.length; i++) {
                            if (i == 0) {
								 BpDealerTemp.splice(0, 1);
					
							}
						 

							if (BpDealerTemp[i].BusinessPartnerKey) {
								confirmStockCode = BpDealerTemp[i].BusinessPartnerKey.substring(4, 5);
							}
							if (confirmStockCode == "5") {

								switch (BpDealerTemp[i].BusinessPartnerName) {

								case "Pacific Zone Stock":
									//BpDealer[i].dummyFieldForSort = 1;
									BpDealerTemp[i].dummyFieldForSort = BpDealerTemp.length - (BpDealerTemp.length - 1);
									break;
								case "Prairie Zone Stock":
									BpDealerTemp[i].dummyFieldForSort = BpDealerTemp.length - (BpDealerTemp.length - 2);
									break;
								case "National Demo":
									BpDealerTemp[i].dummyFieldForSort = BpDealerTemp.length - (BpDealerTemp.length - 6);
									break;
								case "Central Zone Stock":
									BpDealerTemp[i].dummyFieldForSort = BpDealerTemp.length - (BpDealerTemp.length - 3);
									break;
								case "Quebec Zone Stock":
									BpDealerTemp[i].dummyFieldForSort = BpDealerTemp.length - (BpDealerTemp.length - 4);
									break;
								case "Atlantic Zone Stock":	
									BpDealerTemp[i].dummyFieldForSort = BpDealerTemp.length - (BpDealerTemp.length - 5);
									break;
								}

							} else {
								
								BpDealerTemp[i].dummyFieldForSort = i + 7;
							}
						}

						// that.getView().setModel(new sap.ui.model.json.JSONModel(BpDealer2), "BpDealerModel");
						// sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(BpDealer2), "LoginBpDealerModel");
						// that.getView().setModel(new sap.ui.model.json.JSONModel(BpDealerTemp), "BpDealerModelZone");
						var data = _thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0];
						LoggedInDealerCode1 = data.Dealer;
						// var LoggedInDealerCode1 = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
						// var LoggedInDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');
					var dealer=	BpDealerTemp.filter(function (x) {
					return x.BusinessPartner != LoggedInDealerCode1;
				});
					that.getView().setModel(new sap.ui.model.json.JSONModel(dealer), "BpDealerModelZone");

						// that.getView().byId("oDealerCode4").setText(LoggedInDealerCode1);
						// that.getView().byId("oDealerOwnVehiSele").setText(LoggedInDealer);

					sap.ui.core.BusyIndicator.hide(); // close the Busy indicator
				}.bind(this),
				error: function (response) {
					sap.ui.core.BusyIndicator.hide();
				}
			});

		},
		onDealerChange: function(){
			
						// var that = this;
		
				// var oDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerKey;

			// var Series = this.getOwnerComponent().SelectedMSMData[0].SeriesCmbo;

			// var sLocation = window.location.host;
			// var sLocation_conf = sLocation.search("webide");

			// if (sLocation_conf == 0) {
			// 	this.sPrefix = "/vehicleLocatorNode";
			// } else {
			// 	this.sPrefix = "";

			// }

			// this.nodeJsUrl = this.sPrefix + "/node";
			var oDealer = LoggedInDealerCode1;
			this.oDataUrl = _thatVD.nodeJsUrl + "/Z_VEHICLE_MASTER_SRV";
var vtn = _thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].ZZVTN;
                       var oDealer1 =sap.ui.getCore().byId("VLRDealer").getSelectedKey();
        		 	if(oDealer1.length == 10){
		 	oDealer1=oDealer1.slice(-5);
					 }	
			var SeriesUrl = this.oDataUrl + "/ZVMS_CDS_ETA_consolidate('" + oDealer1 + "')/Set?$filter=kunnr eq '" + oDealer +
				"' and zzvtn eq '"+vtn+"'&$format=json";
var that = this;
			$.ajax({
				url: SeriesUrl,
				type: "GET",
				dataType: 'json',
				xhrFields: //
				{
					withCredentials: true
				},

				success: function (odata, oresponse) {

					var a = odata.d.results;
					

					var FilterDelearNotnull = a.filter(function (x) {
						return x.kunnr != null;
					});
				
					var ExcludeOrdType = [
						"RS",
						"F1",
						"F2",
						"F3",
						"F4",
						"F5",
						"DM"
					];
				
					var oExcludeOrdrtype = [];
					for (var i = FilterDelearNotnull.length - 1; i >= 0; --i) {
						if (ExcludeOrdType.indexOf((FilterDelearNotnull[i].zzordertype)) == -1) {
							oExcludeOrdrtype.push(FilterDelearNotnull[i]);
						}
					}

					//        var oJsonModel = new sap.ui.model.json.JSONModel(oExcludeOrdrtype);
					var IncludeOrdertype = oExcludeOrdrtype.filter(function (x) {
						return (x.zzordertype == "SO" );
					});
					var oJsonModel = new sap.ui.model.json.JSONModel(IncludeOrdertype);
					
				// for (var i = 0; i < oJsonModel.oData.length; i++) {
				// 	if (oJsonModel.oData[i].dnc_ind == "Y") {
				// 		oJsonModel.oData[i].zzordertype = "DNC";
				// 	}
				// }
	if(oJsonModel.oData.length==1){
			if (oJsonModel.oData[0].zz_trading_ind == "1") {
				TradingInd ="1";
					sap.ui.getCore().byId("txt_routable").setVisible(false);
					sap.ui.getCore().byId("txt_nonroutable").setVisible(true);
					sap.ui.getCore().byId("txt_nontradeable").setVisible(false);
					sap.ui.getCore().byId("btn_yes").setVisible(true);
					sap.ui.getCore().byId("btn_no").setVisible(true);
					sap.ui.getCore().byId("btn_close").setVisible(false);

					}
					else
					{
							TradingInd ="2";
							sap.ui.getCore().byId("txt_routable").setVisible(true);
sap.ui.getCore().byId("btn_yes").setVisible(true);
					sap.ui.getCore().byId("btn_no").setVisible(true);
					sap.ui.getCore().byId("btn_close").setVisible(false);
					sap.ui.getCore().byId("txt_nontradeable").setVisible(false);
					sap.ui.getCore().byId("txt_nonroutable").setVisible(false);
					}
	}
	else {
						sap.ui.getCore().byId("txt_routable").setVisible(false);
					sap.ui.getCore().byId("txt_nonroutable").setVisible(false);
					sap.ui.getCore().byId("txt_nontradeable").setVisible(true);
					sap.ui.getCore().byId("btn_yes").setVisible(false);
					sap.ui.getCore().byId("btn_no").setVisible(false);
					sap.ui.getCore().byId("btn_close").setVisible(true);
	}
					
					// oJsonModel.setSizeLimit(15000);
				// 	sap.ui.getCore().setModel(oJsonModel, "oVehicleSelectionResults");
				// 				var oModeltemp = that.getView().setModel(oJsonModel, "vehicleSelectTableModel");
				// oModeltemp.updateBindings(true);

					/*  sap.ui.core.BusyIndicator.hide();*/

				},
				error: function () {
				
					/*	 sap.ui.core.BusyIndicator.hide();*/
				}
			});
// 				if (sap.ui.getCore().getModel("oVehicleSelectionResults") != undefined) {
// 				var oVehicleModel = sap.ui.getCore().getModel("oVehicleSelectionResults");

// 				// set the model	
// 				var model = new sap.ui.model.json.JSONModel(oVehicleModel).getData();
// 				//    var model = oVehicleModel.getData();
// 				model.setSizeLimit(10000);

		

// 				var oModeltemp = this.getView().setModel(model, "vehicleSelectTableModel");
// 				oModeltemp.updateBindings(true);
// 				}

// that.getView().byId("oVt_MoyrCmbo").setEnabled(false);

			// this.onStatusChange();
		
		},
		onYesClick: function(){

							var Trade_Return = "N";
							var Trade_Status = "S";

						var Requesting_Dealer = LoggedInDealerCode1;
 var Requested_Dealer =sap.ui.getCore().byId("VLRDealer").getSelectedKey();
    //     		 	if(Requested_Dealer.length == 10){
		 	// Requested_Dealer=Requested_Dealer.slice(-5);
				// 	 }	
			// var Requesting_Dealer_Name = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName;
			var data = _thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0];
			var Proposed_ETA_To,Proposed_ETA_From;
				var that = this;
			// that.oSelectedItem = oEvt.getSource().getBindingContext().getObject();

			// that.oSelectedItem = data;
			// that.oSelectedItem.FromFourth = "FromPush";
			var VTN = data.ZZVTN;

			//  the offered vehicle should send the dealer code of login dealer. 	 23rd MAy. 
			// var dealercode = that.oSelectedItem.kunnr.slice(-5);
			// var oReceivedData = sap.ui.getCore().SelectedTrade;

			// if (oReceivedData != undefined) {
			// 	var dealercode = oReceivedData.kunnr.slice(-5);
			// } else { // when navigating from model block screen, pick a different one. 
				var dealercode = data.Dealer.slice(-5);

			// }
 var oDealer1 =sap.ui.getCore().byId("VLRDealer").getSelectedKey();
 	_thatVD.CurrentETAFrom = data.zzadddata4;
 							_thatVD.CurrentETATo = data.pstsp;

    //     		 	if(oDealer1.length == 10){
		 	// oDealer1=oDealer1.slice(-5);
				// 	 }
					 var oDealerName = sap.ui.getCore().byId("VLRDealer").getValue().substr(sap.ui.getCore().byId("VLRDealer").getValue().indexOf(
							"-") + 1).trim();
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/pipelineInventory-dest";
			} else {
				this.sPrefix = "";

			}

			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_DEALER_TRADE_REQUEST_SRV";
			var SeriesUrl = that.oDataUrl + "/CalculateETASet?$filter=VTN eq '" + VTN + "' and DelearCode eq '" + dealercode + "'&$format=json";
			var ajax = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				},
				url: SeriesUrl,
				async: true,
				success: function (result) {
					//debugger;
					var Data = result.d.results[0];
					/*	Data.MessageType="";
						Data.Calculate="20181126";*/
					if (Data.MessageType != "E") {
					
						if (_thatVD.CurrentETAFrom != null && _thatVD.CurrentETAFrom != "") {

							_thatVD.CurrentETAFrom = _thatVD.CurrentETAFrom.replace(/(\d{4})(\d{2})(\d{2})/g, '$2/$3/$1');
						}

						if (_thatVD.CurrentETATo != null && _thatVD.CurrentETATo != "") {
							var dateTo = _thatVD.CurrentETATo.split("(")[1];
							if (_thatVD.CurrentETATo.indexOf("+") != -1) {
								/*dateTo = dateTo.split("+")[0];*/
								_thatVD.CurrentETATo = new Date(_thatVD.CurrentETATo.split("(")[1].substring(0, 10) * 1000).toDateString().substring(4, 15);
								var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
									pattern: "MM/dd/yyyy"
								});
								_thatVD.CurrentETATo = oDateFormat.format(new Date(CurrentETATo));

							} else {
								dateTo = dateTo;
								var dataTo1 = dateTo.substring(0, dateTo.length - 5);
								var ValidTo = new Date(dataTo1 * 1000);
								ValidTo = ValidTo.toGMTString().substring(4, 16);
								var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
									pattern: "MM/dd/yyyy"
								});
								_thatVD.CurrentETATo = oDateFormat.format(new Date(ValidTo));
							}

						}

						if ((_thatVD.CurrentETAFrom == "" || _thatVD.CurrentETAFrom == null) && (_thatVD.CurrentETATo != "" && _thatVD.CurrentETATo != null)) {
							CurrentETAFrom = CurrentETATo;
						} else if ((_thatVD.CurrentETAFrom != "" && _thatVD.CurrentETAFrom != null) && (_thatVD.CurrentETATo == "" || _thatVD.CurrentETATo == null)) {
							_thatVD.CurrentETATo = _thatVD.CurrentETAFrom;
						} else if ((_thatVD.CurrentETAFrom == "" || _thatVD.CurrentETAFrom == null) && (_thatVD.CurrentETATo == "" || _thatVD.CurrentETATo == null)) {
							/*CurrentETATo=Data.Calculate.replace(/(\d{4})(\d{2})(\d{2})/g, '$2/$3/$1')
							CurrentETAFrom=Data.Calculate.replace(/(\d{4})(\d{2})(\d{2})/g, '$2/$3/$1')*/
						}

						var date1 = new Date(_thatVD.CurrentETAFrom);
						var date2 = new Date(_thatVD.CurrentETATo);
						var timeDiff = Math.abs(date2.getTime() - date1.getTime());
						var CurrentEtadiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

						function addDays(date, days) {
							var result = new Date(date);
							result.setDate(result.getDate() + days);
							return result;
						}
						var Eta = Data.Calculate;
						var Calculate = Eta.replace(/(\d{4})(\d{2})(\d{2})/g, '$2/$3/$1');

						Proposed_ETA_To = addDays(Calculate, CurrentEtadiff);
						if (Proposed_ETA_To != "Invalid Date") {
							Proposed_ETA_To = Proposed_ETA_To;
						} else {
							Proposed_ETA_To = "";
						}
						Proposed_ETA_From = Data.Calculate;
							var data = _thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0];
		var Requesting_Dealer_Name ;//= Dealer_Name;

	var data1 ={};
	var pd_flag,dnc;
	if(data.AccessInstl_flag ==false)
	{
		pd_flag = "";
	}
	else
	{
		pd_flag = "D";
	}
	if(data.ZZORDERTYPE =="SR")
	{
		dnc = "Y";
	}
	else
	{
		dnc = "N";
	}
			data1.zzmoyr = data.Modelyear;
			data1.matnr = data.Model;
			// data1.serieskey = data.TCISeries;
			 data1.zzsuffix = data.Suffix;
			 data1.zzapx = data.APX;
			 data1.zzextcol = data.ExteriorColorCode;
			 data1.zzvtn = data.ZZVTN;
			 data1.pstsp = _thatVD.CurrentETATo;
			 data1.zzadddata4 = _thatVD.CurrentETAFrom;
			 data1.FromFourth ="FromPush";
			 data1.kunnr = Requested_Dealer;
data1.name1 = oDealerName;
data1.vhvin = data.VHVIN;
data1.zzseries=data.TCISeries;

data1.zzintcol=data.INTCOL;   
data1.zzseries_desc_en = data.SERIES_DESC_EN;
data1.zzseries_desc_fr=data.SERIES_DESC_FR;
data1.model_desc_en=data.MODEL_DESC_EN;
data1.model_desc_fr=data.MODEL_DESC_FR;
data1.suffix_desc_en=data.SUFFIX_DESC_EN;
data1.suffix_desc_fr=data.SUFFIX_DESC_FR;
data1.mktg_desc_en=data.EXTCOL_DESC_EN;
data1.mktg_desc_fr=data.EXTCOL_DESC_FR;
data1.mrktg_int_desc_en  = data.INTCOL_DESC_EN;
data1.mrktg_int_desc_fr=data.INTCOL_DESC_FR;
data1.non_D_flag ="";
data1.pd_flag = pd_flag;
data1.zz_trading_ind = TradingInd;
data1.zzordertype=data.ZZORDERTYPE;
data1.Proposed_ETA_From = Proposed_ETA_From;
data1.Proposed_ETA_To = Proposed_ETA_To;
data1.dnc_ind = dnc;
data1.Requesting_Dealer= Requesting_Dealer;
data1.Requesting_Dealer_Name = Requesting_Dealer_Name;
var str = JSON.stringify(data1);
			// var keys = "ModelYear:" + modelyear + ",Model:" + modelkey + ",Series:" + serieskey + ",Suffix:" + suffixkey + ",APX:" + apxkey + ",Color:" + colorkey + ",VTN:" + vtnn + ",FromDate:" +
			// 	fromdate + ",ToDate:" + todate + "/";
	var vehiclelocatorandtradeAppUrl = sap.ui.getCore().getModel("configDataModel").getData().vehiclelocatorandtradeAppUrl;
	// var vehiclelocatorandtradeAppUrl=  "https://webidetesting0203702-d36z7bqhz1.dispatcher.ca1.hana.ondemand.com/webapp/index.html";
			var url = vehiclelocatorandtradeAppUrl + "?&Division=" + Division + "&Language=" + sSelectedLocale + "#/VehicleTrade_CreateSingle/"+str;
			window.location.href = url;
		// 			 that.oSelectedItem.Requested_Dealer = oDealer1;
		// 			 that.oSelectedItem.Requested_Dealer_Name = oDealerName;
		// 				that.oSelectedItem.FromFourth = "FromPush";
		// 							var TradeModel = new sap.ui.model.json.JSONModel(null);
		// sap.ui.getCore().setModel(TradeModel,"TradeModel");
}
}
});

						//that.selectedTrade=escape(JSON.stringify(that.selectedTrade));
						// if (that.SelectedVehicleFrom == "VehileTrade_CreateSingle") {
						// 	sap.ui.getCore().getModel("TradeModel").setProperty("/VehicleTradeVehicle", that.oSelectedItem);
						// 	//	var oSelectedStrItems = JSON.stringify(oSelectedItem);
						// 	that.getRouter().navTo("VehicleTrade_CreateSingle", {
						// 		SelectedTrade: "VehicleTradeVehicle"
						// 	});
						// }
			// var modelyear = data.Modelyear;
			// var modelkey = data.Model;
			// var serieskey = data.TCISeries;
			// var suffixkey = data.Suffix;
			// var apxkey = data.APX;
			// var colorkey = data.ExteriorColorCode;
			// var vtnn = data.ZZVTN;
			// var todate = data.ETATo;
			// var fromdate = data.ETAFrom;
			// 			var Requested_Vtn ;
			// 			// var Requested_Vtn = that.getView().getModel("TradeModel").getData().zzvtn;
			// 			var Offered_Vtn = vtnn;
			// 			var DateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
			// 				pattern: "yyyy-MM-dd"
			// 			});
 
			// 			var Req_Current_ETA_FromData ="";
			// 			if (Req_Current_ETA_FromData != "") {
			// 				var Req_Current_ETA_From = new Date(oDateFormat.format(new Date(Req_Current_ETA_FromData)));
			// 			} else {
			// 				var Req_Current_ETA_From = "0000-00-00T00:00:00";
			// 			}
					 
			// 			var Req_Current_ETA_ToDate="";
			// 				// var Req_Current_ETA_ToDate = Req_Current_ETA_ToDate.replace("To : ", "");
							
			// 				// var Req_Current_ETA_ToDate = Req_Current_ETA_ToDate.replace("À : ", "");
			// 			if (Req_Current_ETA_ToDate != "" && Req_Current_ETA_ToDate != " ") {
			// 				var Req_Current_ETA_To = new Date(oDateFormat.format(new Date(Req_Current_ETA_ToDate)));
			// 			} else {
			// 				var Req_Current_ETA_To = "0000-00-00T00:00:00";
			// 			}
	 
			// 			var Req_Proposed_ETA_FromDate ="";

			// 			// if (Req_Proposed_ETA_FromDate != "") {
			// 			// 	var Req_Proposed_ETA_From = new Date(oDateFormat.format(new Date(Req_Proposed_ETA_FromDate)));
			// 			// } else {
			// 			// 	var Req_Proposed_ETA_From = "0000-00-00T00:00:00";
			// 			// }
			// 			var Req_Proposed_ETA_ToDate ="";
			// 						// var Req_Proposed_ETA_ToDate = Req_Proposed_ETA_ToDate.replace("To : ", "");
			// 						// var Req_Proposed_ETA_ToDate = Req_Proposed_ETA_ToDate.replace("À : ", "");
			// 			// if (Req_Proposed_ETA_ToDate != "") {
			// 			// 	var Req_Proposed_ETA_To = new Date(oDateFormat.format(new Date(Req_Proposed_ETA_ToDate)));
			// 			// } else {
			// 			// 	var Req_Proposed_ETA_To = "0000-00-00T00:00:00";
			// 			// }

			// 			var Off_Current_ETA_FromDate= fromdate;
			// 			if (Off_Current_ETA_FromDate != "") {
			// 				var Off_Current_ETA_From = new Date(oDateFormat.format(new Date(Off_Current_ETA_FromDate)));
			// 			} else {
			// 				var Off_Current_ETA_From = "0000-00-00T00:00:00";
			// 			}
			// 			var Off_Current_ETA_ToDate = todate;
			// 			// var Off_Current_ETA_ToDate = Off_Current_ETA_ToDate.replace("To : ", "");
			// 			// 	var Off_Current_ETA_ToDate = Off_Current_ETA_ToDate.replace("À : ", "");

			// 			if (Off_Current_ETA_ToDate != "") {
			// 				var Off_Current_ETA_To = new Date(oDateFormat.format(new Date(Off_Current_ETA_ToDate)));
			// 			} else {
			// 				var Off_Current_ETA_To = "0000-00-00T00:00:00";
			// 			}

			// 			var Off_Proposed_ETA_FromDate = "";
			// 			if (Off_Proposed_ETA_FromDate != "") {
			// 				var Off_Proposed_ETA_From = new Date(oDateFormat.format(new Date(Off_Proposed_ETA_FromDate)));
			// 			} else {
			// 				var Off_Proposed_ETA_From = "0000-00-00T00:00:00";
			// 			}

			// 			var Off_Proposed_ETA_ToDate = "";
			// 			// var Off_Proposed_ETA_ToDate = Off_Proposed_ETA_ToDate.replace("To : ", "");
			// 			// var Off_Proposed_ETA_ToDate = Off_Proposed_ETA_ToDate.replace("À : ", "");
						
			// 			if (Off_Proposed_ETA_ToDate != "") {
			// 				var Off_Proposed_ETA_To = new Date(oDateFormat.format(new Date(Off_Proposed_ETA_ToDate)));
			// 			} else {
			// 				var Off_Proposed_ETA_To = "0000-00-00T00:00:00";
			// 			}
			// 			// var LoggedinUserFname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserFirstName;
			// 			// var LoggedinUserLname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserLastName;
			// 			// var Created_By = LoggedinUserFname + LoggedinUserLname;

			// 			function truncateString(str, num) {
			// 				if (num > str.length) {
			// 					return str;
			// 				} else {
			// 					str = str.substring(0, num);
			// 					return str;
			// 				}

			// 			};

			// 			// Created_By = truncateString(Created_By, 12);
			// 			// var Created_On = new Date();

			// 			// var estTimeZone = moment.tz(Created_On, "America/New_York");
			// 			// Created_On = moment(estTimeZone).format('YYYY-MM-DD');

			// 			// // Created_On = oDateFormat.format(new Date(Created_On));

			// 			// var Changed_on = new Date();
			// 			// Changed_on = moment(estTimeZone).format('YYYY-MM-DD');

			 
			// 			var Requested_Dealer = data.Dealer;
			// 			var Requested_Dealer_Name = that.getView().byId("txt_orderingDealer").getText().substr(that.getView().byId("txt_orderingDealer").getText().indexOf(
			// 				"-") + 1);
// if(that.getView().byId("FromFourth").getText() == "FromPush")
// 			{
				// var Requested_Dealer = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.Requested_Dealer;
				// 		var Requested_Dealer_Name = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.Requested_Dealer_Name.substr(that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.Requested_Dealer_Name.indexOf(
				// 			"-") + 1);
// }
// var oEntry = {



// 							"Trade_Id": Trade_Id,
// 							"Trade_Status": Trade_Status,
// 							"Requesting_Dealer": Requesting_Dealer,
// 							"Requesting_Dealer_Name": Requesting_Dealer_Name.substring(0, 35),        //str.substring(0, 10);
// 							"Requested_Vtn": Requested_Vtn,
// 							"Offered_Vtn": Offered_Vtn,
// 							"Trade_Return": Trade_Return,
// 							"Req_Current_ETA_From": Req_Current_ETA_From,
// 							"Req_Current_ETA_To": Req_Current_ETA_To,
// 							"Req_Proposed_ETA_From": Req_Proposed_ETA_From,
// 							"Req_Proposed_ETA_To": Req_Proposed_ETA_To,
// 							"Off_Current_ETA_From": Off_Current_ETA_From,

// 							"Off_Current_ETA_To": Off_Current_ETA_To,
// 							"Off_Proposed_ETA_From": Off_Proposed_ETA_From,
// 							"Off_Proposed_ETA_To": Off_Proposed_ETA_To,
// 							"Created_By": Created_By,
// 							"Created_On": new Date(Created_On),
// 							"Changed_on": new Date(Changed_on),
// 							"Requested_Dealer": Requested_Dealer,
// 							"Requested_Dealer_Name": Requested_Dealer_Name.substring(0, 35)

// 						};

						// var sLocation = window.location.host;
						// var sLocation_conf = sLocation.search("webide");

						// if (sLocation_conf == 0) {
						// 	that.sPrefix = "/PipelineInventory_Xsodata";
						// } else {
						// 	that.sPrefix = "";

						// }
						// that.nodeJsUrl = that.sPrefix;
						// that.oDataUrl = that.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata";

						// that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
						// that.oDataModel.setHeaders({
						// 	"Content-Type": "application/json",
						// 	"X-Requested-With": "XMLHttpRequest",
						// 	"DataServiceVersion": "2.0",
						// 	"Accept": "application/json",
						// 	"Method": "POST"
						// });

						// that.oDataModel.create("/TradeRequest", oEntry, null, function (s) {
						// 	//	that.getView().byId("oTrdareqstat").setText("Request Sent");
						// 	// if (that.getView().byId("oTypeHere").getValue() != "" && that.getView().byId("oTypeHere").getValue() != " ") {
						// 	// 	that.TradeComment(oEntry);
						// 	// }
						// 	//	if(that.getView().byId("FromFourth").getText()=="FromFourth"){
						// 	that.TradeVehcles(oEntry);
						// 	//	}
						// 	that.TradeStatus(oEntry);
							/*	that.VehicleTrade_Summary();*/

							//	that.getRouter().navTo("VehicleTrade_Summary");
				// 		}, function () {

				// 		});

				// 	},
				// 	error: function (response) {

				// 	}
				// });

			// }
		

				},
				TradeVehcles: function (oEntry) {

			var that = this;
			var Trade_Id = oEntry.Trade_Id;

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
		
			});

						var oVehicleDetails = [];
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

			// if (that.getView().byId("FromFourth").getText() != "FromPush") {

			var oSuffixReq = suffixkey;
			var omodelReq = modelkey;
			var omodelYearReq = modelyear;
			var oApxReq = apxkey;
			var oSeriesReq = serieskey;
			var oexteriorReq = data.ExteriorColorCode;
			var ointeriorReq = data.INTCOL;
			var ovtnReq = vtnn;
			var ovinReq = data.VHVIN;
			var accIns = data.AccessInstl_flag;
			if(accIns==true)
			{
				accIns='Y';
			}
			else
			{
				accIns='N';
			}
			var ostatusReq = 	TradingInd ;

			var oOrdertypeReq = data.ZZORDERTYPE;
				// oOrdertypeReq = oOrdertypeReq.substring(0, 2);

			var oDNCreq = data.DNC_flag;
			if(oDNCreq==true)
			{
				oDNCreq='Y';
			}
			else
			{
				oDNCreq='N';
			}

			var oEntry2 = {
				APX: oApxReq,
				DNC: oDNCreq,
				Ext_Colour: oexteriorReq,
				Int_Colour: ointeriorReq,
				Model: omodelReq,
				Model_Year: omodelYearReq,
				Order_Type: oOrdertypeReq,
				Series: oSeriesReq,
				Status: ostatusReq,
				Suffix: oSuffixReq,
				VTN: ovtnReq,
				VIN:ovinReq,
				AccessoryInstalled:accIns
			};
			oEntry2["Trade_Id"] = oEntry.Trade_Id;
			oVehicleDetails.push(oEntry2);
			// }
			// if ((that.getView().byId("FromFourth").getText() == "FromFourth")||(that.getView().byId("FromFourth").getText() == "FromPush")) {
			// 	var Suffix = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzsuffix;

			// 	var intColor = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzintcol;

			// 	var model = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.matnr;
			// 	var modelYear = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzmoyr;
			// 	var Apx = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzapx;
			// 	var Series = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzseries;
			// 	var exterior = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzextcol;
			// 	var vtn = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzvtn;
			// 	var vin = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.vhvin;
			// 	var accInstalled = that.getView().byId("accid").getText();
			// 	if(accInstalled=="Yes")
			// 	{
			// 		accInstalled ='Y';
			// 	}
			// 	else
			// 	{
			// 		accInstalled ='N';
			// 	}
			// 	var ostatus = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zz_trading_ind;
			// 	var oOrdertype = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzordertype;
			// 			oOrdertype = oOrdertype.substring(0, 2);			
			// 	var DNC = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.dnc_ind;
			// 	var oEntry1 = {
			// 		APX: Apx,
			// 		DNC: DNC,
			// 		Ext_Colour: exterior,
			// 		Int_Colour: intColor,
			// 		Model: model,
			// 		Model_Year: modelYear,
			// 		Order_Type: oOrdertype,
			// 		Series: Series,
			// 		Status: ostatus,
			// 		Suffix: Suffix,
			// 		VTN: vtn,
			// 		VIN:vin,
			// 		AccessoryInstalled:accInstalled
			// 	};
			// 	oEntry1["Trade_Id"] = oEntry.Trade_Id;
			// 	oVehicleDetails.push(oEntry1);
			// }

 
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				that.sPrefix = "/PipelineInventory_Xsodata";
			} else {
				that.sPrefix = "";

			}
			that.nodeJsUrl = that.sPrefix;
			that.oDataUrl = that.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			that.oDataModel.setHeaders({
				"Content-Type": "application/json",
				"X-Requested-With": "XMLHttpRequest",
				"DataServiceVersion": "2.0",
				"Accept": "application/json",
				"Method": "POST"
			});

			/*	that.oDataModel.create("/TradeVehicles", oEntry1, null, function (s) {*/
			for (var i = 0; i < oVehicleDetails.length; i++) {
				that.oDataModel.create("/TradeVehicles", oVehicleDetails[i], null, function (s) {
					/*	alert("ok");*/
				}, function () {

				});
			}
		},

		TradeStatus: function (oEntry) {

			var that = this;
			var Trade_Id = oEntry.Trade_Id;

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
					/*pattern: "yyyy-MM-dd"*/
			});
			// var oCommentdate = oDateFormat.format(new Date());


			//	var Spars = sap.ui.getCore().getConfiguration().getLanguage();
			//	var Spars = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language.slice(0, 1); //GSR
			var Spars;
			if (that.sCurrentLocaleD == "French") {
				Spars = "F";
			} else {
				Spars = "E";
			}

			// if (Spars != "E") {
			// 	Spars = "F";
			// } else {
			// 	Spars = "E";
			// }
			//	var oVTN = that.getView().byId("vtnid").getText();

			// ENTRY1 VALUES DESCRIPTION;
			var Tradestatus = [];
// if(that.getView().byId("FromFourth").getText() != "FromPush"){
// 			var oVTN = that.getView().getModel("TradeModel").getData().zzvtn;
// 			var oModel_DescReq = that.getView().getModel("TradeModel").getData().model_desc_en;
// 			var oSeries_DescReq = that.getView().getModel("TradeModel").getData().zzseries_desc_en;
// 			var oSuffix_DescReq = that.getView().getModel("TradeModel").getData().suffix_desc_en;
// 			var oInt_Colour_DescReq = that.getView().getModel("TradeModel").getData().mrktg_int_desc_en;
// 			var oExt_Colour_DescReq = that.getView().getModel("TradeModel").getData().mktg_desc_en;

// 			var Entry1 = {

// 				SPRAS: "E",
// 				Model_Desc: oModel_DescReq.substring(0, 40),
// 				Series_Desc: oSeries_DescReq.substring(0, 50),
// 				Suffix_Desc: oSuffix_DescReq.substring(0, 30),
// 				Int_Colour_Desc: oInt_Colour_DescReq.substring(0, 30),
// 				Ext_Colour_Desc: oExt_Colour_DescReq.substring(0, 50),

// 			};
// 			Entry1["Trade_Id"] = oEntry.Trade_Id;
// 			Entry1["VTN"] = oVTN;
// 			Tradestatus.push(Entry1);
// 			var oVTN = that.getView().getModel("TradeModel").oData.zzvtn;
// 			// var oModel_DescReqF = that.getView().getModel("TradeModel").getData().model_desc_en;
// 			var oModel_DescReqF = that.getView().getModel("TradeModel").getData().model_desc_fr;
// 			var oSeries_Desc1ReqF = that.getView().getModel("TradeModel").getData().zzseries_desc_fr;
// 			var oSuffix_Desc1ReqF = that.getView().getModel("TradeModel").getData().suffix_desc_fr;
// 			var oInt_Colour_Desc1ReqF = that.getView().getModel("TradeModel").getData().mrktg_int_desc_fr;
// 			var oExt_Colour_Desc1ReqF = that.getView().getModel("TradeModel").getData().mktg_desc_fr;

// 			var Entry2 = {

// 				SPRAS: "F",
// 				Model_Desc: oModel_DescReqF.substring(0, 40),
// 				Series_Desc: oSeries_Desc1ReqF.substring(0, 50),
// 				Suffix_Desc: oSuffix_Desc1ReqF.substring(0, 30),
// 				Int_Colour_Desc: oInt_Colour_Desc1ReqF.substring(0, 30),
// 				Ext_Colour_Desc: oExt_Colour_Desc1ReqF.substring(0, 50)

// 			};
// 			Entry2["Trade_Id"] = oEntry.Trade_Id;
// 			Entry2["VTN"] = oVTN;
// 			Tradestatus.push(Entry2);
// }
			// if ((that.getView().byId("FromFourth").getText() == "FromFourth")||(that.getView().byId("FromFourth").getText() == "FromPush")) {
				var data = _thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0];

				var oVTN = data.ZZVTN;
				var oModel_Desc = data.MODEL_DESC_EN;
				var oSeries_Desc = data.SERIES_DESC_EN;
				var oSuffix_Desc = data.SUFFIX_DESC_EN;
				var oInt_Colour_Desc = data.INTCOL_DESC_EN;
				var oExt_Colour_Desc = data.EXTCOL_DESC_EN;

				var Entry3 = {

					SPRAS: "E",
					Model_Desc: oModel_Desc.substring(0, 40),
					Series_Desc: oSeries_Desc.substring(0, 50),
					Suffix_Desc: oSuffix_Desc.substring(0, 30),
					Int_Colour_Desc: oInt_Colour_Desc.substring(0, 30),
					Ext_Colour_Desc: oExt_Colour_Desc.substring(0, 50)

				};
				Entry3["Trade_Id"] = oEntry.Trade_Id;
				Entry3["VTN"] = oVTN;
				Tradestatus.push(Entry3);
				var oModel_Desc1 = data.MODEL_DESC_FR;
				var oSeries_Desc1 = data.SERIES_DESC_FR;
				var oSuffix_Desc1 = data.SUFFIX_DESC_FR;
				var oInt_Colour_Desc1 = data.INTCOL_DESC_FR;
				var oExt_Colour_Desc1 = data.EXTCOL_DESC_FR;

				var Entry4 = {

					SPRAS: "F",
					Model_Desc: oModel_Desc1.substring(0, 40),
					Series_Desc: oSeries_Desc1.substring(0, 50),
					Suffix_Desc: oSuffix_Desc1.substring(0, 30),
					Int_Colour_Desc: oInt_Colour_Desc1.substring(0, 30),
					Ext_Colour_Desc: oExt_Colour_Desc1.substring(0, 50)

				};
				Entry4["Trade_Id"] = oEntry.Trade_Id;
				Entry4["VTN"] = oVTN;
				Tradestatus.push(Entry4);

			// }

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				that.sPrefix = "/PipelineInventory_Xsodata";
			} else {
				that.sPrefix = "";

			}
			that.nodeJsUrl = that.sPrefix;
			that.oDataUrl = that.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			that.oDataModel.setHeaders({
				"Content-Type": "application/json",
				"X-Requested-With": "XMLHttpRequest",
				"DataServiceVersion": "2.0",
				"Accept": "application/json",
				"Method": "POST"
			});
			for (var i = 0; i < Tradestatus.length; i++) {
				that.oDataModel.create("/TradeVehicleDesc", Tradestatus[i], null, function (s) {
					that.getRouter().navTo("VehicleTrade_Summary", {
						DataClicked: "Yes"
					});
				}, function () {

				});
			}
		},
			onNoClick: function(){
				sap.ui.getCore().byId("VLRDealer").setSelectedKey(null);
				sap.ui.getCore().byId("txt_routable").setVisible(false);
					sap.ui.getCore().byId("txt_nonroutable").setVisible(false);
					sap.ui.getCore().byId("txt_nontradeable").setVisible(false);
					sap.ui.getCore().byId("btn_yes").setVisible(false);
					sap.ui.getCore().byId("btn_no").setVisible(false);
					sap.ui.getCore().byId("btn_close").setVisible(true);
				_thatVD._oSettingsDialog.close();
		},
			onCloseClick: function(){
				sap.ui.getCore().byId("txt_routable").setVisible(false);
					sap.ui.getCore().byId("txt_nonroutable").setVisible(false);
					sap.ui.getCore().byId("txt_nontradeable").setVisible(false);
					sap.ui.getCore().byId("btn_yes").setVisible(false);
					sap.ui.getCore().byId("btn_no").setVisible(false);
					sap.ui.getCore().byId("btn_close").setVisible(true);
				sap.ui.getCore().byId("VLRDealer").setSelectedKey(null);
				_thatVD._oSettingsDialog.close();
		},
		
		getAPXData: function (data) {
			$.ajax({
				dataType: "json",
				url: _thatVD.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_APX?$filter=zzmoyr eq '" + data.Modelyear + "' and zzmodel eq '" +
					data.Model + "' and zzsuffix eq '" + data.Suffix + "'",
				type: "GET",
				success: function (oRowData) {
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
					_thatVD.SoldOrderBlock = oRowData.d.SoldOrderBlock;
					if (_thatVD.SoldOrderBlock == "X" && (sap.ui.getCore().getModel("BusinessDataModel").getData().SamlList.UserType[0] !==
							"Dealer") && _thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].ZZORDERTYPE == "RS") {
						_thatVD.getView().getModel("LocalVDModel").setProperty("/soldOrderEnabled", false);
					} else if (_thatVD.SoldOrderBlock == "" && (sap.ui.getCore().getModel("BusinessDataModel").getData().SamlList.UserType[0] ==
							"Dealer") && _thatVD.oVehicleDetailsJSON.getData().selectedVehicleData[0].ZZORDERTYPE !== "RS") {
						_thatVD.getView().getModel("LocalVDModel").setProperty("/soldOrderEnabled", true);
					}
					_thatVD.APX_ChangeFlag = oRowData.d.APX_ChangeFlag;
					if (_thatVD.APX_ChangeFlag == "X") {
						_thatVD.getView().getModel("LocalVDModel").setProperty("/APXEnabled", true);
					} else {
						_thatVD.getView().getModel("LocalVDModel").setProperty("/APXEnabled", false);
					}
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
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(_thatVD);
				oRouter.navTo("details");
			}
		},
		onDNCOptionSlection: function (oDNCVal) {
			this.oBundle = this.getView().getModel("i18n").getResourceBundle(); //this.oBundle.getText("DNDemoLoanerVehicle")
			if (oDNCVal.getParameters().selectedItem !== null) {
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

		onAddComment: function (oVal) {
			// console.log("val", oVal);
			_thatVD.getView().getModel("VehicleDetailsJSON").updateBindings(true);
			// debugger;
		},
		navToPushTrade:function(){

			if (!_thatVD._oSettingsDialog) {
				_thatVD._oSettingsDialog = sap.ui.xmlfragment("pipelineInventory.view.fragments.PushTradePopup", _thatVD);
				_thatVD.getView().addDependent(_thatVD._oSettingsDialog);
				// _thatVD._oSettingsDialog.open("filter");

				// _thatVD.setModel(_thatVD.VehicleDetailsJSON, "VehicleDetailsJSON");
			}
			_thatVD._oSettingsDialog.open();
		},
		/*Navigate to Order Change screen*/
		NavToOrderChange: function () {
			var obj = _thatVD.getView().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0];
			var oRouter = sap.ui.core.UIComponent.getRouterFor(_thatVD);
			obj.newAPXValues = [];
			for (var m = 0; m < _thatVD.getView().getModel("VehicleDetailsJSON").getData().APXData.length; m++) {
				obj.newAPXValues.push(_thatVD.getView().getModel("VehicleDetailsJSON").getData().APXData[m]);
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
			if (obj.TCISeries != undefined) {
				obj.TCISeries = obj.TCISeries.replace("/", "%2F");
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
			if (obj.INTCOL_DESC_FR != undefined) {
				obj.INTCOL_DESC_FR = obj.INTCOL_DESC_FR.replace("/", "%2F");
			}
			if (obj.INTCOL_DESC_EN != undefined) {
				obj.INTCOL_DESC_EN = obj.INTCOL_DESC_EN.replace("/", "%2F");
			}
			if (obj.EXTCOL_DESC_EN != undefined) {
				obj.EXTCOL_DESC_EN = obj.EXTCOL_DESC_EN.replace("/", "%2F");
			}
			if (obj.EXTCOL_DESC_FR != undefined) {
				obj.EXTCOL_DESC_FR = obj.EXTCOL_DESC_FR.replace("/", "%2F");
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
				} else {
					sap.m.MessageBox.information(_thatVD.oI18nModel.getResourceBundle().getText("PleaseSelectDealer"));
					//_thatVD.getRouter().navTo("changeHistory2");
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
					_thatVD.postVehicleUpdates(oPost, SelectedDNCVal);
				} else {
					oInputControl.setValueState(sap.ui.core.ValueState.Error);
				}
			} else if (!oInputControl.getVisible()) {
				_thatVD.postVehicleUpdates(oPost, SelectedDNCVal);
			}
		},

		postVehicleUpdates: function (oPost, DNCVal) {
			var Obj = {};
			_thatVD.oVehicleDetailsJSON = _thatVD.getView().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0];
			Obj.VHCLE = _thatVD.oVehicleDetailsJSON.VHCLE;
			if (_thatVD.newAPX != "" && _thatVD.newAPX != undefined) {
				Obj.NewAPX = _thatVD.newAPX;
			} else {
				Obj.NewAPX = _thatVD.getView().byId("apxVal").getSelectedKey();
			}
			if (_thatVD.getView().byId("accessoryVal").getSelectedKey() == this.oBundle.getText("Yes")) {
				Obj.AccessoriesInstalled = "Yes";
			} else if (_thatVD.getView().byId("accessoryVal").getSelectedKey() == this.oBundle.getText("No")) {
				Obj.AccessoriesInstalled = "No";
			}
			Obj.DNC = DNCVal;
			Obj.Comments = _thatVD.oVehicleDetailsJSON.Comments;
			var oModel = _thatVD.getOwnerComponent().getModel("DataModel");

			oModel.setUseBatch(false);
			oModel.create("/VehicleDetailsSet", Obj, {
				success: $.proxy(function (oResponse) {
					if (oResponse.Error != "") {
						sap.m.MessageBox.show(oResponse.Error, {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: _thatVD.oI18nModel.getResourceBundle().getText("Error"),
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (oAction) {}
						});
					} else {
						sap.m.MessageBox.show(_thatVD.oI18nModel.getResourceBundle().getText("VehicleUpdated"), {
							icon: sap.m.MessageBox.Icon.SUCCESS,
							title: _thatVD.oI18nModel.getResourceBundle().getText("Success"),
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (oAction) {}
						});
					}
				}, _thatVD),
				error: function (oError) {
					sap.m.MessageBox.show(_thatVD.oI18nModel.getResourceBundle().getText("ErrorInData"), {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: _thatVD.oI18nModel.getResourceBundle().getText("Error"),
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function (oAction) {}
					});
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
			var url = soldOrderAppUrl + "?&Division=" + Division + "&Language=" + sSelectedLocale + "#/page2" + keys;
			window.location.href = url;
		},

		onExit: function () {
			this.destroy();
		}
	});
});