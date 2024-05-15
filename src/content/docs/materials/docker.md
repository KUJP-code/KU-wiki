---
title: "Docker"
---

Docker is used to create/run containers, basically lightweight VMs. You can configure a custom environment (container) using a Dockerfile, and deploy that container to any major cloud provider without oworrying about differences between their environment and your local dev environment.

Rails > 7.1.2 comes with a Dockerfile by default, and if you need to build a more complex one the [Fly.io generator](https://github.com/fly-apps/dockerfile-rails) is helpful (and may have been merged into Rails anyway by the time someone other than me reads this).

## Stuff specific to us

There are a few things not in version control required to run compose for local testing, namely some environment variables needed by `docker-compose.yml`.

```
# .env/development/database

RDS_PASSWORD={whatever your password is}
RDS_USERNAME=postgres
RDS_DB_NAME=db_prototype_v2_development
POSTGRES_PASSWORD={whatever your password is}
POSTGRES_USERNAME=postgres
```

```
# .env/development/web

SECRET_KEY_BASE=1
RDS_HOSTNAME=database
S3_BUCKET_NAME=test
```

When you run docker-compose the first time you might get some database related errors because it's not set up yet. Just run `docker-compose exec -it bash` to get into the shell for the web container, then `bundle exec rails db:create` to set the DB up for the first time and `bundle exec rails db:migrate` to apply all the migrations. Also migrate each time you add new migrations.

Since login is required for all our sites you'll also want to `bundle exec rails c` while in the container shell and add an admin account to log in with.

## Installation

You'll want to go [here](https://www.docker.com/get-started/) for the community edition of Docker Desktop for your OS, then [to the docs](https://docs.docker.com/desktop/) for detailed installation instructions for your OS. You can technically just install the CLI and use that but if you need to read this you'll probably appreciate having a GUI.

Once you've completed the installation verify it worked by running `docker version` from the command line.

## Containers

A sandboxed environment to execute code in, similar to a VM but much closer to the metal since they just need a kernal, not a host OS and hypervisor.

## Images

Images supply containers with a specific environment, like the file system structure, environment variables and installed software. They can be viewed as a factory or abstract class for creating containers.

## Commands

### `docker build`

```shell
docker build [OPTIONS] PATH
```

Builds an image from a Dockerfile at the specified path. Works by building a throwaway container for each step in the Dockerfile which builds on the throwaway container from the previous step, or the FROM image if the first step. The final output image is added to your `docker images` list.

By default all files in PATH will be added to the image, solve this with a `.dockerignore`, much like a `.gitignore`.

Build steps are cached, so only the steps following the line you made a change on will need to be rebuilt. For this reason you wanna run your update & install commands together with && and packages on separate lines using | so you're not installing cached versions of packages from a previous image.

Along similar lines, you wanna copy your Gemfile/lock and bundle install prior to copying the entire project directory. That way unrelated changes to your project files won't require reinstalling all your gems, the layer will remain cached unless your Gemfile actually changes.

#### Options

- `- f` Specifies the name of the Dockerfile to use. Useful for building dev/prod/test containers.
- `- t` Specifies a tag for the image you're building. Can be supplied multiple times for multiple tags, once for each.

### `docker images`

Lists the available images, can add `prune` to remove old images. There's also `prune` commands for any other resource, and you can prune everything with `docker system prune`.

### `docker ps` & `docker ls`

Lists all running containers/images. If the container/image has been terminated you'll need `docker ps -a` to get a list of all containers.

### `docker rm **<ids>` & `docker rmi **<ids>`

Removes a container/image, or multiple containers/images if multiple IDs are provided.

### `docker run`

```shell
docker run [OPTIONS] <image> <command>
```

Starts a new container based on `<image>` and runs `<command>`. If the specified image isn't available locally it'll be pulled from the registry in layers.

#### Options

`- i` - Run the container in interactive mode, forwards STDIN/OUT from the container to the Docker Daemon. Often used with `- t` like `docker run -it` to pipe STDIN/OUT to a terminal emulator you can actually use.

`--name <name>` - Assign a name to the container.

`- p <host_port>:<container_port>` - Expose a port on the container at the specified host port. When using with rails s you wanna pass `bin/rails s -b 0.0.0.0` to bind all ipv4 addresses on the host, not just localhost.

`-- rm` - Remove the container when it exits

`- t` - Loads a terminal emulator. Often used with `- i` like `docker run -it` to pipe STDIN/OUT from/to the container.

`-v <host_path>:<container_path>` - Mount a host path to a container path. Files in the host path will be available and live-updated in the container. Remember you can use `${PWD}` for the current directory path. Files generated byt the container will be owned by root, so make sure to `chown` them if you need to edit them from the host system.

### `docker tag ID <name>:<tag>`

Tags existing image ID with the specified name and tag. If no tag is specified it'll default to `latest`. Multiple tags can be added to the same image.

## Dockerfiles

### CMD

Specifies a command to run on container initialization. Best written in 'exec' form, which is `CMD ["executable", "arguments"]`, an array of strings which construct the command when joined with spaces.

### COPY

Copies files from the host directory given as the first argument to the container directory given as the second.

### FROM

Sets the base image you're starting from, will download it if not present.

### LABEL

In the form `LABEL <key>=<value>` applies a label 'key' set to 'value', like `LABEL email=bretttanner171@gmail.com`. You can apply as many labels as you like, either in one line with a single LABEL or on multiple lines with multiple LABEL instructions, and any kind of metadata you want can be attached.

### RUN

Executes a command in the container, automatically executed with sudo.

Append `- yqq --no-install-recommends` to install the packages you need. `y` automatically answers yes to all prompts, `qq` is quiet and `--no-install-recommends` is to minimize the size of the built image.

### WORKDIR

Sets the default directory for commands to be run from in the container. You can use this like `cd` to change directories during Dockerfile execution, and the final directory will be set as the default working directory for the built image.

## Docker Compose

Allows you to coordinate and manage containers for the different services that make up your application. Launch your app with `docker-compose up`, `-d` launches it in detached mode, which launches the app in the background and returns you to the shell.

Images are only built if they don't exist, so remember to rebuild them with `docker-compose build` when you make changes.

The steps taken when running `docker-compose up` are:

1. Create a separate network for the app.
2. Create any non-locally mounted volumes like PG databases.
3. Builds an image for any service with a `build` key.
4. Creates a container from the image for each service.
5. Starts the containers.

Since Ruby usually buffers output to STDOUT you'll need to add `stdout.sync = true` to the top of `config/boot.rb` to prevent it from buffering.

You can shut compose down with `ctrl+c`, but occasionally that'll fail due to a bug so you might need to use `docker-compose stop`. That command also takes a service name in order to stop just that service.

### docker-compose.yml

A kind of dockerfile for your application, to describe the images your application requires and how they're run together.

Starts with a line specifying the version of Docker Compose you're using, followed by a list of services and the information needed to build them.

The build key sets the path for the dockerfile to build the image from, relative to docker-compose.yml.

There's also a 'ports' key which sets the ports to expose to the host.

The `command` key sets the command to run in the container like CMD in the dockerfile. Will override the default CMD in the dockerfile.

`volumes` lets you mount a volume (at a path given relative to the docker-compose.yml) to the container. You can use a '.' to mount the current directory rather than `${PWD}` like you would with -v when using `docker run`.

Testing is mostly the same, but if you wanna test with JS you'll need to add a selenium-chrome or other browser driver to your docker-compose.yml.

### Commands

- `build image_name` to build images, useful since compose will keep track of which Dockerfile belongs to which of your services.
- `down` undoes everything `up` does, the private network, associated services etc.
- `exec container_name` to execute a command in a running container. `run` will spin up a new container in the same network.
- `logs` with `-f` and a service name to `tail -f` the logs for that service.
- `pause`/`unpause` to pause/unpause containers
- `restart`, `stop` and `start` to stop and start services.
- `rm` removes the specified containers

### Rails-specific notes

- Don't use `ENV.fetch(key)` in database.yml, use the bracket notation instead `ENV['key']`
- If you want an interactive container session use `docker-compose run --service-ports <service_name>`; then you can interact with stuff like byebug breakpoints.
- To get the dev server to actually accept connections within docker you need to start rails s like this in the Procfile: `rails: bundle exec rails server -p 3001 -b 0.0.0.0`

### Named Volumes

Storage that persists outside containers and can be shared between them, kinda like S3 but for Docker. You can mount your DB storage there so it's not wiped when you recreate the container with these lines in docker-compose.yml:

```yml
services:
  database:
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

The path works just like mounting a file system volume, except the value before the colon is the name of the volume.

## Production Deployments

### AWS-Specific stuff

- Update dockerrun.aws.json with the new image tag
- Build the new image and push it to dockerhub
- `eb deploy -l <version>` to deploy

This workflow relies on having the eb cli installed, having it configured to target the correct application/environment and having the `AWS_EB_PROFILE` env variable set.

### Docker Swarm vs Kubernetes

Basically Kubernetes has more features, but is also more complex to configure and install. Since we're on AWS we'll probably use ECS or EKS, but having notes on Swarm/Kubernetes could still be useful to understand the concepts involved/potential alternatives. Also, using AWS stuff always means implementation details like IAM roles will leak into your orchestration config.

EKS charges 20c an hour per cluster for the management layer as well, so probably not that one.

Docker Swarm describes your application as a stack of services capable of being deployed using `docker-stack.yml`. You can also have one-shot services that run at startup to do something like migrate your database on deploy.

### Kamal

This is going to be included with Rails by default from 8.0 onwards, so might be handy to be familiar with. Especially if we decide to move away from AWS.

### Docker Registries

We'll use Dockerhub because it's the default. You can refer to an image using `<username>/<image_name>:<tag>`.
