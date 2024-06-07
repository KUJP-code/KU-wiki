---
title: Vision UP Promo Site
description: How to work on/deploy the Vision UP promo site.
---

## Working with Git

### Initial Setup

If you're starting from scratch, navigate to the folder you want to work on the site in then `git clone git@github.com:KUJP-code/vision-up-biz.git`. Next you need to run `git checkout deploy` to get a local copy of the deploy branch and switch to it, then `git switch main` to move back to the main branch, which is where you'll do most of your work.

### Making Changes

If you already have the folder, you could navigate to that folder in your terminal and run `git pull` to make sure you have the latest code, or just check you're up to date in the left sidebar if you're opening the project in VS Code.

You should also check you're on the main branch, either by entering `git branch` and checking there's a '\*' next to main in the terminal or looking at the bottom left of your VSCode window and verifying that it says main.

Once you've confirmed you're on main, feel free to start making changes. You can stage and commit your changes with `git add .` then `git commit -m "<message>"` from the command line, or using the '+' icon in VSCode's git interface on the left sidebar to stage all changes or individual files then typing a commit message and hitting enter. You should generally only commit changes when the project is in a working state, so it's safe to roll back to any commit when necessary. I generally make a commit when I finish a feature or a significant chunk of one if it's a big feature and I want to save my progress for easy rollback.

When you're ready to deploy, first `git push` while still on the main branch, then `git switch deploy`, `git merge main` and finally `git push` from the deploy branch to start the automatic deploy process.

In VSCode I think you'd do this by pushing from the git interface on the left sidebar, then clicking 'main' on the bottom left and taking the option to switch to the 'deploy' branch. You'd then open the command palette with `ctrl + shift + p` and type `Git: Merge Branch`, then choose to merge 'main' onto 'deploy'. Finally, you'd push your merged version of 'deploy' from the left sidebar to trigger the automatic deploy process.

## Git commands cheatsheet

All of these need to be run from the project folder.

- `git add .` - prepares all changes to be commited
  - `git add <filenames>` - adds specific files to be commited
- `git checkout .` - undoes all changes to existing files since the last commit (but won't remove new files)
- `git commit -m "<message>"` - commits changes, with the commit message set to `<message>`
- `git diff` - shows a breakdown of changes since last commit
- `git pull` - grabs the latest version of the code from Github
- `git push` - pushes code (from the current branch) to Github
- `git status` - shows which files have changed since the last commit
- `git switch <branch>` - switches to a different branch
