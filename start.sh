#!/bin/bash

# Update the package list
sudo yum update -y  # or use `sudo dnf update -y` for Fedora 22 and later

# Install Docker
sudo yum install -y docker  # or `sudo dnf install -y docker` for Fedora

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Install Git
sudo yum install -y git  # or `sudo dnf install -y git`

sudo yum install https://rpm.nodesource.com/pub_18.x/nodistro/repo/nodesource-release-nodistro-1.noarch.rpm -y
sudo yum install nodejs -y --setopt=nodesource-nodejs.module_hotfixes=1

# Install Python 3.10 (Python version may vary based on the repository)
sudo yum install -y python3.10  # or `sudo dnf install -y python3.10`

# Clone the repository
git clone https://github.com/kacperadach/yt-thumbnails.git

# Change directory into the cloned repo
cd yt-thumbnails

# Install npm dependencies and build
npm install
npm run build

# Move the build directory to the python subdirectory
mv build python/

# Change directory into the python subdirectory
cd python

# Install npm dependencies in the python directory
npm install

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.6.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Run Docker Compose
docker-compose up -d --build

echo "Setup complete."