'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.tab = 1;

		$scope.selectTab =function(setTab){
			$scope.tab = setTab;
		};
		$scope.isSelected = function(){
			return $scope.tab;
		};

	}

	
]);