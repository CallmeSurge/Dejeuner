'use strict';

//Setting up route
angular.module('fooditems').config(['$stateProvider',
	function($stateProvider) {
		// Fooditems state routing
		$stateProvider.
		state('listFooditems', {
			url: '/fooditems',
			templateUrl: 'modules/fooditems/views/list-fooditems.client.view.html'
		}).
		state('createFooditem', {
			url: '/fooditems/create',
			templateUrl: 'modules/fooditems/views/create-fooditem.client.view.html'
		}).
		state('viewFooditem', {
			url: '/fooditems/:fooditemId',
			templateUrl: 'modules/fooditems/views/view-fooditem.client.view.html'
		}).
		state('editFooditem', {
			url: '/fooditems/:fooditemId/edit',
			templateUrl: 'modules/fooditems/views/edit-fooditem.client.view.html'
		});
	}
]);