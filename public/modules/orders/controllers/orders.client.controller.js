'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Orders', 'AllOrders' ,'MenuService', 'SendOrders',
	function($scope, $stateParams, $location, Authentication, Orders, AllOrders, MenuService, SendOrders) {
		$scope.authentication = Authentication;
		$scope.myOrder = [];
		$scope.backendOrders = [];
		$scope.orderItems = [];
		$scope.total = 0;

		// Create new Order
		$scope.create = function() {
			// Create new Order object
			var order = new Orders ({
				items : $scope.backendOrders,
				total : $scope.total
			});
		
			// Redirect after save
			order.$save({menuId: $scope.menu._id}, function(response) {	
				$scope.show_order_success = true;
				$scope.orderButton = true;

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
			var now = moment().add(1, 'd');
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
			console.log($scope.orders);
		};

		$scope.mailSender = function() {
			var orders = $scope.orders;
			var message = '';
			var content = '';
			for (var i = 0; i < orders.length; i++) {
				var name = orders[i].user.displayName;
				var list = orders[i].items;
				content += '<p>' + name + '\'s order: <br>';
				for (var j = 0; j < list.length; j++) {
						var foodName = list[j].item.name;
						var foodPrice = list[j].item.price;
						var quantity = list[j].quantity;
						var sum = foodPrice * quantity;
						content += foodName + ' -- ' + sum + '<br>';  
						// total += sum;
						// console.log(sum);
						// console.log(foodName);
				}
				content += '</p>';
				message += content + '<hr>';
				content = '';
						var total = 0;
			}
			
			var order = new SendOrders ({
				mail : $scope.recepient,
				subject: 'Hello, Orders for ' + moment().day(moment().day()).format('dddd'),
				text : message
			});
	
			order.$save({menuId: $stateParams.menuId}).then(function(data) {	
				$scope.show_mail_success = data.message;

				// Clear form fields
			});
		};
	}
]);