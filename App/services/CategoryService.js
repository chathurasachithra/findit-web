(function (angular) {
    'use strict';

    // creating an instance of app module
    var app = angular.module('app');

    app.factory('categoryService', categoryService);

    categoryService.$inject = ['ParentCategoryResource', 'CategoryResource'];

    function categoryService(ParentCategoryResource, CategoryResource) {

        /**
         * Service return functions
         **/
        var categoryService = {
            'getAllPrentCategories': getAllPrentCategories,
            'getCategories'        : getCategories
        };

        /**
         * Get all parent categories
         **/
        function getAllPrentCategories() {
            return ParentCategoryResource.query().$promise;
        }

        /**
         * Get categories filtered by parent category
         **/
        function getCategories(param) {
            return CategoryResource.query(param).$promise;
        }

        return categoryService;

    }
}(window.angular));