'use strict';

(function() {
	// Fooditems Controller Spec
	describe('Fooditems Controller Tests', function() {
		// Initialize global variables
		var FooditemsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Fooditems controller.
			FooditemsController = $controller('FooditemsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Fooditem object fetched from XHR', inject(function(Fooditems) {
			// Create sample Fooditem using the Fooditems service
			var sampleFooditem = new Fooditems({
				name: 'New Fooditem'
			});

			// Create a sample Fooditems array that includes the new Fooditem
			var sampleFooditems = [sampleFooditem];

			// Set GET response
			$httpBackend.expectGET('fooditems').respond(sampleFooditems);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.fooditems).toEqualData(sampleFooditems);
		}));

		it('$scope.findOne() should create an array with one Fooditem object fetched from XHR using a fooditemId URL parameter', inject(function(Fooditems) {
			// Define a sample Fooditem object
			var sampleFooditem = new Fooditems({
				name: 'New Fooditem'
			});

			// Set the URL parameter
			$stateParams.fooditemId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/fooditems\/([0-9a-fA-F]{24})$/).respond(sampleFooditem);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.fooditem).toEqualData(sampleFooditem);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Fooditems) {
			// Create a sample Fooditem object
			var sampleFooditemPostData = new Fooditems({
				name: 'New Fooditem'
			});

			// Create a sample Fooditem response
			var sampleFooditemResponse = new Fooditems({
				_id: '525cf20451979dea2c000001',
				name: 'New Fooditem'
			});

			// Fixture mock form input values
			scope.name = 'New Fooditem';

			// Set POST response
			$httpBackend.expectPOST('fooditems', sampleFooditemPostData).respond(sampleFooditemResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Fooditem was created
			expect($location.path()).toBe('/fooditems/' + sampleFooditemResponse._id);
		}));

		it('$scope.update() should update a valid Fooditem', inject(function(Fooditems) {
			// Define a sample Fooditem put data
			var sampleFooditemPutData = new Fooditems({
				_id: '525cf20451979dea2c000001',
				name: 'New Fooditem'
			});

			// Mock Fooditem in scope
			scope.fooditem = sampleFooditemPutData;

			// Set PUT response
			$httpBackend.expectPUT(/fooditems\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/fooditems/' + sampleFooditemPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid fooditemId and remove the Fooditem from the scope', inject(function(Fooditems) {
			// Create new Fooditem object
			var sampleFooditem = new Fooditems({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Fooditems array and include the Fooditem
			scope.fooditems = [sampleFooditem];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/fooditems\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFooditem);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.fooditems.length).toBe(0);
		}));
	});
}());