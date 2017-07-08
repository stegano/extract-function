var beautify = require('js-beautify');

/**
 * @constructor
 * @param {String} sourceCode input javascript code.
 * @param {Object} options optional
 * */
function Extractor(sourceCode, options) {

  /**
   * Set default options.
   * */
  sourceCode = sourceCode || "";
  options = options || {
      beautify: true
    };

  var commentsArr = _getComments(sourceCode).filter(function (comments) {
    return _hasAnnotationName(comments, "extract");
  });

  var extractedCodeArr = commentsArr.map(function (comments) {
    var isBeautify = options.beautify;
    var extractedCode = _getClosestFunction(comments);
    return {
      name: _getAnnotationValue(comments, "extract"),
      codeSnippet: isBeautify ? beautify(extractedCode) : extractedCode
    };
  });

  /**
   * Gets the entered source code.
   * @return {String}
   * */
  this.getSourceCode = function () {
    return sourceCode;
  };

  /**
   * Get all the code whose comment name is `extract`.
   * @return {Array}
   * */
  this.getExtractCode = function () {
    return extractedCodeArr;
  };

  /**
   * Gets existing comments in the code as an array.
   * @return {Array}
   * */
  function _getComments() {
    return sourceCode.match(/(?:\/\*\*)+?(.|[^])*?(?:\*\/)+?/gmi) || [];
  }

  /**
   *
   * */
  function _hasAnnotationName(comments, annotationName) {
    return new RegExp(`\\s+@${annotationName}\\s+\\w+?`, "gim").test(comments);
  }

  /**
   * Gets the annotation value contained in the comments.
   * @param {String} comments
   * @param {String} annotationName
   * @return {String}
   * */
  function _getAnnotationValue(comments, annotationName) {
    var ret = "";
    var matches = comments.match(new RegExp(`@${annotationName}\\s+?([.|\\w]+)`, "i"));
    if (matches && matches.length >= 1) {
      ret = matches[1];
    }
    return ret;
  }

  /**
   * Gets the function closest to the annotation.
   * @param {String} comments
   * @return {String}
   * */
  function _getClosestFunction(comments) {
    var afterAnnotationPtr = sourceCode.indexOf(comments) + comments.length;
    var startOffset = sourceCode.indexOf("function", afterAnnotationPtr);
    var oBracket = 0;
    var cBracket = 0;
    var startPos = 0;
    var endPos = 0;
    for (var i = startOffset; i < sourceCode.length; i++) {
      if (oBracket !== 0 && oBracket === cBracket) {
        endPos = i - 1;
        break;
      }
      if (sourceCode[i] === "{") {
        if (startPos === 0) {
          startPos = i + 1;
        }
        oBracket++;
      } else if (sourceCode[i] === "}") {
        cBracket++;
      }
    }
    return sourceCode.slice(startPos, endPos);
  }

  /**
   * Exposed functions for testing.
   * */
  this.__test__ = {
    getAnnotationValue: _getAnnotationValue,
    getClosestFunction: _getClosestFunction,
    getComments: _getComments,
    hasAnnotationName: _hasAnnotationName
  };
}

module.exports = Extractor;