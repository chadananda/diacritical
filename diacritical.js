function Diacritical() {}

Diacritical.prototype.prepareDictionary = function(wordList) {
  // exit is this is already a prepared dictionary object
  if (('terms' in wordList) && ('total' in wordList)) return wordList;
  var self = this,
      dictionary = {terms: {}, total: 0};
  // remove duplicates keeing the verified or most frequent version of each term
  var terms = removeDuplicateTerms(wordList);
  // now add each word to the replacelist. If word has known mispellings, add each seperately
  terms.forEach(function(term) {
    addToDictionary(term.base, term, dictionary);
    if (term.known_mispellings.length>0) term.known_mispellings.forEach(function(known_misspelling) {
      addToDictionary(self.term_strip_alpha(known_misspelling), term, dictionary);
    });
  });
  return dictionary;

  // =============================

  function addToDictionary(base, term, replList) {
    var lookup = base.toLowerCase();
    // here is where we want to add in our new fields
    // [ref], original, definition, [alternates], [known_mispellings] and verified
    var obj = {
      'glyph'     : term.word,
      'html'      : self.glyph2HTML(term.word),
      'stripped'  : base,
      'lookup'    : lookup,
      'ansi'      : self.glyph2ANSI(term.word),
      'ref'       : term.ref,
      'original'  : term.original,
      'definition': term.definition,
      'verified'  : term.verified,
      'alternates': term.alternates
    };
    // add to list
    if (!replList.terms[lookup]) replList.terms[lookup] = {};
    if (!replList.terms[lookup][base]) {
      replList.terms[lookup][base] = obj;
      replList.total++;
    }
    //console.log(obj);
  }

  // ----------------------------------------
  function removeDuplicateTerms(words) {
    // given an array of terms, return a de-duplicated array
    // but in this case, it is unique to the base (stripped) version
    // and the one unique version returned for each base is the most frequent one
    // create an obect list by stripped base version and count of full version
    var is_accents_json = ('offset' in words);
    if (is_accents_json) words = words.rows;
    var word ='', stripped ='', list= {}, word_data = {};

    words.forEach(function(word) {
      if (is_accents_json) {
        word_data = word.value;
        word = word.key;
        word_data.word = word;
        word_data.base = self.term_strip_alpha(word);
      } else {
        word_data = {word: word, ref:[], original: '', definition:'', alternates:[], known_mispellings:[], verified: false, base: self.term_strip_alpha(word)};
      }
      var base = word_data.base;
      if (!(base in list)) list[base] = {};
      if (word in list[base]) { // increment existing item
        list[base][word]['count']++;
        // concat items from this word onto the cumulative list
        list[base][word]['data']['ref'] = list[base][word]['data']['ref'].concat(word_data.ref);
        list[base][word]['data']['ref'] = uniqueArray(list[base][word]['data']['ref']);
        list[base][word]['data']['original'] =  word_data.original?word_data.original:list[base][word]['data']['original'];
        list[base][word]['data']['definition'] =  word_data.definition?word_data.definition:list[base][word]['data']['definition'];
        list[base][word]['data']['alternates'] = list[base][word]['data']['alternates'].concat(word_data.alternates);
        list[base][word]['data']['known_mispellings'] = list[base][word]['data']['known_mispellings'].concat(word_data.known_mispellings);
        if (word_data.verified) list[base][word]['verified'] = true;
      } else { // create new entry
        list[base][word] = {word: word, count: 1};
        list[base][word]['data'] = word_data;
        list[base][word].verified = list[base][word].verified || word_data.verified;

      }
    });

    // iterate through each list and locate the version with the max, create newlist
    var newList = [], max, topword, has_verified;
    words = {};
    for (var index in list) {
      words = list[index];
      max=0; topword=''; has_verified=false;
      for (var index2 in words) {
        word = words[index2];
        if ((word.count>max && !has_verified) || word.verified) {
          topword = word.word;
          max = word.count;
          has_verified = true;
        }
      }
       //newList.push(topword);
       newList.push(list[index][topword]['data']);
    }
    return newList;
  }

  function uniqueArray(a) {
    return a.sort().filter(function(item, pos) {
        return !pos || item != a[pos - 1];
    })
  }
};

