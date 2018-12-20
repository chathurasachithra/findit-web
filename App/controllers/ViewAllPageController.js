(function (angular) {
    'use strict';

    angular.module('app')

        .controller('ViewAllController', function ($scope, $location, $routeParams,  $timeout, $rootScope, categoryService, PromotionService, ENV) {

            
            var parent_category = $routeParams.option != null ? $routeParams.option : null;
            var sub_category = $routeParams.sub != 'all' ? $routeParams.sub : null;

            /**
             * $scope parameters
             **/
            $scope.parent_category = null;
            $scope.title_message = null;
            $scope.filter_results = [];
            $scope.loading_tab_view = true;
            $scope.loading_cat = true;


            /**
             * $scope functions
             * */
            $scope.filterWithSubCategory    = filterWithSubCategory;

            
            
            /**
             * Global variables
             **/
            var view_all_option = PromotionService.getViewAllOption();
            var filter_params   = null;

            /**
             * Runtime functions
             **/
            filterParams();

            $scope.checkIsDiscountExist = function (object) {

              if (object.discount_type != 0 && object.discount != '') {
                if (object.max_amount > object.used_amount) {
                  return true;
                }
              }
              return false;
            };

            $scope.getDiscountText = function (object) {

              if (object.discount_type != 0 && object.discount != '') {
                if (object.max_amount > object.used_amount) {
                  var text = '';
                  if (object.discount_type == 1) {
                    text = object.discount + '% Coupon';
                  }
                  if (object.discount_type == 2) {
                    text = object.discount + 'LKR Coupon';
                  }
                  return text;

                }
              }
              return '';
            };

            /**
             * Set filter params to get results
             **/
            function filterParams(){
                switch (parent_category){
                    case 'promotions':
                        categoryService.getCategories({'parent_slug' : parent_category})
                            .then(function (data) {
                                $scope.categories = data.categories;
                                console.log($scope.categories);
                                $scope.loading_cat = false;
                            })
                        $scope.parent_category = "Promotions";
                        $scope.title_message = "All Promotions";
                        filter_params = {
                            parent_slug      : !sub_category ? parent_category : null,
                            cetegory_slug    : sub_category ? sub_category : null,
                            order_by                : 'created_at',
                            order                   : 'desc'
                        };
                        //getPromotionsWithFilters({ parent_category_id      : $rootScope.parent_categories.discounts_id});
                        getPromotionsWithFilters(filter_params);
                        break;
                    case 'events':
                        categoryService.getCategories({'parent_slug' :parent_category})
                            .then(function (data) {
                                $scope.categories = data.categories;
                                $scope.loading_cat = false;
                            })
                        $scope.parent_category = "Events";
                        $scope.title_message = "All Upcoming Events";
                        filter_params = {
                            parent_slug     : parent_category,
                            cetegory_slug    : sub_category ? sub_category : null,
                            order_by                : 'created_at',
                            order                   : 'desc'
                        };
                        getPromotionsWithFilters(filter_params);
                        break;
                     case 'discount-zone':
                        categoryService.getCategories({'parent_slug' : parent_category})
                            .then(function (data) {
                                $scope.categories = data.categories;
                                $scope.loading_cat = false;
                            })
                        $scope.parent_category = "Discount Zone";
                        $scope.title_message = "All Latest Discount Offers";
                        filter_params = {
                            parent_slug      : parent_category,
                            cetegory_slug    : sub_category ? sub_category : null,
                            order_by                : 'created_at',
                            order                   : 'desc'
                        };
                        getPromotionsWithFilters(filter_params);
                        break;
                    case 'menu':
                        categoryService.getCategories({'parent_slug' : parent_category})
                            .then(function (data) {
                                $scope.categories = data.categories;
                                $scope.loading_cat = false;
                            })
                        $scope.title_message = "All Food Promotions";
                        $scope.parent_category = "Menu";
                        filter_params = {
                            parent_slug      : parent_category,
                            cetegory_slug    : sub_category ? sub_category : null,
                            order_by                : 'created_at',
                            order                   : 'desc'
                        };
                        getPromotionsWithFilters(filter_params);
                        break;
                    case 'recent':
                        categoryService.getAllPrentCategories()
                            .then(function (data) {
                                $scope.categories = data.parent_categories;
                                angular.forEach($scope.categories, function (val) {
                                    val.category_name = val.parent_category_name;
                                    val.category_slug = 'all';
                                })
                                $scope.loading_cat = false;
                            })
                        $scope.title_message = "All Recent Promotions";
                        $scope.parent_category = "Main";
                        filter_params = {
                            order_by                : 'created_at',
                            order                   : 'desc'
                        };
                        getPromotionsWithFilters(filter_params);
                        break;
                    case 'featured':
                        categoryService.getAllPrentCategories()
                            .then(function (data) {
                                $scope.categories = data.parent_categories;
                                angular.forEach($scope.categories, function (val) {
                                    val.category_name = val.parent_category_name;
                                    val.category_slug = 'all';
                                })
                                $scope.loading_cat = false;
                            })
                        $scope.title_message = "All Featured Promotions";
                        $scope.parent_category = "Main";
                        filter_params = {
                            promotion_is_featured   : true,
                            order_by                : 'created_at',
                            order                   : 'desc'
                        };
                        getPromotionsWithFilters(filter_params);
                        break;
                    case 'popular':
                        categoryService.getAllPrentCategories()
                            .then(function (data) {
                                $scope.categories = data.parent_categories;
                                angular.forEach($scope.categories, function (val) {
                                    val.category_name = val.parent_category_name;
                                    val.category_slug = 'all';
                                })
                                $scope.loading_cat = false;
                            })
                        $scope.title_message = "All Popular Promotions";
                        $scope.parent_category = "Main";
                        filter_params = {
                            order_by                : 'promotion_views',
                            order                   : 'desc',
                        };
                        getPromotionsWithFilters(filter_params);
                        break;
                    default:
                        categoryService.getCategories({'parent_category_slug' : parent_category})
                            .then(function (data) {
                                $scope.categories = data.categories;
                                $scope.loading_cat = false;
                            });
                        $scope.parent_category = sub_category;
                        $scope.title_message = sub_category;
                        filter_params = {
                            cetegory_slug            : sub_category,
                            order_by                : 'created_at',
                            order                   : 'desc'
                        };
                        getPromotionsWithFilters(filter_params);

                }
            }
            
            function filterWithSubCategory($index){
                $scope.filter_results = [];
                $scope.title_message = $index;
                var param = {
                    cat_name : $index
                };
                getPromotionsWithFilters(param);
            }


            /**
             * Main filter function
             **/
            function getPromotionsWithFilters(param){
                PromotionService.getPromotionsWithFilters(param)
                    .then(function (response) {

                        angular.forEach(response.promotions, function(val, key){

                            var now = moment(new Date()); //todays date
                            if (val.offer_end_date == '' || val.offer_end_date == null) {
                                var remainDays = null;
                            } else {
                                var end = moment(val.offer_end_date); // another date
                                if (end.diff(now) > 0) {

                                    var duration = moment.duration(end.diff(now));
                                    var days = parseInt(duration.asDays());

                                    if (days == 0) {
                                        var remainDays = '<p class="blink_me">Today</p>';
                                    } else if (days == 1) {
                                        var remainDays = '<p class="blink_me">Tomorrow</p>';
                                    } else {
                                        var remainDays = days + '<span> Days Left<span>';
                                    }
                                }
                            }

                            $scope.filter_results.push({
                                promo_image : ENV.promotion_image_path + val.promotion_id + "/" + val.promotion_image,
                                promo_company_logo : ((val.company_logo != null) ? ENV.logo_path + val.company_id + "/" + val.company_logo : null),
                                promo_name : val.promotion_name,
                                promo_views: val.promotion_unique_views?  val.promotion_views + parseInt(val.promotion_unique_views) : val.promotion_views,
                                promo_company: val.company_name,
                                parent_category_slug: val.parent_category_slug,
                                promo_category_id: val.parent_category_id,
                                promo_date : val.created_at,
                                promo_obj : val,
                                promo_remain : remainDays,
                                is_discount : $scope.checkIsDiscountExist(val),
                                discount_text : $scope.getDiscountText(val),
                                discount_remain : val.max_amount - val.used_amount,
                                discount_remain_percentage : Math.round(((val.max_amount - val.used_amount) /val.max_amount) * 100),
                                discount_claimed: val.used_amount,
                                promotion_slug : val.promotion_slug,
                                promo_offer_date : (val.offer_end_date != null) ? new Date(val.offer_end_date.replace(/-/g, "/")) : null
                            });
                        });
                        $scope.fr_count = $scope.filter_results.length;
                        $scope.loading_tab_view = false;

                    })
                    .catch(function (data) {
                        console.log(data);
                    });
            }

        })

})(window.angular);