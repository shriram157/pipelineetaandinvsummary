/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
'use strict';
var express = require('express');
var request = require('request');
var xsenv = require("@sap/xsenv");
var passport = require('passport');
// var JWTStrategy = require('@sap/xssec').JWTStrategy; 

var async = require('async');

module.exports = function () {
	var app = express.Router();
	//Hello Router
	app.get('/', (req, res) => {
		var output = '<a os Details</a> - Your Node Module is up and Running</br> ';
		// console.log(req);

		res.type('text/html').status(200).send(output);
	});

	app.get('/os', (req, res) => {
		var os = require('os');
		var output = {};

		output.tmpdir = os.tmpdir();
		output.endianness = os.endianness();
		output.hostname = os.hostname();
		output.type = os.type();
		output.platform = os.platform();
		output.arch = os.arch();
		output.release = os.release();
		output.uptime = os.uptime();
		output.loadavg = os.loadavg();
		output.totalmem = os.totalmem();
		output.freemem = os.freemem();
		output.cpus = os.cpus();
		output.networkInfraces = os.networkInterfaces();

		var result = JSON.stringify(output);
		res.type('application/json').status(200).send(result);
	});

	var auth64;

	// SAP Calls Start from here

	var options = {};
	options = Object.assign(options, xsenv.getServices({
		api: {
			name: "S4HANA_CUPS"
		}
	}));

	var uname = options.api.user,
		pwd = options.api.password,
		url = options.api.host,
		APIKey = options.api.APIKey,
		client = options.api.client;

	console.log(options);

	auth64 = 'Basic ' + new Buffer(uname + ':' + pwd).toString('base64');

	app.use(function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});

	// app.all('/*', function (req, res, next) {
	// 	console.log("request", req);
	// 	let headOptions = {};
	// 	var csrfToken;
	// 	// prepare the magic reverse proxy header for odata service to work. 
	// 	let originalHost = req.hostname;
	// 	if (!!req.headers.host) {
	// 		headOptions.host = req.headers.host;
	// 	}

	// 	//only support the basic auth
	// 	headOptions.Authorization = auth64;

	// 	let method = req.method;
	// 	console.log("requested url",req.url);
	// 	let xurl = url + req.url;
	// 	console.log('Method', method);
	// 	console.log('URL that I am running', xurl);
	// 	let xRequest =
	// 		request({
	// 			method: method,
	// 			url: xurl,
	// 			headers: headOptions
	// 		});
	// 	req.pipe(xRequest);
	// 	xRequest.on('response', (response) => {
	// 		// delete response.headers['set-cookie'];
	// 		csrfToken = response.headers['x-csrf-token'];
	// 		xRequest.pipe(res);
	// 	}).on('error', (error) => {
	// 		next(error);
	// 	});
	// });

	//api business partner call
	app.get('/API_BUSINESS_PARTNER', function (req, res) {

		console.log("inside the API_BUSINESS_PARTNER")

		console.log("inside zvehicle master");
		console.log(url);
		console.log(url + "/API_BUSINESS_PARTNER/");

		var csrfToken;
		request({
			url: url +
				"/API_BUSINESS_PARTNER/A_BusinessPartner?$format=json&?sap-client=" + client +
				"&$filter=BusinessPartnerType%20eq%20%27Z001%27&$orderby=BusinessPartnerName",
			headers: {
				"Authorization": auth64,
				"Content-Type": "application/json",
				"APIKey": APIKey,
				"x-csrf-token": "Fetch"
			}

		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				csrfToken = response.headers['x-csrf-token'];
				// console.log(csrfToken);
				var json = JSON.parse(body);
				res.json(json);
			} else {

				var result = JSON.stringify(body);
				res.type('application/json').status(401).send(result);
			}
		});
	});

	// // aarthy service call
	// //https://fioridev1.dev.toyota.ca:44300/sap/opu/odata/sap/Z_VEHICLE_MASTER_SRV/zc_model
	// //https://fioridev1.dev.toyota.ca:44300/sap/opu/odata/sap/Z_VEHICLE_MASTER_SRV/zc_model
	// //https://nodemodule_pipeline.cfapps.us10.hana.ondemand.com/node/ZC_MODEL
	// // https://sapdev.apimanagement.ca1.hana.ondemand.com:443/Z_VEHICLE_MASTER_SRV
	// // https://sapdev.apimanagement.ca1.hana.ondemand.com:443/Z_VEHICLE_MASTER_SRV/zc_model
	// /sap/opu/odata/sap/Z_VEHICLE_CATALOGUE_SRV/

	app.get('/Z_VEHICLE_CATALOGUE_MODEL', function (req, res) {
		//	var zcEntityset = req.param("zc_model");
		var csrfToken;
		console.log("req", req.param());
		console.log("url", url);
		console.log(url + "/Z_VEHICLE_CATALOGUE_SRV/");
		request({
			url: url +
				"/Z_VEHICLE_CATALOGUE_SRV/zc_model/?$format=json",
			headers: {
				"Authorization": auth64,
				"Content-Type": "application/json",
				"APIKey": APIKey,
				"x-csrf-token": "Fetch"
			}
		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				csrfToken = response.headers['x-csrf-token'];
				// console.log(csrfToken);
				var json = JSON.parse(body);
				res.json(json);
			} else {
				var result = JSON.stringify(body);
				res.type('application/json').status(401).send(result);
			}
		});
	});
	app.get('/Z_VEHICLE_CATALOGUE_MM', function (req, res) {
		//	var zcEntityset = req.param("zc_model");
		var csrfToken;
		console.log(url);
		console.log(url + "/Z_VEHICLE_CATALOGUE_SRV/");
		request({
			url: url +
				"/Z_VEHICLE_CATALOGUE_SRV/zc_mmfields/?$format=json",
			headers: {
				"Authorization": auth64,
				"Content-Type": "application/json",
				"APIKey": APIKey,
				"x-csrf-token": "Fetch"
			}
		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				csrfToken = response.headers['x-csrf-token'];
				// console.log(csrfToken);
				var json = JSON.parse(body);
				res.json(json);
			} else {
				var result = JSON.stringify(body);
				res.type('application/json').status(401).send(result);
			}
		});
	});
	app.get('/Z_VEHICLE_CATALOGUE_TRIM', function (req, res) {
		//	var zcEntityset = req.param("zc_model");
		var csrfToken;
		console.log(url);
		console.log(url + "/Z_VEHICLE_CATALOGUE_SRV/");
		request({
			url: url +
				"/Z_VEHICLE_CATALOGUE_SRV/zc_exterior_trim/?$format=json",
			headers: {
				"Authorization": auth64,
				"Content-Type": "application/json",
				"APIKey": APIKey,
				"x-csrf-token": "Fetch"
			}
		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				csrfToken = response.headers['x-csrf-token'];
				// console.log(csrfToken);
				var json = JSON.parse(body);
				res.json(json);
			} else {
				var result = JSON.stringify(body);
				res.type('application/json').status(401).send(result);
			}
		});
	});
	return app;
};