---
title: WSL Dev Environment Setup
description: A guide on setting up your dev environment to contribute to the registration site, in the Windows Subsystem for Linux (WSL).
editUrl: false
---

A guide on setting up your dev environment to contribute to the registration site, in the Windows Subsystem for Linux (WSL)

## Prerequisites

You should use Windows Terminal for this, it'll make things like auto-opening to the correct directory a lot easier later
Ensure you have VSCode installed (on windows), with the WSL extension enabled. It will allow you to call VSCode from the Ubuntu command line but interact with it in Windows as usual.

## Installing WSL

Follow [this link](https://aka.ms/wslstorepage) to install the latest version of WSL from the Microsoft Store

- It won't work if have a running WSL, so either terminate all running instances or just reboot to be sure

## Installing Ubuntu

Once it's installed, search the Microsoft Store for Ubuntu and install the 22.04LTS release
![screenshot of the Windows Store page for Ubuntu 22.04](https://user-images.githubusercontent.com/100023145/230699841-0455dac9-22c8-430f-aa0c-0b958500daf7.png)

Open your new Ubuntu install from the start menu, and create a user account when prompted
![screenshot of account creation prompt](https://user-images.githubusercontent.com/100023145/230699944-e93f1a49-b66c-4d95-9664-b302768b564c.png)

Then type `cd /home/<your username here>` into the terminal to get to your user folder
Type `mkdir repos`, then `cd repos` to enter your newly created folder

To save time later, you'll want to set WSL to open to your repos folder with admin privileges on startup. Click the down arrow at the top of Windows terminal, then go to settings and scroll down to Profiles in the tab that appears. Edit your Ubuntu 22.04 LTS profile to start in your repos directory by setting the starting directory to '/home/<your username>/repos' and stop an annoying bug by changing the command line from Ubuntu 22.04.exe to 'C:\WINDOWS\system32\wsl.exe -d Ubuntu-22.04'.
Save your changes.

![screenshot of Windows Terminal Ubuntu settings to change](https://user-images.githubusercontent.com/100023145/230700847-463b5c81-3da1-4eae-b481-1e63b6d393b9.png)

Finally, scroll up to the 'Startup' tab at the top of options and set 'Ubuntu 22.04 LTS' as your default profile, then save

![screenshot of Windows Terminal startup settings to change](https://user-images.githubusercontent.com/100023145/230700350-673ef9f5-1fec-4d08-a7c2-e133fe66c3ac.png)

Now exit out of Windows terminal and re-open it to reboot WSL. You should open right into your repos directory. Run `sudo apt update && sudo apt upgrade` to get all the latest stuff downloaded, then `sudo apt install build-essential` to get some compilers etc. we'll need later.

## Installing Ruby

Install some key dependencies with `sudo apt install gcc make libssl-dev libreadline-dev zlib1g-dev libsqlite3-dev`

Clone the rbenv (a ruby version manager) repo with `git clone https://github.com/rbenv/rbenv.git ~/.rbenv`, then run the following commands one after the other to add it to your PATH (so you can call it with rbenv --whatever command)

```bash
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
exit
```

The final one will exit your terminal, reopen it then install ruby-build to help compile your ruby versions with

```bash
mkdir -p "$(rbenv root)"/plugins
git clone https://github.com/rbenv/ruby-build.git "$(rbenv root)"/plugins/ruby-build
```

Check rbenv was installed correctly with `rbenv -v`, which should produce rbenv followed by a version number.
If it is, we're now ready to install Ruby 3.0.6, the version we're currently on (If it's not 2023, maybe check with Brett if this is still the right version). Enter `rbenv install 3.0.6 --verbose`, and settle in to wait for 10ish minutes. Maybe make yourself a nice cup of tea. Once it's done enter `rbenv global 3.0.6`, then exit and restart your terminal so it takes effect.

## Installing PostgresQL

Enter `code .` just to make VSCode install the server necessary for using it through WSL but having the GUI in Windows.

### Enabling postgres to auto-run on startup

Give yourself ownership of the /etc folder so you can edit the startup settings, copy the following code into /etc/wsl.conf after opening it with /etc/wsl.conf, save and close the file, then give ownership of the folder back to root using the commands in the image below, but for your username.

```bash
[boot]
systemd=true
```

![screenshot of permissions commands](https://user-images.githubusercontent.com/100023145/230776384-b89fa54c-2250-4dd8-82f3-eb0f3d3e2bde.png)
Finally, exit your terminal and restart all WSL instances by opening command prompt and entering `wsl.exe --shutdown`. Then re-open your WSL terminal and continue, after verifying systemcl is working with `systemctl list-unit-files --type=service`. (It should produce a list of running services).

Now we can install PG and related packages with `sudo apt install postgresql postgresql-contrib libpq-dev`
Then set it to auto-run on startup with `sudo systemctl start postgresql.service`

Create a PG role using `sudo -i -u postgres createuser --interactive`, choose yes when asked if role should be a superuser. **Role name should be the same as your linux username**.

Create an associated database with `sudo -i -u postgres createdb <linux_username>`.

Finally, we should secure our database. Enter the following commands in order to open the PG command prompt, set a password for your role and grant that role all privileges.

```bash
psql
\password <role_name>
grant all privileges on database <role_database_name> to <role_name>;
\q
```

Then export the password as an ENV variable so it can be auto accessed with `echo 'export DATABASE_PASSWORD="<role_password>"' >> ~/.bashrc`

## Cloning the project

To connect to gitbhub we need an SSH key. Generate one with `ssh-keygen -t ed25519 -C "your_email@example.com"` (remember to actually use your email here unlike I did that one time), then mash enter until it stops prompting you.

Start the SSH agent then add your key with

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

Read the key with `cat ~/.ssh/id_ed25519.pub` then copy it into your SSH keys on github [here](https://github.com/settings/keys).

Now you can go to [the repo](https://github.com/KUJP-code/db_prototype_v2_official), click the green code button, make sure SSH is selected then copy the string below into your terminal like so

```bash
git clone git@github.com:KUJP-code/db_prototype_v2_official.git
```

When asked if you want to add it to the list of known hosts type yes, I promise you can trust me)

## Setting up the project

cd into the project directory with `cd db_prototype_v2`, then run `gem install bundler -v 2.4.7` to install the correct version of bundler, then run it with `bundle install`.

Install a JS runtime (NodeJS) with `sudo apt-get install nodejs`.

Enable the 'rails' shortcut command with `sudo apt install ruby-railties`,

Set up the test database with `rails db:prepare`.

Then run `rails s` to start the server.

Congrats, you're done!!

## Working on the Project

From the directory which opens when you open WSL, type `cd db_prototype_v2`

- or just 'cd d' then hit tab for autocomplete
  Open the whole project in VSCode by entering `code .`

Once you open VSCode, make sure you're on the correct branch for the feature you're working on by checking the bottom left corner.

<img width="417" alt="Screenshot of the branch info" src="https://user-images.githubusercontent.com/100023145/231048062-4729e46c-2db1-4810-904e-52ded8a5b46d.png">

If you're not, just click the name of the branch you're on and then click the correct branch on the list that appears.

<img width="636" alt="Screenshot 2023-04-11 at 12 23 56" src="https://user-images.githubusercontent.com/100023145/231048181-0ead7d03-af6a-4e21-8fa1-23bb23145276.png">

To view your changes live, just run `rails s` from the project directory and open localhost:3000/ in your browser of choice.

**If you've had to pull changes from the main repo, you should probably reset the database as it's likely to have changed. Do this with:**

```bash
rails db:drop
rails db:prepare
```
