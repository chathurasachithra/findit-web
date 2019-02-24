(function (angular) {
    'use strict';

    angular.module('app')

        .controller('HomePageController', function ($scope, $location,  $timeout, $rootScope,categoryService,
                                                    PromotionService, ENV, companyService, $anchorScroll) {

            $rootScope.hitDirectory = true;

            /**
             * SEO tags
             */
            $scope.metaInformation = {
                description : 'Find latest offers and daily update on banks, credit cards, travel, education, restaurants, hotels, food, clothing, electronics, events, holiday and more',
                keywords : 'promotions,discounts,events,companies,deals, offers,online,promote,coupons,advertising',
                title : 'Online hub for Promotions, offers, events and discounts in Sri Lanka',
                image : 'http://findit.lk/assets/images/logo.jpg',
                url : $location.absUrl()
            };
            $rootScope.$broadcast('seoUpdate', $scope.seoInformation);

            /**
             * $scope variables
             **/
            $scope.advanced_filter = false;
            $scope.filters_apply = false;
            $scope.recent_active = false;
            $scope.featured_active = false;
            $scope.most_viewed_active = false;
            $scope.enable_categories = false;
            $scope.active_tab = 'featured';
            $scope.company_row = [];
            $scope.logo_path = ENV.logo_thumb_path;
            $scope.logo_large_path = ENV.logo_path;
            $scope.feature_promo = [];
            $scope.recent_promo = [];
            $scope.partner_companies = [];
            $scope.filter = {
                keyword : null,
                parent_cat : null,
                sub_cat : null,
                order_by : null
            };

            $scope.mainCategories = [
              {
                title: 'Weekly',
                desc: 'Discover most recent and upcoming details on discounts, events and promotions taking place across sri lanka.',
                image: '/assets/images/main-promo/weekly.jpg',
                url: '/promotions/weekly',
              },
              {
                title: 'Book It',
                desc: 'Discover most recent and upcoming details on hotel offers discounts and promotions taking place in hotels and resorts across Sri Lanka.',
                image: '/assets/images/main-promo/bookit.jpg',
                url: '/promotions/hotel-resorts',
              },
              {
                title: 'Taste It',
                desc: 'Discover the best offers on Foods, Drink, Promotions, Offers and Discounts from the best restaurants in Sri Lanka.',
                image: '/assets/images/main-promo/eatit.jpg',
                url: '/promotions/food-beverage',
              },
              {
                title: 'Study It',
                desc: 'Discover the best MBA, diploma, degree programs, education, institutes, academies, promotions, offers and discounts from the institutes in Sri Lanka.',
                image: '/assets/images/main-promo/studyit.jpg',
                url: '/promotions/education',
              },
              {
                title: 'Explore It',
                desc: 'Discover the best travel offers, tour packages, discounts, offers and promotions from the travel agents in Sri Lanka.',
                image: '/assets/images/main-promo/exploreit.jpg',
                url: '/promotions/travel',
              },
              {
                title: 'Save It',
                desc: 'Discover the best banks, credit cards promotions, offers and discounts from the banks in Sri Lanka.',
                image: '/assets/images/main-promo/saveit.jpg',
                url: '/promotions/bank-cards',
              },
            ];

            /**
             * $scope functions
             **/
            $scope.enableDisableAdvancedFilter = enableDisableAdvancedFilter;
            $scope.getFeaturedPromotions       = getFeaturedPromotions;
            $scope.getRecentPromotions         = getRecentPromotions;
            $scope.getPopularPromotions        = getPopularPromotions;
            $scope.getCategories               = getCategories;
            $scope.ApplyFilters                = ApplyFilters;
            $scope.resetFilters                = resetFilters;

            $scope.banners = [];

            /**
             * Runtime functions
             **/
            categoryService.getAllPrentCategories()
                .then(function (data) {
                    var p_cat = data.parent_categories;
                    $scope.randomCategories = data.random_categories;
                    $scope.banners = data.banners;

                    angular.forEach($scope.banners, function (banner) {
                      banner.banner = ENV.home_banner_path + banner.banner;
                    });

                    $rootScope.parent_categories = {};
                    $rootScope.social_thumb = 'assets/images/logo.jpg';

                    angular.forEach(p_cat, function (val, key) {
                        switch (val.parent_category_name){
                            case 'Promotions':
                                $rootScope.parent_categories.promotions_id = val.parent_category_id;
                                break;
                            case 'Events':
                                $rootScope.parent_categories.events_id = val.parent_category_id;
                                break;
                            case 'Discount Zone':
                                $rootScope.parent_categories.discounts_id = val.parent_category_id;
                                break;
                            case 'Company':
                                $rootScope.parent_categories.company_id = val.parent_category_id;
                                break;
                            case 'Menu':
                                $rootScope.parent_categories.menu_id = val.parent_category_id;
                                break;
                        }
                    });
                    getRecentPromotions();
                    getUpcomingEvents();
                    getDiscountPromotions();
                    getCompanies();

                    angular.element('#findit').addClass('carousel');
                    angular.element('#findit').addClass('slide');

                });

            categoryService.getCategories({parent_category_id : 1, limit: 'top20'})
              .then(function (data) {
                $scope.categories = data.categories;
              });

            function resetFilters(){
                $scope.filter = {
                    keyword : null,
                    parent_cat : null,
                    sub_cat : null,
                    order_by : null
                };
                $scope.advanced_filter = false;
                $scope.enable_categories = false;
                $scope.filters_apply = false;
                getRecentPromotions();
            }

            /**
             * Get sub categories filtered by parent category
             **/
            function getCategories(){
                $scope.enable_categories = false;
                categoryService.getCategoriesByParentCatId({p_cat_id : getParentCategoryId()})
                    .then(function (data) {
                        $scope.categories =data.categories;
                        $scope.enable_categories = $scope.categories.length != 0 ? false : true;
                    })
                    .catch(function (data) {

                    })
            }

            /**
             * Get All parent categories
             **/
            function getParentCategoryId(){
                var p_cat_id = null;
                if($scope.filter.parent_cat){
                    switch ($scope.filter.parent_cat){
                        case 'Promotions':
                            p_cat_id = $rootScope.parent_categories.promotions_id;
                            break;
                        case 'Events':
                            p_cat_id = $rootScope.parent_categories.events_id;
                            break;
                        case 'Menu':
                            p_cat_id = $rootScope.parent_categories.menu_id;
                            break;
                    }
                }
                return p_cat_id;
            }

            /**
             * Get sub category id
             **/
            function getSubCategoryId(){
                var sub_cat = null;
                angular.forEach($scope.categories, function (val) {
                    if(val.category_name == $scope.filter.sub_cat){
                        sub_cat = val.category_id;
                    }
                });
                return sub_cat;
            }

            /**
             * Get promotions filter by order
             **/
            function getOrderBy(){
                var order_by = null;
                var order    = null;
                switch ($scope.filter.order_by){
                    case 'Most viewed':
                        order       = 'desc';
                        order_by    = 'promotion_views';
                        break;
                    case 'Newest':
                        order       = 'desc';
                        order_by    = 'created_at';
                        break;
                    case 'Oldest':
                        order       = 'asc';
                        order_by    = 'created_at';
                        break;
                }

                return {
                    order       : order,
                    order_by    : order_by
                }
            }

            function ApplyFilters() {
                $scope.filters_apply = true;
                companyService.get({type : 1, search: $scope.filter.keyword ? $scope.filter.keyword : null})
                  .then(function (data) {

                    $scope.filter_results = [];
                    angular.forEach(data.companies, function(val, key){
                      if (val.company_logo) {
                        $scope.filter_results.push(val);
                      }
                    });
                    $scope.fr_count = $scope.filter_results.length;
                    $scope.loading_tab_view = false;
                  });
            }



            /**
             * Advanced filter switch
             **/
            function enableDisableAdvancedFilter(){
                if(!$scope.advanced_filter){
                    $scope.advanced_filter = true;
                    $scope.state_on = "state_on_1";
                }
                else{
                    $scope.advanced_filter = false;
                }
            }

            function  getPopularPromotions() {
                $scope.recent_active = false;
                $scope.featured_active = false;
                $scope.most_viewed_active = true;
                $scope.loading_tab_view = true;
                $scope.active_tab = "popular";
                var param = {
                    order_by   : 'promotion_views',
                    order      : 'desc',
                    limit      : 6
                };
                getPromotionsWithFilters(param);
            }


            /**
             * Get featured promotions
             **/
            function getFeaturedPromotions() {
                $scope.recent_active = false;
                $scope.featured_active = true;
                $scope.most_viewed_active = false;
                $scope.loading_tab_view = true;
                $scope.active_tab = 'featured';
                var param = {
                    promotion_is_featured   : true,
                    limit                   : 6
                };
                PromotionService.getPromotionsWithFilters(param)
                .then(function (response) {
                  $scope.filter_results = [];
                  angular.forEach(response.promotions, function(val, key){
                    $scope.feature_promo.push({
                      promo_image : ENV.promotion_thumb_image_path + val.promotion_id + "/" + val.promotion_image,
                      promo_company_logo :((val.company_logo != null) ? ENV.logo_thumb_path + val.company_id + "/" + val.company_logo : null),
                      promo_name : val.promotion_name,
                      promo_views: val.promotion_unique_views?  val.promotion_views + parseInt(val.promotion_unique_views) : val.promotion_views,
                      promo_company: val.company_name,
                      promo_category_id: val.parent_category_id,
                      promo_date : val.created_at,
                      promo_obj : val,
                      is_discount : $scope.checkIsDiscountExist(val),
                      discount_text : $scope.getDiscountText(val),
                      discount_remain : val.max_amount - val.used_amount,
                      discount_remain_percentage : Math.round(((val.max_amount - val.used_amount) /val.max_amount) * 100),
                      discount_claimed: val.used_amount,
                      offer_date : (val.offer_end_date != null) ? new Date(val.offer_end_date.replace(/-/g, "/")) : null
                    });
                  });
                })
                .catch(function (data) {
                  console.log(data);
                });
            };
            getFeaturedPromotions();

            /**
             * Get recent promotions
             **/
            function getRecentPromotions(){
                $scope.recent_active = true;
                $scope.featured_active = false;
                $scope.most_viewed_active = false;
                $scope.loading_tab_view = true;
                $scope.active_tab = "recent";
                var param = {
                    parent_category_id : $rootScope.parent_categories.promotions_id,
                    order_by   : 'created_at',
                    order      : 'desc',
                    limit      : 6,
                    offset     : 0
                };
                PromotionService.getPromotionsWithFilters(param)
                  .then(function (response) {
                    $scope.recent_promo = [];
                    angular.forEach(response.promotions, function(val, key){
                      $scope.recent_promo.push({
                        promo_image : ENV.promotion_thumb_image_path + val.promotion_id + "/" + val.promotion_image,
                        promo_company_logo :((val.company_logo != null) ? ENV.logo_thumb_path + val.company_id + "/" + val.company_logo : null),
                        promo_name : val.promotion_name,
                        promo_views: val.promotion_unique_views?  val.promotion_views + parseInt(val.promotion_unique_views) : val.promotion_views,
                        promo_company: val.company_name,
                        promo_category_id: val.parent_category_id,
                        promo_date : val.created_at,
                        promo_obj : val,
                        is_discount : $scope.checkIsDiscountExist(val),
                        discount_text : $scope.getDiscountText(val),
                        discount_remain : val.max_amount - val.used_amount,
                        discount_remain_percentage : Math.round(((val.max_amount - val.used_amount) /val.max_amount) * 100),
                        discount_claimed: val.used_amount,
                        offer_date : (val.offer_end_date != null) ? new Date(val.offer_end_date.replace(/-/g, "/")) : null
                      });
                    });
                    $scope.re_count = $scope.recent_promo.length;
                    $scope.loading_tab_view = false;

                })
                .catch(function (data) {
                  console.log(data);
                });
            }

            /**
             * Get up-coming events
             **/
            function getUpcomingEvents(){
                $scope.upcoming_events_loading = true;
                var param = {
                    parent_category_id      : $rootScope.parent_categories.events_id,
                    limit                   : 6,
                    offset                  : 0,
                    order_by                : 'created_at',
                    order                   : 'desc',
                };
                PromotionService.getPromotionsWithFilters(param)
                    .then(function (response) {
                        $scope.upcoming_events = [];
                        angular.forEach(response.promotions, function(val, key){
                            $scope.upcoming_events.push({
                                promo_image : ENV.promotion_thumb_image_path + val.promotion_id + "/" + val.promotion_image,
                                promo_company_logo : ((val.company_logo != null) ? ENV.logo_thumb_path + val.company_id + "/" + val.company_logo : null),
                                promo_name : val.promotion_name,
                                promo_views: val.promotion_unique_views?  val.promotion_views + parseInt(val.promotion_unique_views) : val.promotion_views,
                                promo_company: val.company_name,
                                promo_category_id: val.parent_category_id,
                                promo_date : val.created_at,
                                promo_obj : val,
                                is_discount : $scope.checkIsDiscountExist(val),
                                discount_text : $scope.getDiscountText(val),
                                discount_remain : val.max_amount - val.used_amount,
                                discount_remain_percentage : Math.round(((val.max_amount - val.used_amount) /val.max_amount) * 100),
                                discount_claimed: val.used_amount,
                                offer_date : (val.offer_end_date != null) ? new Date(val.offer_end_date.replace(/-/g, "/")) : null
                            });
                        });
                        $scope.upcoming_events_loading = false;
                        $scope.ep_count = $scope.upcoming_events.length;
                    })
                    .catch(function (data) {
                        console.log(data);
                    });
            }

            /**
             * Get up-coming events
             **/
            function getDiscountPromotions(){
                $scope.discountPromotionsLoading = true;
                var param = {
                    parent_category_id      : $rootScope.parent_categories.discounts_id,
                    limit                   : 6,
                    offset                  : 0,
                    order_by                : 'created_at',
                    order                   : 'desc'
                };
                PromotionService.getPromotionsWithFilters(param)
                    .then(function (response) {
                        $scope.discountPromotions = [];
                        angular.forEach(response.promotions, function(val, key){

                            var now = moment(new Date()).add(-1,'days'); //todays date
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
                            $scope.discountPromotions.push({
                                promo_image : ENV.promotion_thumb_image_path + val.promotion_id + "/" + val.promotion_image,
                                promo_company_logo : ((val.company_logo != null) ? ENV.logo_thumb_path + val.company_id + "/" + val.company_logo : null),
                                promo_name : val.promotion_name,
                                promo_views: val.promotion_unique_views?  val.promotion_views + parseInt(val.promotion_unique_views) : val.promotion_views,
                                promo_company: val.company_name,
                                promo_category_id: val.parent_category_id,
                                promo_date : val.created_at,
                                promo_obj : val,
                                is_discount : $scope.checkIsDiscountExist(val),
                                discount_text : $scope.getDiscountText(val),
                                discount_remain : val.max_amount - val.used_amount,
                                discount_remain_percentage : Math.round(((val.max_amount - val.used_amount) /val.max_amount) * 100),
                                discount_claimed: val.used_amount,
                                remain_days : remainDays,
                                offer_date : (val.offer_end_date != null) ? new Date(val.offer_end_date.replace(/-/g, "/")) : null
                            });
                        });
                        $scope.dp_count = $scope.discountPromotions.length;
                        $scope.discountPromotionsLoading = false;
                    })
                    .catch(function (data) {
                        console.log(data);
                    });
            }
            

            /**
             * Main filter function
             **/
            function getPromotionsWithFilters(param){
                PromotionService.getPromotionsWithFilters(param)
                    .then(function (response) {
                        $scope.filter_results = [];
                        angular.forEach(response.promotions, function(val, key){
                            $scope.filter_results.push({
                                promo_image : ENV.promotion_thumb_image_path + val.promotion_id + "/" + val.promotion_image,
                                promo_company_logo :((val.company_logo != null) ? ENV.logo_thumb_path + val.company_id + "/" + val.company_logo : null),
                                promo_name : val.promotion_name,
                                promo_views: val.promotion_unique_views?  val.promotion_views + parseInt(val.promotion_unique_views) : val.promotion_views,
                                promo_company: val.company_name,
                                promo_category_id: val.parent_category_id,
                                promo_date : val.created_at,
                                promo_obj : val,
                                is_discount : $scope.checkIsDiscountExist(val),
                                discount_text : $scope.getDiscountText(val),
                                discount_remain : val.max_amount - val.used_amount,
                                discount_remain_percentage : Math.round(((val.max_amount - val.used_amount) /val.max_amount) * 100),
                                discount_claimed: val.used_amount,
                                offer_date : (val.offer_end_date != null) ? new Date(val.offer_end_date.replace(/-/g, "/")) : null
                            });
                        });
                        $scope.fr_count = $scope.filter_results.length;
                        $scope.loading_tab_view = false;

                    })
                    .catch(function (data) {
                        console.log(data);
                    });
            }


            function getCompanies(){
                companyService.get()
                    .then(function (data) {
                        $scope.companies = data.companies;
                        $scope.companiesNew = [];
                        angular.forEach($scope.companies, function (val, key) {
                          if (key < 10) {
                            $scope.companiesNew.push(val);
                          }
                          if (val.company_id == 196 || val.company_id == 542) {
                            $scope.companiesNew.push(val);
                          }
                          if (val.company_id == 248 || val.company_id == 1303 || val.company_id == 400 || val.company_id == 1382) {
                            $scope.partner_companies.push(val);
                          }
                        });
                    });
            };

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

        })

})(window.angular);