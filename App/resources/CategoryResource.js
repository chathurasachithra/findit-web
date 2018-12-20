(function (angular) {
    'use strict';

    angular.module('app')
        .factory("CategoryResource", CategoryResource);

    CategoryResource.$inject = ['$resource', 'global', 'ENV'];

    function CategoryResource($resource, global, ENV) {
        return $resource(ENV.base_url + 'category/:id', {}, {
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