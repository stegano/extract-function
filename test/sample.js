(() => {
  /**
   * @extract BasicFunc
   * */
  function basicFunc() {
    // OK
  }

  /**
   * @extract ArgsTest
   * */
  function argsTest(a, b, c, d) {
    // OK
  }

  /**
   * @extract FunctionLiteral
   * */
  var functionLiteral = function () {
    // OK
  };

  var obj = {
    /**
     * @extract ObjectInFunction
     * */
    objInFunction: function () {
      // OK
    },
  };

  /**
   * @extract AnonymousFunction
   * */
  (function () {
    // OK
  })();

  function outerFunction() {
    /**
     * @extract InnerFunction
     * */
    function innerFunction() {
      // OK
    }
  }
});