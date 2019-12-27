# Services for Rolls apps

## Raison d'être
Centralize, version and share Services across Rolls Apps.

## Usage
- Clone the repository on your local machine
- `cd` into to the App where you are working
- Remove the current services directory with `rm -r src/services` 
- Copy the services direcory from this repo with `cp -r ../services/src/services src/services`
- Re-run the previous command after changing files this repo

## A note on Symlinks
Creating a Symlink from `src/services` in Apps to `--> src/services` directory in this repo was attempted, but required extra Webpack configuration as a workaround in order to work. 

We'll move straight from this hyper-simple and confusing approach, to creating a private Node package server whenever is needed.