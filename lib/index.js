/**
 * 코드내 존재하는 주석을 배열로 리턴
 * @param {String} codeStr
 * @return {Array}
 * */
function getAllComments(codeStr) {
  return codeStr.match(/(?:\/\*)+?(.|[^])*?(?:\*\/)+?/gmi) || [];
}
/**
 * 주석에 해당하는 타입이 존재하는지 확인
 * @param {String} codeCommentsStr
 * @param {String} annotationName
 * @return {boolean}
 * */
function hasAnnotationName(codeCommentsStr, annotationName) {
  return new RegExp(`\\s+@${annotationName}\\s+\\w+?`, "gim").test(codeCommentsStr);
}
/**
 * 주석에 해당하는 정보를 가져옴
 * @param {String} codeCommentsStr
 * @param {String} annotationName
 * @return {String}
 * */
function getAnnotationValue(codeCommentsStr, annotationName) {
  var ret = "";
  var matches = codeCommentsStr.match(new RegExp(`@${annotationName}\\s+?(\\w+)`, "i"));
  if (matches && matches.length >= 1) {
    ret = matches[1];
  }
  return ret;
}
/**
 * 주석과 가장 근접한 함수 정보를 가져옴
 * @param {String} codeStr
 * @param {String} codeCommentsStr
 * @return {String}
 * */
function getClosestFunction(codeStr, codeCommentsStr) {
  var afterAnnotationPtr = codeStr.indexOf(codeCommentsStr) + codeCommentsStr.length;
  var startOffset = codeStr.indexOf("function", afterAnnotationPtr);
  var oBracket = 0;
  var cBracket = 0;
  var startPos = 0;
  var endPos = 0;
  for (var i = startOffset; i < codeStr.length; i++) {
    if (oBracket !== 0 && oBracket === cBracket) {
      endPos = i;
      break;
    }
    if (codeStr[i] === "{") {
      if (startPos === 0) {
        startPos = i;
      }
      oBracket++;
    } else if (codeStr[i] === "}") {
      cBracket++;
    }
  }
  return codeStr.slice(startPos, endPos);
}

module.exports = {
  getAllComments,
  getClosestFunction,
  getAnnotationValue,
  hasAnnotationName
};