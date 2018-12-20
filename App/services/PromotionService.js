(function (angular) {
    'use strict';

    // creating an instance of app module
    var app = angular.module('app');

    app.factory('PromotionService', PromotionService);

    PromotionService.$inject = ['PromotionResource', 'PromotionViewsResource', 'ReviewResource', 'AddReviewResource',
      'PartnerCompaniesResource', 'PromotionCouponResource'];

    function PromotionService(PromotionResource, PromotionViewsResource, ReviewResource, AddReviewResource,
                              PartnerCompaniesResource, PromotionCouponResource) {
        
        var promotion = null;
        var view_all_option = null;
        var sub_category = null;
        

        /**
         * Return all functions of this service
         **/
        var PromotionService = {
            'getPromotionsWithFilters'          : getPromotionsWithFilters,
            'setPromotion'                      : setPromotion,
            'getPromotion'                      : getPromotion,
            'addPromotionViews'                 : addPromotionViews,
            'addCouponCode'                     : addCouponCode,
            'getReviews'                        : getReviews,
            'addReviews'                        : addReviews,
            'setViewAllOption'                  : setViewAllOption,
            'getViewAllOption'                  : getViewAllOption,
            'setSubCat'                         : setSubCat,
            'getSubCat'                         : getSubCat,
            'getPartnerCompanies'               : getPartnerCompanies
        };

        /**
         * Get promotions with various filters
         **/
        function getPromotionsWithFilters(param){
            return PromotionResource.query(param).$promise;
        }

        /**
         * Set sub category
         **/
        function setSubCat(param){
            sub_category = param;
        }

        /**
         * Get Sub Cat
         **/
        function getSubCat(){
            return sub_category;
        }
        
        /**
         * Get Partnered companies
         **/
        function getPartnerCompanies(param){
            return PartnerCompaniesResource.query(param).$promise;
        }


        /**
         * Add promotion views
         **/
        function addPromotionViews(param){
            return PromotionViewsResource.query(param).$promise;
        }

        /**
         * Get review according to promotion id
         **/
        function getReviews(param){
            return ReviewResource.query(param).$promise;
        }
        
        /**
         * Set the view all option
         * */
        function setViewAllOption(param) {
            view_all_option = param
        }
        
        /**
         * Get the view all option 
         **/
        function getViewAllOption() {
            return view_all_option;
        }


        /**
         * Add review to related promotion
         **/
        function addReviews(param){
            return AddReviewResource.query(param).$promise;
        }

      /**
       * Add review to related promotion
       **/
       function addCouponCode(param){
            return PromotionCouponResource.save(param).$promise;
       }




        /**
         * Set user selected promotion 
         **/
        function setPromotion(promo){
            promotion = promo;
        }
        
        /**
         * Get user selected promotion 
         **/
        function getPromotion(){
            return promotion;
        }



        return PromotionService;

    }
}(window.angular));