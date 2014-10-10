'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Order Schema
 */

var OrderSchema = new Schema({
	menu: {
		type: Schema.ObjectId,
		ref: 'Menu'
	},
	items: [{
		item: {
			type: Schema.ObjectId,
			ref: 'FoodItem'
		},
		quantity: {
			type: Number
		}
	}],
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Order', OrderSchema);
