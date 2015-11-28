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
