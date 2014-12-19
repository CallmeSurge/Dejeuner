'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Orders', 'AllOrders' ,'MenuService', 'SendOrders',
	function($scope, $stateParams, $location, Authentication, Orders, AllOrders, MenuService, SendOrders) {
		$scope.authentication = Authentication;
		$scope.myOrder = [];
		$scope.orderBasket = [];
		$scope.orderItems = [];
		$scope.total = 0;


		$scope.controllerInit = function(){
			$scope.findCurrentMenu();
		};

		$scope.getItemInOrder = function(item){
			for (var i = $scope.myOrder.length - 1; i >= 0; i--) {
				if( $scope.myOrder[i].item._id === item._id)
					return $scope.myOrder[i];
			};
		}


		$scope.filterUserPreviousOrder = function(orders){
			console.log(orders);
			for (var i = orders.length - 1; i >= 0; i--) {
				if (orders[i].user._id === Authentication.user._id) {
					 $scope.myOrder = orders[i].items;
					 $scope.total = orders[i].total;
					 break;
				}
			}
		};

		$scope.getOrders = function(){
			Orders.query({menuId: $scope.menu._id}, $scope.filterUserPreviousOrder);
		};
		
		$scope.previousOrderContains = function(item){
			for (var i = $scope.myOrder.length - 1; i >= 0; i--) {
				if ($scope.myOrder[i].item._id === item._id )
					return true;
			}
			return false;
		};

		// Create new Order
		$scope.create = function() {
			// Create new Order object
			var order = new Orders ({
				items : $scope.orderBasket,
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
		$scope.checkedIndex = function($event, foodItem){ 
			if ($event.target.checked) { 
				$scope.myOrder.push({item:foodItem, quantity:foodItem.quantity});
				$scope.orderBasket.push({item: foodItem._id, quantity: foodItem.quantity});
				$scope.computeTotal();

			} else {
				var item = $scope.getItemInOrder(foodItem);
				var index = $scope.myOrder.indexOf(item);
				$scope.myOrder.splice(index, 1);
				$scope.orderBasket.splice(index, 1);
				$scope.computeTotal();
			}
		};


		$scope.updateFoodQuantityChange = function(foodItem){
			$scope.updateOrderBasketWith(foodItem);
			$scope.updateMyOrderWith(foodItem);
			$scope.computeTotal();
		};

		$scope.updateMyOrderWith = function(foodItem){
			$scope.getItemInOrder(foodItem);
		};

		$scope.updateOrderBasketWith = function(foodItem){
			for (var i = $scope.orderBasket.length - 1; i >= 0; i--) {
				$scope.orderBasket[i].item === foodItem._id ? $scope.orderBasket[i].quantity = foodItem.quantity : null;
			}
		};

		$scope.computeTotal = function(){
			$scope.total = 0;
			for (var i = $scope.myOrder.length - 1; i >= 0; i--) {
				$scope.total += $scope.myOrder[i].item.price * $scope.myOrder[i].quantity;
			}
		};


		// Update existing Order
		// $scope.update = function() {
		// 	var order = $scope.order ;

		// 	order.$update({menuId: $scope.menu._id}, function() {
		// 		$location.path('orders/' + order._id);
		// 	}, function(errorResponse) {
		// 		$scope.error = errorResponse.data.message;
		// 	});
		// };

		$scope.findCurrentMenu = function() {
			var now = moment().add(1, 'd');
			var menus = MenuService.query(function(menus){
				for(var index = 0; index < menus.length; index++){
					var date = moment(menus[index].date);
					if(now.isSame(date, 'day')){
						$scope.menu = menus[index];
						$scope.getOrders();
						break;
					}
				}
			});
		};

		// Find a list of Orders
		$scope.find = function() {
			$scope.orders = AllOrders.query();
		};

		// Find existing Order for a particular user
		$scope.findOne = function() {
			// var now = moment().add(1, 'd');
			// var order = Order.query(function(order){
			// 	for (var i = 0; i < order.length; i++) {
			// 	 // var date = moment(order[i].date)
			// 	};
			// })
			$scope.order = Orders.query({ 
				userId: $stateParams.userId
			});
		};

		$scope.findByMenu = function() {
			$scope.orders = Orders.query({menuId: $stateParams.menuId});
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
				}
				content += '</p>';
				message += content + '<hr>';
				content = '';
						var total = 0;
			}
			
			var order = new SendOrders ({
				mail : $scope.recepient,
				subject: 'Hello, Orders for ' + moment().day(moment().add(1, 'd').day()).format('dddd'),
				text : message
			});
	
			order.$save({menuId: $stateParams.menuId}).then(function(data) {	
				$scope.show_mail_success = data.message;
				$scope.recepient = '';

				// Clear form fields
			});
		};
	}
]);