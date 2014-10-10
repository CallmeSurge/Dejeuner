'use strict';

//Menus service used to communicate Menus REST endpoints
angular.module('menus').factory('MenuService', ['$resource',
	function($resource) {
		return $resource('menus/:menuId', { menuId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);