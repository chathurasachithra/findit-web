(function (angular) {
    'use strict';

    angular.module('app')

        .controller('MainController', function ($scope, $location,  $timeout, $rootScope, categoryService,
                                                PromotionService, ENV, companyService) {

            /**
             * SEO tags
             */
            $scope.metaInformation = {
              description : 'Find latest offers and daily update on banks, credit cards, travel, education, restaurants, hotels, food, clothing, electronics, events, holiday and more',
              keywords : 'promotions,discounts,events,companies,deals, offers,online,promote,coupons,advertising',
              title : 'Online hub for Promotions, offers, events and discounts in Sri Lanka',
              image : 'http://findit.lk/assets/images/logo.jpg',
              url : $location.absUrl()
            };
            $rootScope.$on('seoUpdate', function (event, seoObject) {
                if (seoObject && seoObject.title) {
                    $scope.metaInformation.title = seoObject.title;
                    $scope.metaInformation.description = seoObject.description;
                    $scope.metaInformation.keywords = seoObject.keywords; //Comma separated
                    $scope.metaInformation.url = seoObject.url;
                    $scope.metaInformation.image = seoObject.image;
                }
            });
        });

})(window.angular);