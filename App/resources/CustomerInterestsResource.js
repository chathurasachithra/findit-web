(function (angular) {
    'use strict';

    angular.module('app')
        .factory("CustomerInterestsResource", CustomerInterestsResource);

    CustomerInterestsResource.$inject = ['$resource', 'global', 'ENV'];

    function CustomerInterestsResource($resource, global, ENV) {
        return $resource(ENV.base_url + 'customer/interests', {}, {
            save : {
                method          : 'POST',
                transformRequest: function (data) {
                    return global.param(data);
                }
            },
            query: {
                isArray: false
            }
        });
    }
})(window.angular);