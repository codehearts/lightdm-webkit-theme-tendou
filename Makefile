DOCKER=docker
DOCKER_TAG=codehearts/lightdm-webkit-theme-tendou:latest

REPO_ROOT=$(shell git rev-parse --show-toplevel)

test: docker_installed
	$(DOCKER) pull $(DOCKER_TAG)
	$(DOCKER) run --rm -v $(REPO_ROOT):/app $(DOCKER_TAG)

docker_build: docker_installed
	$(DOCKER) build --rm -t $(DOCKER_TAG) .

docker_push: docker_installed
	$(DOCKER) push $(DOCKER_TAG)

docker_installed:
ifeq (, $(shell which $(DOCKER)))
    $(error Docker is required for testing, see https://www.docker.com to get set up)
endif

.PHONY: test docker_build docker_push docker_installed
