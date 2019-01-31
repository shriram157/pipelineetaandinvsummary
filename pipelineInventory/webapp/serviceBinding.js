function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}