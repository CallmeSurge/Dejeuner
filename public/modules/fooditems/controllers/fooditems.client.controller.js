'use strict';

// Fooditems controller
angular.module('fooditems').controller('FooditemsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Fooditems',
	function($scope, $stateParams, $location, Authentication, Fooditems ) {
		$scope.authentication = Authentication;

		// Create new Fooditem
		$scope.create = function() {
			// Create new Fooditem object
			var fooditem = new Fooditems ({
				name: this.name,
				price: this.price
			});

			// Redirect after save
			fooditem.$save(function(response) {
				$scope.show_item_success = true;
				$scope.fooditems = Fooditems.query();

				// Clear form fields
				$scope.name = '';
				$scope.price = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Fooditem
		$scope.remove = function( fooditem ) {
			if ( fooditem ) { fooditem.$remove();

				for (var i in $scope.fooditems ) {
					if ($scope.fooditems [i] === fooditem ) {
						$scope.fooditems.splice(i, 1);
					}
				}
			} else {
				$scope.fooditem.$remove(function() {
					$location.path('/#!/');
				});
			}
		};

		// Update existing Fooditem

		$scope.selectForUpdate = function(index){
			$scope.name = $scope.fooditems[index].name;
			$scope.price = $scope.fooditems[index].price;
			$scope.update_index = index;
		};

		$scope.update = function() {
			$scope.fooditems[$scope.update_index].name = this.name;
			$scope.fooditems[$scope.update_index].price = this.price;
			var fooditem = $scope.fooditems[$scope.update_index];
			fooditem.$update(function() {
				$location.path('/#!/');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Fooditems
		$scope.find = function() {
			$scope.fooditems = Fooditems.query();
		};

		// Find existing Fooditem
		$scope.findOne = function() {
			$scope.fooditem = Fooditems.get({ 
				fooditemId: $stateParams.fooditemId
			});
		};
	}
]);