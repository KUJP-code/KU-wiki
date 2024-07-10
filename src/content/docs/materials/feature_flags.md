---
title: Feature Flags
description: How we handle feature flags with Flipper
---

We use [Flipper](https://www.flippercloud.io/docs/introduction) to manage feature flags, mostly by organisation but we can also use them in the future to test with percentages of users.

There's a link to the dashboard in the admin links section, where you can create features and add access to them for specific groups/actors.

## Initializing groups

Groups are not created in the database, they're added programatically in an initializer. Right now we only have a group for each organisation, but if we were to add more `config/initializers/flipper.rb` would be the place to go.

Would be possible to manually add orgs here, but I decided to do it automatically by grabbing the list of orgs in the initializer and iterating over them. Keep in mind that since we're in an initializer, it's necessary to wrap the database access in `Rails.application.config.after_initialize` to ensure ActiveRecord is loaded first.

Because the groups are set in an initializer, once you create a new organisation it won't show up in the list of groups until you restart the server, causing the initializer to run again.

## Features

Features are best added through the dashboard. Always use snake_case to name features, and keep them as short as possible.

You can check a feature is enabled for a user with `Flipper.enabled?(:feature_name, user)`.

Checking if a feature that doesn't exist is enabled doesn't throw, it just logs a warning and returns false.
