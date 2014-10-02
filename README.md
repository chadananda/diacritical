# Diacriṭícál
_Bahá’í Term Suggestion Script_

### Home Page: http://chadananda.github.io/diacritical




### The big idea:

Formatting Bahá’í electronic texts is a pain. Even the best quality electronic texts from the BWC contain thousands of errors. And by far the most common type of error is the darned diacritcals on all those transliterated Arabic and Persian terms.

This project attempts to address that fundamental problem by providing an automated replacement and suggestion system which can utilize a dictionary of authoritatively spelled terms.

#### Some Examples:

See how many errors the current dictionary can find in some reference.bahai.org books:
 
* http://chadananda.github.io/diacritical/html/report-Dawn-Breakers.html
* http://chadananda.github.io/diacritical/html/report-GPB.html
* http://chadananda.github.io/diacritical/html/report-Advent.html
* http://chadananda.github.io/diacritical/html/report-Gleanings.html
* http://chadananda.github.io/diacritical/html/report-Kitab-i-Iqan.html
* http://chadananda.github.io/diacritical/html/report-PDC.html
* http://chadananda.github.io/diacritical/html/report-WOB.html
* http://chadananda.github.io/diacritical/html/report-Summons.html



### Get involved, help build the dictionary!

The project to actually gather that massive correct dictionary is over here: https://github.com/chadananda/accents

To get involved, simply contact me at <chadananda@gmail.com>. I'll set up user credentials for you which allow you to log in and start adding words to the dictionary.

A JSON object containing the current wordlist can be pulled down using this REST URL:

  * http://diacritics.iriscouch.com/accents/_design/terms_list/_view/terms_list



### Using the Library

After adding diacritical.js to a web page simply provide a dictionary of UTF-8 terms as a Javascript array. For example:

```Javascript
var diacrital = New Diacritical();
var dictionary = [
    'Abu’l-Faḍl',
    'Aḥmad',
    'Aḥmad',
    'Aḥmad',
    'Ahmad',
    'aḥmad',
    'Aḥsanu’l-Qiṣaṣ',
    'Ba_ghdád',
    'Baqí‘',
    'Báqir-i-Ra_shtí',
    'Dalílu’l-Mutaḥayyirín',
    'Fatḥ-‘Alí',
];
var bad_text = "This is some sample text with bad diacriticals: Ahmad, Baghdad, "+
  "Fath-Ali and Baqi. Notice that the dictionary uses _sh to indicate an "+
  "underscore. Also, notice that the dictionary is case sensitive but the "+
  "replacement system is still smart enough to deal with all-caps like AHMAD. "+
  "Moreover, the dictionary ideally should have multiple versions of each word in "+
  "order to help weed out misspellings. (Notice one of the spellings of Ahmad is "+
  "wrong in the dictionary but the word is still corrected correctly.)";

var fixed_text = diacritical.replaceText(bad_text, dictionary);
```

### Using the Library as a node module

Diacritical is now a node module so you can simply install it in your node project with:

```
npm install diacritical
```

Then instantiate a new diacritical object with:

```
var Diacritical = require('diacritical'),
    diacritical = new Diacritical;
```

You'll have to fetch a wordlist like this:

```
  var accents_url = 'http://diacritics.iriscouch.com/accents/_design/terms_list/_view/terms_list';
  var dictionary = [];
  request(accents_url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      for (i = 0; i < data.rows.length; ++i) dictionary.push(data.rows[i]['key']);    
    } else {
      console.log("Error Response: " + error);
    }
  });
```    
    

### Test harness: http://chadananda.github.io/diacritical/tests


