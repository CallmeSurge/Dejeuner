'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var FoodItemSchema = new Schema({

	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Enter the food item'
	},
	price: {
		type: Number,
		default: ''
	}
});

mongoose.model('FoodItem', FoodItemSchema);