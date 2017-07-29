#!/usr/bin/env node

var Extractor = require("../lib/Extractor");
var path = require("path");
var fs = require("fs");
var mkdirp = require("mkdirp");
var beautify = require("js-beautify");
var cla = require("command-line-args");
var clu = require("command-line-usage");

/**
 * 커맨드라인 설정
 * */
var options = cla([
  {
    name: "src",
    alias: "s",
    type: String,
    multiple: true,
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
 * 도움말.
 * */
if ("help" in options) {
  var manual = clu([
    {
      header: "Usage",
      content: "[bold]{extract-function} [bold]{--src} [underline]{files} [bold]{--out} [underline]{directory} [bold]{--beautify} [underline]{boolean}"
    },
    {
      header: "Example",
      content: "$ extract-function -s ./src/**.js -o ./test/extractFiles --beatufiy false"
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
 * 함수를 담을 템플릿을 로드함.
 * */
var template = fs.readFileSync(path.resolve(__dirname, "../template/basic.js"), "utf8");

/**
 * 추출할 파일 목록을 가져옴.
 * */
if (options.out) {
  /**
   * 추출될 파일 디렉토리 생성.
   * */
  mkdirp(options.out, function (err) {
    if (err) {
      console.error(err);
    }
  });
}

/**
 * 파일 본문 내용을 읽어와 함수 정보를 추출.
 * */
var files = options.src.map(function (file) {
  var sourceCode = fs.readFileSync(file, "utf8");
  return new Extractor(sourceCode, {
    beautify: false
  }).getExtractCode();
});

/**
 * 각 파일에서 추출된 함수 정보들을 새로운 파일에 씀.
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
       * 내보낼 파일 경로가 없을 경우 콘솔에 출력.
       * */
      process.stdout.write(`/** @function ${item.name} **/`);
      process.stdout.write(jsCode);
    }
  });
});
