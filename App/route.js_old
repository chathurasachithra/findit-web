var app = angular.module('app');

/**
 * All application routes
 * ---------------------------------------------------------------------------------------------------------------
 */
app.config(function ($routeProvider, $locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true);

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8; multipart/form-data';

    $httpProvider.interceptors.push(function ($window, $rootScope, $q, ENV) {
        return {
            // Sending Auth Token header for every POST request to validate the user.
            'request': function (config) {

                var token = 'KBC0uZf4piqQy7g3Gs9iAau1VbehWAzz1uZ29tdwAsy0yga0DWaZ89pENTyxnbGA8L4xffMhAYv2AxyN0MRVapqCu02xu41GnFKc';

                if(config.url != ENV.base_url + 'user/auth'){
                    if (token && config.method == 'POST' && config.method != 'OPTIONS') {
                        config.headers['Auth-Token'] = token;
                    }
                }



                return config;
            },

            'responseError': function (responseError) {
                if (responseError.status == '422') {

                    angular.forEach(responseError.data, function (val, key) {
                        angular.forEach(val, function (v, k) {
                            $rootScope.$broadcast('errorResponseEvent', {msg: v});
                        });
                    });

                } else {
                    $rootScope.$broadcast('errorResponseEvent', responseError.data);
                }

                return $q.reject(responseError);
            }
        };
    });

    $routeProvider
        .when('/', {
            templateUrl: 'App/views/home.html',
            controller: 'HomePageController'
        })
      .when('/home-demo', {
        templateUrl: 'App/views/home-demo.html',
        controller: 'HomeDemoPageController'
      })
        .when('/view_all/:option/:sub', {
            templateUrl: 'App/views/view_all.html',
            controller: 'ViewAllController'
        })
        .when('/promotion/:pid', {
            templateUrl: 'App/views/post_detail.html',
            controller: 'ExpandPageController'
        })
        .when('/company/:cid', {
            templateUrl: 'App/views/company_profile.html',
            controller: 'CompanyPageController'
        })
        .when('/register', {
            templateUrl: 'App/views/register.html',
        })
        .when('/register/company', {
            templateUrl: 'App/views/register_as_company.html',
            controller: 'RegisterController'
        })
        .when('/directory', {
            templateUrl: 'App/views/company_directory.html',
            controller: 'DirectoryController'
        })
        .when('/about_us', {
            templateUrl: 'App/views/about_us.html'
        })
        .when('/contact_us', {
            templateUrl: 'App/views/contact_us.html'
        })
        .when('/register/visitor', {
            templateUrl: 'App/views/register_as_visitor.html',
            controller: 'RegisterController'
        })
        .otherwise({
            redirectTo: '/'
        });


});