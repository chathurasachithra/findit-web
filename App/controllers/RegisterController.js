(function (angular) {
    'use strict';

    angular.module('app')

        .controller('RegisterController', function ($scope, $location,  $timeout, $rootScope,categoryService, companyService, ENV, $route, CustomerService) {

            $scope.sucess = false;
            $scope.error = false;


            var vistitor_selected_interests = [];

            categoryService.getAllPrentCategories()
                .then(function (data) {
                    var p_cat = data.parent_categories;

                    $rootScope.parent_categories = {};

                    angular.forEach(p_cat, function (val, key) {
                        switch (val.parent_category_name) {
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
                    getCompanyCategories();
                });
            
                function getCompanyCategories(){
                    categoryService.getCategories({parent_category_id : $rootScope.parent_categories.promotions_id})
                        .then(function (data) {
                            $scope.categories = data.categories;
                        })
                }


            $scope.onSubmit = false;
            $scope.registerAsCompany = function(){
              $scope.onSubmit = true;
              if($scope.name && $scope.tel1 && $scope.c_cat) {
                  if ($scope.from_company.$valid) {
                      $scope.onSubmit = true;
                      companyService.addNewCompany({
                          'name': $scope.name,
                          'desc': $scope.desc ? $scope.desc : null,
                          'tel1': $scope.tel1 ? $scope.tel1 : null,
                          'tel2': $scope.tel2 ? $scope.tel2 : null,
                          'address': $scope.address ? $scope.address : null,
                          'email': $scope.email ? $scope.email : null,
                          'website': $scope.website ? $scope.website : null,
                          'fb': $scope.fb ? $scope.fb : null,
                          'twitter': $scope.twitter ? $scope.twitter : null,
                          'linkedin': $scope.linkedin ? $scope.linkedin : null,
                          'youtube': $scope.youtube ? $scope.youtube : null,
                          'instagram': $scope.instagram ? $scope.instagram : null,
                          'company_logo': $scope.image ? $scope.image.name : null,
                          'category_id': $scope.c_cat,
                          'customer_portal' : true
                      }).then(function (data) {
                          console.log(data);
                          $scope.onSubmit = false;
                          $scope.sucess = true;
                          $scope.success_message = "Thank you for register with us. Request successfully recorded.";
                          upload_image(data.company.company_id);
                      });
                  } else {
                      $scope.error = true;
                      $scope.onSubmit = false;
                      $scope.error_message = "Please correct following errors";
                      $timeout(function () {
                          $scope.error = false;
                      }, 3000);
                  }
              }else{
                  $scope.from_company.comp_cat.$dirty = true;
                  $scope.from_company.name.$dirty = true;
                  $scope.from_company.contact_person_tel_no.$dirty = true;
                  $scope.from_company.image.$dirty = true;
                  $scope.error = true;
                  $scope.error_message = "Please correct following errors";
                  $scope.onSubmit = false;
                  $timeout(function () {
                      $scope.error = false;
                  }, 3000);
              }

            };

            $scope.registerAsVisitor    = function () {

                if($scope.first_name && $scope.second_name && $scope.visitor_email && $scope.province) {
                    if ($scope.from_visitor.$valid) {

                            var param = {
                                'first_name'        : $scope.first_name,
                                'second_name'       : $scope.second_name,
                                'age'               : $scope.age,
                                'province'          : $scope.province,
                                'mobile_no'         : $scope.visitor_tel1,
                                'land_no'           : $scope.visitor_tel2 ,
                                'email'             : $scope.visitor_email,
                                'gender'            : $scope.male
                            };
                            CustomerService.storeCustomer(param)
                                .then(function (data) {
                                    $scope.sucess = true;
                                    $scope.success_message = "Successfully added";
                                    $timeout(function() {
                                        $scope.sucess = false;
                                        $scope.resetVisitorForm();
                                        $route.reload();
                                    }, 3000);

                                }).catch(function () {
                                $scope.error = true;
                                $scope.error_message = "Something went wrong while adding customer";
                                $timeout(function () {
                                    $scope.error = false;
                                    $route.reload();
                                }, 3000);

                            });
                    }
                    else{
                        $scope.error = true;
                        $scope.error_message = "Please correct following errors";
                        $timeout(function () {
                            $scope.error = false;
                        }, 3000);
                    }
                }else{
                    $scope.from_visitor.first_name.$dirty = true;
                    $scope.from_visitor.second_name.$dirty = true;
                    $scope.from_visitor.age.$dirty = true;
                    $scope.from_visitor.visitor_tel1.$dirty = true;
                    $scope.from_visitor.visitor_email.$dirty = true;
                    $scope.from_visitor.visitor_tel2.$dirty = true;
                    $scope.from_visitor.province.$dirty = true;

                    $scope.error = true;
                    $scope.error_message = "Please correct following errors";
                    $timeout(function () {
                        $scope.error = false;
                    }, 3000);
                }
            };

            function storeCustomerInterests(customer_id){
                var success_count = 0;
                angular.forEach(vistitor_selected_interests, function (interst) {
                    var param = {
                        'customer_id'       : customer_id,
                        'category_id'       : interst
                    };
                    CustomerService.storeCustomerInterests(param)
                        .then(function () {
                            success_count++;
                        }).catch(function () {
                        $scope.error = true;
                        $scope.error_message = "Something went wrong while adding customer interests";
                        $timeout(function () {
                            $scope.error = false;
                            $route.reload();
                        }, 3000);
                        }).finally(function () {
                        if(success_count == vistitor_selected_interests.length){
                            $scope.sucess = true;
                            $scope.success_message = "Successfully added";
                            $timeout(function() {
                                $scope.sucess = false;
                                $scope.resetVisitorForm();
                                $route.reload();
                            }, 3000);
                        }
                    });
                });
            }

            $scope.resetVisitorForm     = function () {
                $scope.from_visitor.first_name.$dirty = false;
                $scope.from_visitor.second_name.$dirty = false;
                $scope.from_visitor.age.$dirty = false;
                $scope.from_visitor.visitor_tel1.$dirty = false;
                $scope.from_visitor.visitor_email.$dirty = false;
                $scope.from_visitor.visitor_tel2.$dirty = false;
                $scope.from_visitor.province.$dirty = false;

                $scope.tick = false;
                vistitor_selected_interests= [];

                $scope.first_name       = '';
                $scope.second_name      = '';
                $scope.age              = '';
                $scope.visitor_email    = '';
                $scope.visitor_tel1     = '';
                $scope.visitor_tel2     = '';
                $scope.province         = '';
                $route.reload();
                $scope.male = true;
            };

            $scope.addInterest          = function (cid, tick) {
                if(tick){
                    vistitor_selected_interests.push(cid);
                }
                else{
                    vistitor_selected_interests.splice(vistitor_selected_interests.indexOf(cid), 1);
                }
            };

            function upload_image(company_id){
                var data ={
                    company_id : company_id
                };
                if ($scope.image) {
                    companyService.uploadCompanyLogo($scope.image, data).then(function (data) {
                        $scope.sucess = true;
                        $scope.success_message = "Thank you for register with us. Request successfully recorded.";
                        $timeout(function() {
                            $scope.sucess = false;
                        }, 3000);
                        $scope.resetAll();
                    }).catch(function (data) {

                    });
                } else {
                    $scope.sucess = true;
                    $scope.success_message = "Thank you for register with us. Request successfully recorded.";
                    $timeout(function() {
                        $scope.sucess = false;
                    }, 3000);
                    $scope.resetAll();
                }

            }

            $scope.resetAll = function(){
                $scope.from_company.comp_cat.$dirty = false;
                $scope.from_company.comp_cat.$invalid = false;
                $scope.from_company.name.$dirty = false;
                $scope.from_company.image.$dirty = false;
                $scope.from_company.name.$invalid = false;
                $scope.from_company.image.$invalid = false;
                $scope.from_company.contact_person_tel_no.$dirty = false;
                $scope.from_company.contact_person_tel_no.$invalid = false;
                $scope.from_company.land_no.$dirty = false;
                $scope.from_company.land_no.$invalid = false;
                $scope.c_cat = "";
                $scope.name = "";
                $scope.desc = "";
                $scope.tel1 = "";
                $scope.tel2 = "";
                $scope.tel2 = "";
                $scope.address = "";
                $scope.email = "";
                $scope.website = "";
                $scope.fb = "";
                $scope.twitter = "";
                $scope.linkedin = "";
                $scope.youtube = "";
                $scope.image = null;
                $route.reload();
            }


        })

})(window.angular);