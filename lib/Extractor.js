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
      args: extractedCode.args,
      body: isBeautify ? beautify(extractedCode.body) : extractedCode.body
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
   * @return {Object}
   * */
  function _getClosestFunction(comments) {
    var args = null;
    var afterAnnotationPtr = sourceCode.indexOf(comments) + comments.length;
    var startOffset = sourceCode.indexOf("function", afterAnnotationPtr);
    var startParenthesesPos = 0;
    var endParenthesesPos = 0;
    var oBraces = 0;
    var cBraces = 0;
    var startBracesPos = 0;
    var endBracesPos = 0;
    for (var i = startOffset; i < sourceCode.length; i++) {

      switch (sourceCode[i]) {
        case "{":
          if (startBracesPos === 0) {
            startBracesPos = i + 1;
          }
          oBraces++;
          break;
        case "}":
          cBraces++;
          break;
        case "(":
          if (startParenthesesPos === 0) {
            startParenthesesPos = i + 1;
          }
          break;
        case ")":
          if (endParenthesesPos === 0) {
            endParenthesesPos = i;
          }
          break;
      }

      if (oBraces !== 0 && oBraces === cBraces) {
        endBracesPos = i - 1;
        break;
      }
      if (args === null && startParenthesesPos !== 0 && endParenthesesPos !== 0) {
        var argsString = sourceCode.slice(startParenthesesPos, endParenthesesPos);
        args = argsString ? argsString.replace(/\s+/gm, '').split(",") : [];
      }
    }
    return {
      args: args,
      body: sourceCode.slice(startBracesPos, endBracesPos)
    };
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