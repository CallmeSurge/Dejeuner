'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	FoodItem = mongoose.model('FoodItem'),
	_ = require('lodash');

/**
 * Create foodItems
 */
exports.create = function(req, res) {
	var foodItem = new FoodItem(req.body);

	foodItem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(foodItem);
		}
	});
};

/**
 * Show the current foodItem
 */
exports.read = function(req, res) {
	res.jsonp(req.foodItem);
};

/**
 * Update a foodItem
 */
exports.update = function(req, res) {
	var foodItem = req.foodItem;

	foodItem = _.extend(foodItem, req.body);

	foodItem.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(foodItem);
		}
	});
};

/**
 * Delete an foodItem
 */
exports.delete = function(req, res) {
	var foodItem = req.foodItem;

	foodItem.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(foodItem);
		}
	});
};

/**
 * List of FoodItems
 */
exports.list = function(req, res) {
	FoodItem.find().sort('-created').populate('user', 'displayName').exec(function(err, foodItems) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(foodItems);
		}
	});
};

/**
 * Article middleware
 */
exports.foodItemByID = function(req, res, next, id) {
	FoodItem.findById(id).populate('user', 'displayName').exec(function(err, foodItem) {
		if (err) return next(err);
		if (!foodItem) return next(new Error('Failed to load foodItem ' + id));
		req.foodItem = foodItem;
		next();
	});
};
