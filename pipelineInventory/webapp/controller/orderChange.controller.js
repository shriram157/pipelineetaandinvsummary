var _that;
sap.ui.define([
	// "sap/ui/core/mvc/Controller",
	'pipelineInventory/controller/BaseController',
	'sap/ui/core/routing/History'
], function (BaseController,History) {
	"use strict";

	return BaseController.extend("pipelineInventory.controller.orderChange", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf pipelineInventory.view.orderChange
		 */
		onInit: function () {
			_that = this;
			_that.oDummyJSONModel = sap.ui.getCore().getModel("DummyJSONModel");
			_that.getView().setModel(_that.oDummyJSONModel, "DummyJSONModel");
			
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
		
		NavigateBack: function () {
			// this.getRouter().navTo("details", {});
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(_that);
				oRouter.navTo("vehicleDetails");
			}
		},

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
		 * @memberOf pipelineInventory.view.orderChange
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf pipelineInventory.view.orderChange
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf pipelineInventory.view.orderChange
		 */
		//	onExit: function() {
		//
		//	}

	});

});