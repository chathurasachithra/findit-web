(function (angular) {
    'use strict';

    angular.module('app')
        .factory("CustomerResource", CustomerResource);

    CustomerResource.$inject = ['$resource', 'global', 'ENV'];

    function CustomerResource($resource, global, ENV) {
        return $resource(ENV.base_url + 'customer', {}, {
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