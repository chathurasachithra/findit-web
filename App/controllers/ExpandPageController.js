(function (angular) {
    'use strict';

    angular.module('app')

        .controller('ExpandPageController', function ($scope, $location, $routeParams,  $timeout,
                                                      $rootScope,categoryService, PromotionService, ENV) {

            $rootScope.hitDirectory = true;
            
            /**
             * $scope parameters
             **/
            $scope.selected_promotion = {};
            $scope.cat_loading = true;
            $scope.related_promo_loading = true;
            $scope.related_promotions = [];
            $scope.company_promotions = [];
            $scope.review_count = 0;
            $scope.logo_path = ENV.logo_path;
            $scope.rw = {
                name : null,
                email : null,
                desc  : null
            };
            $scope.currentUrl = $location.absUrl();

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

            $scope.getDiscountTextMain = function (object) {

              if (object.discount_type != 0 && object.discount != '') {
                if (object.max_amount > object.used_amount) {
                  var text = '';
                  if (object.discount_type == 1) {
                    text = object.discount + '%';
                  }
                  if (object.discount_type == 2) {
                    text = object.discount + 'LKR';
                  }
                  return text;

                }
              }
              return '';
            };

            categoryService.getAllPrentCategories()
                .then(function (data) {
                    var p_cat = data.parent_categories;

                    $rootScope.parent_categories = {};

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

                    PromotionService.getPromotionsWithFilters({slug : $routeParams.pid})
                        .then(function (data) {
                            $scope.selected_promotion = {
                                promo_image : ENV.promotion_image_path + data.promotions[0].promotion_id + "/" + data.promotions[0].promotion_image,
                                promo_company_logo : (data.promotions[0].company_logo != null) ?  ENV.logo_path + data.promotions[0].company_id + "/" + data.promotions[0].company_logo : null,
                                promo_name : data.promotions[0].promotion_name,
                                promo_views: data.promotions[0].promotion_unique_views?  data.promotions[0].promotion_views + parseInt(data.promotions[0].promotion_unique_views) : data.promotions[0].promotion_views,
                                promo_company: data.promotions[0].company_name,
                                promo_category_id: data.promotions[0].parent_category_id,
                                promo_date : data.promotions[0].created_at,
                                promo_obj : data.promotions[0],
                                is_discount : $scope.checkIsDiscountExist(data.promotions[0]),
                                discount_text : $scope.getDiscountTextMain(data.promotions[0]),
                                discount_remain : data.promotions[0].max_amount - data.promotions[0].used_amount,
                                discount_remain_percentage : Math.round(((data.promotions[0].max_amount - data.promotions[0].used_amount) /data.promotions[0].max_amount) * 100),
                                discount_claimed: data.promotions[0].used_amount,
                                offer_date : (data.promotions[0].offer_end_date != null) ? new Date(data.promotions[0].offer_end_date.replace(/-/g, "/")) : null
                            };


                            var now = moment(new Date()).add(-1,'days'); //todays date
                            if (data.promotions[0].offer_end_date == '' || data.promotions[0].offer_end_date == null) {
                                var remainDays = null;
                            } else {
                                var end = moment(data.promotions[0].offer_end_date); // another date
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
                            $scope.remainDays = remainDays;


                            var metaTags = data.promotions[0].promotion_description;
                            if (data.promotions[0] && data.promotions[0].meta_tags && data.promotions[0].meta_tags != '') {
                                var metaTags = data.promotions[0].meta_tags;
                            }

                            /**
                             * SEO tags
                             */
                            $scope.seoInformation = {
                                description : data.promotions[0].promotion_description,
                                keywords : metaTags,
                                title : 'Find it - ' + $scope.selected_promotion.promo_name,
                                image : $scope.selected_promotion.promo_image,
                                url : $location.absUrl()
                            };
                            $rootScope.$broadcast('seoUpdate', $scope.seoInformation);

                            $rootScope.social_thumb = $scope.selected_promotion.promo_image;

                            getCategories($scope.selected_promotion.promo_obj.parent_category_slug);
                            activateCurrectTab();
                            getRelatedPromotions();
                            getFeaturedPromotions();
                            getRecentPromotions();
                            addPromotionViews();
                            getRelatedReviews();
                            getPartneredCompanies();
                        });
                })


            /**
             * $scope functions
             **/
            $scope.getPromotionCats         = getPromotionCats;
            $scope.getEventCats             = getEventCats;
            $scope.getMenuCats              = getMenuCats;
            $scope.addReview                = addReview;
            $scope.OpenInside               = OpenInside;
            $scope.viewAll                  = viewAll;
            $scope.filterWithSubCategory    = filterWithSubCategory;
            
            function filterWithSubCategory($index){
                PromotionService.setSubCat($index);
                PromotionService.setViewAllOption(10);
                $state.go('/promotions');
            }

            /**
             * View all functions
             **/
            function viewAll($index){
                PromotionService.setViewAllOption($index);
                $state.go('/promotions');
            }

            /**
             * Add promotion views
             * */
            function addPromotionViews(){
                PromotionService.addPromotionViews({id : $scope.selected_promotion.promo_obj.promotion_id})
            }


            /**
             * Get partner companies
             * */
            function getPartneredCompanies() {
                PromotionService.getPartnerCompanies({promotion_id :$scope.selected_promotion.promo_obj.promotion_id })
                    .then(function (data) {
                        $scope.partner_companies = data.partner_companies;
                })
            }


            /**
             * Open another promotion inside this view
             * */
            function OpenInside($index){
                PromotionService.setPromotion($index);
                $state.reload();
            }

            /**
             * Add new review
             **/
            function addReview($index){


                if($index.name && $index.email && $index.desc){
                    var param = {
                        reviewer_name       : $index.name,
                        reviewer_email      : $index.email,
                        review_description  : $index.desc,
                        promotion_id        : $scope.selected_promotion.promo_obj.promotion_id
                    };

                    PromotionService.addReviews(param).then(function (data) {
                        $scope.rw.name = null;
                        $scope.rw.email = null;
                        $scope.rw.desc = null;
                        getRelatedReviews();
                    });
                }
                
            }

            /**
             * Get related views
             **/
            function getRelatedReviews(){
                PromotionService.getReviews({promotion_id : $scope.selected_promotion.promo_obj.promotion_id})
                    .then(function (data) {
                        if(data != null){
                            $scope.reviews = data.review;
                            $scope.review_count = (data.review && data.review.length) ? data.review.length : 0;
                        }
                    });
            }


            /**
             * Activate related category tab
             **/
            function activateCurrectTab(){
                if($scope.selected_promotion.promo_category_id == $rootScope.parent_categories.promotions_id){
                    $scope.promo_tab = 'active';
                }

                if($scope.selected_promotion.promo_category_id == $rootScope.parent_categories.events_id){
                    $scope.event_tab = 'active';
                }

                if($scope.selected_promotion.promo_category_id == $rootScope.parent_categories.jobs_id){
                    $scope.discount_tab = 'active';
                }

                if($scope.selected_promotion.promo_category_id == $rootScope.parent_categories.menu_id){
                    $scope.menu_tab = 'active';
                }

            }


            /**
             * Get related promotions
             **/
            function getRelatedPromotions(){

                getPromotionsWithFilters({
                    parent_category_id : $scope.selected_promotion.promo_category_id, category_id : $scope.selected_promotion.promo_obj.category_id,
                    limit                   : 4,
                    offset                  : 0
                });
                $scope.related_promo_loading = true;

                /*getPromotionsWithFilters({
                company_id : $scope.selected_promotion.promo_obj.company_id,
                limit                   : 3,
                offset                  : 0});*/

                if ($scope.selected_promotion.promo_obj.company_id != 999999) {
                  getPromotionsWithFiltersCompany({
                    company_id: $scope.selected_promotion.promo_obj.company_id,
                    limit: 7,
                    offset: 0
                  });
                }
            }


            /**
             * Get promotion categories
             **/
            function getPromotionCats() {
                $scope.categories = null;
                getCategories($rootScope.parent_categories.promotions_id);
            }


            /**
             * Get event categories
             * */
            function getEventCats() {
                $scope.categories = null;
                getCategories($rootScope.parent_categories.events_id);
            }

            /**
             * Get menu categories
             **/
            function getMenuCats() {
                $scope.categories = null;
                getCategories($rootScope.parent_categories.menu_id);
            }

            /**
             * Get sub categories filtered by parent category
             **/
            function getCategories(param){
                categoryService.getCategories({parent_slug: param})
                    .then(function (data) {
                        $scope.categories =data.categories;
                        $scope.cat_loading = false;
                    })
                    .catch(function (data) {

                    })
            }


          /**
           * Main filter function own company promo
           **/
          function getPromotionsWithFiltersCompany(param){
            PromotionService.getPromotionsWithFilters(param)
              .then(function (response) {
                var count = 0;
                angular.forEach(response.promotions, function(val, key){

                  if (count < 6 && $scope.selected_promotion.promo_obj.promotion_id != val.promotion_id) {
                    $scope.company_promotions.push({
                      promo_image: ENV.promotion_thumb_image_path + val.promotion_id + "/" + val.promotion_image,
                      promo_company_logo: ((val.company_logo != null) ? ENV.logo_thumb_path + val.company_id + "/" + val.company_logo : null),
                      promo_name: val.promotion_name,
                      promo_views: val.promotion_unique_views ? val.promotion_views + parseInt(val.promotion_unique_views) : val.promotion_views,
                      promo_company: val.company_name,
                      promo_category_id: val.parent_category_id,
                      promo_date: val.created_at,
                      promo_obj: val,
                      is_discount : $scope.checkIsDiscountExist(val),
                      discount_text : $scope.getDiscountText(val),
                      discount_remain : val.max_amount - val.used_amount,
                      discount_remain_percentage : Math.round(((val.max_amount - val.used_amount) /val.max_amount) * 100),
                      discount_claimed: val.used_amount,
                    });
                    count = count + 1;
                  }
                });
                $scope.com_pro_count = $scope.company_promotions.length;
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

                        var match_count = 0;

                        angular.forEach(response.promotions, function(val, key){

                            angular.forEach($scope.related_promotions, function (ex_val) {
                               if(ex_val.promo_obj.promotion_id == val.promotion_id){
                                    match_count++;
                               }
                            });

                            if(match_count == 0 && $scope.selected_promotion.promo_obj.promotion_id != val.promotion_id){
                                $scope.related_promotions.push({
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
                                });
                            }

                            match_count = 0;
                        });
                        $scope.rp_count = $scope.related_promotions.length;
                        $scope.related_promo_loading = false;

                    })
                    .catch(function (data) {
                        console.log(data);
                    });
            }

            /**
             * Get Featured promotions
             **/
            function getFeaturedPromotions(){
                $scope.upcoming_events_loading = true;
                var param = {
                    promotion_is_featured   : true,
                    limit                   : 6,
                    offset                  : 0
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
             * Get Featured promotions
             **/
            function getRecentPromotions(){
                $scope.recent_promo_loading = true;
                var param = {
                    order_by                : 'created_at',
                    order                   : 'desc',
                    limit      :             6,
                    offset                  : 0
                };
                PromotionService.getPromotionsWithFilters(param)
                    .then(function (response) {
                        $scope.recent_promo = [];
                        angular.forEach(response.promotions, function(val, key){
                            $scope.recent_promo.push({
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
                            });
                        });
                        $scope.recent_promo_loading = false;
                        $scope.recent_count = $scope.recent_promo.length;
                    })
                    .catch(function (data) {
                        console.log(data);
                    });
            };

            /** Coupon section **/
            $scope.sucess = false;
            $scope.error = false;
            $scope.getCoupon = function() {
              $scope.onSubmit = false;
              $scope.sucess = false;
              $scope.error = false;
              if ($scope.form_coupon.$valid) {


                  var param = {
                    'name': $scope.name,
                    'email': $scope.email,
                    'tele_number': $scope.phone,
                    'nic': $scope.nic,
                    'promotion_id': $scope.selected_promotion.promo_obj.promotion_id,
                  };

                  $scope.onSubmit = true;
                  PromotionService.addCouponCode(param)
                    .then(function (data) {
                      if (data.status && data.status == 'success') {
                        $scope.sucess = true;
                        $scope.success_message = 'Your coupon code has sent to your email. Please check your inbox.';
                        $scope.name = '';
                        $scope.email = '';
                        $scope.phone = '';
                        $scope.nic = '';
                        $scope.form_coupon.$setPristine();
                        $timeout(function () {
                          $scope.sucess = false;
                        }, 3000);
                      } else {
                        $scope.error = true;
                        $scope.error_message = data.message;
                      }
                      $scope.onSubmit = false;
                    })
                    .catch(function (data) {
                      $scope.onSubmit = false;
                      $scope.error = true;
                      $scope.success_message = 'Something went wrong. Please try again later.';
                    });

              } else{
                $scope.form_coupon.$setDirty();
              }
            }
            

        })

})(window.angular);