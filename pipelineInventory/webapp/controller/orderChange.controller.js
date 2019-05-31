sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/core/routing/History',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/resource/ResourceModel',
], function (BaseController, History, JSONModel, ResourceModel) {
	"use strict";
	var _thatOC, sSelectedLocale, Division, localLang;
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
				localLang = "F";
			} else {
				_thatOC.oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(_thatOC.oI18nModel, "i18n");
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
			_thatOC.nodeJsUrl = this.sPrefix + "/node";

			var _oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0,
				dropdownEnabled: false
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

		getOrderFlag: function (_OrderNumber) {
			var url = _thatOC.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/OrderChangeSet('" + _OrderNumber + "')";
			$.ajax({
				dataType: "json",
				url: url,
				type: "GET",
				success: function (oRowData) {
					// debugger;
					_thatOC.Order_ChangeFlag = oRowData.d.Order_ChangeFlag;
					if (_thatOC.Order_ChangeFlag == "X") {
						_thatOC.getView().getModel("LocalOCModel").setProperty("/dropdownEnabled", true);
					} else {
						_thatOC.getView().getModel("LocalOCModel").setProperty("/dropdownEnabled", false);
					}
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					_thatOC.errorFlag = true;
				}
			});
		},

		_oOrderChangeRoute: function (oEvent) {
			_thatOC.getView().setBusy(false);
			sap.ui.core.BusyIndicator.hide();
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
				delay: 0,
				dropdownEnabled: false
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

			if (oEvent.getParameters().name == "orderChange2") {
				if (oEvent.getParameter("arguments").Data2 != undefined) {
					// debugger;
					var Data = JSON.parse(oEvent.getParameter("arguments").Data2);
					_thatOC.Data = JSON.parse(oEvent.getParameter("arguments").Data2);

					Data.NewSuffix = Data.NewSuffix.replace("%2F", "/");
					Data.OldSuffix = Data.OldSuffix.replace("%2F", "/");

					_thatOC.oVehicleDetailsJSON = new sap.ui.model.json.JSONModel();
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData = [];
					console.log("Data", Data);
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData.push(Data);
					_thatOC.getOrderFlag(Data.VHCLE);
					if (Data.Status == "Accepted") {
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Model = Data.NewModel;
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Suffix = Data.NewSuffix;
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].APX = Data.NewAPX;
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].ExteriorColorCode = Data.NewColor;
					} else {
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Model = Data.OldModel;
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Suffix = Data.OldSuffix;
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].APX = Data.OldAPX;
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].ExteriorColorCode = Data.OldColor;
					}

					_thatOC.oVehicleDetailsJSON.updateBindings(true);

					_thatOC.byId("ID_modelSelect").setSelectedKey(_thatOC.Data.NewModel.split("-")[0]);
					_thatOC.byId("APXrequired").setSelectedKey(_thatOC.Data.NewAPX.split("-")[0]);
					_thatOC.byId("ID_suffixSelect").setSelectedKey(_thatOC.Data.OldSuffix.split("-")[0]);
					_thatOC.byId("ID_ExteriorColorSelect").setSelectedKey(_thatOC.Data.OldColor.split("-")[0]);

					// _thatOC.onModelSelectionChange(_thatOC.byId("ID_modelSelect"), Data);

					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Status = "";
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].NewColour = "";
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Guidelines = "";
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].CurrentDate = _thatOC.curDate;
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].newAPXValues = [];
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].newAPXValues.push({
						"zzapx": Data.NewAPX
					});
					_thatOC.oVehicleDetailsJSON.updateBindings(true);
					_thatOC.oVehicleDetailsJSON.refresh(true);
					_thatOC.getView().setModel(_thatOC.oVehicleDetailsJSON, "VehicleDetailsJSON");
					_thatOC.APX = _thatOC.Data.APX;

					_thatOC.getModelData(_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].TCISeries, _thatOC.oVehicleDetailsJSON.getData()
						.selectedVehicleData[0].Modelyear);
					_thatOC.onModelSelectionChange(_thatOC.byId("ID_modelSelect"), Data.OldSuffix.split("-")[0]);
					_thatOC.onSuffixChange(_thatOC.byId("ID_suffixSelect"), Data.OldColor.split("-")[0]);
				}
			} else if (oEvent.getParameters().name !== "orderChange2") {
				if (oEvent.getParameter("arguments").Data != undefined) {
					// debugger;
					var Data = JSON.parse(oEvent.getParameter("arguments").Data);
					_thatOC.Data2 = JSON.parse(oEvent.getParameter("arguments").Data);
					if (Data.NewSuffix != undefined) {
						Data.NewSuffix = Data.NewSuffix.replace("%2F", "/");
					}
					if (Data.OldSuffix != undefined) {
						Data.OldSuffix = Data.OldSuffix.replace("%2F", "/");
					}
					if (Data.Suffix != undefined) {
						Data.Suffix = Data.Suffix.replace("%2F", "/");
					}
					if (Data.SUFFIX_DESC_FR != undefined && Data.SUFFIX_DESC_EN != undefined) {
						Data.SUFFIX_DESC_FR = Data.SUFFIX_DESC_FR.replace("%2F", "/");
						Data.SUFFIX_DESC_EN = Data.SUFFIX_DESC_EN.replace("%2F", "/");
					}
					Data.ORDERTYPE_DESC_EN = Data.ORDERTYPE_DESC_EN.replace("%2F", "/");
					Data.SERIES_DESC_EN = Data.SERIES_DESC_EN.replace("%2F", "/");
					Data.SERIES_DESC_FR = Data.SERIES_DESC_FR.replace("%2F", "/");

					_thatOC.oVehicleDetailsJSON = new sap.ui.model.json.JSONModel();
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData = [];
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData.push(Data);
					console.log("Data", Data);
					_thatOC.getOrderFlag(Data.VHCLE);

					_thatOC.byId("ID_modelSelect").setSelectedKey(_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Model);
					_thatOC.byId("ID_suffixSelect").setSelectedKey(_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Suffix);
					_thatOC.byId("ID_ExteriorColorSelect").setSelectedKey(_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].ExteriorColorCode);
					_thatOC.byId("APXrequired").setSelectedKey(_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].APX);

					_thatOC.ColorCode = _thatOC.Data2.ExteriorColorCode;
					_thatOC.APX = _thatOC.Data2.APX;

					// _thatOC.byId("ID_modelSelect").setSelectedKey(_thatOC.byId("readOnlyModel").getValue());
					// _thatOC.byId("ID_suffixSelect").setSelectedKey(_thatOC.byId("readOnlySuffix").getValue());
					// _thatOC.byId("ID_ExteriorColorSelect").setSelectedKey(_thatOC.byId("readOnlyColour").getValue()); //readOnlyAPX
					// _thatOC.byId("APXrequired").setSelectedKey(_thatOC.byId("readOnlyAPX").getValue());
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].NewModel = "";
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].NewSuffix = "";
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].NewAPX = "";
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Status = "";
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].NewColour = "";
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Guidelines = "";
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].CurrentDate = _thatOC.curDate;
					_thatOC.oVehicleDetailsJSON.updateBindings(true);
					_thatOC.oVehicleDetailsJSON.refresh(true);
					_thatOC.getView().setModel(_thatOC.oVehicleDetailsJSON, "VehicleDetailsJSON");

					console.log("APX", _thatOC.APX);
					_thatOC.getView().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0].newAPXValues.push({
						"zzapx": _thatOC.APX
					});
					_thatOC.getView().getModel("VehicleDetailsJSON").updateBindings(true);

					_thatOC.getModelData(_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].TCISeries, _thatOC.oVehicleDetailsJSON.getData()
						.selectedVehicleData[0].Modelyear);
					_thatOC.onModelSelectionChange(_thatOC.byId("ID_modelSelect"), Data.Suffix);
					_thatOC.onSuffixChange(_thatOC.byId("ID_suffixSelect"), _thatOC.Data2.ExteriorColorCode);
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
									"ENModelDesc": oData.d.results[i].ENModelDesc,
									"FRModelDesc": oData.d.results[i].FRModelDesc,
									"localLang": localLang
								});
								_thatOC.oVehicleDetailsJSON.updateBindings(true);
							}
							b = 0;
						}
						sap.ui.core.BusyIndicator.hide();
						// _thatOC.oVehicleDetailsJSON.getData().modelData.unshift({
						// 	"Model": "",
						// 	"ENModelDesc": ""
						// });
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

		onModelSelectionChange: function (oModel, oSuffixValue) {
			_thatOC.temp = [];
			_thatOC.temp1 = [];
			_thatOC.Modelyear = _thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Modelyear;
			if (oSuffixValue == undefined) {
				_thatOC.Model = oModel.getParameters("selectedItem").selectedItem.getKey();
			} else {
				_thatOC.Model = oModel.getSelectedKey();
				if (!oSuffixValue.split("-")[0]) {
					oSuffixValue = oSuffixValue;
				} else {
					oSuffixValue = oSuffixValue.split("-")[0];
				}
			}
			if (_thatOC.Model != undefined) {
				if (!_thatOC.Model.split("-")[0]) {
					_thatOC.Model = _thatOC.Model;
				} else {
					_thatOC.Model = _thatOC.Model.split("-")[0];
				}
			}
			_thatOC.oVehicleDetailsJSON.getData().suffixData = [];
			$.ajax({
				dataType: "json",
				url: _thatOC.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_INTCOL?$filter=Model eq '" + _thatOC.Model +
					"' and Modelyear eq '" +
					_thatOC.Modelyear + "'",
				type: "GET",
				success: function (oData) {
					if (oData.d.results.length > 0) {
						console.log("suffixData", oData.d.results);
						var selectedKey = _thatOC.oVehicleDetailsJSON.getData().suffixData.filter(function (val) {
							if (val.suffix == oSuffixValue)
								return val.suffix;
						});
						_thatOC.byId("ID_suffixSelect").setSelectedKey(selectedKey);
						// _thatOC.oVehicleDetailsJSON.getData().suffixData = oData.d.results;
						$.each(oData.d.results, function (i, item) {
							_thatOC.oVehicleDetailsJSON.getData().suffixData.push({
								"Model": item.Model,
								"Modelyear": item.Model,
								"Suffix": item.Suffix,
								"int_c": item.int_c,
								"SuffixDescriptionEN": item.SuffixDescriptionEN,
								"SuffixDescriptionFR": item.SuffixDescriptionFR,
								"mrktg_int_desc_en": item.mrktg_int_desc_en,
								"mrktg_int_desc_fr": item.mrktg_int_desc_fr,
								"localLang": localLang
							});
						});
						sap.ui.core.BusyIndicator.hide();
						_thatOC.oVehicleDetailsJSON.updateBindings(true);
					} else {
						sap.ui.core.BusyIndicator.hide();
					}
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
				},
				complete: function () {
					jQuery.sap.delayedCall(500, _thatOC, function () {
						_thatOC.oSuffixValue = oSuffixValue;
						console.log("oSuffixValue", oSuffixValue);
						if (oSuffixValue != undefined) {
							if (!oSuffixValue.OldSuffix) {
								if (oSuffixValue.Suffix != undefined) {
									_thatOC.byId("ID_suffixSelect").setSelectedKey(oSuffixValue.Suffix);
								} else {
									// if (!oSuffixValue.split("-")[0]) {
									_thatOC.byId("ID_suffixSelect").setSelectedKey(oSuffixValue);
									// } else {
									// 	_thatOC.byId("ID_suffixSelect").setValue(oSuffixValue.split("-")[0]);
									// }
								}
							} else {
								if (oSuffixValue.OldSuffix != undefined || oSuffixValue.OldSuffix != "") {
									_thatOC.byId("ID_suffixSelect").setSelectedKey(oSuffixValue.OldSuffix.split("-")[0]);
								}
								// else if (oSuffixValue.OldSuffix != undefined || oSuffixValue.OldSuffix != "") {
								// 	_thatOC.byId("ID_suffixSelect").setValue(oSuffixValue.OldSuffix.split("-")[0]);
								// } 
								else {
									if (oSuffixValue.Suffix != undefined) {
										_thatOC.byId("ID_suffixSelect").setSelectedKey(oSuffixValue.Suffix.split("-")[0]);
									} else {
										// console.log("oSuffixValue.split(" - ")[0]", oSuffixValue.split("-")[0]);
										// if (!oSuffixValue.split("-")[0]) {
										_thatOC.byId("ID_suffixSelect").setSelectedKey(oSuffixValue);
										// }
										// else {
										// 	_thatOC.byId("ID_suffixSelect").setValue(oSuffixValue.split("-")[0]);
										// }
									}
								}
							}
							_thatOC.getView().getModel("VehicleDetailsJSON").updateBindings(true);
							// _thatOC.onSuffixChange(_thatOC.byId("ID_suffixSelect"), _thatOC.ColorCode);
						}

					});
				}
			});
		},
		onSuffixChange: function (oSuffixVal, ColorVal) {
			sap.ui.core.BusyIndicator.show();
			var Modelyear = _thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Modelyear;
			var Suffix;
			if (ColorVal == undefined) {
				Suffix = oSuffixVal.getParameters("selectedItem").selectedItem.getKey();
			} else {
				Suffix = oSuffixVal.getSelectedKey();
			}

			var Model = _thatOC.getView().byId("ID_modelSelect").getSelectedKey();
			var series = _thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].TCISeries;

			_thatOC.oVehicleDetailsJSON.getData().colorData = [];
			if (Suffix != undefined) {
				if (!Suffix.split("-")[0]) {
					Suffix = Suffix;
				} else {
					Suffix = Suffix.split("-")[0];
				}
			}
			if (Model != undefined) {
				if (!Model.split("-")[0]) {
					Model = Model;
				} else {
					Model = Model.split("-")[0];
				}
			}
			$.ajax({
				dataType: "json",
				url: _thatOC.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/zc_exterior_trim?$filter=ModelYear eq '" + Modelyear +
					"' and Model eq '" + Model + "' and Suffix eq '" + Suffix + "' and TCISeries eq '" + series + "'",
				type: "GET",
				success: function (oData) {
					console.log("suffix data", oData.d.results);
					if (oData.d.results.length > 0) {
						$.each(oData.d.results, function (i, item) {
							if (ColorVal != undefined) {
								if (localLang = "F") {
									if (!ColorVal.split("-")[0] && ColorVal == item.ExteriorColorCode) {
										_thatOC.byId("ID_ExteriorColorSelect").setSelectedKey(item.ExteriorColorCode + "-" + item.MarketingDescriptionEXTColorFR);
									} else if (ColorVal.split("-")[0] && ColorVal.split("-")[0] == item.ExteriorColorCode) {
										_thatOC.byId("ID_ExteriorColorSelect").setSelectedKey(item.ExteriorColorCode + "-" + item.MarketingDescriptionEXTColorFR);
									}
								} else if (localLang = "E") {
									if (!ColorVal.split("-")[0] && ColorVal == item.ExteriorColorCode) {
										_thatOC.byId("ID_ExteriorColorSelect").setSelectedKey(item.ExteriorColorCode + "-" + item.MarketingDescriptionEXTColorEN);
									} else if (ColorVal.split("-")[0] && ColorVal.split("-")[0] == item.ExteriorColorCode) {
										_thatOC.byId("ID_ExteriorColorSelect").setSelectedKey(item.ExteriorColorCode + "-" + item.MarketingDescriptionEXTColorEN);
									}

								}
							}

							_thatOC.oVehicleDetailsJSON.getData().colorData.push({
								"ExteriorColorCode": item.ExteriorColorCode,
								"MarketingDescriptionEXTColorEN": item.MarketingDescriptionEXTColorEN,
								"MarketingDescriptionEXTColorFR": item.MarketingDescriptionEXTColorFR,
								"localLang": localLang
							});
						});

						// _thatOC.byId("APXrequired").setSelectedKey(_thatOC.APX);

						_thatOC.oVehicleDetailsJSON.updateBindings(true);
						sap.ui.core.BusyIndicator.hide();
					} else {
						sap.ui.core.BusyIndicator.hide();
					}
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
				},
				complete: function () {
					jQuery.sap.delayedCall(1000, _thatOC, function () {
						console.log("ColorVal", ColorVal);
						if (ColorVal != undefined) {
							if (ColorVal.OldColor != undefined) {
								_thatOC.byId("ID_ExteriorColorSelect").setSelectedKey(ColorVal.OldColor.split("-")[0]);
							} else {
								if (ColorVal.ExteriorColorCode != undefined) {
									_thatOC.byId("ID_ExteriorColorSelect").setSelectedKey(ColorVal.ExteriorColorCode);
								} else {
									if (!ColorVal.split("-")[0]) {
										_thatOC.byId("ID_ExteriorColorSelect").setSelectedKey(ColorVal);
									} else {
										_thatOC.byId("ID_ExteriorColorSelect").setSelectedKey(ColorVal.split("-")[0]);
									}
									// _thatOC.byId("ID_ExteriorColorSelect").setValue(ColorVal);
								}
							}
						}
						_thatOC.getView().getModel("VehicleDetailsJSON").updateBindings(true);
					});
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
			} else if (_oSelectedScreen == _thatOC.oI18nModel.getResourceBundle().getText("ChangeHistory")) {
				if (_thatOC.getView().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0].Dealer != undefined) {
					_thatOC.getRouter().navTo("changeHistory", {
						SelectedDealer: _thatOC.getView().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0].Dealer
					});
				} else {
					// sap.m.MessageBox.information(_thatOC.oI18nModel.getResourceBundle().getText("PleaseSelectDealer"));
					_thatOC.getRouter().navTo("changeHistory2");
				}
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
					// debugger;
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