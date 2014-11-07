'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Order = mongoose.model('Order'),
	FoodItem = mongoose.model('FoodItem'),
	_ = require('lodash'),
	nodemailer = require('nodemailer');


/**
 * Create foodItems
 */
exports.create = function(req, res) {
	console.log(req.body);

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
 * Send a mail
 */

exports.sendMail = function (req, res){

	var order = new Order(req.body);
	console.log('inspection starts');
	console.log(req.body.mail);
	console.log('inspection ends');
	var smtpTransport = nodemailer.createTransport('SMTP',{
	   	service: 'Gmail',
	   	auth: {
	       user: 'bello.a.babajide@gmail.com',
	       pass: 'babajide90'
	   	}
	});

		smtpTransport.sendMail({
	   		from: 'Bello Babajide <bello.babajide@andela.co>', // sender address
	   		to: '<' + req.body.mail + '>', // comma separated list of receivers
	   		subject: req.body.subject, // Subject line
	   		html : req.body.text // plaintext body
		}, function(error, response){
	   	if(error){
	   		return res.status(400).send({
				message: errorHandler.getErrorMessage(error)
			});
	   	}else{
	   		res.jsonp({'message': 'Orders Sent Successfully'});
	   		res.status(200);
	       console.log('Message sent: ' + response.message);
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
	var details = Order.find().where('menu').in([req.menu._id]).sort('-created').populate('order').populate('items.item').populate('user', 'displayName');
		details.exec(function(err, orders) {
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
	Order.findById(id).populate('items.item').exec(function(err, order) {
		if (err) return next(err);
		if (!order) return next(new Error('Failed to load order ' + id));
		next();
	});
};
