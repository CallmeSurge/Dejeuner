'use strict';

// Configuring the Articles module
angular.module('menus').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Menus', 'menus', 'dropdown', '/menus(/create)?');
		Menus.addSubMenuItem('topbar', 'menus', 'List Menus', 'menus');
		Menus.addSubMenuItem('topbar', 'menus', 'New Menu', 'menus/create');
	}
]);