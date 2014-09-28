// Diacritical Suggest
// Add this to your HTML file to highlight misspelled words and generate a spelling report
//




$(function(){
  //     //chadananda.github.io/diacritical/suggest.css
  //     //chadananda.github.io/diacritical/suggest.js
  var css_url = '//dl.dropboxusercontent.com/u/382588/JS/Projects/diacritical/suggest.css';
  var diacritical_url =  '//dl.dropboxusercontent.com/u/382588/JS/Projects/diacritical/diacritical.js';
  var accents_url = '//diacritics.iriscouch.com/accents/_design/terms_list/_view/terms_list';

  // fetch style sheet
  $('head').append('<link rel="stylesheet" type="text/css" href="'+ css_url +'">');

  console.log("Added style sheet");

  // fetch diacritics library
  //$.getScript(diacritical_url, function(){
    var diacritical = new Diacritical();

    //console.log('Got diacritical.js');

    $.getJSON( accents_url, function( data ) {
      var total = data.total_rows;
      var list = data.rows;
      var wordlist = [];
      $.each(data.rows, function(index) {
        wordlist.push(data.rows[index]['key']);
      });

      console.log('Loaded wordlist, '+ wordlist.length + ' items');

      // replace out each block but keep building the same report
      var html;
      var report = {};
      $('h1,h2,h3,h4,h5,p,blockquote,div').each(function() {
        if ($(this).text().trim().length > 3) {
          //console.log("Processing block length: "+ $(this).text().length);
          $(this).html(diacritical.replaceText($(this).html(), wordlist, 'showall', report));
        }
      });
      console.log(report);

      var unknowns ='', corrected ='', replacements ='', report_html ='';
      if (report.unknowns.length) unknowns = report.unknowns.length +' Unknowns: '+ JSON.stringify(report.unknowns, undefined, 2) +"\n";
      if (report.corrected.length) corrected = report.corrected.length +' Corrected: '+ JSON.stringify(report.corrected, undefined, 2) +"\n";
      if (report.replacements) replacements = ' Replacement Suggestions: '+
        jQuery('<div />').text(JSON.stringify(report.replacements, undefined, 2)).html();

      report_html = "<div id='report_output'>"+
        "<h2> Dictionary refreshed with " + wordlist.length + " terms </h2>"+
        "<pre>" + unknowns + corrected + replacements + '</pre>'+
        '</div>';

      $('body').append(report_html);

    });
 // });
});

