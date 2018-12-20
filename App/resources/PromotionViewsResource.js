(function (angular) {
    'use strict';

    angular.module('app')
        .factory("PromotionViewsResource", PromotionViewsResource);

    PromotionViewsResource.$inject = ['$resource', 'global', 'ENV'];

    function PromotionViewsResource($resource, global, ENV) {
        return $resource(ENV.base_url + 'promotion/views', {}, {
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