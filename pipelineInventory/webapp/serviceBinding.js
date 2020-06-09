function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
	var Url = "/sap/opu/odata/sap/Z_VEHICLE_MASTER_SRV/";
	var Model = new sap.ui.model.odata.ODataModel(Url, true);
	sap.ui.getCore().setModel(oModel);
}