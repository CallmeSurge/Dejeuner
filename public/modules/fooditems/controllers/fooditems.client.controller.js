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
				$scope.find();
				$location.path('fooditems/create');

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
					$location.path('fooditems/create');
				});
			}
		};

		// Update existing Fooditem
		$scope.update = function() {
			var fooditem = $scope.fooditem ;

			fooditem.$update(function() {
				$location.path('fooditems/create');
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