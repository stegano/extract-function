var expect = require('chai').expect;
var testFunctions = require('../lib');

describe('getAllComments', () => {
  var code = `
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  !!/** testComments1 **/,
  /** testComments2 /*/!!
  !!/* testComments3 */,
  /** 
  * testComments4 
  **/!!
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  `;
  var expected = [
    `/** testComments1 **/`,
    `/** testComments2 /*/`,
    `/* testComments3 */`,
    `/** 
  * testComments4 
  **/`
  ];
  var allComments = testFunctions.getAllComments(code);
  it('Returns all comments that exists in the code.', () => {
    expect(allComments).to.length(4);
  });
  allComments.forEach((value, index) => {
    it(`Returns comments(${value}) that exist in the code.`, () => {
      expect(value).to.equal(expected[index]);
    });
  });
});

describe('hasAnnotationName', () => {
  var code = `
  /** 
  @A test 
  **/
  /******** @B test **************/
  /* 
  @C test */
  `;
  var expected = [
    "A",
    "B",
    "C"
  ];
  testFunctions.getAllComments(code).forEach((comment, index) => {
    it(`'${expected[index]}' must exist.`, () => {
      var value = testFunctions.hasAnnotationName(comment, expected[index]);
      expect(value).to.equal(true);
    })
  });
});

describe('getAnnotationValue', () => {
  var code = `
  /** 
  @A test1 aaaaaa
  **/
  /******** @B test2 **************/
  /* 
  @C test3 */
  `;
  var expected = [
    "A",
    "B",
    "C"
  ];
  testFunctions.getAllComments(code).forEach((comment, index) => {
    it(`'${expected[index]}' value must be 'test${index + 1}.'`, () => {
      var value = testFunctions.getAnnotationValue(comment, expected[index]);
      expect(value).to.equal(`test${index + 1}`);
    })
  });
});
