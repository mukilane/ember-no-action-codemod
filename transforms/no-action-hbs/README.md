# no-action-hbs


## Usage

```
npx ember-no-action-codemod no-action-hbs path/of/files/ or/some**/*glob.hbs

# or

yarn global add ember-no-action-codemod
ember-no-action-codemod no-action-hbs path/of/files/ or/some**/*glob.hbs
```

## Local Usage
```
node ./bin/cli.js no-action-hbs path/of/files/ or/some**/*glob.hbs
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.hbs](transforms/no-action-hbs/__testfixtures__/basic.input.hbs)</small>):
```hbs
{{action "methodName"}}
{{action this.method param}}
{{this.method}}

<div
    onclick={{action "methodName"}}
    onclick={{action "methodName" param}}
    {{on "click" (action "methodName")}}
>
</div>
```

**Output** (<small>[basic.output.hbs](transforms/no-action-hbs/__testfixtures__/basic.output.hbs)</small>):
```hbs
{{this.methodName}}
{{fn this.method param}}
{{this.method}}

<div
    onclick={{this.methodName}}
    onclick={{fn this.methodName param}}
    {{on "click" this.methodName}}
>
</div>
```
<!--FIXTURES_CONTENT_END-->