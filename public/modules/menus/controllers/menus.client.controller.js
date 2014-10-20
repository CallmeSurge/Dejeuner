'use strict';

// Menus controller
angular.module('menus').controller('MenusController', ['$scope', '$stateParams', '$location', 'Authentication', 'MenuService', 'Fooditems',
	function($scope, $stateParams, $location, Authentication, MenuService, Fooditems ) {
		$scope.authentication = Authentication;
		$scope.items = [];
		// Create new Menu
		$scope.create = function() {
			// Create new Menu object
			var ids = _.map($scope.items, function(obj){
					return obj._id;
				});
			var menu = new MenuService ({
				items: ids

			});

			// Redirect after save
			menu.$save(function(response) {
				$scope.show_menu_success = true;
				$scope.updateFoodItem();


				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		// Remove existing Menu
		$scope.remove = function( menu ) {
			if ( menu ) { menu.$remove();

				for (var i in $scope.menus ) {
					if ($scope.menus [i] === menu ) {
						$scope.menus.splice(i, 1);
					}
				}
			} else {
				$scope.menu.$remove(function() {
					$location.path('/#!/');
				});
			}
		};
		$scope.checkIndex = function($event, fooditem){ 
			if ($event.target.checked) { 
				$scope.items.push(fooditem);
			} else {
				var index = $scope.items.indexOf(fooditem);
				$scope.items.splice(index, 1);
			}
		};

		// Update existing Menu
		$scope.isSelected = function($event, index){
			var itemIds = _.map($scope.menu.items, function(item){
				return item._id;
			});
			var itemIsSelected = itemIds.indexOf($scope.fooditems[parseInt(index)]._id) > -1;
				return itemIsSelected;

		};

		$scope.update = function() {	

				var menu = $scope.menu ;

				menu.$update(function() {
					$location.path('menus/' + menu._id);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			// };
		};

		$scope.viewOrders = function(menuId){
			$location.path('menus/' + menuId + '/orders');
		};

		$scope.updateFoodItem = function(){
			$scope.fooditems = Fooditems.query();
		};

		// Find a list of Menus
		$scope.find = function() {
			$scope.menus = MenuService.query();
		};

		// Get all of Fooditems
		$scope.getFoodItems = function() {
			$scope.fooditems = Fooditems.query();
		};

		// Find existing Menu
		$scope.findOne = function() {
			$scope.menu = MenuService.get({ 
				menuId: $stateParams.menuId
			});
		};

	}
]);