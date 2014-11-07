'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
/**
 * Menu Schema
 */
var MenuSchema = new Schema({

	items: [{
		type: Schema.ObjectId,
		ref: 'FoodItem'

	}],
	date: {
		type: Date
	}

});

mongoose.model('Menu', MenuSchema);