const UglifyJS = require("uglify-js");
const fs = require('fs');
const uglifycss = require('uglifycss');

if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function(a, b) {
        return this.split(a).join(b);
    }
}

const a = fs.readFileSync('../emu-main.js', 'utf8').substring(18);
const code = fs.readFileSync('../emulator.js', 'utf8').replaceAll('window.EJS_main', a);

function minify(source){
    const ast = UglifyJS.parse(source);
    return UglifyJS.minify(ast).code;
}
console.log('minifying');
fs.writeFileSync('../emu-css.min.css', uglifycss.processString(fs.readFileSync('../emu-css.css', 'utf8')));
const min = minify(code);
console.log('done!');

fs.writeFileSync('../emulator.min.js', min);
