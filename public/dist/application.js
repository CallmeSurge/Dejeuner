'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'dejeuner';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
      // Create angular module
      angular.module(moduleName, dependencies || []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('fooditems');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('menus');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('orders');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Configuring the Articles module
angular.module('articles').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items	
    Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
    Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
    Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
  }
]);'use strict';
// Setting up route
angular.module('articles').config([
  '$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider.state('listArticles', {
      url: '/articles',
      templateUrl: 'modules/articles/views/list-articles.client.view.html'
    }).state('createArticle', {
      url: '/articles/create',
      templateUrl: 'modules/articles/views/create-article.client.view.html'
    }).state('viewArticle', {
      url: '/articles/:articleId',
      templateUrl: 'modules/articles/views/view-article.client.view.html'
    }).state('editArticle', {
      url: '/articles/:articleId/edit',
      templateUrl: 'modules/articles/views/edit-article.client.view.html'
    });
  }
]);'use strict';
angular.module('articles').controller('ArticlesController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Articles',
  function ($scope, $stateParams, $location, Authentication, Articles) {
    $scope.authentication = Authentication;
    $scope.create = function () {
      var article = new Articles({
          title: this.title,
          content: this.content
        });
      article.$save(function (response) {
        $location.path('articles/' + response._id);
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.remove = function (article) {
      if (article) {
        article.$remove();
        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };
    $scope.update = function () {
      var article = $scope.article;
      article.$update(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.find = function () {
      $scope.articles = Articles.query();
    };
    $scope.findOne = function () {
      $scope.article = Articles.get({ articleId: $stateParams.articleId });
    };
  }
]);'use strict';
//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', [
  '$resource',
  function ($resource) {
    return $resource('articles/:articleId', { articleId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  'Fooditems',
  function ($scope, Authentication, Fooditems) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.tab = 1;
    $scope.selectTab = function (setTab) {
      $scope.tab = setTab;
      $scope.fetchFooditems();
    };
    $scope.isSelected = function () {
      return $scope.tab;
    };
    $scope.fetchFooditems = function () {
      $scope.fooditems = Fooditems.query();
    };
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not existslol');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].isPublic : isPublic,
        roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].roles : roles,
        position: position || 0,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
            roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].items[itemIndex].roles : roles,
            position: position || 0,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
// Configuring the Articles module
angular.module('fooditems').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Fooditems', 'fooditems', 'dropdown', '/fooditems(/create)?');
    Menus.addSubMenuItem('topbar', 'fooditems', 'List Fooditems', 'fooditems');
    Menus.addSubMenuItem('topbar', 'fooditems', 'New Fooditem', 'fooditems/create');
  }
]);'use strict';
//Setting up route
angular.module('fooditems').config([
  '$stateProvider',
  function ($stateProvider) {
    // Fooditems state routing
    $stateProvider.state('listFooditems', {
      url: '/fooditems',
      templateUrl: 'modules/fooditems/views/list-fooditems.client.view.html'
    }).state('createFooditem', {
      url: '/fooditems/create',
      templateUrl: 'modules/fooditems/views/create-fooditem.client.view.html'
    }).state('viewFooditem', {
      url: '/fooditems/:fooditemId',
      templateUrl: 'modules/fooditems/views/view-fooditem.client.view.html'
    }).state('editFooditem', {
      url: '/fooditems/:fooditemId/edit',
      templateUrl: 'modules/fooditems/views/edit-fooditem.client.view.html'
    });
  }
]);'use strict';
// Fooditems controller
angular.module('fooditems').controller('FooditemsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Fooditems',
  function ($scope, $stateParams, $location, Authentication, Fooditems) {
    $scope.authentication = Authentication;
    // Create new Fooditem
    $scope.create = function () {
      // Create new Fooditem object
      var fooditem = new Fooditems({
          name: this.name,
          price: this.price
        });
      // Redirect after save
      fooditem.$save(function (response) {
        $scope.show_item_success = true;
        $scope.fooditems = Fooditems.query();
        // Clear form fields
        $scope.name = '';
        $scope.price = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Fooditem
    $scope.remove = function (fooditem) {
      if (fooditem) {
        fooditem.$remove();
        for (var i in $scope.fooditems) {
          if ($scope.fooditems[i] === fooditem) {
            $scope.fooditems.splice(i, 1);
          }
        }
      } else {
        $scope.fooditem.$remove(function () {
          $location.path('/#!/');
        });
      }
    };
    // Update existing Fooditem
    $scope.selectForUpdate = function (index) {
      $scope.name = $scope.fooditems[index].name;
      $scope.price = $scope.fooditems[index].price;
      $scope.update_index = index;
    };
    $scope.update = function () {
      $scope.fooditems[$scope.update_index].name = this.name;
      $scope.fooditems[$scope.update_index].price = this.price;
      var fooditem = $scope.fooditems[$scope.update_index];
      fooditem.$update(function () {
        $location.path('/#!/');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Fooditems
    $scope.find = function () {
      $scope.fooditems = Fooditems.query();
    };
    // Find existing Fooditem
    $scope.findOne = function () {
      $scope.fooditem = Fooditems.get({ fooditemId: $stateParams.fooditemId });
    };
  }
]);'use strict';
//Fooditems service used to communicate Fooditems REST endpoints
angular.module('fooditems').factory('Fooditems', [
  '$resource',
  function ($resource) {
    return $resource('fooditems/:fooditemId', { fooditemId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Configuring the Articles module
angular.module('menus').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Menus', 'menus', 'dropdown', '/menus(/create)?');
    Menus.addSubMenuItem('topbar', 'menus', 'List Menus', 'menus');
    Menus.addSubMenuItem('topbar', 'menus', 'New Menu', 'menus/create');
  }
]);'use strict';
//Setting up route
angular.module('menus').config([
  '$stateProvider',
  function ($stateProvider) {
    // Menus state routing
    $stateProvider.state('listMenus', {
      url: '/menus',
      templateUrl: 'modules/menus/views/list-menus.client.view.html'
    }).state('createMenu', {
      url: '/menus/create',
      templateUrl: 'modules/menus/views/create-menu.client.view.html'
    }).state('viewMenu', {
      url: '/menus/:menuId',
      templateUrl: 'modules/menus/views/view-menu.client.view.html'
    }).state('editMenu', {
      url: '/menus/:menuId/edit',
      templateUrl: 'modules/menus/views/edit-menu.client.view.html'
    });
  }
]);'use strict';
// Menus controller
angular.module('menus').controller('MenusController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'MenuService',
  'Fooditems',
  function ($scope, $stateParams, $location, Authentication, MenuService, Fooditems) {
    $scope.authentication = Authentication;
    $scope.items = [];
    // Create new Menu
    $scope.create = function () {
      // Create new Menu object
      var ids = _.map($scope.items, function (obj) {
          return obj._id;
        });
      var menu = new MenuService({
          items: ids,
          date: moment().add(1, 'd').valueOf()
        });
      // Redirect after save
      menu.$save(function (response) {
        $scope.show_menu_success = true;
        $scope.updateFoodItem();
        // Clear form fields
        $scope.name = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Menu
    $scope.remove = function (menu) {
      if (menu) {
        menu.$remove();
        for (var i in $scope.menus) {
          if ($scope.menus[i] === menu) {
            $scope.menus.splice(i, 1);
          }
        }
      } else {
        $scope.menu.$remove(function () {
          $location.path('/#!/');
        });
      }
    };
    $scope.checkIndex = function ($event, fooditem) {
      if ($event.target.checked) {
        $scope.items.push(fooditem);
      } else {
        var index = $scope.items.indexOf(fooditem);
        $scope.items.splice(index, 1);
      }
    };
    // Update existing Menu
    $scope.isSelected = function ($event, index) {
      var itemIds = _.map($scope.menu.items, function (item) {
          return item._id;
        });
      var itemIsSelected = itemIds.indexOf($scope.fooditems[parseInt(index)]._id) > -1;
      return itemIsSelected;
    };
    $scope.update = function () {
      var menu = $scope.menu;
      menu.$update(function () {
        $location.path('menus/' + menu._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });  // };
    };
    $scope.viewOrders = function (menuId) {
      $location.path('menus/' + menuId + '/orders');
    };
    $scope.updateFoodItem = function () {
      $scope.fooditems = Fooditems.query();
    };
    // Find a list of Menus
    $scope.find = function () {
      $scope.menus = MenuService.query();
    };
    // Get all of Fooditems
    $scope.getFoodItems = function () {
      $scope.fooditems = Fooditems.query();
    };
    // Find existing Menu
    $scope.findOne = function () {
      $scope.menu = MenuService.get({ menuId: $stateParams.menuId });
    };
  }
]);'use strict';
//Menus service used to communicate Menus REST endpoints
angular.module('menus').factory('MenuService', [
  '$resource',
  function ($resource) {
    return $resource('menus/:menuId', { menuId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Configuring the Articles module
angular.module('orders').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Orders', 'orders', 'dropdown', '/orders(/create)?');
    Menus.addSubMenuItem('topbar', 'orders', 'List Orders', 'orders');
    Menus.addSubMenuItem('topbar', 'orders', 'New Order', 'orders/create');
  }
]);'use strict';
//Setting up route
angular.module('orders').config([
  '$stateProvider',
  function ($stateProvider) {
    // Orders state routing
    $stateProvider.state('listOrders', {
      url: '/menus/:menuId/orders',
      templateUrl: 'modules/orders/views/list-orders.client.view.html'
    }).state('createOrder', {
      url: '/orders/create',
      templateUrl: 'modules/orders/views/create-order.client.view.html'
    }).state('viewOrder', {
      url: '/orders/:orderId',
      templateUrl: 'modules/orders/views/view-order.client.view.html'
    }).state('editOrder', {
      url: '/orders/:orderId/edit',
      templateUrl: 'modules/orders/views/edit-order.client.view.html'
    });
  }
]);'use strict';
// Orders controller
angular.module('orders').controller('OrdersController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Orders',
  'AllOrders',
  'MenuService',
  'SendOrders',
  function ($scope, $stateParams, $location, Authentication, Orders, AllOrders, MenuService, SendOrders) {
    $scope.authentication = Authentication;
    $scope.myOrder = [];
    $scope.backendOrders = [];
    $scope.orderItems = [];
    $scope.total = 0;
    // Create new Order
    $scope.create = function () {
      // Create new Order object
      var order = new Orders({
          items: $scope.backendOrders,
          total: $scope.total
        });
      // Redirect after save
      order.$save({ menuId: $scope.menu._id }, function (response) {
        $scope.show_order_success = true;
        $scope.orderButton = true;  // Clear form fields
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Order
    $scope.remove = function (order) {
      if (order) {
        order.$remove();
        for (var i in $scope.orders) {
          if ($scope.orders[i] === order) {
            $scope.orders.splice(i, 1);
          }
        }
      } else {
        $scope.order.$remove({ menuId: $scope.menu._id }, function () {
          $location.path('orders');
        });
      }
    };
    $scope.checkedIndex = function ($event, fooditem) {
      if ($event.target.checked) {
        $scope.myOrder.push(fooditem);
        $scope.backendOrders.push({
          item: fooditem._id,
          quantity: fooditem.quantity
        });
        $scope.total = $scope.total + fooditem.quantity * fooditem.price;
      } else {
        var index = $scope.myOrder.indexOf(fooditem);
        $scope.myOrder.splice(index, 1);
        $scope.backendOrders.splice(index, 1);
        $scope.total = $scope.total - fooditem.quantity * fooditem.price;
      }
    };
    // Update existing Order
    $scope.update = function () {
      var order = $scope.order;
      order.$update({ menuId: $scope.menu._id }, function () {
        $location.path('orders/' + order._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.findCurrentMenu = function () {
      var now = moment().add(1, 'd');
      var menus = MenuService.query(function (menus) {
          for (var index = 0; index < menus.length; index++) {
            var date = moment(menus[index].date);
            if (now.isSame(date, 'day')) {
              $scope.menu = menus[index];
              break;
            }
          }
        });
    };
    // Find a list of Orders
    $scope.find = function () {
      $scope.orders = AllOrders.query();
    };
    // Find existing Order
    $scope.findOne = function () {
      $scope.order = AllOrders.get({ orderId: $stateParams.orderId });
    };
    $scope.findByMenu = function () {
      $scope.orders = Orders.query({ menuId: $stateParams.menuId });
    };
    $scope.mailSender = function () {
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
          content += foodName + ' -- ' + sum + '<br>';  // total += sum;
                                                        // console.log(sum);
                                                        // console.log(foodName);
        }
        content += '</p>';
        message += content + '<hr>';
        content = '';
        var total = 0;
      }
      var order = new SendOrders({
          mail: $scope.recepient,
          subject: 'Hello, Orders for ' + moment().day(moment().add(1, 'd').day()).format('dddd'),
          text: message
        });
      order.$save({ menuId: $stateParams.menuId }).then(function (data) {
        $scope.show_mail_success = data.message;
        $scope.recepient = '';  // Clear form fields
      });
    };
  }
]);'use strict';
//Orders service used to communicate Orders REST endpoints
angular.module('orders').factory('Orders', [
  '$resource',
  function ($resource) {
    return $resource('menus/:menuId/orders/:orderId', {
      orderId: '@_id',
      menuId: '@menuId'
    }, { update: { method: 'PUT' } });
  }
]).factory('SendOrders', [
  '$resource',
  function ($resource) {
    return $resource('menus/:menuId/send-orders', { menuId: '@menuId' }, { update: { method: 'PUT' } });
  }
]).factory('AllOrders', [
  '$resource',
  function ($resource) {
    return $resource('orders/:orderId', { orderId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/authentication/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/authentication/signin.client.view.html'
    }).state('forgot', {
      url: '/password/forgot',
      templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
    }).state('reset-invlaid', {
      url: '/password/reset/invalid',
      templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
    }).state('reset-success', {
      url: '/password/reset/success',
      templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
    }).state('reset', {
      url: '/password/reset/:token',
      templateUrl: 'modules/users/views/password/reset-password.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    // If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('PasswordController', [
  '$scope',
  '$stateParams',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;
      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };
    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;
        // Attach user profile
        Authentication.user = response;
        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);
        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);