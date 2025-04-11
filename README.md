# ember-no-action-codemod


A collection of codemods for ember action deprecation.

## Usage

To run a specific codemod from this project, you would run the following:

```
npx ember-no-action-codemod <TRANSFORM NAME> path/of/files/ or/some**/*glob.js

# or

yarn global add ember-no-action-codemod
ember-no-action-codemod <TRANSFORM NAME> path/of/files/ or/some**/*glob.js
```

## Local Usage
```
node ./bin/cli.js <TRANSFORM NAME> path/of/files/ or/some**/*glob.js
```

## Transforms

<!--TRANSFORMS_START-->
* [no-action-hbs](transforms/no-action-hbs/README.md)
* [no-action-js](transforms/no-action-js/README.md)
<!--TRANSFORMS_END-->

## Contributing

### Installation

* clone the repo
* change into the repo directory
* `yarn`

### Running tests

* `yarn test`

### Update Documentation

* `yarn update-docs`