describe("Accents", function() {


  beforeEach(function() {
    d = new Diacritical();
    dictionary = d.prepareDictionary(getTestDictionaryList());
  });

  it("Prepared dictionary should be a hash object", function() {
    expect(Object.prototype.toString.call(dictionary)).toEqual('[object Object]');
  });


  describe("Tokenizer", function() {

    it("Tokenized plain text string should contain 2 tokens", function() {
       var test_text = "    MUHÍT-I-SHÁ'IR-I-KIRMANÍ'S: 'Abu’l-Fàdl', ";
       expect(d.tokenizeString(test_text).length).toEqual(2);
    });
    it("Tokenized HTML string should contain 2 tokens", function() {
       var test_text = "    <span>MUHÍT-I-SHÁ'IR-I-KIRMANÍ'S</span>: 'A<u>bu</u>’l-Fàdl', ";
       expect(d.tokenizeString(test_text).length).toEqual(2);
    });

    it("Tokenized HTML string should be marked isAllCaps", function() {
       var test_text = "  <u>SH</u>Í’AH  <span>MUHÍT-I-SHÁ'IR-I-KIRMANÍ'S</span>: 'A<u>bu</u>’l-Fàdl',  ";
       var tokens = d.tokenizeString(test_text);
       expect(tokens[0].info.isAllCaps).toEqual(true);
       expect(tokens[1].info.isAllCaps).toEqual(true);
       expect(tokens[2].info.isAllCaps).toEqual(false);
    });


    it("Tokens should rejoin into the exact same string.", function() {
       var test_text = "    MUHÍT-I-SHÁ'IR-I-KIRMANÍ'S: 'Abu’l-Fàdl', ";
       var tokens = d.tokenizeString(test_text);
       expect(d.rebuildBlock(tokens, 'original')).toEqual(test_text);
    });
    it("Tokens with HTML tags should rejoin into the exact same string.", function() {
       var test_text = "<p>    <span>MUHÍT-I-SHÁ'IR-I-KIRMANÍ'S</span>: 'A<u>bu</u>’l-Fàdl', </p>";
       var tokens = d.tokenizeString(test_text);
       expect(d.rebuildBlock(tokens, 'original')).toEqual(test_text);
    });


    it("Tokenizer correctly parses words out of text string", function() {
       var test_text = "'Abu’l-Fàdl', 'Abu’l-Fádl',Abu‘l-Fadl's et \"Abu'l-Fadl\" elit, Abu'l-Fadl—sed do Ahsanu’l-Qisaṣ.";
       var tokens = d.tokenizeString(test_text);
       expect(tokens[0].word).toEqual("Abu’l-Fàdl");
       expect(tokens[1].word).toEqual("Abu’l-Fádl");
       expect(tokens[2].word).toEqual("Abu‘l-Fadl");
       expect(tokens[3].word).toEqual("et");
       expect(tokens[4].word).toEqual("Abu'l-Fadl");
       expect(tokens[5].word).toEqual("elit");
       expect(tokens[6].word).toEqual("Abu'l-Fadl");
       expect(tokens[7].word).toEqual("sed");
       expect(tokens[9].word).toEqual("Ahsanu’l-Qisaṣ");
    });
    it("Tokenizer correctly parses words out of HTML string", function() {
       var html = "<pre>'Abu’l-Fàdl', <span class='test class'>'Abu’l-Fádl',Abu‘l-Fadl's</span>"+
                  " et \"Abu'l-Fadl\" elit, <i>Abu'l-Fadl—sed</i> do Ahsanu’l-Qisaṣ.</pre>";
       var tokens = d.tokenizeString(html);
       expect(tokens[0].word).toEqual("Abu’l-Fàdl");
       expect(tokens[1].word).toEqual("Abu’l-Fádl");
       expect(tokens[2].word).toEqual("Abu‘l-Fadl");
       expect(tokens[3].word).toEqual("et");
       expect(tokens[4].word).toEqual("Abu'l-Fadl");
       expect(tokens[5].word).toEqual("elit");
       expect(tokens[6].word).toEqual("Abu'l-Fadl");
       expect(tokens[7].word).toEqual("sed");
       expect(tokens[8].word).toEqual("do");
       expect(tokens[9].word).toEqual("Ahsanu’l-Qisaṣ");
    });



    it("Tokenizer correctly parses prefixes out of plain text string", function() {
       var test_text = "  'Abu’l-Fàdl', 'Abu’l-Fádl',Abu‘l-Fadl's et \"Abu'l-Fadl\" elit, Abu'l-Fadl—sed do Ahsanu’l-Qisaṣ.";
       var tokens = d.tokenizeString(test_text);
       //console.log(tokens);
       expect(tokens[0].prefix).toEqual("  '");
       expect(tokens[1].prefix).toEqual("'");
       expect(tokens[2].prefix).toEqual("");
       expect(tokens[4].prefix).toEqual("\"");
       expect(tokens[6].prefix).toEqual("");
       expect(tokens[7].prefix).toEqual("—");
    });
    it("Tokenizer correctly parses prefixes out of HTML string", function() {
       var html = "<pre>  'Abu’l-Fàdl', 'Abu’l-Fádl',Abu‘l-Fadl's et <span>\"Abu'l-Fadl\"</span> elit, Abu'l-Fadl—sed do Ahsanu’l-Qisaṣ.";
       var tokens = d.tokenizeString(html);
       //console.log(tokens);
       expect(tokens[0].prefix).toEqual("<pre>  '");
       expect(tokens[1].prefix).toEqual("'");
       expect(tokens[2].prefix).toEqual("");
       expect(tokens[4].prefix).toEqual("<span>\"");
       expect(tokens[6].prefix).toEqual("");
       expect(tokens[7].prefix).toEqual("—");
    });


    it("Tokenizer correctly parses suffixes out of plain text string", function() {
       var test_text = "'Abu’l-Fàdl', 'Abu’l-Fádl',Abu‘l-Fadl's et \"Abu'l-Fadl\" elit, Abu'l-Fadl—sed do Ahsanu’l-Qisaṣ.";
       var tokens = d.tokenizeString(test_text);
       expect(tokens[0].suffix).toEqual("', ");
       expect(tokens[1].suffix).toEqual("',");
       expect(tokens[2].suffix).toEqual("'s ");
       expect(tokens[3].suffix).toEqual(" ");
       expect(tokens[4].suffix).toEqual("\" ");
       expect(tokens[5].suffix).toEqual(", ");
       expect(tokens[6].suffix).toEqual("");
       expect(tokens[9].suffix).toEqual(".");
    });
    it("Tokenizer correctly parses suffixes out of HTML string", function() {
       var html = "'Abu’l-Fàdl', 'Abu’l-Fádl',Abu‘l-Fadl's et <span>\"Abu'l-Fadl\"</span> elit, Abu'l-Fadl—sed do Ahsanu’l-Qisaṣ.";
       var tokens = d.tokenizeString(html);
       expect(tokens[0].suffix).toEqual("', ");
       expect(tokens[1].suffix).toEqual("',");
       expect(tokens[2].suffix).toEqual("'s ");
       expect(tokens[4].suffix).toEqual("\"</span> ");
    });



    it("Tokenizer correctly splits on fake m-dashes, commas, tabs and line breaks in plain text", function() {
       var test_text = "Abu’l-Fàdl---Abu’l-Fádl--Abu‘l-Fadl's,Abu'l-Fadl\tAbu'l-Fadl\nAbu'l-Fadl";
       expect(d.tokenizeString(test_text).length).toEqual(6);
    });
    it("Tokenizer correctly splits on fake m-dashes, commas, tabs and line breaks in HTML", function() {
       var html = "<pre>Abu’l-Fàdl---<i>Abu’l-Fádl</i>--Abu‘l-Fadl's,<span>Abu'l-Fadl\tAbu'l-Fadl\n</span>Abu'l-Fadl</pre>";
       expect(d.tokenizeString(html).length).toEqual(6);
    });


    it("Tokenizer correctly adds beginning whitespace onto prefix of first token", function() {
       var test_text = "  \t\n\n\t Abu’l-Fàdl Abu’l-Fàdl";
       var tokens = d.tokenizeString(test_text);
       //console.log(tokens);
       expect(tokens.length).toEqual(2);
    });
    it("Tokenizer correctly adds beginning whitespace onto prefix of first token with HTML", function() {
       var html = "  \t\n\n<p>\t <pre>Abu’l-Fàdl Abu’l-Fàdl</pre></p>";
       var tokens = d.tokenizeString(html);
       expect(tokens[0].prefix).toEqual("  \t\n\n<p>\t <pre>");
    });

    it("Correctly recognize dashed words are not a term", function() {
       var report = {},
           text = "well-being";
       var tokens = d.tokenizeString(text);
       d.addTermSuggestions(tokens, dictionary, report);
       expect(report.unknownTotal).toEqual(0);
    });

    it("Correctly recognize words with start and end single quots are not terms", function() {
       var report = {},
           text = "'dog pet'";
       var tokens = d.tokenizeString(text);
       d.addTermSuggestions(tokens, dictionary, report);
       expect(report.unknownTotal).toEqual(0);
    });


    it("Correctly determine words with 'e's are not terms", function() {
       var report = {},
           text = " l’Asie ";
       var tokens = d.tokenizeString(text);
       d.addTermSuggestions(tokens, dictionary, report);
       expect(report.unknownTotal).toEqual(0);
    });


  });



  describe("Prepare Dictionary", function() {

    it("Test dictionary should contain 5 items", function() {
       var test = ['Abu’l-Faḍl','Aḥmad','Aḥsanu’l-Qiṣaṣ','Ba_ghdád','Baqí‘'];
       var dictionary = d.prepareDictionary(test);
       expect(dictionary.total).toEqual(5);
    });

    it("Dictionary with matching duplicates should contain 5 items", function() {
       var test = ['Abu’l-Faḍl','Aḥmad','Aḥmad','Aḥmad','Aḥmad','Aḥsanu’l-Qiṣaṣ','Ba_ghdád','Baqí‘'];
       var dictionary = d.prepareDictionary(test);
       expect(dictionary.total).toEqual(5);
    });

    it("Dictionary with conflicted spellings should contain 5 items based on most common version", function() {
       var test = ['Abu’l-Faḍl','Aḥmad','Ahmad','Aḥmad','Aḥmad','Aḥsanu’l-Qiṣaṣ','Ba_ghdád','Baqí‘','Baqí‘','Baqí'];
       var dictionary = d.prepareDictionary(test);
       expect(dictionary.total).toEqual(5);
    });

    it("Dictionary with case variation should return 5 word groups", function() {
       var test = ['Abu’l-Faḍl','Aḥmad', 'aḥmad', 'Aḥsanu’l-Qiṣaṣ','Ba_ghdád','Baqí‘'];
       var dictionary = d.prepareDictionary(test);
       expect(dictionary.total).toEqual(6);
       expect(Object.keys(dictionary.terms).length).toEqual(5);
       //expect(Object.keys(dictionary.terms['ahmad'])).length.toEqual(2);
    });

  });



  describe("Suggestion Generator", function() {


    it("Correctly replace All CAPS using verbose method", function() {
       var report = {},
           text = "AHMAD, ahmad, Ahmad, AHMAD'S";
       var dictionary = d.prepareDictionary(getTestDictionaryList());
       var tokens = d.tokenizeString(text);
       d.addTermSuggestions(tokens, dictionary, report);
       var newText = d.rebuildBlock(tokens, 'clean', dictionary);
       expect(newText).toEqual("AḤMAD, aḥmad, Aḥmad, AḤMAD'S");
    });

    it("Correctly replace All CAPS using brief method", function() {
       var text = "AHMAD, ahmad, Ahmad, AHMAD'S";
       var newText = d.replaceText(text, dictionary, 'clean');
       expect(newText).toEqual("AḤMAD, aḥmad, Aḥmad, AḤMAD'S");
    });

    it("Mark 'correction' All CAPS term when underscore HTML is present", function() {
       var text = "<u>SH</u>Í’AH";
       //var dictionary = ['_Shí‘ah'];
       var newText = d.replaceText(text, dictionary, 'suggest');
       expect(newText).toEqual("<mark class='term correction'><u>SH</u>Í‘AH</mark>");
    });

    it("Mark 'correct' All CAPS term when underscore HTML is present", function() {
       var text = "<u>SH</u>Í‘AH";
       var newText = d.replaceText(text, dictionary, 'suggest');
       expect(newText).toEqual("<mark class='term correct'><u>SH</u>Í‘AH</mark>");
    });

    it("Correctly replace suggestions with term tags", function() {
       var text = "AHMAD, ahmad";
       var newText = d.replaceText(text, dictionary, 'suggest');
       expect(newText).toEqual("<mark class='term correction'>AḤMAD</mark>, <mark class='term correction'>aḥmad</mark>");
    });

    it("Correctly replace suggestions with term tags showing all misspellings", function() {
       var text = "Ahmad";
       var newText = d.replaceText(text, dictionary, 'showall');
       expect(newText).toEqual("<mark class='term misspelled'>Ahmad</mark> <mark class='term correction'>Aḥmad</mark>");
    });

    it("Correctly count corrected terms", function() {
       var report = {}, text = "AHMAD, ahmad";
       var newText = d.replaceText(text, getTestDictionaryList(), 'clean', report);
       expect(report.correctedTotal).toEqual(2);
    });

    it("Correctly gather suspected new terms", function() {
       var dictionary = d.prepareDictionary(['Abu’l-Faḍl','Aḥmad','Aḥsanu’l-Qiṣaṣ']);
       var report = {}, text = "AHMAD, ahmad, Baghdád, Kitab-i-Iqan, Abdu'l-Baha";
       var newText = d.replaceText(text, dictionary, 'clean', report);
       expect(report.unknownTotal).toEqual(3);
    });

    it("Correct a bunch of individual terms", function() {
       var dictionary = getTestDictionaryList();
       expect(d.replaceText('AHMAD', dictionary)).toEqual('AḤMAD');
       expect(d.replaceText('Abul-Fadl', dictionary)).toEqual('Abu’l-Faḍl');
       expect(d.replaceText('Baghdad', dictionary)).toEqual('Ba<u>gh</u>dád');
       expect(d.replaceText('Baqi', dictionary)).toEqual('Baqí‘');
       expect(d.replaceText('Askari', dictionary)).toEqual('‘Askarí');
       expect(d.replaceText('Jafár', dictionary)).toEqual('Ja‘far');
       expect(d.replaceText('Ahmad', dictionary)).toEqual('Aḥmad');
    });

    it("Correctly replace words with interior incorrect caps", function() {
       var text = "AhmAd, Kitáb-I-Iqán";
       var newText = d.replaceText(text, dictionary, 'clean');
       expect(newText).toEqual("Aḥmad, Kitáb-i-Íqán");
    });

    it("Correctly identify lower case prefixes on otherwise capitalized words (latin languages)", function() {
       var text = "unAhmad, laKitáb-i-Iqán, dinBaha, lui'Abbas";
       var newText = d.replaceText(text, dictionary, 'clean');
       expect(newText).toEqual("unAḥmad, laKitáb-i-Íqán, dinBahá, lui‘Abbás");
    });



    it("Do not gather awkward terms when already in dictionary", function() {
       var dictionary = d.prepareDictionary(['_Sharí‘at-Madár','Aḥmad','Aḥsanu’l-Qiṣaṣ']);
       var report = {}, text = "<u>Sh</u>arí‘at-Madár";
       var newText = d.replaceText(text, dictionary, 'clean', report);
       expect(report.unknownTotal).toEqual(0);
    });


    it("Correctly load full test dictionary", function() {
       var report = {},
           text = "AHMAD, Ahmad, AHMAD'S";
       var dictionary = d.prepareDictionary(ACCENTS_TEST_DICTIONARY);
       var tokens = d.tokenizeString(text);
       d.addTermSuggestions(tokens, dictionary, report);
       var newText = d.rebuildBlock(tokens, 'clean', dictionary);
       expect(newText).toEqual("AḤMAD, Aḥmad, AḤMAD'S");

       console.log(report);
    });



  });



});




var getTestDictionaryList = function() {
  return [
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
    'Bahá',
    'Dalílu’l-Mutaḥayyirín',
    'Fatḥ-‘Alí',
    'Ismá‘íl-i-_Dhabíḥ',
    'Jabal-i-_Shadíd',
    'Ja‘far',
    'Kázim-i-Ra_shtí',
    'Mullá',
    'Maḥmúd-i-Qamṣarí',
    'Mihdíy-i-_Khu’í',
    'Muḥít-i-_Shá‘ir-i-Kirmání',
    'Mu’a_dh_dhin',
    'Nabíl-i-A‘ẓam',
    'Qaṣídiy-i-Varqá’íyyih',
    'Siyyidu’_sh-_Shuhadá’',
    '_Shay_kh',
    '_Shay_khí',
    '_Shay_khís',
    '_shí‘ah',
    '‘Abbás',
    '‘Abdu’l-_Kháliq-i-Yazdí',
    '‘Askarí',
    'Kitáb-i-Íqán',
    '_Sharí‘at-Madár'
  ];
};
