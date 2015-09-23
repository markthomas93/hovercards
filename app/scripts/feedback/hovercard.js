var $ = require('jquery');

var EXTENSION_ID = chrome.i18n.getMessage('@@extension_id');

var NameSpace = '.' + EXTENSION_ID;

var Cleanup = 'cleanup' + NameSpace;
var Click   = 'click' + NameSpace;

var feedback_url;
var last_interacted_feedback_url;
var show_feedback = false;

$.fn.extend({
    addFeedback: function(obj) {
        if (!show_feedback) {
            return this;
        }
        $('<div class="feedback-link"></div>')
            .append('<a href="' + feedback_url + '" target="_blank"><img src="' + chrome.extension.getURL('images/logo-128.png') + '"><div>Hey you! Can you give me feedback?</div></a>')
            .append('<span></span>')
            .on('click', function(e) {
                e.stopPropagation();
                last_interacted_feedback_url = feedback_url;
                chrome.storage.sync.set({ last_interacted_feedback_url: last_interacted_feedback_url });
                show_feedback = false;
                obj.trigger(Cleanup);
            })
            .appendTo(this);
        return this;
    },
    // TODO Get rid of this crap
    positionFeedback: function() {
        this.find('.feedback-link').toggleClass('feedback-link-bottom', this.hasClass(EXTENSION_ID + '-hovercard-from-bottom'));
        return this;
    }
});

chrome.storage.sync.get(['feedback_url', 'last_interacted_feedback_url'], function(obj) {
    chrome.storage.onChanged.addListener(function(changes, area_name) {
        if (area_name !== 'sync' || !('feedback_url' in changes || 'last_interacted_feedback_url' in changes)) {
            return;
        }
        feedback_url = obj.feedback_url;
        last_interacted_feedback_url = obj.last_interacted_feedback_url;
        show_feedback = feedback_url && feedback_url.length && feedback_url !== last_interacted_feedback_url;
    });
    feedback_url = obj.feedback_url;
    last_interacted_feedback_url = obj.last_interacted_feedback_url;
    show_feedback = feedback_url && feedback_url.length && feedback_url !== last_interacted_feedback_url;
});
