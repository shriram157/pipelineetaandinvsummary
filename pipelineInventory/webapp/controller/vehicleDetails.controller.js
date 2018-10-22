var _that;
sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'toyota/ca/xsaapp/PipelineETAInventSummary/controller/BaseController',
	'sap/ui/core/routing/History'
], function (BaseController, History) {
	"use strict";

	return BaseController.extend("toyota.ca.xsaapp.PipelineETAInventSummary.controller.vehicleDetails", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf toyota.ca.xsaapp.PipelineETAInventSummary.view.vehicleDetails
		 */
		onInit: function () {
			_that = this;

			this.getView().setModel(sap.ui.getCore().getModel("SelectJSONModel"), "SelectJSONModel");
			_that.oDummyJSONModel = sap.ui.getCore().getModel("DummyJSONModel");
			this.getView().setModel(_that.oDummyJSONModel, "DummyJSONModel");
			sap.ui.getCore().setModel(_that.oDummyJSONModel, "DummyJSONModel");

			this.getRouter().attachRouteMatched(function (oEvent) {
				//console.log(oEvent.getParameter("arguments").data);
				var _OrderNumber = oEvent.getParameter("arguments").OrderNumber;
				if (_that.oDummyJSONModel !== undefined) {
					for (var i = 0; i < _that.oDummyJSONModel.getData().ProductCollection.length; i++) {
						if (_that.oDummyJSONModel.getData().ProductCollection[i].ProductId == _OrderNumber) {
							_that.oDummyJSONModel.getData().selectedVehicleData = [];
							_that.oDummyJSONModel.getData().selectedVehicleData.push(_that.oDummyJSONModel.getData().ProductCollection[i]);
							_that.oDummyJSONModel.updateBindings();
							// _that.getView().byId("ID_VLForm").bindElement("DummyJSONModel>/selectedVehicleData/0/");
							//_that.getView().bindElement("DummyJSONModel>/selectedVehicleData");
						}
					}
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
				var oRouter = sap.ui.core.UIComponent.getRouterFor(_that);
				oRouter.navTo("details");
			}
		},

		/*Navigate to Order Change screen*/
		NavToOrderChange: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(_that);
			oRouter.navTo("orderChange", {
				OrderNumber: sap.ui.getCore().getModel("DummyJSONModel").getData().selectedVehicleData[0].ProductId
			});
		},

		/*Routing to selected screens*/
		selectedScreen: function (oSelectedScreen) {
			var selectedScreenText = oSelectedScreen.getParameters().selectedItem.getText();
			if (selectedScreenText == "Master") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Pipeline ETA & Inventory Summary");
				_that.getRouter().navTo("Routemaster");
			} else if (selectedScreenText == "Details") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Details");
				_that.getRouter().navTo("details");
			} else if (selectedScreenText == "Vehicle Details") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Vehicle Details");
				_that.getRouter().navTo("vehicleDetails");
			} else if (selectedScreenText == "Order Change") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Order Change");
				_that.getRouter().navTo("orderChange");
			} else if (selectedScreenText == "Ship To Dealer") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Ship To Dealer");
				_that.getRouter().navTo("shipToDealer");
			} else if (selectedScreenText == "Ship To Dealer Response") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Ship To Dealer Response");
				_that.getRouter().navTo("shipToDealerResponse");
			} else if (selectedScreenText == "Assign Vehicles") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Assign Vehicles");
				_that.getRouter().navTo("assignVehicles");
			} else if (selectedScreenText == "Assign Vehicles Status") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Assign Vehicles Status");
				_that.getRouter().navTo("assignVehiclesStatus");
			} else if (selectedScreenText == "Change History") {
				// oSelectedScreen.getSource().getParent().getContentLeft()[2].setText("Change History");
				_that.getRouter().navTo("changeHistory");
			}
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf toyota.ca.xsaapp.PipelineETAInventSummary.view.vehicleDetails
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf toyota.ca.xsaapp.PipelineETAInventSummary.view.vehicleDetails
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf toyota.ca.xsaapp.PipelineETAInventSummary.view.vehicleDetails
		 */
		//	onExit: function() {
		//
		//	}

	});

});