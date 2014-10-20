'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Fooditems',
	function($scope, Authentication, Fooditems) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.tab = 1;

		$scope.selectTab =function(setTab){
			$scope.tab = setTab;
			$scope.fetchFooditems();
		};
		$scope.isSelected = function(){
			return $scope.tab;
		};
		$scope.fetchFooditems = function() {
			$scope.fooditems = Fooditems.query();
		};

	}

	
]);