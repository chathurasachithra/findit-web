/*
 * Author       : Buddhika Herath
 * Contact      : (9471) 3132 621
 * Email        : b.prabuddha@gmail.com
 * LinkedIn     : https://www.linkedin.com/in/buddhika-herath-609638103/
 * Website      : http://buddhikaherath.co.nf/
 */
(function () {
    'use strict';

    angular
        .module('app')
        .constant('ENV', {
            base_url                    : 'http://api.findit.lk/api/v1/',  //http://findit.local //'http://findit.local/api/v1/'
            logo_path                   : 'http://api.findit.lk/images/companies/',
            logo_thumb_path             : 'http://api.findit.lk/images/companies-thumb/',
            promotion_image_path        : 'http://api.findit.lk/images/promotions/',
            promotion_thumb_image_path  : 'http://api.findit.lk/images/promotions-thumb/',
            company_promo_path          : 'http://api.findit.lk/images/company-promo/',
            company_banner_path         : 'http://api.findit.lk/images/banners/',
            home_banner_path            : 'http://api.findit.lk/images/home/',
            env             : 'development'
        });
})()

