(function (angular) {
    'use strict';

    angular.module('app')

        .controller('ContactUsController', function ($scope, $location, $routeParams, $timeout, $rootScope,categoryService, PromotionService, companyService,  ENV) {

            $scope.success = false;
            
                $scope.submit = function () {
                    $scope.name = "";
                    $scope.phone = "";
                    $scope.email = "";
                    $scope.msg = "";
                    $scope.success = true;
                    $timeout(function () {
                        $scope.success = false;
                    }, 3000);
                }

        })

})(window.angular);