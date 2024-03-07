---
title: Overview
---

## Automated Deployment

I added a custom rake task to deploy the app to elastic beanstalk. It requires you to be authenticated with the eb cli and docker, as well as for the docker daemon to be running. In order, it:

1. Is invoked with `rails "eb:deploy"`
2. Fetches the current deployed version and asks you to input the new version
3. Offers a prompt comparing that with the version you're planning to deploy and requires confirmation to continue
4. Builds a docker image with the current state of your directory (including uncommitted files)
  - It's tagged with the version you provided
5. Pushes that image to docker hub
6. Updates 'dockerrun.aws.json' with the new image/tag
7. Deploys 'dockerrun.aws.json' to elastic beanstalk as an artifact
8. Tails the deployment logs from 'eb deploy'
