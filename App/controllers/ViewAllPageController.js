(function (angular) {
    'use strict';

    angular.module('app')

        .controller('ViewAllController', function ($scope, $location, $routeParams,  $timeout, $rootScope,
                                                   categoryService, PromotionService, ENV, $route, companyService) {
            
            let parent_category = $route.current.$$route.category;
            let parent_filter = null;
            let sub_category = $routeParams.sub ? $routeParams.sub : null;
            if (sub_category == 'weekly' || sub_category == 'recent' || sub_category == 'popular' || sub_category == 'featured') {
              parent_filter = sub_category;
              sub_category = null;
            }
            /**
             * $scope parameters
             **/
            $scope.parent_category = null;
            $scope.title_message = null;
            $scope.sub_title_message = null;
            $scope.show_sub_title_message = false;
            $scope.filter_results = [];
            $scope.loading_tab_view = true;
            $scope.loading_cat = true;
            $scope.submit_button = 'Submit a Promotion';
            $scope.currentUrl = $location.absUrl();
            $scope.logo_large_path = ENV.logo_path;
            $scope.search = '';

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

            $scope.companiesNew = [];
            $scope.getFeatureCompanies = function () {
              companyService.get()
                .then(function (data) {
                  $scope.companies = data.companies;
                  angular.forEach($scope.companies, function (val, key) {
                    if (key < 10) {
                      $scope.companiesNew.push(val);
                    }
                    if (val.company_id == 196 || val.company_id == 542) {
                      $scope.companiesNew.push(val);
                    }
                  });
                });
            };
            $scope.getFeatureCompanies();

          $scope.getSearchPromotions = function () {
            console.log($scope.search);
            filterParams();
          };

            /**
             * Set filter params to get results
             **/
            function filterParams(){
                $scope.title_message = null;
                $scope.sub_title_message = null;
                $scope.show_sub_title_message = false;
                switch (parent_category){
                    case 'promotions':

                        categoryService.getCategories({'parent_slug': parent_category})
                          .then(function (data) {
                            $scope.categories = data.categories;
                            $scope.loading_cat = false;
                          });

                        if (parent_filter == null) {

                          $scope.parent_category = "Promotions";
                          $scope.title_message = "Promotions";
                          $scope.submit_button = 'Submit a Promotion';
                          $scope.sub_title_message = "Discover most recent and upcoming  details on discounts, events and promotions taking place across sri lanka";
                          filter_params = {
                            parent_slug: !sub_category ? parent_category : null,
                            cetegory_slug: sub_category ? sub_category : null,
                            order_by: 'created_at',
                            order: 'desc'
                          };
                          //getPromotionsWithFilters({ parent_category_id      : $rootScope.parent_categories.discounts_id});
                          getPromotionsWithFilters(filter_params);
                        } else {

                          switch (parent_filter) {
                            case 'recent':
                              $scope.submit_button = 'Submit a Promotion';
                              $scope.title_message = "Recent Promotions";
                              $scope.sub_title_message = "Discover most recent and upcoming  details on discounts, events and promotions taking place across sri lanka";
                              $scope.parent_category = "Promotions";
                              filter_params = {
                                parent_slug: 'promotions',
                                order_by: 'created_at',
                                order: 'desc'
                              };
                              getPromotionsWithFilters(filter_params);
                              break;
                            case 'weekly':
                              $scope.submit_button = 'Submit a Promotion';
                              $scope.title_message = "Weekly Promotions";
                              $scope.sub_title_message = "Discover most recent and upcoming  details on discounts, events and promotions taking place across sri lanka";
                              $scope.parent_category = "Promotions";
                              filter_params = {
                                parent_slug: 'promotions',
                                order_by: 'weekly',
                                order: 'desc'
                              };
                              getPromotionsWithFilters(filter_params);
                              break;
                            case 'featured':
                              $scope.submit_button = 'Submit a Promotion';
                              $scope.title_message = "Featured Promotions";
                              $scope.sub_title_message = "Discover most recent and upcoming  details on discounts, events and promotions taking place across sri lanka";
                              $scope.parent_category = "Promotions";
                              filter_params = {
                                parent_slug: 'promotions',
                                promotion_is_featured: true,
                                order_by: 'created_at',
                                order: 'desc'
                              };
                              getPromotionsWithFilters(filter_params);
                              break;
                            case 'popular':
                              $scope.submit_button = 'Submit a Promotion';
                              $scope.title_message = "Popular Promotions";
                              $scope.sub_title_message = "Discover most recent and upcoming  details on discounts, events and promotions taking place across sri lanka";
                              $scope.parent_category = "Promotions";
                              filter_params = {
                                parent_slug: 'promotions',
                                order_by: 'promotion_views',
                                order: 'desc',
                              };
                              getPromotionsWithFilters(filter_params);
                              break;
                          }
                        }
                        break;
                    case 'events':
                        categoryService.getCategories({'parent_slug' :parent_category})
                            .then(function (data) {
                                $scope.categories = data.categories;
                                $scope.loading_cat = false;
                            })
                        $scope.parent_category = "Events";
                        $scope.title_message = "Events";
                        $scope.submit_button = 'Submit an Event';
                        $scope.sub_title_message = "Find out latest upcoming details on events  taking place across Sri Lanka. Stay tuned";
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
                            });
                        $scope.submit_button = 'Submit Discounts/Deals';
                        $scope.parent_category = "Discount Zone";
                        $scope.title_message = "Discount zone ";
                        $scope.sub_title_message = "All the discounts and deals in Sri Lanka in one place.  Save money , Save time";
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
                        $scope.submit_button = 'Submit a Promotion';
                        filter_params = {
                            parent_slug      : parent_category,
                            cetegory_slug    : sub_category ? sub_category : null,
                            order_by                : 'created_at',
                            order                   : 'desc'
                        };
                        getPromotionsWithFilters(filter_params);
                        break;
                    default:
                        categoryService.getCategories({'parent_category_slug' : parent_category})
                            .then(function (data) {
                                $scope.categories = data.categories;
                                $scope.loading_cat = false;
                            });
                        $scope.submit_button = 'Submit a Promotion';
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

                if (param.cetegory_slug && param.cetegory_slug != null) {
                  categoryService.getCategories({'parent_slug' : parent_category})
                    .then(function (data) {
                      $scope.categories = data.categories;
                      angular.forEach(data.categories, function (category) {
                        if (category.category_slug == param.cetegory_slug) {
                          $scope.title_message = $scope.title_message + " on " + category.category_name + "";
                          if (category.description != null) {
                            $scope.sub_title_message = category.description;
                          }
                          $scope.show_sub_title_message = true;
                        }
                      });
                    });
                } else {
                  $scope.show_sub_title_message = true;
                }

                if ($scope.search !== '') {
                  param.search = $scope.search;
                }
                $scope.loading_tab_view = true;
                PromotionService.getPromotionsWithFilters(param)
                    .then(function (response) {
                        $scope.filter_results = [];
                        if (response.promotions.length>0) {
                          angular.forEach(response.promotions, function (val, key) {

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
                              promo_image: ENV.promotion_thumb_image_path + val.promotion_id + "/" + val.promotion_image,
                              promo_company_logo: ((val.company_logo != null) ? ENV.logo_thumb_path + val.company_id + "/" + val.company_logo : null),
                              promo_name: val.promotion_name,
                              promo_views: val.promotion_unique_views ? val.promotion_views + parseInt(val.promotion_unique_views) : val.promotion_views,
                              promo_company: val.company_name,
                              parent_category_slug: val.parent_category_slug,
                              promo_category_id: val.parent_category_id,
                              promo_date: val.created_at,
                              promo_obj: val,
                              promo_remain: remainDays,
                              is_discount: $scope.checkIsDiscountExist(val),
                              discount_text: $scope.getDiscountText(val),
                              discount_remain: val.max_amount - val.used_amount,
                              offer_end_date : (val.offer_end_date) ? val.offer_end_date.slice(0,10) : null,
                              discount_remain_percentage: Math.round(((val.max_amount - val.used_amount) / val.max_amount) * 100),
                              discount_claimed: val.used_amount,
                              promotion_slug: val.promotion_slug,
                              promo_offer_date: (val.offer_end_date != null) ? new Date(val.offer_end_date.replace(/-/g, "/")) : null
                            });
                          });
                        }
                        $scope.fr_count = $scope.filter_results.length;
                        $scope.loading_tab_view = false;
                    })
                    .catch(function (data) {
                        console.log(data);
                    });
            }

        })

})(window.angular);