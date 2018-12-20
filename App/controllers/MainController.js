(function (angular) {
    'use strict';

    angular.module('app')

        .controller('MainController', function ($scope, $location,  $timeout, $rootScope, categoryService,
                                                PromotionService, ENV, companyService) {

            /**
             * SEO tags
             */
            $scope.metaInformation = {
              description : 'Findit.lk is an online information hub which provide the latest details on promotions,' +
              ' discounts and events taking place across Sri Lanka.Also this platform helps to grow any business using' +
              ' digital marketing tools.In the findit.lk database, you will find registered companies from major' +
              ' industries of which you can now hunt for the best deal available out there on your expected product' +
              ' or service and also compare prices amongst each other. This way, through findit.lk, you are bound to' +
              ' find for yourself, for whichever requirement, the best deal that money can buy! If you register with' +
              ' findit.lk, you will receive exclusive offers and the best deals in town, courtesy of our partner' +
              ' companies that are registered with us.',
              keywords : 'Promotions In Sri Lanka, Discounts in srilanka, Events in sri lanka, Companies in sri lanka,' +
              ' deals in srilanka,offers in sri lanka, online business sri lanka, How to promote business online,' +
              ' Directory Sri lanka, Business in srilanka',
              title : 'Findit.lk',
              image : 'assets/images/logo.jpg',
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