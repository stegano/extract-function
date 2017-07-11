var Extractor = require("../lib/Extractor");
var path = require("path");
var fs = require("fs");
var mkdirp = require("mkdirp");
var beautify = require("js-beautify");
var glob = require("glob");

/**
 * 커맨드라인 설정
 * */
var program = require("commander");
program
  .version("0.0.1")
  .option("-i, --in <path>", "JS source code path.")
  .option("-o, --out <path>", "Extracted source code path.")
  .option("-b, --beautify <boolean>", "whether to use `js-beautify`", true)
  .parse(process.argv);

/**
 * 함수를 담을 템플릿을 로드함.
 * */
var template = fs.readFileSync("./template/basic.js", "utf8");

/**
 * 추출할 파일 목록을 가져옴.
 * */
glob(program.in, function (err, files) {

  if (err) {
    console.log(err);
  }

  if (program.out) {
    /**
     * 추출될 파일 디렉토리 생성.
     * */
    mkdirp(program.out, function (err) {
      if (err) {
        console.error(err);
      }
    });
  }

  /**
   * 파일 본문 내용을 읽어와 함수 정보를 추출.
   * */
  files = files.map(function (file) {
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
      jsCode = program.beautify ? beautify(jsCode) : jsCode;
      if (program.out) {
        fs.writeFileSync(path.join(program.out, item.name + ".js"), jsCode, "utf8");
      } else {
        /**
         * 내보낼 파일 경로가 없을 경우 콘솔에 출력.
         * */
        console.log(`/** @function ${item.name} **/`);
        console.log(jsCode);
      }
    });
  });
});
