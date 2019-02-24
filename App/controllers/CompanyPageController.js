(function (angular) {
  'use strict';

  angular.module('app')

    .controller('CompanyPageController', function ($scope, $location,$document, $window,  $routeParams, $timeout,
                                                   $rootScope,categoryService, PromotionService,
                                                   companyService, ENV, $sce) {
      if($rootScope.hitDirectory){
        $window.location.reload();
        $rootScope.hitDirectory = false;
      }
      /**
       * $scope parameters
       **/
      $scope.company_id                       = $routeParams.cid;
      $scope.main_loader                      = true;
      $scope.promo_count                      = 0;
      $scope.events_count                     = 0;
      $scope.total_views                      = 0;
      $scope.discounts_count                  = 0;
      $scope.total_promotions                 = 0;
      $scope.all                              = false;
      $scope.currentUrl = $location.absUrl();
      $scope.viewAllPromotionsButton = false;
      $scope.allPromotions = {};
      $scope.viewAllGalleryButton = false;
      $scope.allGallery = {};

      companyService.get({id : $scope.company_id})
        .then(function (data) {
          $scope.company = {
            id              : data.companies[0].company_id,
            is_logo         : data.companies[0].company_logo? true : false,
            is_banner       : data.companies[0].company_banner? true : false,
            company_logo    : ENV.logo_path + data.companies[0].company_id + "/" + data.companies[0].company_logo,
            company_banner  : ENV.company_banner_path + data.companies[0].company_id + "/" + data.companies[0].company_banner,
            name            : data.companies[0].company_name,
            is_desc         : data.companies[0].company_description ? true : false,
            desc            : data.companies[0].company_description,
            is_address      : data.companies[0].company_address ? true : false,
            address         : data.companies[0].company_address,
            is_tel          : data.companies[0].company_tel1 ? true : false,
            tel             : data.companies[0].company_tel1,
            is_social       : data.companies[0].company_fb || data.companies[0].company_linkedin || data.companies[0].company_twitter || data.companies[0].company_youtube || data.companies[0].company_instagram ? true : false,
            facebook        : data.companies[0].company_fb,
            twitter         : data.companies[0].company_twitter,
            youtube         : data.companies[0].company_youtube,
            linkedIn        : data.companies[0].company_linkedin,
            instagram       : data.companies[0].company_instagram,
            is_web          : data.companies[0].company_website ? true : false,
            web             : data.companies[0].company_website,
            is_map          : data.companies[0].company_longitude && data.companies[0].company_latitude ? true : false,
          };

          if (data.videos == "") {
            $scope.promo_videos = [];
          } else {
            $scope.promo_videos = data.videos.trim().split(",");
          }
          $scope.promo_images = [];
          angular.forEach(data.images, function (image) {
            $scope.promo_images.push({
              id: image.id,
              url : ENV.company_promo_path + image.image_name,
              thumbUrl : ENV.company_promo_path + image.image_name,
              bubbleUrl : ENV.company_promo_path + image.image_name,
              title : image.title,
              desc : image.description,
            });
          });

          if ($scope.promo_images.length > 6) {
            $scope.viewAllGalleryButton = true;
            $scope.allGallery= angular.copy($scope.promo_images);
            $scope.promo_images = $scope.promo_images.slice(0, 6)
          }

          var metaTags = $scope.company.desc;
          if (data.companies[0] && data.companies[0].meta_tags && data.companies[0].meta_tags != '') {
            var metaTags = data.companies[0].meta_tags;
          }

          /**
           * SEO tags
           */
          $scope.seoInformation = {
            description : $scope.company.desc,
            keywords : metaTags,
            title : 'Find it - ' + $scope.company.name,
            image : $scope.company.company_logo,
            url : $location.absUrl()
          };
          $rootScope.$broadcast('seoUpdate', $scope.seoInformation);

          $scope.longitude   = data.companies[0].company_longitude ? parseFloat(data.companies[0].company_latitude) : null;
          $scope.latitude    = data.companies[0].company_latitude ? parseFloat(data.companies[0].company_longitude) : null;
          $scope.total_views =  parseInt(data.companies[0].company_views) + parseInt(data.companies[0].company_unique_views);
          $rootScope.social_thumb = $scope.company.is_logo? $scope.company.company_logo : 'assets/images/logo.jpg';
          getAll();
          addCompanyViews();
        });


      /**
       * $scope.functions
       **/
      $scope.getEvents            = getEvents;
      $scope.getAll               = getAll;
      $scope.getPromotions        = getPromotions;
      $scope.getDiscounts         = getDiscounts;


      /**
       * Get all promotions posted by this company
       **/
      function getAll(){
        $scope.total_promotions = 0;
        $scope.promo_count = 0;
        $scope.events_count = 0;
        $scope.discounts_count = 0;
        $scope.filter_results = null;
        $scope.loading_tab_view = true;
        $scope.all = true;
        var param = {
          company_id   :  $scope.company.id
        };
        getPromotionsWithFilters(param);
      }

      /**
       * Get promotions posted by this company
       **/
      function getPromotions(){
        $scope.filter_results = null;
        $scope.loading_tab_view = true;
        var param = {
          parent_category_id   :  $rootScope.parent_categories.promotions_id,
          company_id   :  $scope.company.id
        };
        getPromotionsWithFilters(param);
      }

      /**
       * Add company views
       * */
      function addCompanyViews(){
        companyService.addCompanyViews({id : $scope.company.id})
      }

      /**
       * Get discounts posted by this company
       **/
      function getDiscounts(){
        $scope.filter_results = null;
        $scope.loading_tab_view = true;
        if($rootScope.parent_categories.discounts_id){
          var param = {
            parent_category_id   :  $rootScope.parent_categories.discounts_id,
            company_id   :  $scope.company.id
          };
          getPromotionsWithFilters(param);
        }
      }

      /**
       * Get events posted by this company
       **/
      function getEvents(){
        $scope.filter_results = null;
        $scope.loading_tab_view = true;
        if($rootScope.parent_categories.events_id){
          var param = {
            parent_category_id   :  $rootScope.parent_categories.events_id,
            company_id   :  $scope.company.id
          };
          getPromotionsWithFilters(param);
        }
      }

      /**
       * Main filter function
       **/
      function getPromotionsWithFilters(param){
        $scope.loading_tab_view = true;
        PromotionService.getPromotionsWithFilters(param)
          .then(function (response) {
            $scope.filter_results = [];
            angular.forEach(response.promotions, function(val, key){
              $scope.filter_results.push({
                promo_image : ENV.promotion_image_path + val.promotion_id + "/" + val.promotion_image,
                promo_company_logo : ENV.logo_path + val.company_id + "/" + val.company_logo,
                promo_name : val.promotion_name,
                promotion_description : val.promotion_description,
                promo_views: val.promotion_unique_views?  val.promotion_views + parseInt(val.promotion_unique_views) : val.promotion_views,
                promo_company: val.company_name,
                promo_category_id: val.parent_category_id,
                promo_date : val.created_at,
                promo_obj : val,
                offer_end_date : (val.offer_end_date) ? new Date(val.offer_end_date.replace(/-/g,"/")).toISOString().slice(0,10) : null,
                is_discount : $scope.checkIsDiscountExist(val),
                discount_text : $scope.getDiscountText(val),
                discount_remain : val.max_amount - val.used_amount,
                discount_remain_percentage : Math.round(((val.max_amount - val.used_amount) /val.max_amount) * 100),
                discount_claimed: val.used_amount,
              });

              if($scope.all){
                if(val.parent_category_name == 'Promotions'){
                  $scope.promo_count++;
                }

                if(val.parent_category_name == 'Events'){
                  $scope.events_count++;
                }
              }

            });

            if($scope.all){
              $scope.total_promotions = $scope.filter_results.length;
            }
            $scope.all = false;
            $scope.fr_count = $scope.filter_results.length;

            if ($scope.filter_results.length > 8) {
              $scope.viewAllPromotionsButton = true;
              $scope.allPromotions = angular.copy($scope.filter_results);
              $scope.filter_results = $scope.filter_results.slice(0, 8)
            }
            $scope.loading_tab_view = false;

          })
          .catch(function (data) {
            console.log(data);
          });
      };

      $scope.getYoutubeIFrame = function(video){
        return 'https://www.youtube.com/embed/' + video;
      };

      $scope.selectedVideo = '';
      $scope.setVideoId = function(video){
        $scope.selectedVideo = video;
      };

      $scope.selectedImage = '';
      $scope.setImage = function(image){
        $scope.selectedImage = image;
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

      $scope.toggle = false;

      $scope.viewAll = function (type) {

        if (type == 'promotions') {
          $scope.viewAllPromotionsButton = false;
          $scope.filter_results = $scope.allPromotions;
        } else {
          $scope.viewAllGalleryButton = false;
          $scope.promo_images = $scope.allGallery;
        }
        return true;
      };

    })

})(window.angular);