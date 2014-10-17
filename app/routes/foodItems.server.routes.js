'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	foodItems = require('../../app/controllers/foodItems');

module.exports = function(app) {
	// Article Routes
	app.route('/foodItems')
		.get(foodItems.list)
		.post(users.requiresLogin, foodItems.create);

	app.route('/foodItems/:foodItemId')
		.get(foodItems.read)
		.put(users.requiresLogin, foodItems.update)
		.delete(users.requiresLogin, foodItems.delete);

	// Finish by binding the article middleware
	app.param('foodItemId', foodItems.foodItemByID);
};