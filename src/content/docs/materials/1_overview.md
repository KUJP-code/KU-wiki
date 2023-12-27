---
title: Materials Site Overview
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

There are two ways we can go with this, a static site or a CMS type thing. Static site will be cheaper, faster and simpler but a CMS type setup would allow non-technical staff to modify marketing copy etc. more easily. There's also the hybrid approach of having a mostly static site which fetches some info as needed from the customer site where staff could create content.

### Fully static

My first preference would be a static site if possible, it'll be fast, simple and cheap. We could build it with Astro, same as this wiki but without the Starlight theme so we can make our own. Would also make it easier to add islands of dynamic content with Astro Islands, or transition to full server side rendering since Astro supports that as well. It also lets us use any frontend framework for components, so React, Svelte, Vue etc. are all fine. Opens up the possible contributors/ready made componenets we can use a bit, though I think we still wanna stick with one to keep things simple.

We could host it on S3, or on cloudflare pages since we're gonna be using them for our domains in the future anyway. Either way will be significantly cheaper than SSR, on cloudflare it could literally be free and on AWS we'd just need to pay for the S3 storage + bandwidth, maybe $5 a month tops.

I'd be surprised if doing it this way, fully static, took more than a month. It could very possibly take less than that depending on the complexity of the content/styling.

### Hybrid

We could also make the marketing site mostly static, with only some parts like a carousel of our current packages being dynamic. Could achieve this a number of ways. In this scenario non-tech staff could add content on the customer site (or seasonal site since they already have logins) which the marketing site would fetch whenever the relevant page is loaded. This probably slows down the page load by some amount, but we can mitigate that to some degree using a CDN and caching. Both of those add complexity though, which makes this probably the option which takes the longest. I need to make the CMS dashboard from the full SSR option, the static site, the dynamic parts of the static site and the APIs/CDN to glue all the components together. If it works out could be almost as fast as a static site, only a little more expensive and allow non-tech staff to modify the marketing site.

I'm not an expert on CDN pricing but given the pretty tiny volumes of data we work with I'd be surprised if it was more than an extra $5 a month.

### Full SSR

## Customer Site
