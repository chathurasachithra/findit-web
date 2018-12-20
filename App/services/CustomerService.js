(function (angular) {
    'use strict';

    // creating an instance of app module
    var app = angular.module('app');

    app.factory('CustomerService', CustomerService);

    CustomerService.$inject = ['CustomerResource', 'CustomerInterestsResource'];

    function CustomerService(CustomerResource , CustomerInterestsResource) {

        /**
         * Service return functions
         **/
        var CustomerService = {
            'storeCustomer'          : storeCustomer,
            'storeCustomerInterests' : storeCustomerInterests
        };


        /**
         * Store new customer resource 
         **/
        function storeCustomer(param){
            return CustomerResource.save(param).$promise;
        }
        
        /**
         * Store customer interests
         * */
        function storeCustomerInterests(param){
            return CustomerInterestsResource.save(param).$promise;
        }



        return CustomerService;

    }
}(window.angular));