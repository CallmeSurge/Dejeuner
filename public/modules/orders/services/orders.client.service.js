'use strict';

//Orders service used to communicate Orders REST endpoints
angular.module('orders').factory('Orders', ['$resource',
	function($resource) {
		return $resource('menus/:menuId/orders/:orderId', { orderId: '@_id', menuId: '@menuId'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('orders').factory('AllOrders', ['$resource',
	function($resource) {
		return $resource('orders/:orderId', { orderId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);