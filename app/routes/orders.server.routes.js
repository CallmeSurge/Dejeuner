'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	orders = require('../../app/controllers/orders'),
	menus = require('../../app/controllers/menus');

module.exports = function(app) {
	// Article Routes
	app.route('/menus/:menuId/orders')
		.get(orders.list)
		.post(users.requiresLogin, orders.create);

	app.route('/menus/:menuId/orders/:orderId')
		.get(orders.read)
		.put(users.requiresLogin, orders.update)
		.delete(users.requiresLogin, orders.delete);

	app.route('/menus/orders/:orderId')
		.get(orders.read);

	app.param('menuId', menus.menuByID);
	// Finish by binding the article middleware
	app.param('orderId', orders.orderByID);
};