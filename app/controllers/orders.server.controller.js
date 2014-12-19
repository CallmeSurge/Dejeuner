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
	var smtpTransport = nodemailer.createTransport('SMTP',{
	   	service: 'Gmail',
	   	auth: {
	       user: 'menu.service@andela.co',
	       pass: 'andela2014'
	   	}
	});

		smtpTransport.sendMail({
	   		from: 'Menu Service <menu.service@andela.co>', // sender address
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

var create = function(req, res) {
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
 * Update a order
 */
exports.update = function(req, res) {
	var order = new Order(req.body);
	order.user = req.user;
	order.menu = req.menu;
	var id = req.user._id;
	Order.find().where('menu').in([req.menu._id]).where('user').equals(req.user._id).exec(function(err, orders) {
		// console.log('order before splice', orders[2].user);
		
		for(var x in orders){
			
			if(String(req.user._id) === String(orders[x].user)){
				// console.log(req.user._id + '-' + orders[x].user);
				// console.log(orders[x]);
				var item = {
					menu: req.menu._id,
					user: req.user._id,
					total: req.body.total,
					items: req.body.items
				};
				var this_order = orders[x];
				console.log('Before', this_order);
				this_order = _.extend(this_order, item);
				this_order.save(function(err){
					if(err){
						console.log(err);
					} else {
						console.log('After' + this_order);
					}
				});
			}
		}

		console.log(orders);
		// for(var i = 0; i <= orders.length; i++) {
			// if(String(id) === String(orders[i].user)) {
				// orders.splice(orders[i].user, 1);
			// }else{
			// 	console.log('start inspect');
			// 	console.log(orders);
			// 	console.log('inspectin ends');
			// 	// console.log(orders[i].user);
			// 	// console.log('username already exist');
			// 	// create();
			// 	// return done(new Error('User already created an order'));
			// 	// order.splice(order[i].user, 1);
			// 	// console.log('order after splice', order);
			// } 
		// }
		// create(req, res);
		// console.log('order after splice', orders);
		// console.log('username already exist');
		// return;
	});	
	// Order.find().where('menu').in([req.menu._id]).exec(function(err, orders){
	// 	console.log('entered', orders);
	// 	return;
	};
// };

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
			console.log('starts');
			console.log(orders);
			console.log('stops');
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
