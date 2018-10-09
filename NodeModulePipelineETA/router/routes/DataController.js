/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
'use strict';
var express = require('express');
var request = require('request');
var xsenv = require("@sap/xsenv");
var passport = require('passport');
// var xsjs = require('@sap/xsjs');
var JWTStrategy = require('@sap/xssec').JWTStrategy;

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

	var auth64, auth64_new;

	// SAP Calls Start from here

	app.use(function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});

	var user = "XSA_DEV",
		host = "https://sapdev.apimanagement.ca1.hana.ondemand.com:443/",
		password = "XSA_DEV@123",
		APIKey = "RBHKiLeMQEF9F8xnICJFcwQjvX5fVYum",
		client = "200";

	// /*Odata call*/
	// //api zc_model call
	app.get("/zc_model", function (req, res) {
	// 	console.log("inside zc_model");
	// 	console.log("request", req);
	// 	console.log("response", res);
		var url = host +"/Z_VEHICLE_MASTER_SRV/zc_model?sap-client-200&$format=json";
		var csrfToken = "Fetch";
		request({
			url: url,
			method: "GET",
			headers: {
				// "Authorization": auth64_new,
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/json",
				"DataServiceVersion": "2.0",
				"APIKey": APIKey,
				"X-CSRF-Token": csrfToken
			}
		}, function (error, response, body) {
			// console.log("error", error);
			// console.log("response", response);
			// console.log("body", body);
			if (!error && response.statusCode == 200) {
				csrfToken = response.headers['x-csrf-token'];
				// console.log(csrfToken);
				var json = JSON.parse(body);
				res.json(json);
			} else {
				// console.log("inside zc_model error");
				// console.log("error2", error);
				// console.log("response2", response);
				// console.log("body2", body);
				var result = JSON.stringify(body);
				console.log(result);
				res.type('application/json').status(401).send(result);
			}
		});
	});
	// //api zc_exterior_trim call
	app.get("/zc_exterior_trim", function (req, res) {
		var url = host +"/Z_VEHICLE_MASTER_SRV/zc_exterior_trim?sap-client-200&$format=json";
		var csrfToken = "Fetch";
		request({
			url: url,
			method: "GET",
			headers: {
				// "Authorization": auth64_new,
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/json",
				"DataServiceVersion": "2.0",
				"APIKey": APIKey,
				"X-CSRF-Token": csrfToken
			}
		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				csrfToken = response.headers['x-csrf-token'];
				var json = JSON.parse(body);
				res.json(json);
			} else {
				var result = JSON.stringify(body);
				console.log(result);
				res.type('application/json').status(401).send(result);
			}
		});
	});
	
	// //api zc_mmfields call
	app.get("/zc_mmfields", function (req, res) {
		var url = host +"/Z_VEHICLE_MASTER_SRV/zc_mmfields?sap-client-200&$format=json";
		var csrfToken = "Fetch";
		request({
			url: url,
			method: "GET",
			headers: {
				// "Authorization": auth64_new,
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/json",
				"DataServiceVersion": "2.0",
				"APIKey": APIKey,
				"X-CSRF-Token": csrfToken
			}
		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				csrfToken = response.headers['x-csrf-token'];
				var json = JSON.parse(body);
				res.json(json);
			} else {
				var result = JSON.stringify(body);
				console.log(result);
				res.type('application/json').status(401).send(result);
			}
		});
	});
	//api business partner call
	app.get('/API_BUSINESS_PARTNER', function(req, res) {
		// var url = "https://tcid1gwapp1.tci.internal.toyota.ca:44300/sap/opu/odata/sap";
		var csrfToken;
		request({
			url: host +
				"/API_BUSINESS_PARTNER/",
			headers: {
				// "Authorization": auth64,
				"Content-Type": "application/json",
				 "APIKey": APIKey,
				"x-csrf-token": "Fetch"
			}

		}, function(error, response, body) {
			console.log("noerror",error);
			console.log("dataResponse",response);
			// console.log(Buffer.from(response, 'base64'));
			console.log("body",body);
			if (!error && response.statusCode == 200) {
				console.log("error1",error);
				csrfToken = response.headers['x-csrf-token'];
				// console.log(csrfToken);
				var json = JSON.parse(body);
				res.json(json);
			} else {
				console.log("error2",error);
				var result = JSON.stringify(body);
				res.type('application/json').status(401).send(result);
			}
		});
	});
	return app;
};