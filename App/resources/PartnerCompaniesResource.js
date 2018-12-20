(function () {
    'use strict';

    var app = angular.module('app');

    app.factory("PartnerCompaniesResource", PartnerCompaniesResource);

    PartnerCompaniesResource.$inject = ['$resource', 'global', 'ENV'];

    function PartnerCompaniesResource($resource, global, ENV) {
        return $resource(ENV.base_url + 'promotion/partner', {}, {
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
})();