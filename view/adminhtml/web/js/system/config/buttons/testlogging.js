/**
 * Copyright © MageWorx. All rights reserved.
 * See LICENSE.txt for license details.
 */
 define([
    'jquery',
    'underscore',
    'mage/translate'
], function (jQuery, _, __) {

    function Button(config)
    {
        this.submitUrl = config.submitUrl;

        this.processAction = function () {

            var params = {};

            var wrapper = jQuery('#commerce365-configuration-testlogging-indicator'),
                base = this,
                result;

            new Ajax.Request(this.submitUrl, {
                parameters: params,
                loaderArea: false,
                asynchronous: true,
                onCreate: function () {
                    wrapper.find('.check_success').hide();
                    wrapper.find('.check_error').hide();
                    wrapper.find('.check_processing').show();
                    jQuery('#check_message_span').text('');
                },
                onSuccess: function (response) {
                    var responseJSON = response.responseJSON,
                        resultText = '';
                    result = responseJSON;
                    wrapper.find('.check_processing').hide();
                    if (typeof responseJSON.success == 'undefined' || !responseJSON.success) {
                        resultText = __('Error Message: ') + responseJSON.error_message;
                        wrapper.find('.check_success').hide();
                        wrapper.find('.check_error').show();
                    } else {
                        resultText = __('Success');
                        if (typeof responseJSON.message != 'undefined') {
                            resultText = responseJSON.message;
                        }
                        wrapper.find('.check_error').hide();
                        wrapper.find('.check_success').show();
                    }
                    jQuery('#test_message_span').text(resultText);
                }
            });
        }
    }

    return function (config, node) {
        var button = new Button(config);
        node.addEventListener('click', function (e) {
            button.processAction();
        });
    };
});
