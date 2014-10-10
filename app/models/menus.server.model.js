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
		type: Date,
		required: 'Date can not be Empty',
		default: Date.now
	}

});

mongoose.model('Menu', MenuSchema);