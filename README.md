# Snug

[![Build Status](https://travis-ci.org/smizell/snug.svg?branch=master)](https://travis-ci.org/smizell/snug)

Make your functions safe.

## Install

```shell
npm install snug
```

## Usage

### Type Annotations

Make your input and output values snug. The `inputs` arrays corresponds to the respective input arguments. Functions are expected, so you can add whatever logic you desire for your type. If you do not specify any `inputs` or `outputs`, there will be no checks.

```js
var snug = require('snug');

var sum = snug.annotate({
  inputs: [lodash.isNumber, lodash.isNumber],
  outputs: [lodash.isNumber],
  fn: function(a, b) {
    return a + b;
  }
});

sum(3, 4); // Returns 7
sum(3); // TypeError - Not enough arguments
sum(3, 4, 5); // TypeError - Too many arguments
sum('a', 'b'); // TypeError - wrong types
```

If you would like to define your annotations apart from your functions, simply leave off the `fn` property. You will then get a function in which you can pass in a function to annotate.

```js
var snug = require('snug');

var sumAnnotation = snug.annotate({
  inputs: [lodash.isNumber, lodash.isNumber],
  outputs: [lodash.isNumber]
});

var sum = sumAnnotation(function(a, b) {
  return a + b;
});

sum(3, '4'); // TypeError
```

### Catching Errors

Sometimes, you want to make a function fail gracefully. You can do this with the `catch` function.

```js
var snug = require('snug');

var sum = snug.annotate({
  inputs: [lodash.isNumber, lodash.isNumber],
  outputs: [lodash.isNumber],
  fn: function(a, b) {
    return a + b;
  },
  catch: function(error) {
    return 0;
  }
});

sum('a', 'b'); // TypeError is caught, calls catch function, returns 0
```

### Creating Prototype Chains

Sometimes you may want to create prototype chains. The code gets really ugly when doing that and using annotations. Using the `create` method will let you build a prototype chain that are annotation objects. Note how the `fn` functions use `this`.

```js
var MyFunction = snug.create({
  constructor: {
    fn: function(a) {
      this.a = a;
    }
  },

  add: {
    inputs: [lodash.isNumber],
    outputs: [lodash.isNumber],
    fn: function(b) {
      return this.a + b;
    }
  }
});

var myFn = new MyFunction(1);
myFn.add(2); // Returns 3
```

### Structures

You may want to iterate over an object or array to see if every item passes a certain check. There are two functions to help with this.

#### Typed Array Structure

This ensures that every item in the array passes a single test.

```js
var check = snug.structures.typedArray(lodash.isNumber);
check([1, 2, 3]); // True
check([1, '2', 3]); // False
```

#### Object Structure

This looks at every key in an object and checks to see if each passes the check.

```js
var check = snug.structures.object({
  foo: lodash.isNumber,
  bar: lodash.isBoolean
});

check({
  foo: 4,
  bar: true
}); // True

check({
  foo: 4,
  bar: 'true'
}); // False

check({
  foo: 4
}); // False
```

### Logic

Sometimes, you need to get fancy with your annotations.

#### and

```js
var snug = require('snug');

// Input value must be a number AND less than 10
var inc = snug.annotate({
  inputs: [snug.logic.and([
    lodash.isNumber,
    function(value) { return value < 10; }
  ])],
  outputs: [lodash.isNumber],
  fn: function(a) {
    return a + 1;
  }
});
```

#### or

```js
var snug = require('snug');

// Input value must be a number OR less than 10
var inc = snug.annotate({
  inputs: [snug.logic.or([
    lodash.isNumber,
    function(value) { return value < 10; }
  ])],
  outputs: [lodash.isNumber],
  fn: function(a) {
    return a + 1;
  }
});
```

#### nor

```js
var snug = require('snug');

// Input value must not be a number nor less than 10
// Not sure how this function would work :)
var inc = snug.annotate({
  inputs: [snug.logic.nor([
    lodash.isNumber,
    function(value) { return value < 10; }
  ])],
  outputs: [lodash.isNumber],
  fn: function(a) {
    return a + 1;
  }
});
```

#### wildcard

```js
var snug = require('snug');

// Input value can be of any type
// True is always returned
var inc = snug.annotate({
  inputs: [snug.logic.wildcard()],
  outputs: [lodash.isNumber],
  fn: function(a) {
    return a + 1;
  }
});
```

#### each

Ensures the value is an array and each item of the array passes the check given.

```js
var snug = require('snug');

// Input value must be array of numbers
var inc = snug.annotate({
  inputs: [snug.logic.each(lodash.isNumber)],
  outputs: [lodash.isNumber],
  fn: function(a) {
    return a.map(function(item) {
      return item + 1;
    });
  }
});

inc([1, 2, 3]); // No errors
```
