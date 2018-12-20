(function (angular) {
    'use strict';

    angular.module('app')
        .factory("ReviewResource", ReviewResource);

    ReviewResource.$inject = ['$resource', 'global', 'ENV'];

    function ReviewResource($resource, global, ENV) {
        return $resource(ENV.base_url + 'review', {}, {
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