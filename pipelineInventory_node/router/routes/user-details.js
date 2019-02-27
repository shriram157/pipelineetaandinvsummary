/*eslint new-cap: 0, no-console: 0, no-shadow: 0, no-unused-vars: 0*/
/*eslint-env es6, node*/

"use strict";

module.exports = function (log) {
	var express = require("express");
	var request = require("request");
	var xsenv = require("@sap/xsenv");

	var router = express.Router();

	// TODO: provide service name via environment variable instead
	var apimServiceName = "PIPELINE_INVENTORY_APIM_CUPS";
	var options = {};
	options = Object.assign(options, xsenv.getServices({
		apim: {
			name: apimServiceName
		}
	}));
	log.logMessage("debug", "Properties of APIM user-provided service '%s' : %s", apimServiceName, JSON.stringify(options));

	var xsuaaService = xsenv.getServices({
		xsuaa: {
			tag: "xsuaa"
		}
	}).xsuaa;

	var url = options.apim.host;
	var APIKey = options.apim.APIKey;
	var s4Client = options.apim.client;
	var s4User = options.apim.user;
	var s4Password = options.apim.password;

	router.get("/attributes", (req, res) => {
		var userAttributes = req.authInfo.userAttributes;
		//req.logMessage("debug", "User attributes from JWT: %s", JSON.stringify(userAttributes));

		var resBody = {
			"attributes": [],
			"samlAttributes": userAttributes,
			legacyDealer: "",
			legacyDealerName: "",
			"sales": []
		};

		var userType = userAttributes.UserType[0];
		var dealerCode = null;
		var zone = null;
		var bpZone = null;
		var bpReqUrl = null;

		// Dealer user
		if (userType === "Dealer") {
			dealerCode = userAttributes.DealerCode[0];
			bpReqUrl = url + "/API_BUSINESS_PARTNER/A_BusinessPartner?sap-client=" + s4Client + "&$format=json&$filter=SearchTerm2 eq '" +
				dealerCode + "'&$expand=to_Customer";
		}

		// Zone user
		else if (userType === "Zone") {
			zone = userAttributes.Zone[0];
			if (zone === "1") {
				bpZone = "1000";
			} else if (zone === "2") {
				bpZone = "2000";
			} else if (zone === "3") {
				bpZone = "3000";
			} else if (zone === "4") {
				bpZone = "5000";
			} else if (zone === "5") {
				bpZone = "4000";
			} else if (zone === "7") {
				bpZone = "9000";
			} else {
				//req.logMessage("error", "Unrecognized zone ID: %s", zone);
				return res.type("plain/text").status(500).send("Unknown zone ID.");
			}

			bpReqUrl = url + "/API_BUSINESS_PARTNER/A_BusinessPartner?sap-client=" + s4Client + "&$format=json" +
				"&$expand=to_Customer/to_CustomerSalesArea&$filter=(BusinessPartnerType eq 'Z001' or BusinessPartnerType eq 'Z004')" +
				"&$orderby=BusinessPartner asc";
		}

		// National user (TCI user)
		else {
			bpReqUrl = url + "/API_BUSINESS_PARTNER/A_BusinessPartner?sap-client=" + s4Client + "&$format=json" +
				"&$expand=to_Customer/to_CustomerSalesArea&$filter=(BusinessPartnerType eq 'Z001' or BusinessPartnerType eq 'Z004')" +
				"&$orderby=BusinessPartner asc";
		}

		req.logMessage("debug", "BP URL: %s", bpReqUrl);
		var bpReqHeaders = {
			"APIKey": APIKey,
			"Authorization": "Basic " + new Buffer(s4User + ":" + s4Password).toString("base64"),
			"Content-Type": "application/json"
		};
		request({
			url: bpReqUrl,
			headers: bpReqHeaders
		}, function (bpErr, bpRes, bpResBodyStr) {
			var toCustomerAttr1 = null;
			var bpAttributes = null;

			log.logMessage("debug", "Response body from proxied BP call: %s", bpResBodyStr);

			if (!bpErr && bpRes.statusCode === 200) {
				var bpResBody = JSON.parse(bpResBodyStr);
				var bpResults = bpResBody.d.results;

				// Filter BP results by sales area for zone user
				if (userType === "Zone") {
					bpResults = bpResults.filter(o => {
						if (!o.to_Customer) {
							return false;
						}
						var customerSalesArea = o.to_Customer.to_CustomerSalesArea;
						if (!customerSalesArea) {
							return false;
						}
						for (var i = 0; i < customerSalesArea.results.length; i++) {
							if (customerSalesArea.results[i].SalesOffice === bpZone) {
								if ((customerSalesArea.results[i].SalesOrganization == "6000" && customerSalesArea.results[i].DistributionChannel == "10")) {
									if (customerSalesArea.results[i].Customer !== "2400500000") {
										resBody.sales.push(customerSalesArea.results[i]); //to fetch sales data
									}
								}
								return true;
							}
						}
						return false;
					});
				}
				if (userType === "National") {
					bpResults = bpResults.filter(o => {
						if (!o.to_Customer) {
							return false;
						}
						var customerSalesArea = o.to_Customer.to_CustomerSalesArea;
						if (!customerSalesArea) {
							return false;
						}
						for (var i = 0; i < customerSalesArea.results.length; i++) {
							if (customerSalesArea.results[i].SalesOffice == "1000" || customerSalesArea.results[i].SalesOffice == "2000" ||
								customerSalesArea.results[i].SalesOffice == "3000" || customerSalesArea.results[i].SalesOffice == "4000" ||
								customerSalesArea.results[i].SalesOffice == "5000" || customerSalesArea.results[i].SalesOffice == "7000" ||
								customerSalesArea.results[i].SalesOffice == "9000") {
								// if (bpZone) {
								if ((customerSalesArea.results[i].SalesOrganization == "6000") && (customerSalesArea.results[i].DistributionChannel == "10")) {
									resBody.sales.push(customerSalesArea.results[i]); //to fetch sales data
								}
							}
							return true;
							// }
						}
						return false;
					});
				}

				for (var i = 0; i < bpResults.length; i++) {
					var bpLength = bpResults[i].BusinessPartner.length;
					bpAttributes = {
						BusinessPartnerName: bpResults[i].OrganizationBPName1,
						BusinessPartnerKey: bpResults[i].BusinessPartner,
						BusinessPartner: bpResults[i].BusinessPartner.substring(5, bpLength),
						BusinessPartnerType: bpResults[i].BusinessPartnerType,
						SearchTerm2: bpResults[i].SearchTerm2
					};
					// bpAttributes.Sales = bpResults[i].sales;
					try {
						toCustomerAttr1 = bpResults[i].to_Customer.Attribute1;
					} catch (e) {
						req.logMessage("info", "The Data is sent without Attribute value for the BP", bpResults[i].BusinessPartner);
					}

					// if (toCustomerAttr1 === "01") {
					// 	bpAttributes.Division = "10"; //TOY
					// 	bpAttributes.Attribute = "01";
					// } else if (toCustomerAttr1 === "02") {
					// 	bpAttributes.Division = "20"; //LEX
					// 	bpAttributes.Attribute = "02";
					// } else if (toCustomerAttr1 === "03") {
					// 	bpAttributes.Division = "Dual"; //DUAL
					// 	bpAttributes.Attribute = "03";
					// } else if (toCustomerAttr1 === "04") {
					// 	bpAttributes.Division = "10";
					// 	bpAttributes.Attribute = "04";
					// } else if (toCustomerAttr1 === "05") {
					// 	bpAttributes.Division = "Dual";
					// 	bpAttributes.Attribute = "05";
					// } else {
					// 	// Set as Toyota dealer as fallback
					// 	bpAttributes.Division = "10";
					// 	bpAttributes.Attribute = "01";
					// }

					if (userType === "Dealer") {
						if (bpAttributes.BusinessPartner === dealerCode || bpAttributes.SearchTerm2 === dealerCode) {
							resBody.legacyDealer = bpAttributes.BusinessPartner;
							resBody.legacyDealerName = bpAttributes.BusinessPartnerName;
							resBody.attributes.push(bpAttributes);

							// Dealer should only return one BP result anyway, but break here just in case
							break;
						}
					} else {
						resBody.attributes.push(bpAttributes);
					}
				}
				req.logMessage("debug", "Response body: %s", JSON.stringify(resBody));
				return res.type("application/json").status(200).send(resBody);
			} else {
				req.logMessage("error", "Proxied BP call %s FAILED: %s", bpReqUrl, bpErr);
				return res.type("application/json").status(400).send(bpResBody);
			}
		});
	});

	router.get("/currentScopesForUser", (req, res) => {
		var xsAppName = xsuaaService.xsappname;
		var scopes = req.authInfo.scopes;
		var userAttributes = req.authInfo.userAttributes;

		req.logMessage("debug", "Scopes from JWT: %s", JSON.stringify(scopes));
		req.logMessage("debug", "User attributes from JWT: %s", JSON.stringify(userAttributes));

		var role = "Unknown";
		var manageVehicles = false;
		var manageVehicleConfigDetails = false;
		var updateVehicleDetails = false;
		var viewVehicleDetails = false;
		var viewVehicleSummary = false;

		for (var i = 0; i < scopes.length; i++) {
			if (scopes[i] === xsAppName + ".Manage_Vehicles") {
				manageVehicles = true;
			} else if (scopes[i] === xsAppName + ".Manage_Vehicle_Config_Details") {
				manageVehicleConfigDetails = true;
			} else if (scopes[i] === xsAppName + ".Update_Vehicle_Details") {
				updateVehicleDetails = true;
			} else if (scopes[i] === xsAppName + ".View_Vehicle_Details") {
				viewVehicleDetails = true;
			} else if (scopes[i] === xsAppName + ".View_Vehicle_Summary") {
				viewVehicleSummary = true;
			} else {
				req.logMessage("warn", "Unrecognized scope: %s", scopes[i]);
			}
		}

		req.logMessage("debug", "manageVehicles: %s", manageVehicles);
		req.logMessage("debug", "manageVehicleConfigDetails: %s", manageVehicleConfigDetails);
		req.logMessage("debug", "updateVehicleDetails: %s", updateVehicleDetails);
		req.logMessage("debug", "viewVehicleDetails: %s", viewVehicleDetails);
		req.logMessage("debug", "viewVehicleSummary: %s", viewVehicleSummary);

		if (!manageVehicles && manageVehicleConfigDetails && updateVehicleDetails && viewVehicleDetails && viewVehicleSummary) {
			role = "Dealer_User";
		} else if (manageVehicles && !manageVehicleConfigDetails && !updateVehicleDetails && viewVehicleDetails && viewVehicleSummary) {
			role = userAttributes.Zone ? "TCI_Zone_User" : "TCI_User";
		}
		req.logMessage("debug", "role: %s", role);

		return res.type("application/json").status(200).send(JSON.stringify({
			loggedUserType: [
				role
			]
		}));
	});

	return router;
};