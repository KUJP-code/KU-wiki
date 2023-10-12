---
title: Registration Site Overview
description: An overview of the wiki contents related to the seasonal registration site.
editUrl: false
---

This section relates to the seasonal (and party) registration site, built with Ruby on Rails and hosted on AWS Elastic Beanstalk.

If anyone other than me reads this, and I didn't have time to go back and clean up, I really do apologise for the code quality. I started this project straight after finishing the Rails path of the Odin Project, and leant **a lot** as I was working on this.

## Handy Rails commands

When using ssh, navigate to the project folder using `cd /var/app/current` before running any rails-specific commands.

`bundle exec rake db:migrate RAILS_ENV=production` to run migrations in production
`RAILS_ENV=production bundle exec rails c` to access the rails console in production

## Image Processing

Use `sharp-cli`. Install with `npm install -g sharp-cli` (it won't run on Bun, has a heavy dependence on Node).

Common usage is to `cd` into the folder containing your images, then run `npx sharp -i ./filename -o ./ -f "avif"`. You can append the `--nearLossless` option if you're unhappy with the resulting image quality, and it's possible to mass convert images using a blob matcher like `npx sharp -i './*.png' -o ./ -f "avif"`.

A full list of commands and options can be found [here](https://github.com/vseventer/sharp-cli), there are more than you can even think of.
