#!/usr/bin/env node
var Extractor = require("../lib/Extractor");
var path = require("path");
var fs = require("fs");
var mkdirp = require("mkdirp");
var beautify = require("js-beautify");
var commandLineArgs = require("command-line-args");
var commandLineUsage = require("command-line-usage");

/**
 * Command Line settings.
 * */
var options = commandLineArgs([
  {
    name: "src",
    alias: "s",
    type: String,
    multiple: false,
    defaultValue: []
  },
  {
    name: "out",
    alias: "o",
    type: String
  },
  {
    name: "beautify",
    alias: "b",
    defaultValue: true
  },
  {
    name: "help"
  }
]);

/**
 * Command Line Manual.
 * */
if ("help" in options) {
  var manual = commandLineUsage([
    {
      header: "Usage",
      content: "[bold]{extract-function} [bold]{--src} [underline]{files} [bold]{--out} [underline]{directory} [bold]{--beautify} [underline]{boolean}"
    },
    {
      header: "Example",
      content: "$ extract-function -s ./src/**.js -o ./test/extractFiles --beautify false"
    },
    {
      header: "Options",
      optionList: [
        {
          name: "src",
          alias: "s",
          typeLabel: "[underline]{files}",
          description: "A list of files containing annotations to extract."
        },
        {
          name: "out",
          alias: "o",
          typeLabel: "[underline]{directory}",
          description: "The directory where extracted files will be created."
        },
        {
          name: "beautify",
          alias: "b",
          typeLabel: "[underline]{boolean}",
          description: "Apply beautify-js to the extracted files."
        },
        {
          name: "help",
          description: "Display this usage guide."
        }
      ]
    }
  ]);
  process.stdout.write(manual);
}

/**
 * Gets the source code wrapper template.
 * */
var template = fs.readFileSync(path.resolve(__dirname, "../template/basic.js"), "utf8");

/**
 * Gets the list of files to extract.
 * */
if (options.out) {
  /**
   * Create a file directory to be extracted.
   * */
  mkdirp(options.out, function (err) {
    if (err) {
      console.error(err);
    }
  });
}

/**
 * Extracts function information from contents of the loaded file.
 * */
var files = [];
options.src.forEach(function getFileInfo(srcPath) {
  var isDirectory = fs.statSync(srcPath).isDirectory();
  if (isDirectory) {
    fs.readdirSync(srcPath).forEach(function (item) {
      var absPath = path.resolve(srcPath, item);
      getFileInfo(absPath);
    });
  } else {
    var sourceCode = fs.readFileSync(srcPath, "utf8");
    var extractor = new Extractor(sourceCode, {
      beautify: false
    });
    files.push(extractor.getExtractCode());
  }
});
/**
 *  The function information extracted from each file is written to a new file.
 * */
files.forEach(function (extractedCode) {
  extractedCode.forEach(function (item) {
    var args = item.args;
    var functionName = item.name;
    functionName = functionName.replace(/\W/gm, "_");
    var functionBody = item.body;
    var jsCode = template;
    jsCode = jsCode.replace(/\/\*\* @args \*\*\//gim, args);
    jsCode = jsCode.replace(/\/\*\* @functionName \*\*\//gim, functionName);
    jsCode = jsCode.replace(/\/\*\* @functionBody \*\*\//gim, functionBody);
    jsCode = options.beautify ? beautify(jsCode) : jsCode;
    if (options.out) {
      fs.writeFileSync(path.join(options.out, item.name + ".js"), jsCode, "utf8");
    } else {
      /**
       * Output to console if there is no file path to export.
       * */
      process.stdout.write(`/** @function ${item.name} **/`);
      process.stdout.write(jsCode);
    }
  });
});
