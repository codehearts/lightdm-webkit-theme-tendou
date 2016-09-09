## Tendou for LightDM

A Windows 10 inspired theme for LightDM. [Try the demo](http://codehearts.github.io/lightdm-webkit-theme-tendou/) and see if you like it! This theme isn't intended to look exactly like Windows 10, but feel free to fork this and tweak the styles.

![](https://raw.githubusercontent.com/codehearts/lightdm-webkit-theme-tendou/master/screenshot.png)

This theme allows for switching users, but not graphical sessions. It also allows you to shutdown/restart/sleep from the menu in the bottom right.

The code for the waiting indicator when logging in is based on [this pen](http://codepen.io/vineethtr/pen/GJpxoQ) by @vineethtrv.

### Contributing
Simply fork this repo, make a branch, and open a pull request with your changes! This project uses Hound CI for keeping code clean, Travis CI for automated builds, and Codecov for coverage.

#### Testing
Tests are written using Mocha with Sinon and Chai. A local build environment is provided as a Vagrant VM. You'll need Vagrant installed locally, and then you can `vagrant up` and `vagrant ssh`. Run tests with `npm test` and lint code with `jshint js/main.js`

### Roadmap
- [x] Messages for invalid passwords
- [ ] Keyboard shortcuts for power actions
- [ ] Keyboard shortcuts for user switching
- [ ] Graphical session choice support
