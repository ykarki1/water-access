(function ($) {

$(document).ready(function() {

  // Expression to check for absolute internal links.
  var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");

  // Attach onclick event to document only and catch clicks on all elements.
  $(document.body).click(function(event) {
    // Catch the closest surrounding link of a clicked element.
    $(event.target).closest("a,area").each(function() {
      // Fetches settings.
      var os_ga = Drupal.settings.os_ga;
      // Checks for download links (including query string)
      var isDownload = new RegExp("\\.(" + os_ga.trackDownloadExtensions + ")(\\?.*)?$", "i");

      // Is the clicked URL internal?
      if (isInternal.test(this.href)) {
        // Is download tracking activated and the file extension configured for
    // download tracking?
        if (os_ga.trackDownload && isDownload.test(this.href)) {
          // Download link clicked.
          var extension = isDownload.exec(this.href);
          _gaq.push(["_trackEvent", "Downloads", extension[1].toUpperCase(), this.href.replace(isInternal, '')]);
        }
      }
      else {
        if (os_ga.trackMailto && $(this).is("a[href^='mailto:'],area[href^='mailto:']")) {
          // Mailto link clicked.
          _gaq.push(["_trackEvent", "Mails", "Click", this.href.substring(7)]);
        }
        else if (os_ga.trackOutbound && this.href.match(/^\w+:\/\//i)) {
        // External link clicked.
        _gaq.push(["_trackEvent", "Outbound links", "Click", this.href]);
        }
      }
      // Is this link in a main menu?
      if (os_ga.trackNavigation) {
      if ($(this).closest('#block-os-secondary-menu').length) {
        var navType = "Secondary Nav";
        }
        if ($(this).closest('#block-os-primary-menu').length) {
          var navType = "Primary Nav";
        }
        if (navType) {
          _gaq.push(["_trackEvent", navType, "Click", this.href]);
        }
      }
    });
  });
});

})(jQuery);
;

(function ($) {

  /**
   * When the user is on a mobile device we need to disable the super fish menu.
   */
  Drupal.behaviors.RepsponsiveMenu = {
    attach: function (context) {

      // see https://stackoverflow.com/a/13819253/847651.
      var isMobile = {
        Android: function() {
          return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
          return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
          return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
          return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
        },
        any: function() {
          return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
      };

      if (isMobile.any()) {
        // On mobile, don't call the menu open functionality.
        $.fn.showSuperfishUl = function() {}
      }
    }
  };

})(jQuery);
;
/**
 * Add a dismiss "X" link to all drupal messages.
 */

(function ($) {

  Drupal.behaviors.dismiss = {
    attach: function(context) {

      // Append the Dismiss button to each message box.
      $('.messages').each(function(){
        $(this).prepend('<a class="dismiss">X</a>');
      });

      // When the Dismiss button is clicked hide this set of messages.
      $('.dismiss').click(function(){
        $(this).parent().hide('fast');
      });

    }
  }

})(jQuery);
;
window.tinyMCEPreInit = {"base":"\/profiles\/openscholar\/libraries\/tinymce\/jscripts\/tiny_mce","suffix":"","query":""};;
