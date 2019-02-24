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
            base_url                    : 'http://exampleapi.dev/api/v1/',
            logo_path                   : 'http://exampleapi.dev/images/companies/',
            promotion_image_path        : 'http://exampleapi.dev/images/promotions/',
            env             : 'development'
        });
})()