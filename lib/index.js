var Extractor = require("./Extractor");
var fs = require("fs");
var nconf = require("nconf");
var mkdirp = require("mkdirp");
var beautify = require('js-beautify');
var path = require("path");
var glob = require("glob");
var del = require("del");

var settingsJson = path.join(process.cwd(), "extract-function.json");
var templateFilePath = path.join(process.cwd(), "template", "basic.js");
var template = fs.readFileSync(templateFilePath, "utf8");

nconf.argv().file(settingsJson).env();
var inPath = nconf.get("in");
var outPath = nconf.get("out");
var isBeautify = nconf.get("beautify");


isBeautify = isBeautify === undefined ? true : isBeautify;

glob(inPath, function (err, files) {
  if (err) {
    console.error(err);
  }
  if (outPath) {
    mkdirp(outPath, function (err) {
      if (err) {
        console.error(err);
      }
    });
  }
  files
    .map(function (file) {
      var sourceCode = fs.readFileSync(file, "utf8");
      return new Extractor(sourceCode, {
        beautify: false
      }).getExtractCode();
    })
    .forEach(function (extractedCode) {
      extractedCode.forEach(function (item) {
        var jsCode = template.replace("/** @replaceCode **/", item.codeSnippet);
        jsCode = isBeautify ? beautify(jsCode) : jsCode;
        if (outPath) {
          fs.writeFileSync(path.join(outPath, item.name + ".js"), jsCode, "utf8");
        } else {
          console.log(`/** @function ${item.name} **/`);
          console.log(jsCode);
        }
      });
    });
});
