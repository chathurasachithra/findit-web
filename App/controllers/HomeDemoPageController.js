(function (angular) {
    'use strict';

    angular.module('app')

        .controller('HomeDemoPageController', function ($scope, $location,  $timeout, $rootScope,categoryService,
                                                    PromotionService, ENV, companyService, $anchorScroll) {

            $rootScope.hitDirectory = true;

            /**
             * SEO tags
             */
            $scope.metaInformation = {
                description : 'Findit.lk is an online information hub which provide the latest details on promotions,' +
                ' discounts and events taking place across Sri Lanka.Also this platform helps to grow any business using' +
                ' digital marketing tools.In the findit.lk database, you will find registered companies from major' +
                ' industries of which you can now hunt for the best deal available out there on your expected product' +
                ' or service and also compare prices amongst each other. This way, through findit.lk, you are bound to' +
                ' find for yourself, for whichever requirement, the best deal that money can buy! If you register with' +
                ' findit.lk, you will receive exclusive offers and the best deals in town, courtesy of our partner' +
                ' companies that are registered with us.',
                keywords : 'Promotions In Sri Lanka, Discounts in srilanka, Events in sri lanka, Companies in sri lanka,' +
                ' deals in srilanka,offers in sri lanka, online business sri lanka, How to promote business online,' +
                ' Directory Sri lanka, Business in srilanka',
                title : 'Findit.lk',
                image : 'assets/images/logo.jpg',
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
            $scope.logo_path = ENV.logo_path;

            $scope.filter = {
                keyword : null,
                parent_cat : null,
                sub_cat : null,
                order_by : null
            };

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
                var p_cat_id = $scope.filter.sub_cat ? null : getParentCategoryId();
                var orders = getOrderBy();

                var param = {
                    parent_category_id      : p_cat_id,
                    category_id             : $scope.filter.sub_cat ? getSubCategoryId() : null,
                    keyword                 : $scope.filter.keyword ? $scope.filter.keyword : null,
                    promotion_is_featured   : $scope.filter.order_by == 'Featured' ? true : null,
                    order_by                : orders.order_by,
                    order                   : orders.order
                };
                getPromotionsWithFilters(param);
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
                getPromotionsWithFilters(param);
            }

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
                getPromotionsWithFilters(param);
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
                                promo_image : ENV.promotion_image_path + val.promotion_id + "/" + val.promotion_image,
                                promo_company_logo : ENV.logo_path + val.company_id + "/" + val.company_logo,
                                promo_name : val.promotion_name,
                                promo_views: val.promotion_unique_views?  val.promotion_views + parseInt(val.promotion_unique_views) : val.promotion_views,
                                promo_company: val.company_name,
                                promo_category_id: val.parent_category_id,
                                promo_date : val.created_at,
                                promo_obj : val,
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
                                promo_image : ENV.promotion_image_path + val.promotion_id + "/" + val.promotion_image,
                                promo_company_logo : ENV.logo_path + val.company_id + "/" + val.company_logo,
                                promo_name : val.promotion_name,
                                promo_views: val.promotion_unique_views?  val.promotion_views + parseInt(val.promotion_unique_views) : val.promotion_views,
                                promo_company: val.company_name,
                                promo_category_id: val.parent_category_id,
                                promo_date : val.created_at,
                                promo_obj : val,
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
                                promo_image : ENV.promotion_image_path + val.promotion_id + "/" + val.promotion_image,
                                promo_company_logo : ENV.logo_path + val.company_id + "/" + val.company_logo,
                                promo_name : val.promotion_name,
                                promo_views: val.promotion_unique_views?  val.promotion_views + parseInt(val.promotion_unique_views) : val.promotion_views,
                                promo_company: val.company_name,
                                promo_category_id: val.parent_category_id,
                                promo_date : val.created_at,
                                promo_obj : val,
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
                        var i = 1;
                        var temp = [];
                        angular.forEach($scope.companies, function (val) {
                            val.views = val.company_views || val.company_unique_views ?  parseInt(val.company_views) + parseInt(val.company_unique_views) : parseInt(0);
                            if(i < 17){
                                temp.push(val);
                                i++;
                            }
                            else{
                                $scope.company_row.push(temp);
                                temp = [];
                                i = 1;
                            }

                        });
                    })
            }

        })

})(window.angular);