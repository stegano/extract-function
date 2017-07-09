var fs = require("fs");
var expect = require('chai').expect;
var sampleCode = fs.readFileSync("./test/sample.js", "utf8");
var Extractorjs = require('../lib/Extractor');
var extractor = new Extractorjs(sampleCode, {
  beautify: false
});

describe("Extractor", () => {
  /**
  * _getComments function test
  * */
  it("Extractor._getComments", () => {
    var commentsArr = extractor.__test__.getComments();
    var expected = 6;
    expect(commentsArr).to.be.length(expected);
  });
  /**
   * _hasAnnotationName function test
   * */
  it("Extractor._hasAnnotationName", () => {
    var commentsArr = extractor.__test__.getComments();
    var expected = true;
    commentsArr.forEach((comment) => {
      var hasAnnotation = extractor.__test__.hasAnnotationName(comment, "extract");
      expect(hasAnnotation).to.be.equal(expected);
    });
  });
  /**
   * _getAnnotationValue function test
   * */
  it("Extractor._getAnnotationValue", () => {
    var commentsArr = extractor.__test__.getComments();
    var expected = [
      "BasicFunc",
      "ArgsTest",
      "FunctionLiteral",
      "ObjectInFunction",
      "AnonymousFunction",
      "InnerFunction",
    ];
    commentsArr.forEach((comment, index) => {
      var annotationValue = extractor.__test__.getAnnotationValue(comment, "extract");
      expect(annotationValue).to.be.equal(expected[index]);
    });
  });
  /**
   * _getClosestFunction function test
   * */
  it("Extractor._getClosestFunction", () => {
    var commentsArr = extractor.__test__.getComments();
    var expected = [
      {
        "args": [],
        "body": "// OK"
      },
      {
        "args": ["a", "b", "c", "d"],
        "body": "// OK"
      },
      {
        "args": [],
        "body": "// OK"
      },
      {
        "args": [],
        "body": "// OK"
      },
      {
        "args": [],
        "body": "// OK"
      },
      {
        "args": [],
        "body": "// OK"
      }
    ];
    commentsArr.forEach((comment, index) => {
      var functionInfo = extractor.__test__.getClosestFunction(comment);
      expect(functionInfo.args).to.be.deep.equal(expected[index].args);
      expect(functionInfo.body.trim()).to.be.equal(expected[index].body);
    });
  });
});
