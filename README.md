# Tendou for LightDM

[![Build Status][build-badge]][build-link] [![Coverage][coverage-badge]][coverage-link] [![MIT License][license-badge]](LICENSE.md)

![](https://raw.githubusercontent.com/codehearts/lightdm-webkit-theme-tendou/master/screenshot.png)

A Windows 10 inspired theme for LightDM. [Try the demo](http://codehearts.github.io/lightdm-webkit-theme-tendou/) to see how you like it! Tendou isn't intended to look exactly like Windows 10, but you're free to fork and tweak the styles.

Tendou allows for switching users, but not graphical sessions. It also allows you to shutdown/restart/sleep from the menu in the bottom right.

The code for the waiting indicator when logging in is based on [this pen](http://codepen.io/vineethtr/pen/GJpxoQ) by @vineethtrv.

## The Future of Tendou

This theme was originally written for personal use, but has gotten some attention lately. I'm in the process of rewriting and testing the JS to ensure reliability. The goal is to write a fully tested LightDM WebKit theme framework such that the developer only needs to provide their styles and HTML, and the framework will provide the functionality on top of that.

## Contributing
Found a bug? Want to add new functionality? Contributions are warmly welcomed! See [CONTRIBUTING.md](https://github.com/codehearts/lightdm-webkit-theme-tendou/blob/master/CONTRIBUTING.md) to learn how this project is set up and what the expectations are.

[coverage-badge]: https://codecov.io/gh/codehearts/lightdm-webkit-theme-tendou/branch/master/graph/badge.svg
[coverage-link]:  https://codecov.io/gh/codehearts/lightdm-webkit-theme-tendou
[license-badge]:  https://img.shields.io/badge/license-MIT-007EC7.svg
[build-badge]:    https://travis-ci.org/codehearts/lightdm-webkit-theme-tendou.svg?branch=master
[build-link]:     https://travis-ci.org/codehearts/lightdm-webkit-theme-tendou
