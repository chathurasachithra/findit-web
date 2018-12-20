(function (angular) {
    'use strict';

    angular.module('app')
        .factory("PromotionCouponResource", PromotionCouponResource);

    PromotionCouponResource.$inject = ['$resource', 'global', 'ENV'];

    function PromotionCouponResource($resource, global, ENV) {
        return $resource(ENV.base_url + 'promotion/coupon', {}, {
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