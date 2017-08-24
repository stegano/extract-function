/**
 * This template is supports AMD and CommonJS and Browser global scope.
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