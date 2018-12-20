var app=angular.module('app', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ngMessages',
    'ngIntlTelInput',
    'ngFileUpload',
    'ngMap',
    'ngSanitize',
    'angularMoment',
    'thatisuday.ng-image-gallery'
]);


app.config(function (ngIntlTelInputProvider) {
    ngIntlTelInputProvider.set({
        initialCountry: 'lk',
        nationalMode: true,
        autoFormat: true,
        autoPlaceholder: true,
        formatOnDisplay:true,
        separateDialCode:true
    });
});

app.directive('countdown', [
    'Util', '$interval', function(Util, $interval) {
        return {
            restrict: 'A',
            scope: {
                date: '@'
            },
            link: function(scope, element) {
                var future;
                future = new Date(scope.date);
                $interval(function() {
                    var diff;
                    diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
                    return element.text(Util.dhms(diff));
                }, 1000);
            }
        };
    }
]);

app.factory('Util', [
    function() {
        return {
            dhms: function(t) {
                var days, hours, minutes, seconds;
                days = Math.floor(t / 86400);
                t -= days * 86400;
                hours = Math.floor(t / 3600) % 24;
                t -= hours * 3600;
                minutes = Math.floor(t / 60) % 60;
                t -= minutes * 60;
                seconds = t % 60;
                var day_msg = days > 1 ? ' DAYS ' : ' DAY ';
                return [days + day_msg + hours + ' HOURS ' + minutes + ' MIN ' + seconds + ' SEC '].join(' ');
            }
        };
    }
]);

app.filter('trusted', ['$sce', function ($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
}]);

/**
 * Global runtime statements
 **/
app.run(function ($rootScope, categoryService, $timeout, $location, $window) {

    $window.ga('create', 'UA-104667275-1', 'auto');

    // track pageview on state change
    $rootScope.$on('$stateChangeSuccess', function (event) {
        $window.ga('send', 'pageview', $location.path());
    });

   /* $rootScope.loaded = false;
    $rootScope.custom_style = 'display_none';
    

    $timeout(function() {
            $rootScope.loaded = true;
            $timeout(function() {
                $rootScope.custom_style = 'display_block';
                console.log("asasd")
            },3400);

        console.log($rootScope.loaded);
    }, 1000);


    $rootScope.$on('$routeChangeStart', function(next, current) {
        $rootScope.loaded = false;
        $rootScope.custom_style = 'display_none';

        console.log($rootScope.loaded);

        $timeout(function() {
            $rootScope.loaded = true;
            $timeout(function() {
                $rootScope.custom_style = 'display_block';
                console.log("asasd")
            },3400);

            console.log($rootScope.loaded);
        }, 1000);
    });
*/

    /**
     *Get all parent categories keep all relevant category ids
     **/
    categoryService.getAllPrentCategories()
        .then(function (data) {
            var p_cat = data.parent_categories;

            $rootScope.parent_categories = {};
            $rootScope.social_thumb = 'assets/images/logo.jpg';

            angular.forEach(p_cat, function (val, key) {
                switch (val.parent_category_name){
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
        })
});