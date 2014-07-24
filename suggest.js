// Diacritical Suggest
// Add this to your HTML file to highlight misspelled words and generate a spelling report
//


$(function(){
  //     //chadananda.github.io/diacritical/suggest.css
  //     //chadananda.github.io/diacritical/suggest.js
  var css_url = 'https://dl.dropboxusercontent.com/u/382588/JS/Projects/diacritical/suggest.css';
  var js_url =  'https://dl.dropboxusercontent.com/u/382588/JS/Projects/diacritical/diacritical.js';
  var accents_url = '//diacritics.iriscouch.com/accents/_design/terms_list/_view/terms_list';

  // fetch style sheet
  $('head').append('<link rel="stylesheet" type="text/css" href="'+ css_url +'">');

  // fetch diacritics library
  $.getScript(js_url, function(){

    // fetch words list
    var wordlist = [];

    var report_template = (function () {/*
      <div id="report_output" class="hidden">
          <div class="legend">
            <mark class="term correct">Verified Correct</mark> <br>
            <mark class="term misspelled">Misspelled</mark> <br>
            <mark class="term correction">Suggestion</mark> <br>
            <mark class="term unknown">Unrecognized</mark>
          </div>
          <div class="report"></div>
      </div>
    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
    //$('body').append(report_template);



    //$('body').prepend(report_summary);
    $.getJSON( accents_url, function( data ) {
      var total = data.total_rows;
      var list = data.rows;
      $.each(data.rows, function(index) {
        wordlist.push(data.rows[index]['key']);
      });
      // $('#suggest_summary').html("Current dictionary loaded with <b><i>"+ wordlist.length + "</i></b> items.");

      // process text
      var diacritical = new Diacritical();



      /*


      if ($('#diacritics_suggest').length) text = $('#diacritics_suggest').html();
      else text = $('body').html();

      var report = {}; // must pass in an object to get a report back
      var html = diacritical.replaceText(text, wordlist, 'showall', report);

      if ($('#diacritics_suggest').length) $('#diacritics_suggest').html(html);
      else $('body').html(html);
      */

      // replace out each block but keep building the same report
      var html;
      var report = {};
      $('h1,h2,h3,h4,h5,p,blockquote,div').each(function() {
        html = $(this).html();
        if (html.length > 3) {
          html = diacritical.replaceText(html, wordlist, 'showall', report);
          $(this).html(html);
        }
      });


      var report_html = "<hr> <div id='report_output'>"+
        "<h2> Dictionary refreshed with " + wordlist.length + " terms </h2>"+
        (report.unknowns.length ? '<pre> '+ report.unknowns.length +' Unknowns: '+ JSON.stringify(report.unknowns, undefined, 2) +'</pre>':'') +
        (report.corrected.length ? '<pre> '+ report.corrected.length +' Corrected: '+ JSON.stringify(report.corrected, undefined, 2) +'</pre>':'') +
        (report.replacements.length ? '<pre> '+ report.replacements.length +' Replacement Suggestions: '+ JSON.stringify(report.replacements, undefined, 2) +'</pre>':'') +
        '</div>';

      //$('#report_output .report').html(report_html);
      $('body').append(report_html);

    });
  });
});