Diacritical.prototype.term_strip_alpha = function(word) {
  return word
    // replace accented vowels
    .replace(/\á/g, 'a')
    .replace(/\í/g, 'i')
    .replace(/\ú/g, 'u')
    .replace(/\Á/g, 'A')
    .replace(/\Í/g, 'I')
    .replace(/\Ú/g, 'U')

    // replace dot-unders with regular letters
    .replace(/\Ḥ/g, 'H')
    .replace(/\ḥ/g, 'h')
    .replace(/\Ḍ/g, 'D')
    .replace(/\ḍ/g, 'd')
    .replace(/\Ṭ/g, 'T')
    .replace(/\ṭ/g, 't')
    .replace(/\Ẓ/g, 'Z')
    .replace(/\ẓ/g, 'z')
    .replace(/\Ṣ/g, 'S')
    .replace(/\ṣ/g, 's')

    // remove all non alphas
    //.replace(/[^a-zA-Z\-]/g, '') // this fails with ansi characters, we'll have to re-think it

    // remove all HTML tags
    .replace(/<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>/g, '')

    // delete quotes and line unders
    .replace(/[\’\‘\'\`\_]/g, '')

    // delete dashes
    .replace(/[\-]/g, '')

    .trim(); // just in case
};

Diacritical.prototype.glyph2HTML = function(term) {
  term = term.replace(/_([sdztgkc][h])/ig, "<u>$1</u>");
  return term;
};

Diacritical.prototype.glyph2ANSI = function(term) {
  return term
    // remove underscores
    .replace(/_/g, '')
    // replace curly quotes with straight single quote
    .replace(/[\’\‘\`]/g, "'")
    // replace dot-unders with non-dotted
    .replace(/\Ḥ/g, 'H')
    .replace(/\ḥ/g, 'h')
    .replace(/\Ḍ/g, 'D')
    .replace(/\ḍ/g, 'd')
    .replace(/\Ṭ/g, 'T')
    .replace(/\ṭ/g, 't')
    .replace(/\Ẓ/g, 'Z')
    .replace(/\ẓ/g, 'z')
    .replace(/\Ṣ/g, 'S')
    .replace(/\ṣ/g, 's');
};

Diacritical.prototype.HTML2glyph = function(term) {
  // replace underscore
  term = term.replace(/\<u\>([sdztgkc][h]\<\/u\>)/ig, "_$1");
  // remove other tags
  term = term.replace(/(<([^>]+)>)/ig, '');
  // remove all non-legal character
  term = term.replace(/[^a-zA-ZáÁíÍúÚḤḥḌḍṬṭẒẓṢṣ\’\‘\_\-]/g, '');
  return term;
};

Diacritical.prototype.isPossibleTerm = function(token) {
  var self = this;

  // remove quotes from either side
  token = token.trim().replace(/^[\’\‘\'\`\-]/mg, '').replace(/[\’\‘\'\`\-]$/mg, '');

  // stripped down version must be at least two characters
  if (self.term_strip_alpha(token).length<2) return false;

  // word must contain some non-normal characters beside just one dash
  if (token.replace(/[a-zA-Z]/g, '') === '-') return false;

  // first, see if it has our special characters
  if (token.search(/[áÁíÍúÚḤḥḌḍṬṭẒẓṢṣ\’\‘\'\`\-]/g) === -1) return false;
  // next, remove illegal characters and see if anything changed
  //  first, remove any tags
  var src = token.replace(/(<([^>]+)>)/ig, '')
  // next, remove all not allowed characters
  var modified = src.replace(/[^a-zA-ZáÁíÍúÚḤḥḌḍṬṭẒẓṢṣ\’\‘\'\`\-]/g, '').replace(/[eo]/g, '');
  // if no change after deleting not allowed characters, this might be a term
  return (src === modified);
};

Diacritical.prototype.splitTokens = function(tokens, delimeter_regex_str) {
  var self = this,
      items = [],
      templist = [],
      token,
      newtoken;
  if (typeof tokens === 'string') tokens = splitStringIntoTokens(tokens, delimeter_regex_str);
  // loop through array and split each word further based on delimiter regex
  //console.log('Splitting array on delimiter: '+ delimeter_regex_str);
  tokens.forEach(function(token) {
    //console.log('Testing token: ', token);
    items = splitStringIntoTokens(token.word, delimeter_regex_str);
    //console.log('splitString: '+ token.word, items);
    if (items.length>0) { // the delimiter matched this word block, it needs to be split further
      //console.log('Word split: ', token, items);
      templist.push({word: '', prefix: token.prefix, suffix: ''}); // these will be cleaned up at the end
      items.forEach(function(newtoken)  { templist.push(newtoken);  });
      templist.push({word:'', prefix: '', suffix: token.suffix});
    } else templist.push(token);
  });
  // clean up a little and return
  return cleanTokenList(templist);

  // ========================================================

  function splitStringIntoTokens (str, delimeter_regex_str) {
    // split any string by delimeter with delimeter suffixed to each
    var tokens = [],
        prevIndex = 0,
        match,
        divider_regex;

    divider_regex = new RegExp(delimeter_regex_str, 'g');
    while (match = divider_regex.exec(str)) {
      tokens.push({
        word: str.substring(prevIndex, match.index),
        suffix: match[0],
        prefix: ''
      });
      prevIndex = divider_regex.lastIndex;
    }
    // if there is no final delimiter, the last bit is ignored. Grab it into a token
    if (prevIndex < str.length) tokens.push({word: str.substring(prevIndex, str.length), prefix:'', suffix:''});
    return tokens;
  }
  function cleanTokenList(tokens) {
    // remove empty tokens and merge tokens without words
    var prefix = '',
        shortList = [],
        loc;
    // merge empty tokens pushing prefixes and suffixes forward to next non-empty word
    tokens.forEach(function(token, index) {
      if (token.word.length>0) {
        token.prefix = prefix+token.prefix;
        shortList.push(token);
        prefix = '';
      } else prefix = prefix + token.prefix + token.suffix;
    });
    if (prefix.length>0) {
      if (shortList.length>0) shortList[shortList.length-1].suffix = shortList[shortList.length-1].suffix + prefix;
       else shortList.push({word:'', prefix: prefix, suffix:''});
    }
    tokens = JSON.parse(JSON.stringify(shortList));

    // TODO: these two should be one loop like /^[\s]+|^[^\s]+[\s]+/gm
    // move back beginning spaces or beginning non-space plus space
    if (tokens.length>2) for (var i=1; i<tokens.length; i++) {
      if (loc = /^([\s]+|^[^\s]+[\s]+)(.*)$/gm.exec(tokens[i].prefix)) {
        tokens[i-1].suffix += loc[1];
        tokens[i].prefix = loc[2];
      }
    }
    return tokens;
  }
}

Diacritical.prototype.tokenizeString = function(str, type) {
  if (!str) return [];
  if (str instanceof Array) return str; // already tokenized apparently

  var self = this,
      tt,
      regex;

  if (!type) type='html'; // we're not yet using this

  // split text up into tokens in several steps
  var tokens = str,
      delimiters = [
    // all html tags except <u>
    '</?(?!u)\\w+((\\s+\\w+(\\s*=\\s*(?:".*?"|\'.*?\'|[^\'">\\s]+))?)+\\s*|\\s*)/?>',
    // m-dashes
    '[\\—]|[-]{2,3}',
    // white space and remaining punctuation
    "[\\s\\,\\.\\!\\—\\?\\;\\:\\[\\]\\+\\=\\(\\)\\*\\&\\^\\%\\$\\#\\@\\~\\|]+?"
  ];
  delimiters.forEach(function(delimiter) {
    tokens = self.splitTokens(tokens, delimiter);
  });

  // loop through tokens and do some manual edge cleanup of words
  tokens.forEach(function(token, index) {
    // Split off any punctuation on the word and move it to the prefix and suffix - tag friendly
    regex = /^([^a-zA-ZáÁíÍúÚḤḥḌḍṬṭẒẓṢṣ\’\‘\'\`\<\>]*)(.*?)([^a-zA-ZáÁíÍúÚḤḥḌḍṬṭẒẓṢṣ\’\‘\'\`\<\>]*)$/mg;
    if (tt = regex.exec(token.word)) {
      token.prefix = token.prefix + tt[1];
      token.word = tt[2];
      token.suffix = tt[3] + token.suffix;
    }
    // Remove single quotes only if they are on both sides
    regex = /^([\’\‘\'\`])(.*)([\’\‘\'\`])$/mg;
    if ((tt = regex.exec(token.word)) && (tt[1].length>0 || tt[3].length>0)) {
      token.prefix = token.prefix + tt[1];
      token.word = tt[2];
      token.suffix = tt[3] + token.suffix;
    }

    // we need to move these into an array or language-specific

    // Remove 's and any other similar suffix
    if (tt = /^(.*)([\’\‘\'\`]s)$/img.exec(token.word)) {
      token.word = tt[1]; token.suffix = tt[2] + token.suffix;
    }


    // remove Romanian suffixes -- , 'ul'
    ['-ul','-ului','-ii','-uri','-ilor','-la','-ua','-ismului','-ismul','-smului','-i','ilor','lor','ului','atul'].forEach(function(suffix) {
      suffix = suffix.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // a regexp escape
      var re = new RegExp('^(.*)('+suffix+')$', 'img');
      if (tt = re.exec(token.word)) {
        token.word = tt[1]; token.suffix = tt[2] + token.suffix;
      }
    });

    // remove Romanian lower-case prefixes such as "din" or "la", "lui"
    var regex = /^([a-z]+)([\_\’\‘\'\`]*?[A-Z]+.*?)$/mg;
    if ((tt = regex.exec(token.word))  &&  (['din','la','lui','un'].indexOf(tt[1])>-1) ) {
      token.prefix = token.prefix + tt[1];
      token.word = tt[2];
    }


    // for each word, add some additional info
    token.info = tokenInfo(token);
    // replace list item with updated object
    tokens[index] = token;
  });

  return tokens;

  // =====================================
  function tokenInfo(token) {
    var info = {class: []};
    // now generate base version
    info.stripped = self.term_strip_alpha(token.word);
    // now determine if word is allcaps
    info.isAllCaps = (info.stripped === info.stripped.toUpperCase());

    //info.lookup = info.stripped.substr(0,3).toLowerCase();
    info.isPossibleTerm = self.isPossibleTerm(token.word);
    info.html = self.glyph2HTML(token.word);
    info.glyph = self.HTML2glyph(token.word);
    info.ansi = self.glyph2ANSI(info.glyph);
    info.soundex = self.soundex(info.ansi);


    //if (info.isPossibleTerm) info.class = ['term'];
    return info;
  }
};


Diacritical.prototype.replaceText = function(text, dictionary, options, report) {
  // simple interface with report being an optional object
  var self=this, tokens = [], result = '';
  if (!report) report = {};
  tokens = self.tokenizeString(text);
 //console.log('tokens',tokens);
  dictionary = self.prepareDictionary(dictionary);
 //console.log('dictionary',dictionary);
  self.addTermSuggestions(tokens, dictionary, report);
  //console.log('report', report);
  result = self.rebuildBlock(tokens, options);
 // console.log('result', result);
  return result;
}

// given an array of token objects, rebuild the original text block
// dictionary is optional just in case you want to pass in a raw string in place of tokens
Diacritical.prototype.rebuildBlock = function(tokens, options, dictionary) {
  var self = this;
  if (!(['clean', 'showall', 'suggest', 'original'].indexOf(options)>-1)) {
    //console.log("Illegal option '"+options+"' passed to rebuildBlock. Options are: 'clean', 'showall', 'suggest' or 'original'");
    options = 'clean';
  }
  // options: [clean], showall, suggest, original
  if (!tokens) return '';

  // allow passing in raw text strings for simplified use, including dictionary
  if (typeof tokens == 'string') {
    tokens = self.tokenizeString(tokens);
    if (dictionary) self.addTermSuggestions(tokens, dictionary);
  }

 // console.log(tokens);

  var words = [], newword;
  tokens.forEach(function(token) {
    // default regular word
    newword = token.word;
    if (options != 'original') {
      // is a term

      if ('suggestion' in token) {
        if (token.suggestion.isMisspelled) {
          // correct and mistake, change token.word
          if ((options ==='showall')  && token.suggestion.isMisspelled) newword = "<mark class='term misspelled'>"+
            token.word + "</mark> <mark class='term correction'>" + token.suggestion.html + "</mark>";
          // correction only
          if ((options ==='suggest') && token.suggestion.isMisspelled) newword = "<mark class='term correction'>"+
             token.suggestion.html + "</mark>";
          // correction without markup
          if ((options === 'clean') && token.suggestion.isMisspelled) newword = token.suggestion.html;
        } else {
          // no correction
          if ((options != 'clean')) newword = "<mark class='term correct'>"+ token.word + "</mark>";
        }
      } else if (token.info.isPossibleTerm) {
        if  (options != 'clean') newword = "<mark class='term unknown'>"+ token.word + "</mark>";
      }

    }
    words.push(token.prefix + newword + token.suffix);
  });
  return words.join('');
};


Diacritical.prototype.soundex = function(s) {
  if (!s) return '';
  var a = s.toLowerCase().split('');
     f = a.shift(),
     r = '',
     codes = {
         a: '', e: '', i: '', o: '', u: '',
         b: 1, f: 1, p: 1, v: 1,
         c: 2, g: 2, j: 2, k: 2, q: 2, s: 2, x: 2, z: 2,
         d: 3, t: 3,
         l: 4,
         m: 5, n: 5,
         r: 6
     };

  r = f +
     a
     .map(function (v, i, a) { return codes[v]; })
     .filter(function (v, i, a) {
         return ((i === 0) ? v !== codes[f] : v !== a[i - 1]);
     })
     .join('');

  return (r + '000').slice(0, 4).toUpperCase();
};


Diacritical.prototype.addTermSuggestions = function(tokens, dictionary, report) {
  if (!dictionary) return;
  if (!tokens) return;
  var self = this,
      key, subkey,
      terms,
      term,
      allcaps,
      is_match = false,
      suggestion,
      corrected;

  if (!report.unknowns) report.unknowns = [];
  if (!report.corrected) report.corrected = [];
  if (!report.replacement_details) report.replacement_details = {};
  if (!report.replacements) report.replacements = {};
  //report.unknownTotal = 0; report.correctedTotal = 0;
  report.blockCount = (report.blockCount ? report.blockCount +1 : 1);
  report.unknownTotal = (report.unknownTotal ? report.unknownTotal : 0);
  report.correctedTotal = (report.correctedTotal ? report.correctedTotal : 0);

  dictionary = self.prepareDictionary(dictionary); //safe to call muliple times
  dictionary = dictionary.terms;

  tokens = self.tokenizeString(tokens); // safe to call with string or tokens

  tokens.forEach(function(token, index) {
    if (suggestion = dictionarySuggestion(token)) {
      token.suggestion = suggestion;
      token.info.soundex = suggestion.soundex;

      // report misspelled corrections
      if (suggestion.isMisspelled) {
        report.correctedTotal++;

        if (report.corrected.indexOf(suggestion.glyph) == -1) {
          report.corrected.push(suggestion.glyph);
          report.replacement_details[token.word] = suggestion;
        }
        if (report.replacements[token.word] == undefined) report.replacements[token.word] = suggestion.html;
        //console.log(report.replacements[token.word]);

      } else token.suggestion.inDictionary = true;
    } else if (token.info.isPossibleTerm) { // report unknown terms with no dictionary match
      report.unknownTotal++;
      if (report.unknowns.indexOf(token.word) === -1) report.unknowns.push(token.word);
    }
    tokens[index] = token;
  });

  // ---------------------------------------------
  function isProperCase(word) {
    return ((word.length>0) && (word.split('')[0]===word.split('')[0].toUpperCase()));
  }
  function dictionarySuggestion(token) {

    //console.log("dictionarySuggestion(token)", token);

    var matchCase = token.info.stripped,
        matchLower = token.info.stripped.toLowerCase(),
        suggestion,
        possibilities,
        result = false;

    //console.log(matchLower, dictionary);

    if (matchLower in dictionary) {
      //console.log("shiah in dictionary ");
      possibilities = dictionary[matchLower];
      //console.log("possibilities", possibilities);
      if (token.info.isAllCaps) {// case insensitive -- just take the first one
        suggestion = possibilities[Object.keys(possibilities)[0]];
        result = JSON.parse(JSON.stringify(suggestion));

        result.glyph = result.glyph.toUpperCase();
        result.html = result.html.toUpperCase().replace(/<U>/g,'<u>').replace(/<\/U>/g,'</u>');
        result.stripped = result.stripped.toUpperCase();
        result.ansi = result.ansi.toUpperCase();
        result.isMisspelled = (token.info.glyph != result.glyph.toUpperCase());
        result.soundex = self.soundex(result.ansi.toUpperCase());
        result.type = "All-Caps match";

      } else if (matchCase in possibilities) {
        // Case sensitive, check for an exact match
        suggestion = possibilities[matchCase];
        result = JSON.parse(JSON.stringify(suggestion));

        result.isMisspelled = (token.info.glyph != result.glyph);
        result.soundex = self.soundex(result.ansi);
        result.type = "exact case match";

      } else {
        // not all-caps and exact case match is not found
          // so we take the first match that at least matches case on the first letter
        for (var key in possibilities) {
          suggestion = possibilities[key];
          if (!result && isProperCase(matchCase)===isProperCase(suggestion.stripped)) {
            result = JSON.parse(JSON.stringify(suggestion));

            result.isMisspelled = (token.info.glyph != result.glyph);
            result.soundex = self.soundex(result.ansi);
            result.type = "inexact case match";
          }
        }
      }
    }
    //console.log('token', token);
    //console.log('result', result);
    return result;
  }
};


