(function (angular) {
    'use strict';

    angular.module('app')

        .controller('DirectoryController', function ($scope, $location, $routeParams, $timeout, $rootScope,
                                                     categoryService, PromotionService, companyService,  ENV, $window) {

            $scope.logo_path = ENV.logo_path;
            $scope.active = "all";
            $scope.search = '';
            $scope.selectedCategory = null;
            $scope.currentUrl = $location.absUrl();
            $rootScope.hitDirectory = true;

            getCategories();
            
            $scope.getCompanies  = getCompanies;

            $scope.searchCompany = function ()
            {
              getCompanies($scope.selectedCategory);
            };
            
            categoryService.getAllPrentCategories()
                .then(function (data) {
                    var p_cat = data.parent_categories;

                    $rootScope.parent_categories = {};

                    angular.forEach(p_cat, function (val, key) {
                        switch (val.parent_category_name) {
                            case 'Promotions':
                                $rootScope.parent_categories.promotions_id = val.parent_category_id;
                                break;
                            case 'Events':
                                $rootScope.parent_categories.events_id = val.parent_category_id;
                                break;
                            case 'Discount Zone':
                                $rootScope.parent_categories.discounts_id = val.parent_category_id;
                                break;
                            case 'Company':
                                $rootScope.parent_categories.company_id = val.parent_category_id;
                                break;
                            case 'Menu':
                                $rootScope.parent_categories.menu_id = val.parent_category_id;
                                break;
                        }
                    });
                    categoryService.getCategories({parent_category_id : $rootScope.parent_categories.promotions_id})
                        .then(function (data) {
                            $scope.categories = data.categories;
                            getCompanies();
                        })
                });
            
            function getCompanies(key, param){

                if (key === 'cat') {
                  if (param) {
                    $scope.active = param.category_name;
                    $scope.selectedCategory = param.category_id;
                  } else {
                    $scope.active = "all";
                    $scope.selectedCategory = null;
                  }
                }
                companyService.get({cat : $scope.selectedCategory, type : 1, search: $scope.search})
                    .then(function (data) {
                        $scope.companies = data.companies;
                        angular.forEach($scope.companies, function (val) {
                            val.views = val.company_views || val.company_unique_views ?  parseInt(val.company_views) + parseInt(val.company_unique_views) : parseInt(0);
                        });
                        $window.scrollTo(0, 0);
                    })
            }

            /**
             * Get sub categories filtered by parent category
             **/
            function getCategories(){
                categoryService.getCategories({parent_slug: 'promotions'})
                    .then(function (data) {
                        $scope.categories =data.categories;
                        $scope.cat_loading = false;
                    })
                    .catch(function (data) {

                    })
            }

        })

})(window.angular);