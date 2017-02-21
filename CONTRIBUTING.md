# Contributing

Thanks for your interest in contributing! Let's make this theme more stable, customizable, and sexy :sparkles:

#### Ways to Contribute

- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Contributing Code](#contributing-code)
- [Testing](#testing)
  - [Writing Tests for JavaScript](#writing-tests-for-javascript)

#### Style Guides

This project is in a stylistic transition, so some of the sources may not follow the conventions in this document. These conventions should be followed for all new contributions, to help with the transition.

- [JavaScript Style Guide](#javascript-style-guide)
- [CSS Style Guide](#css-style-guide)
- [HTML Style Guide](#html-style-guide)

#### Links

- [Project homepage](https://github.com/codehearts/lightdm-webkit-theme-tendou)
- [Issue tracker](https://github.com/codehearts/lightdm-webkit-theme-tendou/issues)


## Reporting Bugs

Bugs are reported through this project's [issues page](https://github.com/codehearts/lightdm-webkit-theme-tendou/issues). When reporting:

- Describe how to reproduce your issue
- Describe what you expected, and what actually happened


## Suggesting Features

Suggestions are made through this project's [issues page](https://github.com/codehearts/lightdm-webkit-theme-tendou/issues), and don't obligate you to implement them. In your suggestion:

- Describe what feature or change you want to see
- Explain why the feature or change would be useful



## Contributing Code

- Branch off `master` with a descriptive name (`fix-login-failed-on-wake-from-sleep` instead of `fix-login`)
- Make your changes following the [JavaScript](#javascript-style-guide), [CSS](#css-style-guide), and [HTML](#html-style-guide) style guides
- Write tests for any modified or new functionality (see [Testing](#testing))
  - Currently, only the JavaScript in `js/` has automated testing; CSS/HTML just need to be seen in-browser
- Open a pull request on this repo
  - If your PR resolves an issue (for example, issue #42), don't forget to include `closes #42` to your PR body



## Testing

The build environment is provided as a Docker container tagged `codehearts/lightdm-webkit-theme-tendou`

- Run `make test` from anywhere in the project repo (requires [Docker](https://www.docker.com))
- Run a basic test on `index.html` in a WebKit-based browser and Firefox (to ensure the online demo functions)
- If you need to build the Docker container
  - Run `make docker_build` to rebuild the container
  - Run `make docker_push` to push the container to Docker Hub
  - Add `DOCKER_TAG=<your tag>` after the `make` command to change the Docker tag (`make docker_build DOCKER_TAG=local-tendou`)

### Writing Tests for JavaScript

All JavaScript in `js/` is tested using [Mocha](https://mochajs.org/) and [Sinon](http://sinonjs.org/). See the existing tests in `tests/` for ideas on writing your own.

Sinon allows you to create spies and stubs for testing. Stubbing a function allows you to define its behavior and inspect its calls, which is useful for verifying the integration between different units.

Here's an example of stubbing a DOM operation to return an object whose `remove` function can be spied on.

```js
  var sandbox = sinon.sandbox.create();

  var remove_spy = sandbox.spy();
  var createElement_stub = sandbox.stub(document, 'createElement', function() {
    return { remove: remove_spy };
  });

  var test_element = document.createElement('div');
  test_element.remove();

  remove_spy.calledOnce; // True

  sandbox.restore(); // Don't forget to restore your spies and stubs back to their original functions!
```


## JavaScript Style Guide

These styles and conventions are for consistency, but aren't set in stone. If you have an argument for why camelCase would be better than underscores, let's talk about it!

- Use 2 spaces instead of tabs
- Variable and function names use underscores, not camelcase
- All blocks must have braces (no one-line `if` statements)
- Single quotes for strings
- Prefix private members of function objects with `_`
  - This project doesn't worry about limiting the scope of private members. If it becomes an issue, privileged functions may be used. See [Private Members in JavaScript](http://www.crockford.com/javascript/private.html)


## CSS Style Guide

- Use 2 spaces instead of tabs
- Use hyphens in IDs and class names


## HTML Style Guide

- Use 2 spaces instead of tabs
- Exclude the closing `/` from self-closing tags (`<img>` rather than `<img />`)
- Place `script` tags at the bottom of the document
