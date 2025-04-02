# no-action-js


## Usage

```
npx ember-no-action-codemod no-action-js path/of/files/ or/some**/*glob.js

# or

yarn global add ember-no-action-codemod
ember-no-action-codemod no-action-js path/of/files/ or/some**/*glob.js
```

## Local Usage
```
node ./bin/cli.js no-action-js path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
* [component](#component)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/no-action-js/__testfixtures__/basic.input.js)</small>):
```js
const Component = {
  test() {},
  actions: {
    method() {},
    anotherMethod(param) {},
    expr: function() {},
    test: function() {}
  }
};
```

**Output** (<small>[basic.output.js](transforms/no-action-js/__testfixtures__/basic.output.js)</small>):
```js
import { action } from "@ember/object";
const Component = {
  test() {},
  method: action(function() {}),
  anotherMethod: action(function(param) {}),
  expr: action(function() {}),
  testAction: action(function() {})
};
```
---
<a id="component">**component**</a>

**Input** (<small>[component.input.js](transforms/no-action-js/__testfixtures__/component.input.js)</small>):
```js
import { computed } from '@ember/object';

export default Component.extend({
    test() {},
    actions: {
        method() {},
        anotherMethod(param) {},
        expr: function() {},
        test() {}
    }
});
```

**Output** (<small>[component.output.js](transforms/no-action-js/__testfixtures__/component.output.js)</small>):
```js
import { computed, action } from '@ember/object';

export default Component.extend({
    test() {},
    method: action(function() {}),
    anotherMethod: action(function(param) {}),
    expr: action(function() {}),
    testAction: action(function() {})
});
```
<!--FIXTURES_CONTENT_END-->