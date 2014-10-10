'use strict';

// Configuring the Articles module
angular.module('fooditems').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Fooditems', 'fooditems', 'dropdown', '/fooditems(/create)?');
		Menus.addSubMenuItem('topbar', 'fooditems', 'List Fooditems', 'fooditems');
		Menus.addSubMenuItem('topbar', 'fooditems', 'New Fooditem', 'fooditems/create');
	}
]);