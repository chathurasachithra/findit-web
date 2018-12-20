(function (angular) {
    'use strict';

    angular.module('app')
        .factory("AddReviewResource", AddReviewResource);

    AddReviewResource.$inject = ['$resource', 'global', 'ENV'];

    function AddReviewResource($resource, global, ENV) {
        return $resource(ENV.base_url + 'review/add', {}, {
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