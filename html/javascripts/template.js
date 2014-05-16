    $(function(){
      var accents_url = '//diacritics.iriscouch.com/accents/_design/terms_list/_view/terms_list';
      var wordlist = [];
      $('#dictionary_load').html('<span class="blink">Loading latest dictionary...</span> <img src="images/24px-spinner-0645ad.gif">');
      $.getJSON( accents_url, function( data ) {
        var total = data.total_rows;
        var list = data.rows;
        $.each(data.rows, function(index) {
          wordlist.push(data.rows[index]['key']);
        });
        $('#dictionary_load').html("Current dictionary loaded with <b><i>"+ wordlist.length + "</i></b> items.");
        var report = {}; // must pass in an object to get a report back
        var text = $('#textinput').html();
        //var html = accents_replace(text, wordlist, report);

        // process text
        var diacritical = new Diacritical();
        var fixed_text = diacritical.replaceText(text, wordlist, 'showall', report);
        var suggested_text = diacritical.replaceText(text, wordlist, 'suggest');
        var suggested_html = "\n\n<textarea class='suggest_text'>"+ suggested_text + "</textarea>";
        var htmlreport = " <h3>JSON Report:</h3> <pre class='report'>" + JSON.stringify(report, undefined, 2) + "</pre> ";
        var html = fixed_text + htmlreport + suggested_html;


        var report_html = "<h2> Total Confirmed Corrections: <mark class='term correction'> &nbsp;" +
          report.correctedTotal + "&nbsp;</mark></h2><h2> Questionable terms: <mark class='term unknown'>&nbsp;" +
          report.unknownTotal +"&nbsp;</mark></h2";
        $('#report_output div.content').html(html);
        $('#report_output div.report').html(report_html);
        $('#report_output').removeClass('hidden');

        $('#hidden-cleanup').remove
      });
    });