/**
 * Abbreviator jQuery Plugin (jQuery >= 1.2.x)
 *
 * Usage:
 *
 *   $('#mydiv').abbrev(); // Autofit mydiv's innerHTML content horizontally
 *
 * This work is distributed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 */
(function($) {
  var $tmpDiv;
  var $tmpSpan;
  
  $(function() {
    // NOTE: We have to use a <span> inside a max-width <div> for IE6
    $tmpDiv = $('\
      <div style="width:9999px; left:-9999px; top:-9999px; display:block; position: absolute">\
        <span></span>\
      </div>'
    ).appendTo('body');
    $tmpSpan = $tmpDiv.children();
  });

  $.fn.abbrev = function() {
    return $(this).each(function() {
      var $this = $(this);

      // Grab unaltered content FIRST
      var content = $this.html();

      // Append our tmp div to the container element we're about
      // to abbreviate, so that it inherits the containers CSS properties
      // (font, padding, etc.)
      $tmpDiv.appendTo(this);

      // Take one off for when the content exactly matches container
      // In Firefox 3 and Safari 3 the content will wrap without this
      var containerWidth = $this.width() - 1;
      var contentWidth = $tmpSpan.html(content).width();

      // If the content fits inside the container, then skip
      // to the next element

      if (contentWidth <= containerWidth) {
        $tmpDiv.appendTo('body');
        return;
      }

      // Instead of just removing characters one-by-one until the content
      // fits (slow), we estimate a good starting place by taking the %
      // covered in pixel space and shorten the string by that amount.

      var coverage = containerWidth / contentWidth;
      var l = content.length;

      var abbrevContent = content.substr(0, parseInt(l * coverage, 10));

      while ($tmpSpan.html(ellipsifyString(abbrevContent)).width() >= containerWidth) {
        abbrevContent = abbrevContent.substring(0, abbrevContent.length - 1);
      }

      // Return our tmp span back to the <body> element; otherwise it'll
      // be destroyed in the line below ...
      $tmpDiv.appendTo('body');

      $this.html(abbrString(ellipsifyString(abbrevContent), content));
    });
  };

  // Private functions

  function ellipsifyString(s) {
    return s + '&hellip;';
  }

  function abbrString(s, full) {
    return '<abbr title="' + full + '">' + s + '</abbr>';
  }
})(jQuery);