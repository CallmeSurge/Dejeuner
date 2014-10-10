'use strict';

//Setting up route
angular.module('menus').config(['$stateProvider',
	function($stateProvider) {
		// Menus state routing
		$stateProvider.
		state('listMenus', {
			url: '/menus',
			templateUrl: 'modules/menus/views/list-menus.client.view.html'
		}).
		state('createMenu', {
			url: '/menus/create',
			templateUrl: 'modules/menus/views/create-menu.client.view.html'
		}).
		state('viewMenu', {
			url: '/menus/:menuId',
			templateUrl: 'modules/menus/views/view-menu.client.view.html'
		}).
		state('editMenu', {
			url: '/menus/:menuId/edit',
			templateUrl: 'modules/menus/views/edit-menu.client.view.html'
		});
	}
]);