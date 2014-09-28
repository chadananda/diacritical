// Read and eval library
eval(require('fs').readFileSync('./node_modules/diacritical/diacritical.js', 'utf8'));

// The diacritical.js file defines a class 'Diacritical' which is all we want to export
module.exports = Diacritical;

