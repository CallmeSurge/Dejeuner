'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	menus = require('../../app/controllers/menus');

module.exports = function(app) {
	// Article Routes
	app.route('/menus')
		.get(menus.list)
		.post(users.requiresLogin, users.adminOnly, menus.create);

	app.route('/menus/:menuId')
		.get(menus.read)
		.put(users.requiresLogin, users.adminOnly, menus.update)
		.delete(users.requiresLogin, users.adminOnly, menus.delete);

	// Finish by binding the article middleware
	app.param('menuId', menus.menuByID);
};