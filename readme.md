## Tendou for LightDM

A Windows 10 inspired theme for LightDM. [Try the demo](http://codehearts.github.io/lightdm-webkit-theme-tendou/) and see if you like it! This theme isn't intended to look exactly like Windows 10, but feel free to fork this and tweak the styles.

![](https://raw.githubusercontent.com/codehearts/lightdm-webkit-theme-tendou/master/screenshot.png)

This theme allows for switching users, but not graphical sessions. It also allows you to shutdown/restart/sleep from the menu in the bottom right.

The code for the waiting indicator when logging in is based on [this pen](http://codepen.io/vineethtr/pen/GJpxoQ) by @vineethtrv.

### Contributing
Simply fork this repo, make a branch, and open a pull request with your changes! This project uses Hound CI for linting, Travis CI for automated builds, and Codecov for coverage.

#### Testing
Tests are written using Mocha with Sinon and Chai. The build environment is provided as a Docker container tagged `codehearts/lightdm-webkit-theme-tendou`. You'll need Docker installed locally, then you can run `make test` to lint and test your changes. Rebuilding the Docker container can be done with `make docker_build`, and the container can be pushed to Docker Hub with `make docker_push`. To change the tag when building, add `DOCKER_TAG=<your tag>` after the `make` command (`make docker_build DOCKER_TAG=local-tendou`).

### Roadmap
- [x] Messages for invalid passwords
- [ ] Keyboard shortcuts for power actions
- [x] Keyboard shortcuts for user switching
- [ ] Graphical session choice support
