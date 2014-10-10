'use strict';

//Fooditems service used to communicate Fooditems REST endpoints
angular.module('fooditems').factory('Fooditems', ['$resource',
	function($resource) {
		return $resource('fooditems/:fooditemId', { fooditemId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);