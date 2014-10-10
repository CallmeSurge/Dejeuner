'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Order = mongoose.model('Order'),
	_ = require('lodash');

/**
 * Create foodItems
 */
exports.create = function(req, res) {

	var order = new Order(req.body);
	order.user = req.user;
	order.menu = req.menu;
	order.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(order);
		}
	});
};

/**
 * Show the current orders
 */
exports.read = function(req, res) {
	res.jsonp(req.order);
};

/**
 * Update a order
 */
exports.update = function(req, res) {
	var order = req.order;

	order = _.extend(order, req.body);

	order.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(order);
		}
	});
};

/**
 * Delete a menu
 */
exports.delete = function(req, res) {
	var order = req.order;

	order.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(order);
		}
	});
};

/**
 * List of menus
 */
exports.list = function(req, res, id) {
	Order.find().where('menu').in([req.menu._id]).sort('-created').populate('items.item').populate('menu', 'date').populate('user', 'displayName').exec(function(err, orders) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(orders);
		}
	});
};


/**
 * Menu middleware
 */
exports.orderByID = function(req, res, next, id) {
	Order.findById(id).populate('items').exec(function(err, order) {
		if (err) return next(err);
		if (!order) return next(new Error('Failed to load order ' + id));
		next();
	});
};
