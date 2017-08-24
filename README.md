[![GitHub release](https://img.shields.io/github/release/stegano/extract-function.svg)]()

You can extract the function in the source code and use it for testing.

# Installation
```bash
npm i extract-function --save-dev
```

# Using module in source code
```javascript
var sourceCode = `
  /**
   * @extract BasicFunc
   * */
  function basicFunc() {
    // OK
  }
  function test() {
    // OK
  }
  `;
var ExtractFunction = require("extract-function");
var ef = new ExtractFunction(sourceCode);
ef.hasAnnotationName("extract"); // -> `true`
ef.getAnnotationnValue("extract"); // -> `BasicFunc`
ef.getComments(); // -> `/**\n    * @extract BasicFunc\n    * */`
ef.getClosestFunction(); // -> `function basicFuc() {\n      // OK\n    }`
```

# Using the Command Line
```bash
Usage

  extract-function --src files --out directory --beautify boolean

Example

  $ extract-function -s ./src/**.js -o ./test/extractFiles --beatufiy false

Options

  -s, --src files          A list of files containing annotations to extract.
  -o, --out directory      The directory where extracted files will be created.
  -b, --beautify boolean   Apply beautify-js to the extracted files.
  --help                   Display this usage guide.
```


# Demo
```bash
./node_modules/.bin/extract-function -s ./test/sample.js -o ./result
```

```javascript
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

## Output : A list of extracted files.
```bash
./result
├── AnonymousFunction.js
├── ArgsTest.js
├── BasicFunc.js
├── FunctionLiteral.js
├── InnerFunction.js
└── ObjectInFunction.js
```