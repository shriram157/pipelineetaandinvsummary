sap.ui.define([
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
					var Data = JSON.parse(oEvent.getParameter("arguments").Data2);
					_thatOC.Data = JSON.parse(oEvent.getParameter("arguments").Data2);

					Data.NewSuffix = Data.NewSuffix.replace("%2F", "/");
					Data.OldSuffix = Data.OldSuffix.replace("%2F", "/");

					_thatOC.oVehicleDetailsJSON = new sap.ui.model.json.JSONModel();
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData = [];

					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData.push(Data);
					_thatOC.getOrderFlag(Data.VHCLE);
					if (_thatOC.Data.Status !== "Rejected") {
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Model = Data.NewModel;
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Suffix = Data.NewSuffix;
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].APX = Data.NewAPX;
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].ExteriorColorCode = Data.NewColor;

						_thatOC.byId("ID_modelSelect").setSelectedKey(Data.NewModel.split("-")[0]);
						_thatOC.byId("APXrequired").setSelectedKey(Data.NewAPX);
						_thatOC.byId("ID_suffixSelect").setSelectedKey(Data.NewSuffix.split("-")[0]);
						_thatOC.byId("ID_ExteriorColorSelect").setSelectedKey(Data.NewColor.split("-")[0]);
						_thatOC.ColorCode = Data.NewColor;
						_thatOC.suffix = Data.NewSuffix;

						_thatOC.getModelData(_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].TCISeries, _thatOC.oVehicleDetailsJSON.getData()
							.selectedVehicleData[0].Modelyear);
						// _thatOC.onModelSelectionChange(_thatOC.byId("ID_modelSelect"), Data.NewSuffix.split("-")[0]);
						// _thatOC.onSuffixChange(_thatOC.byId("ID_suffixSelect"), Data.NewSuffix.split("-")[0]);
					} else {
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Model = Data.OldModel;
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Suffix = Data.OldSuffix;
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].APX = Data.OldAPX;
						_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].ExteriorColorCode = Data.OldColor;

						_thatOC.byId("ID_modelSelect").setSelectedKey(Data.OldModel.split("-")[0]);
						_thatOC.byId("APXrequired").setSelectedKey(Data.OldAPX);
						_thatOC.byId("ID_suffixSelect").setSelectedKey(Data.OldSuffix.split("-")[0]);
						_thatOC.byId("ID_ExteriorColorSelect").setSelectedKey(Data.OldColor.split("-")[0]);
						_thatOC.ColorCode = Data.OldColor;
						_thatOC.suffix = Data.OldSuffix;

						_thatOC.getModelData(_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].TCISeries, _thatOC.oVehicleDetailsJSON.getData()
							.selectedVehicleData[0].Modelyear);
						// _thatOC.onModelSelectionChange(_thatOC.byId("ID_modelSelect"), Data.OldSuffix.split("-")[0]);
						// _thatOC.onSuffixChange(_thatOC.byId("ID_suffixSelect"), Data.OldColor.split("-")[0]);
					}

					_thatOC.oVehicleDetailsJSON.updateBindings(true);
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
				}
			} else if (oEvent.getParameters().name !== "orderChange2") {
				if (oEvent.getParameter("arguments").Data != undefined) {
					var Data = JSON.parse(oEvent.getParameter("arguments").Data);
					_thatOC.Data2 = JSON.parse(oEvent.getParameter("arguments").Data);
					if (Data.NewSuffix != undefined) {
						Data.NewSuffix = Data.NewSuffix.replace("%2F", "/");
					}
					if (Data.DNC_Comment != undefined) {
						Data.DNC_Comment = Data.DNC_Comment.replace("%2F", " ");
					}
					if (Data.Comments != undefined) {
						Data.Comments = Data.Comments.replace("%2F", " ");
					}

					if (Data.OldSuffix != undefined) {
						Data.OldSuffix = Data.OldSuffix.replace("%2F", "/");
					}
					if (Data.Suffix != undefined) {
						Data.Suffix = Data.Suffix.replace("%2F", "/");
					}
					if (Data.TCISeries != undefined) {
						Data.TCISeries = Data.TCISeries.replace("%2F", "/");
					}
					if (Data.SUFFIX_DESC_FR != undefined && Data.SUFFIX_DESC_EN != undefined) {
						Data.SUFFIX_DESC_FR = Data.SUFFIX_DESC_FR.replace("%2F", "/");
						Data.SUFFIX_DESC_EN = Data.SUFFIX_DESC_EN.replace("%2F", "/");
					}
					Data.ORDERTYPE_DESC_EN = Data.ORDERTYPE_DESC_EN.replace("%2F", "/");
					Data.SERIES_DESC_EN = Data.SERIES_DESC_EN.replace("%2F", "/");
					Data.SERIES_DESC_FR = Data.SERIES_DESC_FR.replace("%2F", "/");
					if (Data.INTCOL_DESC_FR != undefined && Data.INTCOL_DESC_EN != undefined) {
						Data.INTCOL_DESC_EN = Data.INTCOL_DESC_EN.replace("%2F", "/");
						Data.INTCOL_DESC_FR = Data.INTCOL_DESC_FR.replace("%2F", "/");
					}
					if (Data.MODEL_DESC_EN != undefined && Data.MODEL_DESC_FR != undefined) {
						Data.MODEL_DESC_EN = Data.MODEL_DESC_EN.replace("%2F", "/");
						Data.MODEL_DESC_FR = Data.MODEL_DESC_FR.replace("%2F", "/");
					}
					if (Data.EXTCOL_DESC_EN != undefined && Data.EXTCOL_DESC_FR != undefined) {
						Data.EXTCOL_DESC_EN = Data.EXTCOL_DESC_EN.replace("%2F", "/");
						Data.EXTCOL_DESC_FR = Data.EXTCOL_DESC_FR.replace("%2F", "/");
					}
					_thatOC.oVehicleDetailsJSON = new sap.ui.model.json.JSONModel();
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData = [];
					_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData.push(Data);
					_thatOC.getOrderFlag(Data.VHCLE);

					_thatOC.byId("ID_modelSelect").setSelectedKey(_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Model);
					_thatOC.byId("ID_suffixSelect").setSelectedKey(_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Suffix);
					_thatOC.byId("ID_ExteriorColorSelect").setSelectedKey(_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].ExteriorColorCode);
					_thatOC.byId("APXrequired").setSelectedKey(_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].APX);

					_thatOC.ColorCode = _thatOC.Data2.ExteriorColorCode;
					_thatOC.suffix = _thatOC.Data2.Suffix;
					_thatOC.APX = _thatOC.Data2.APX;

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

					_thatOC.getView().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0].newAPXValues.push({
						"zzapx": _thatOC.APX
					});
					_thatOC.getView().getModel("VehicleDetailsJSON").updateBindings(true);
					_thatOC.getModelData(_thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].TCISeries, _thatOC.oVehicleDetailsJSON.getData()
						.selectedVehicleData[0].Modelyear);
					// _thatOC.onModelSelectionChange(_thatOC.byId("ID_modelSelect"), Data.Suffix);
					// _thatOC.onSuffixChange(_thatOC.byId("ID_suffixSelect"), _thatOC.Data2.ExteriorColorCode);
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
						_thatOC.oVehicleDetailsJSON.updateBindings(true);
					} else {
						sap.ui.core.BusyIndicator.hide();
					}
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
				},
				complete: function () {
					_thatOC.onModelSelectionChange(_thatOC.byId("ID_modelSelect"), _thatOC.suffix);
				}
			});
		},

		onModelSelectionChange: function (oModel, oSuffixValue) {
			_thatOC.temp = [];
			_thatOC.temp1 = [];

			var sFlag;
			_thatOC.Modelyear = _thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Modelyear;
			if (oSuffixValue == undefined) {
				//Change added by Minakshi for INC0188198
				_thatOC.Model = _thatOC.byId("ID_modelSelect").getSelectedKey();
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
			//Change added by Minakshi for INC0188198 start
			if (oModel.hasOwnProperty("oSource") == true) {
				sFlag = true;
			} else {
				sFlag = false;
			}
			//Change added by Minakshi for INC0188198 end
			$.ajax({
				dataType: "json",
				url: _thatOC.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZC_INTCOL?$filter=Model eq '" + _thatOC.Model +
					"' and Modelyear eq '" +
					_thatOC.Modelyear + "'",
				type: "GET",
				success: function (oData) {
					_thatOC.oVehicleDetailsJSON.getData().suffixData = [];
					_thatOC.oVehicleDetailsJSON.updateBindings(true);
					if (oData.d.results.length > 0) {
						//Change added by Minakshi for INC0188198 start 
						if (sFlag == true) {
							_thatOC.byId("ID_suffixSelect").setSelectedKey("");
							_thatOC.byId("ID_ExteriorColorSelect").setSelectedKey("");
						}
						//Change added by Minakshi for INC0188198 end

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
						var selectedKey;
						if (_thatOC.Data) {
							if (_thatOC.Data.Status === "Rejected") {
								selectedKey = _thatOC.oVehicleDetailsJSON.getData().suffixData.filter(function (val) {
									if (localLang === "F" && val.suffix == oSuffixValue) {
										return val.suffix + " " + val.SuffixDescriptionFR + " " + val.mrktg_int_desc_fr;
									} else if (localLang === "E" && val.suffix == oSuffixValue) {
										return val.suffix + " " + val.SuffixDescriptionEN + " " + val.mrktg_int_desc_en;
									}
								});
								console.log("selectedKey", selectedKey);
								_thatOC.oVehicleDetailsJSON.getData().suffixData.unshift(selectedKey);
								// _thatOC.byId("ID_suffixSelect").setSelectedKey(selectedKey);
							}
						}
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
					_thatOC.onSuffixChange(_thatOC.byId("ID_suffixSelect"), _thatOC.ColorCode);
					// jQuery.sap.delayedCall(500, _thatOC, function () {
					// 	if (_thatOC.Data) {
					// 		if (_thatOC.Data.Status == "Rejected") {
					// 			_thatOC.oSuffixValue = oSuffixValue;
					// 			if (oSuffixValue != undefined) {
					// 				if (!oSuffixValue.OldSuffix) {
					// 					if (oSuffixValue.Suffix != undefined) {
					// 						_thatOC.byId("ID_suffixSelect").setSelectedKey(oSuffixValue.Suffix);
					// 					} else {
					// 						_thatOC.byId("ID_suffixSelect").setSelectedKey(oSuffixValue);
					// 					}
					// 				} else {
					// 					if (oSuffixValue.OldSuffix != undefined || oSuffixValue.OldSuffix != "") {
					// 						_thatOC.byId("ID_suffixSelect").setSelectedKey(oSuffixValue.OldSuffix.split("-")[0]);
					// 					} else {
					// 						if (oSuffixValue.Suffix != undefined) {
					// 							_thatOC.byId("ID_suffixSelect").setSelectedKey(oSuffixValue.Suffix.split("-")[0]);
					// 						} else {
					// 							_thatOC.byId("ID_suffixSelect").setSelectedKey(oSuffixValue);
					// 						}
					// 					}
					// 				}
					// 				_thatOC.getView().getModel("VehicleDetailsJSON").updateBindings(true);
					// 				// _thatOC.onSuffixChange(_thatOC.byId("ID_suffixSelect"), _thatOC.ColorCode);
					// 			}
					// 		}
					// 	}

					// });
				}
			});
		},
		onSuffixChange: function (oSuffixVal, ColorVal) {
			sap.ui.core.BusyIndicator.show();
			var Modelyear = _thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].Modelyear;
			var Suffix;
			var sFlag;
			if (ColorVal == undefined) {
				Suffix = oSuffixVal.getParameters("selectedItem").selectedItem.getKey();
			} else {
				Suffix = oSuffixVal.getSelectedKey();
				if (!ColorVal.split("-")[0]) {
					ColorVal = ColorVal;
				} else {
					ColorVal = ColorVal.split("-")[0];
				}
			}

			var Model = _thatOC.getView().byId("ID_modelSelect").getSelectedKey();
			var series = _thatOC.oVehicleDetailsJSON.getData().selectedVehicleData[0].TCISeries;

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
//Change added by Minakshi for INC0188198 start
			if (oSuffixVal.hasOwnProperty("oSource") == true) {
				sFlag = true;
			} else {
				sFlag = false;
			}
//Change added by Minakshi for INC0188198 end
			$.ajax({
				dataType: "json",
				url: _thatOC.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/zc_exterior_trim?$filter=ModelYear eq '" + Modelyear +
					"' and Model eq '" + Model + "' and Suffix eq '" + Suffix + "' and TCISeries eq '" + series + "'",
				type: "GET",
				success: function (oData) {
					_thatOC.oVehicleDetailsJSON.getData().colorData = [];
					_thatOC.oVehicleDetailsJSON.updateBindings(true);

					var selectedKey;
					if (oData.d.results.length > 0) {
						//Change added by Minakshi for INC0188198 start
						if (sFlag == true) {
							_thatOC.byId("ID_ExteriorColorSelect").setSelectedKey("");
						}
						//Change added by Minakshi for INC0188198 end
						$.each(oData.d.results, function (i, item) {
							_thatOC.oVehicleDetailsJSON.getData().colorData.push({
								"ExteriorColorCode": item.ExteriorColorCode,
								"MarketingDescriptionEXTColorEN": item.MarketingDescriptionEXTColorEN,
								"MarketingDescriptionEXTColorFR": item.MarketingDescriptionEXTColorFR,
								"localLang": localLang
							});
						});
						if (_thatOC.Data) {
							if (_thatOC.Data.Status === "Rejected") {
								if (ColorVal != undefined) {
									selectedKey = _thatOC.oVehicleDetailsJSON.getData().colorData.filter(function (val) {
										if (localLang === "F" && val.ExteriorColorCode == ColorVal) {
											return val.ExteriorColorCode + " " + val.MarketingDescriptionEXTColorFR;
										} else if (localLang === "E" && val.ExteriorColorCode == ColorVal) {
											return val.ExteriorColorCode + " " + val.MarketingDescriptionEXTColorEN;
										}
									});
									_thatOC.oVehicleDetailsJSON.getData().colorData.unshift(selectedKey);
									// _thatOC.byId("ID_ExteriorColorSelect").setSelectedKey(selectedKey);
								}
							}
						}

					

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
				
					_thatOC.getView().getModel("VehicleDetailsJSON").updateBindings(true);
				
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
					//_thatOC.getRouter().navTo("changeHistory2");
					sap.m.MessageBox.information(_thatOC.oI18nModel.getResourceBundle().getText("PleaseSelectDealer"));
				}
			}
		},

		_DataValidate: function (oPost) {
			var sUserInput = _thatOC.getView().byId("ID_modelSelect").getSelectedKey();
			var sUserInput2 = _thatOC.getView().byId("ID_suffixSelect").getSelectedKey();
			var sUserInput3 = _thatOC.getView().byId("ID_ExteriorColorSelect").getSelectedKey();
			var oInputControl = _thatOC.getView().byId("ID_modelSelect");
			var oInputControl2 = _thatOC.getView().byId("ID_suffixSelect");
			var oInputControl3 = _thatOC.getView().byId("ID_ExteriorColorSelect");

			if (sUserInput && sUserInput2 && sUserInput3) {
				oInputControl.setValueState(sap.ui.core.ValueState.Success);
				oInputControl2.setValueState(sap.ui.core.ValueState.Success);
				oInputControl3.setValueState(sap.ui.core.ValueState.Success);
				_thatOC.onRequestChange(oPost);
			} else {
				oInputControl.setValueState(sap.ui.core.ValueState.Error);
				oInputControl2.setValueState(sap.ui.core.ValueState.Error);
				oInputControl3.setValueState(sap.ui.core.ValueState.Error);
			}
		},

		onRequestChange: function (oPost) {
			var Obj = {};
			_thatOC.oOrderChangeJSON = _thatOC.getView().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0];
			Obj.VHCLE = _thatOC.oOrderChangeJSON.VHCLE;
			Obj.Dealer = _thatOC.oOrderChangeJSON.Dealer;
			Obj.LANGUAGE = localLang;
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
			OrderChangeModel.setUseBatch(false);

			_thatOC.fnGetLoggedInUserId(function (loggedInUser) {
				Obj.UpdatedBy = loggedInUser;
				OrderChangeModel.create("/OrderChangeSet", Obj, {
					success: $.proxy(function (oResponse) {
						if (oResponse.Error != "") {
							sap.m.MessageBox.show(oResponse.Error, {
								icon: sap.m.MessageBox.Icon.ERROR,
								title: _thatOC.oI18nModel.getResourceBundle().getText("Error"),
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function (oAction) {}
							});
						} else {
							_thatOC.getView().getModel("VehicleDetailsJSON").getData().selectedVehicleData[0].Status = "Requested";
							_thatOC.getView().getModel("VehicleDetailsJSON").updateBindings(true);
							sap.m.MessageBox.show(_thatOC.oI18nModel.getResourceBundle().getText("VehicleUpdated"), {
								icon: sap.m.MessageBox.Icon.SUCCESS,
								title: _thatOC.oI18nModel.getResourceBundle().getText("Success"),
								actions: [sap.m.MessageBox.Action.OK],
								onClose: function (oAction) {}
							});
						}
					}, _thatOC),
					error: function (oError) {
						sap.m.MessageBox.show(_thatOC.oI18nModel.getResourceBundle().getText("ErrorInData"), {
							icon: sap.m.MessageBox.Icon.ERROR,
							title: _thatOC.oI18nModel.getResourceBundle().getText("Error"),
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function (oAction) {}
						});
						// sap.m.MessageBox.error(
						// 	"Error in data posting"
						// );
					}
				});
			});

		},

		onExit: function () {
			this.destroy();
		}

	});

});