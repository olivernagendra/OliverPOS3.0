// ES6 module syntax
import LocalizedStrings from 'react-localization';
import language_es from './Language_es.json'; //Spanish
import language_en from './Language_en.json'; //English
import language_hi from './Language_hi.json'; //Hindi
import language_fr from './Language_fr.json'; //French
import language_nl from './Language_nl.json'; //Dutch
import language_de from './Language_de.json'; //German
import language_zh from './Language_zh.json'; //chinese
import language_no from './Language_no.json'; //Norwegian
import language_da from './Language_da.json'; //danish
import language_fi from './Language_fi.json'; //finnish for Finland
var language = {
    "en": language_en,
    "fr": language_fr,
    "hi": language_hi,
    "es": language_es,
    "nl": language_nl,
    "de": language_de,
    "zh": language_zh,
    "no": language_no,
    "da": language_da,
    "fi": language_fi,
}
var lang = localStorage.getItem('LANG') ? localStorage.getItem('LANG').toString() : 'en';
var result = {};
// const formatedLanguage = (selectLang) => {
//     // console.log("selectLang",selectLang)
//     if (selectLang && selectLang.length) {
//         for (var i = 0; i < selectLang.length; i++) {
//             result[selectLang[i].key.replace(" ", "")] = selectLang[i].value;
//         }
//     } else {
//         formatedLanguage(language.en)
//     }
//     return result
// }



const formatedLanguage = (selectLang) => {
    // console.log("selectLang",selectLang)
     if (selectLang) {
        result = selectLang
    } else {
        formatedLanguage(selectLang)
    }
     return result
 }



var LocalizedLanguage = new LocalizedStrings({
    [lang]: formatedLanguage(language[lang])
});

//console.log("LocalizedLanguage", LocalizedLanguage) 
if (lang) {
    LocalizedLanguage.setLanguage(lang);
}
export function changeLanguage(d)
{
    formatedLanguage(language[d]);
    LocalizedLanguage.setLanguage(d);
}
export default LocalizedLanguage;



