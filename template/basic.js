/**
 * AMD 또는 CommonJS 사용 가능하도록 모듈을 제공하는 템플릿.
 * */
(function (extract) {
  if (typeof module === "object" && module.exports) {
    module.exports = extract;
  } else if (typeof window === "object" && typeof define === "function") {
    define("/** @functionName **/", function () {
      return extract;
    });
  } else if (typeof window === "object") {
    window["/** @functionName **/"] = extract;
  }
})(function (/** @args **/) {
  /** @functionBody **/
});