sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/core/routing/History',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel',
], function (BaseController, History, JSONModel, ResourceModel) {
	"use strict";
	var _thatOC,sSelectedLocale,Division;
	return BaseController.extend("pipelineInventory.controller.orderChange", {

		onInit: function () {
			_thatOC = this;
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			_thatOC.oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd"
			});
			_thatOC.curDate = _thatOC.oDateFormat.format(new Date());

			_thatOC.oI18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			_thatOC.getView().setModel(_thatOC.oI18nModel, "i18n");

			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				sSelectedLocale = "EN"; // default is english 
			}
			if (sSelectedLocale == "fr") {
				_thatOC.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				this.getView().setModel(_thatOC.oI18nModel, "i18n");
				this.sCurrentLocale = 'FR';
			} else {
				_thatOC.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(_thatOC.oI18nModel, "i18n");
				this.sCurrentLocale = 'EN';
			}

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/pipelineInventory-dest";
			} else {
				this.sPrefix = "";
			}
			_thatOC.nodeJsUrl = this.sPrefix + "/node";

			var _oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0
			});
			_thatOC.getView().setModel(_oViewModel, "LocalOCModel");
			
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

			_thatOC.getView().setModel(sap.ui.getCore().getModel("VehicleDetailsJSON"), "VehicleDetailsJSON");
			_thatOC.getOwnerComponent().getRouter().attachRoutePatternMatched(_thatOC._oOrderChangeRoute, _thatOC);
		},

		_oOrderChangeRoute: function (oEvent) {
			_thatOC.getView().setBusy(false);
			sap.ui.core.BusyIndicator.hide();
			if (oEvent.getParameters().name == "orderChange2") {
				if (oEvent.getParameter("arguments").Data2 != undefined) {
					var Data = JSON.parse(oEvent.getParameter("arguments").Data2);
					Data.NewSuffix = Data.NewSuffix.replace("%2F", "/");
					Data.OldSuffix = Data.OldSuffix.replace("%2F", "/");
					_thatOC.oVehicleDetailsJSON = new sap.ui.model.json.JSONModel();
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData = [];
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData.push(Data);

					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Model = Data.OldModel;
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Suffix = Data.OldSuffix;
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].APX = Data.OldAPX;
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].ExteriorColorCode = Data.OldColor;

					_thatOC.oVehicleDetailsJSON.updateBindings(true);
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].NewModel = "";
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].NewSuffix = "";
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].NewAPX = "";
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Status = "";
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].NewColour = "";
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Guidelines = "";
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].CurrentDate = _thatOC.curDate;
					_thatOC.oVehicleDetailsJSON.updateBindings(true);
					_thatOC.oVehicleDetailsJSON.refresh(true);
					_thatOC.getModelData(_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].TCISeries, _thatOC.oVehicleDetailsJSON.getData()
						.selectedVehicleData[0].Modelyear);
					_thatOC.getView().setModel(_thatOC.oVehicleDetailsJSON, "VehicleDetailsJSON");
				}
			} else {
				if (oEvent.getParameter("arguments").Data != undefined) {
					var Data = JSON.parse(oEvent.getParameter("arguments").Data);
					if (Data.NewSuffix != undefined) {
						Data.NewSuffix = Data.NewSuffix.replace("%2F", "/");
					}
					if (Data.OldSuffix != undefined) {
						Data.OldSuffix = Data.OldSuffix.replace("%2F", "/");
					}
					if (Data.Suffix != undefined) {
						Data.Suffix = Data.Suffix.replace("%2F", "/");
					}
					_thatOC.oVehicleDetailsJSON = new sap.ui.model.json.JSONModel();
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData = [];
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData.push(Data);
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].NewModel = "";
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].NewSuffix = "";
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].NewAPX = "";
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Status = "";
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].NewColour = "";
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Guidelines = "";
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].CurrentDate = _thatOC.curDate;
					_thatOC.oVehicleDetailsJSON.updateBindings(true);
					_thatOC.oVehicleDetailsJSON.refresh(true);
					_thatOC.getModelData(_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].TCISeries, _thatOC.oVehicleDetailsJSON.getData()
						.selectedVehicleData[0].Modelyear);
					_thatOC.getView().setModel(_thatOC.oVehicleDetailsJSON, "VehicleDetailsJSON");
				}
			}
		},

		getModelData: function (TCISeries, Modelyear) {
			var Series = TCISeries;
			var Modelyear = Modelyear;
			$.ajax({
				dataType: "json",
				url: _thatOC.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_MODEL_DETAILS?$filter=Modelyear eq '" + Modelyear +
					"' and TCISeries eq '" + Series + "'",
				type: "GET",
				success: function (oData) {
					_thatOC.oVehicleDetailsJSON.getData().modelData = [];
					if (oData.d.results.length > 0) {
						var b = 0;
						console.log("Model Data", oData.d.results);
						for (var i = 0; i < oData.d.results.length; i++) {
							var oModel = oData.d.results[i].Model;
							for (var j = 0; j < _thatOC.oVehicleDetailsJSON.getData().modelData.length; j++) {
								if (oModel != _thatOC.oVehicleDetailsJSON.getData().modelData[j].Model) {
									b++;
								}
							}
							if (b == _thatOC.oVehicleDetailsJSON.getData().modelData.length) {
								_thatOC.oVehicleDetailsJSON.getData().modelData.push({
									"Model": oData.d.results[i].Model,
									"ENModelDesc": oData.d.results[i].ENModelDesc
								});
								_thatOC.oVehicleDetailsJSON.updateBindings(true);
							}
							b = 0;
						}
						sap.ui.core.BusyIndicator.hide();
						_thatOC.oVehicleDetailsJSON.getData().modelData.unshift({
							"Model": "",
							"ENModelDesc": ""
						});
						_thatOC.oVehicleDetailsJSON.updateBindings(true);
					} else {
						sap.ui.core.BusyIndicator.hide();
					}
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},

		onModelSelectionChange: function (oModel) {
			_thatOC.temp = [];
			_thatOC.temp1 = [];
			_thatOC.Modelyear = _thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Modelyear;
			_thatOC.Model = oModel.getParameters("selectedItem").selectedItem.getKey();
			_thatOC.oVehicleDetailsJSON.getData().suffixData = [];
			/*$.ajax({
				dataType: "json",
				url: _thatOC.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/zc_configuration?$filter=Model eq '" + _thatOC.Model +
					"'and ModelYear eq '" + _thatOC.Modelyear + "'",
				type: "GET",
				success: function (oData) {
					if (oData.d.results.length > 0) {
						_thatOC.temp = oData.d.results;
						// debugger;
						var tempNew = [];
						_thatOC.TCISeries = _thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].TCISeries;
						_thatOC.Modelyear = _thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Modelyear;
						var url = _thatOC.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZVMS_INT_Color?$filter=model_year eq '" + _thatOC.Modelyear +
							"' and tci_series eq '" + _thatOC.TCISeries + "'";
						$.ajax({
							dataType: "json",
							url: url,
							type: "GET",
							success: function (oDataInner) {
								console.log("oDataInner.results", oDataInner.d.results);
								console.log("suffixes", _thatOC.temp1);
								_thatOC.temp1 = oDataInner.d.results;
								if (_thatOC.temp1.length > 0) {
									for (var n = 0; n < _thatOC.temp.length; n++) {
										for (var m = 0; m < _thatOC.temp1.length; m++) {
											console.log("mapping", _thatOC.temp1[m].Suffix);
											_thatOC.oVehicleDetailsJSON.getData().suffixData.push({
												"Suffix": _thatOC.temp[n].Suffix,
												"SuffixDescriptionEN": _thatOC.temp[n].SuffixDescriptionEN,
												"MarktgIntDescEN": _thatOC.temp1[m].mrktg_int_desc_en
											});
											sap.ui.core.BusyIndicator.hide();
											_thatOC.oVehicleDetailsJSON.updateBindings(true);
										}
									}
									_thatOC.oVehicleDetailsJSON.getData().suffixData.unshift({
										"Suffix": "",
										"SuffixDescriptionEN": "",
										"MarktgIntDescEN": ""
									});
									_thatOC.oVehicleDetailsJSON.updateBindings(true);
								} else {
									sap.ui.core.BusyIndicator.hide();
								}
							},
							error: function (oError) {
								sap.ui.core.BusyIndicator.hide();
							}
						});
						_thatOC.oVehicleDetailsJSON.updateBindings(true);
					} else {
						sap.ui.core.BusyIndicator.hide();
					}
				},*/
			$.ajax({
				dataType: "json",
				url: _thatOC.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_INTCOL?$filter=Model eq '" + _thatOC.Model + "' and Modelyear eq '" +
					_thatOC.Modelyear + "'",
				type: "GET",
				success: function (oData) {
					if (oData.d.results.length > 0) {
						_thatOC.oVehicleDetailsJSON.getData().suffixData = oData.d.results;
						sap.ui.core.BusyIndicator.hide();
						_thatOC.oVehicleDetailsJSON.getData().suffixData.unshift({
							"Model": "",
							"Modelyear": "",
							"Suffix": "",
							"int_c": "",
							"SuffixDescriptionEN": "",
							"SuffixDescriptionFR": "",
							"mrktg_int_desc_en": "",
							"mrktg_int_desc_fr": ""
						});
						_thatOC.oVehicleDetailsJSON.updateBindings(true);
					} else {
						sap.ui.core.BusyIndicator.hide();
					}
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		onSuffixChange: function (oSuffixVal) {
			sap.ui.core.BusyIndicator.show();
			var Modelyear = _thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Modelyear;
			var Suffix = oSuffixVal.getParameters("selectedItem").selectedItem.getKey();
			var Model = _thatOC.getView().byId("ID_modelSelect").getSelectedKey();
			var series = _thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].TCISeries;

			_thatOC.oVehicleDetailsJSON.getData().colorData = [];
			$.ajax({
				
				dataType: "json",
				url: _thatOC.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/zc_exterior_trim?$filter=ModelYear eq '" + Modelyear +
					"' and Model eq '" + Model + "' and Suffix eq '" + Suffix + "' and TCISeries eq '" + series + "'",
				type: "GET",
				success: function (oData) {
					if (oData.d.results.length > 0) {
						$.each(oData.d.results, function (i, item) {
							_thatOC.oVehicleDetailsJSON.getData().colorData.push({
								"ExteriorColorCode": item.ExteriorColorCode,
								"MarketingDescriptionEXTColorEN": item.MarketingDescriptionEXTColorEN
							});
						});
						_thatOC.oVehicleDetailsJSON.getData().colorData.unshift({
							"ExteriorColorCode": "",
							"MarketingDescriptionEXTColorEN": ""
						});
						_thatOC.oVehicleDetailsJSON.updateBindings(true);
						sap.ui.core.BusyIndicator.hide();
					} else {
						sap.ui.core.BusyIndicator.hide();
					}
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
				}
			});
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

		NavigateBack: function () {
			// this.getRouter().navTo("details", {});
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(_thatOC);
				oRouter.navTo("vehicleDetails");
			}
		},

		onMenuLinkPress: function (oLink) {
			var _oLinkPressed = oLink;
			var _oSelectedScreen = _oLinkPressed.getSource().getProperty("text");
			if (_oSelectedScreen == _thatOC.oI18nModel.getResourceBundle().getText("PageTitle")) {
				_thatOC.getRouter().navTo("Routemaster");
			} else if (_oSelectedScreen == _thatOC.oI18nModel.getResourceBundle().getText("VehicleDetails")) {
				_thatOC.getRouter().navTo("vehicleDetailsNodata");
			}
			// else if (_oSelectedScreen == _thatOC.oI18nModel.getResourceBundle().getText("ChangeHistory")) {
			// 	_thatOC.getRouter().navTo("changeHistory");
			// 	_thatOC.getView().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0].Dealer
			// }
			else if (_thatOC.getView().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0].Dealer != undefined) {
				_thatOC.getRouter().navTo("changeHistory", {
					SelectedDealer: _thatOC.getView().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0].Dealer
				});
			}
		},

		_DataValidate: function (oPost) {
			var sUserInput = _thatOC.getView().byId("ID_modelSelect").getSelectedKey();
			var sUserInput2 = _thatOC.getView().byId("ID_suffixSelect").getSelectedKey();
			var sUserInput3 = _thatOC.getView().byId("ID_ExteriorColorSelect").getSelectedKey();
			// var sUserInput4 = _thatOC.getView().byId("APXrequired").getValue();
			var oInputControl = _thatOC.getView().byId("ID_modelSelect");
			var oInputControl2 = _thatOC.getView().byId("ID_suffixSelect");
			var oInputControl3 = _thatOC.getView().byId("ID_ExteriorColorSelect");
			// var oInputControl4 = _thatOC.getView().byId("APXrequired");

			if (sUserInput && sUserInput2 && sUserInput3) {
				oInputControl.setValueState(sap.ui.core.ValueState.Success);
				oInputControl2.setValueState(sap.ui.core.ValueState.Success);
				oInputControl3.setValueState(sap.ui.core.ValueState.Success);
				// oInputControl4.setValueState(sap.ui.core.ValueState.Success);
				_thatOC.onRequestChange(oPost);
			} else {
				oInputControl.setValueState(sap.ui.core.ValueState.Error);
				oInputControl2.setValueState(sap.ui.core.ValueState.Error);
				oInputControl3.setValueState(sap.ui.core.ValueState.Error);
				// oInputControl4.setValueState(sap.ui.core.ValueState.Error);
			}
		},

		onRequestChange: function (oPost) {
			var Obj = {};
			_thatOC.oOrderChangeJSON = _thatOC.getView().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0];
			Obj.VHCLE = _thatOC.oOrderChangeJSON.VHCLE;
			Obj.Dealer = _thatOC.oOrderChangeJSON.Dealer;
			if (_thatOC.getView().byId("ID_modelSelect").getSelectedKey() != undefined) {
				Obj.NewModel = _thatOC.getView().byId("ID_modelSelect").getSelectedKey();
			}
			if (_thatOC.getView().byId("ID_suffixSelect").getSelectedKey() != undefined) {
				Obj.NewSuffix = _thatOC.getView().byId("ID_suffixSelect").getSelectedKey();
			}
			if (_thatOC.getView().byId("ID_ExteriorColorSelect").getSelectedKey() != undefined) {
				Obj.NewColor = _thatOC.getView().byId("ID_ExteriorColorSelect").getSelectedKey();
			}
			var OrderChangeModel = _thatOC.getOwnerComponent().getModel("DataModel");
			//new sap.ui.model.odata.v2.ODataModel(_thatOC.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV");
			OrderChangeModel.setUseBatch(false);
			OrderChangeModel.create("/OrderChangeSet", Obj, {
				success: $.proxy(function (oResponse) {
					console.log(oResponse);
					if (oResponse.Error != "") {
						sap.m.MessageBox.error(oResponse.Error);
					} else {
						_thatOC.getView().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0].Status = "Requested";
						_thatOC.getView().getModel("VehicleDetailsJSON").updateBindings(true);
						sap.m.MessageBox.success("Succesfully posted");
					}
				}, _thatOC),
				error: function (oError) {
					sap.m.MessageBox.error(
						"Error in data posting"
					);
				}
			});
		},

		onExit: function () {
			this.destroy();
		}

	});

});