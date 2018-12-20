(function (angular) {
    'use strict';

    // creating an instance of app module
    var app = angular.module('app');

    app.factory('companyService', companyService);

    companyService.$inject = ['CompanyResource', 'Upload', '$q', 'ENV', 'CompanyViewsResource'];

    function companyService(CompanyResource, Upload, $q, ENV, CompanyViewsResource) {

        /**
         * Service return functions
         **/
        var companyService = {
            'get': get,
            'addNewCompany' : addNewCompany,
            'uploadCompanyLogo' : uploadCompanyLogo,
            'addCompanyViews' : addCompanyViews
        };

        /**
         * Get all parent categories
         **/
        function get(param) {
            return CompanyResource.get(param).$promise;
        }

        /**
         * Add company views 
         **/
        function addCompanyViews(param){
            return CompanyViewsResource.query(param).$promise;
        }


        /**
         * Register new company
         **/
        function addNewCompany(params) {
            return CompanyResource.save(params).$promise;
        }

        function uploadCompanyLogo(company_logo,data){
            var deferred = $q.defer();
            // upload on file select or drop
            Upload.upload({
                url : ENV.base_url + 'company/logo',
                data: {company_logo: company_logo, data: data}

            }).then(function (resp) {
                deferred.resolve(resp.data);

            }, function (resp) {
                deferred.reject(resp);
            });

            return deferred.promise;
        }



        return companyService;

    }
}(window.angular));