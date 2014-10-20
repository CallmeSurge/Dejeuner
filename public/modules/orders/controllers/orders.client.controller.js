'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Orders', 'AllOrders' ,'MenuService',
	function($scope, $stateParams, $location, Authentication, Orders, AllOrders, MenuService) {
		$scope.authentication = Authentication;
		$scope.myOrder = [];
		$scope.backendOrders = [];
		$scope.orderItems = [];
		$scope.total = 0;

		// Create new Order
		$scope.create = function() {
			// Create new Order object
			var order = new Orders ({
				items : $scope.backendOrders
			});
		
			// Redirect after save
			order.$save({menuId: $scope.menu._id}, function(response) {	
				$scope.show_order_success = true;

				// Clear form fields
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

		};

		// Remove existing Order
		$scope.remove = function( order ) {
			if ( order ) { order.$remove();

				for (var i in $scope.orders ) {
					if ($scope.orders [i] === order ) {
						$scope.orders.splice(i, 1);
					}
				}
			} else {
				$scope.order.$remove({menuId: $scope.menu._id}, function() {
					$location.path('orders');
				});
			}
		};
		$scope.checkedIndex = function($event, fooditem){ 
			if ($event.target.checked) { 
				$scope.myOrder.push(fooditem);
				$scope.backendOrders.push({item: fooditem._id, quantity: fooditem.quantity});
				$scope.total = $scope.total + (fooditem.quantity * fooditem.price);
			} else {
				var index = $scope.myOrder.indexOf(fooditem);
				$scope.myOrder.splice(index, 1);
				$scope.backendOrders.splice(index, 1);
				$scope.total = $scope.total - (fooditem.quantity * fooditem.price);
			}
		};

		// Update existing Order
		$scope.update = function() {
			var order = $scope.order ;

			order.$update({menuId: $scope.menu._id}, function() {
				$location.path('orders/' + order._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.findCurrentMenu = function() {
			var now = moment();
			var menus = MenuService.query(function(menus){
				for(var index = 0; index < menus.length; index++){
					var date = moment(menus[index].date);
					if(now.isSame(date, 'day')){
						$scope.menu = menus[index];
						break;
					}
				}
			});
		};

		// Find a list of Orders
		$scope.find = function() {
			$scope.orders = AllOrders.query();
		};

		// Find existing Order
		$scope.findOne = function() {
			$scope.order = AllOrders.get({ 
				orderId: $stateParams.orderId
			});
		};

		$scope.findByMenu = function() {
			$scope.orders = Orders.query({menuId: $stateParams.menuId});
		};
	}
]);