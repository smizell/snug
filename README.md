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
var check = snug.logic.and([
  lodash.isNumber,
  function(value) { return value < 10; }
]);

check(4); // True
check(100); // False
```

#### or

```js
var check = snug.logic.or([
  lodash.isNumber,
  function(value) { return value === 'foobar'; }
]);

check(4); // True
check('foobar'); // True
check('hello world'); // False
```

#### nor

```js
var check = snug.logic.nor([
  lodash.isNumber,
  function(value) { return value === 'foobar'; }
]);

check(9); // False
check('foobar'); // False
check('hello world'); // True
```

#### wildcard

Maybe you don't care about the type of a given value. If so, you can use `wildcard` to say any type is fine.

```js
var check = snug.logic.wildcard();

// No matter what value is given, it will be true
check('anything'); // True
```

#### optional

You may have figured out to use the `or` function with an `isUndefined` check as the first item, but that gets kind of verbose after a while. You can use `optional` to do a check or pass if the value is undefined.

```js
var check = snug.logic.optional(lodash.isNumber);

check(4); // True
check('4'); // False
check(); // True
```

### Access to Config

Sometimes, when you create an annotation, you may want to access the configuration you passed to it. Each function exposes this through a `$config` property.

This is useful for testing annotations.

```js
var sumAnnotation = snug.annotate({
  inputs: [lodash.isNumber, lodash.isNumber],
  outputs: [lodash.isNumber]
});

sumAnnotation.$config; // This is the object with inputs and outputs provided above
```
