# Diacritical
_A Transliteration-Dictionary Based Suggestion Library_

### Example: http://chadananda.github.io/diacritical
### Test harness: http://chadananda.github.io/diacritical/tests


### The big idea:

Formatting Bahá’í electronic texts is a pain. Even the best quality electronic texts from the BWC contain thousands of errors. And by far the most common type of error is the darned diacritcals on all those transliterated Arabic and Persian terms.

This project attempts to address that fundamental problem by providing an automated replacement and suggestion system which can utilize a dictionary of authoritatively spelled terms.  

The project to actually gather that massive correct dictionary is over here:

#### https://github.com/chadananda/accents


### Get involved, help build the dictionary!

To get involved, simply contact me at <chadananda@gmail.com>. I'll set up user credentials for you which allow you to log in and start adding words to the dictionary. 

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
var bad_text = "This is some sample text with bad diacritcals: Ahmad, Baghdad, "+
  "Fath-Ali and Baqi. Notice that the dictionary uses _sh to indicate an "+
  "underscore. Also, notice that the dictionary is case sensitive but the "+
  "replacement system is still smart enough to deal with all-caps like AHMAD. "+
  "Also, the dictionary ideally should have multiple versions of each word in "+
  "order to help weed out misspellings. (Notice one of the spellings of Ahmad is "+
  "wrong in the dictionary but the word is still corrected correctly.";
  
var fixed_text = diacritical.replaceText(bad_text, dictionary);
```


