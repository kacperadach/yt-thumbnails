#!/bin/bash

# Update the package list
sudo apt update -y

# Install Docker
sudo apt install -y docker.io

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Install Git
sudo apt install -y git

sudo apt install -y nodejs
sudo apt install -y npm

# Install Python 3.10 (or the latest available version in the Ubuntu repositories)
sudo apt install -y python3.10

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

# Install Docker Compose (The version might change, so check the latest version on the Docker Compose GitHub page)
sudo apt install docker-compose

# Run Docker Compose
docker-compose up -d --build

echo "Setup complete."