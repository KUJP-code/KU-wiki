---
title: Overview
---

My initial plan for the materials site structure.

## Requirements from Leroy

- Marketing site for prospective customers where they can view the packages and send their details to sign up
- A storage solution for all the materials
- Customer site for signed up customers to access all the materials in their package.
  - There will also be a custom tailor made package option.
- Materials should be downloadedable, printable from and if possible castable to TVs.
- It will be a subscription service, so we need a way to keep track of customers subscriptions too.

## Marketing Site

I think we should go for a fully static site for this, both for SEO and performance. Having static content also makes it much easier to ensure everything looks good on all devices as you don't have such a wide range of potential content to make work.

We should use Astro as a framework to generate the site since it's faster to work with than vanilla JS and gives a lot of handy features like letting you use any frontend framework (React, Svelte, Angular etc.) and the ability to go for hybrid/full SSR in the future if we want to for some reason.

For hosting we could chuck it on S3, or Cloudflare Pages if we do what I think we should and get the new domain on Cloudflare/transfer the .app domain to Cloudflare. Static sites are free on Cloudflare and nearly free on S3, just have to pay for the storage which is trivial.

Sign up form could either send to the customer site API, or we could redirect them to the customer site sign up page.

## Customer Site

I think this one should be Rails, since it'll need to be dynamically generated/have users/roles etc. We'd host on Elastic Beanstalk just like we do now.

The main choice is whether to make it part of the current seasonal site or its own entirely separate thing on a different server. I'd say separate servers is clearly the better choice, but depends on whether we want to commit ~$20 a month to a new business out of the gate.

Would be possible to start as part of the seasonal site then split into a separate one later if needed or vice versa, but there'd be a not-insignificant amount of friction involved in switching. Gets harder to switch the more changes we make with them separate/together as they'll diverge more and more.

### Part of the seasonal site

##### Pros

- Cheaper, < $5 a month extra compared to our baseline bill
- Will save some time as I don't have to do the initial AWS/Rails setup
- Everything in one place for staff who interact with both seasonal & materials sites (though mostly just admins I guess?)
- Consistent branding (if we want that)

##### Cons

- Will also waste some time making it fit into the current Site
- Will be more complex, for stuff like security I'll always have to consider an extra set of roles and permissions going forward
- If one site goes down, so does the other. e.g. the platform upgrade we need to do after spring would also take down the materials site
- Could be difficult to style, the seasonal site uses Bootstrap which is not ideal for fancy stuff, and replacing it with Tailwind/using both is a lot

### Separate

##### Pros

- Greenfield projects are always nice, we start on the latest version of Ruby/Rails, latest AWS platform, with all my accumulated knowledge and no legacy code
- If one site goes down it doesn't affect the other
- Much easier to style as I can ditch Bootstrap and use Tailwind without having to run both at once/rework all the seasonal site's styling
- Differentiated from the teaching side (if we want that)

##### Cons

- More expensive, likely about as much as the full cost of the seasonal site (~ $20 a month). Only thing we could maybe share is the S3 bucket, not a big cost
- Initial setup will take some time, but not that much. I'm a lot more familiar with AWS these days, and the initial Rails setup is short/will let me make some better decisions than I did last time
