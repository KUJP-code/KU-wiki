---
title: Platform Upgrades
description: A guide to EB platform upgrades
editUrl: false
---

From time to time AWS will deprecate the platform our server is running on, or we'll need to upgrade earlier than that for other reasons. This guide walks you through how to do that.

I'll also include instructions for specific upgrades, like the Puma gem, which can be a little trickier than a regular gem upgrade.

## Platform Upgrades

:::danger
DO NOT TRY THIS ON LIVE FIRST! Always spin up a test environment using the following steps. Platform upgrades can definitely have breaking changes, and you don't want to be trying to troubleshoot them while the main site is down.
:::

### [Cloning the environment](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.managing.clone.html)

Go to the production environment and select 'Clone this environment' from the Actions dropdown. In the menu which appears, ensure the platform version is exactly the same as the current one, since AWS will sneakily try to force you onto the latest. We want an exact copy so we can test upgrading from the version we're actually on.

Associated resources like the database and S3 will also be copied, but not the data on them. So you'll need to SSH in and set up an admin account at minimum so you can actually log in, then create any other data you need for the testing you're doing.

Once you've created the clone, upload the new application version with the changes you wanna test and deploy it to the new testing environment. Then test without worrying about destroying prod!

## Puma Upgrades

AWS' Ruby platform has its own fixed version of Puma, which we're sometimes going to want to be ahead of for security or performance reasons.

If you try to push the app with a different version of Puma to what the platform has, you have a lot of error log reading to look forward to. Currently the way around this is to include a `Procfile` in the project root containing `web: bundle exec puma -C /opt/elasticbeanstalk/config/private/pumaconf.rb`, and to set the following ENV variables in the configuration pane of elasticbeanstalk:

```
BUNDLER_DISABLE_SHARED_GEMS = 1
BUNDLE_PATH = vendor/bundle
```

This ensures we use the versions of gems defined in our Gemfile rather than those on the AWS platform, and provides a path to install those gems in.

## Rails Upgrades

:::danger
Don't do this as soon as a new Rails version comes out. The various gems we rely on aren't gonna be updated instantly, we need to wait for them to be compatible with the latest major Rails release before upgrading (Devise/PaperTrail especially).
:::
