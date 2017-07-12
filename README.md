# extract-function
Extract module using comment in the source code.

## Installation
```
npm i extract-function
```

## Demonstration
```
extract-function -i ./test/sample.js -o ./result
```

#### ./test/sample.js
```
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
```

#### Result : A list of extracted files.
```
./result
├── AnonymousFunction.js
├── ArgsTest.js
├── BasicFunc.js
├── FunctionLiteral.js
├── InnerFunction.js
└── ObjectInFunction.js
```