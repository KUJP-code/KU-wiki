---
title: "Docker"
---

Docker is used to create/run containers, basically lightweight VMs. You can configure a custom environment (container) using a Dockerfile, and deploy that container to any major cloud provider without oworrying about differences between their environment and your local dev environment.

## Installation

You'll want to go [here](https://www.docker.com/get-started/) for the community edition of Docker Desktop for your OS, then [to the docs](https://docs.docker.com/desktop/) for detailed installation instructions for your OS. You can technically just install the CLI and use that but if you need to read this you'll probably appreciate having a GUI.

Once you've completed the installation verify it worked by running `docker version` from the command line.

## Containers

A sandboxed environment to execute code in, similar to a VM but much closer to the metal since they just need a kernal, not a host OS and hypervisor.

## Images

Images supply containers with a specific environment, like the file system structure, environment variables and installed software. They can be viewed as a factory or abstract class for creating containers.

## Commands

### `docker run`

```shell
docker run [OPTIONS] <image> <command>
```

Starts a new container based on `<image>` and runs `<command>`. If the specified image isn't available locally it'll be pulled from the registry in layers.

#### Options

-- rm - Remove the container when it exits

### `docker ps` & `docker ls`

Lists all running containers/images. If the container/image has been terminated you'll need `docker ps -a` to get a list of all containers.

### `docker rm **<ids>` & `docker rmi **<ids>`

Removes a container/image, or multiple containers/images if multiple IDs are provided.
