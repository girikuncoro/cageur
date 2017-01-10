# Cageur API
This is `cageur-api` component responsible for serving API to `cageur-ui` and connect to `cageur-db`.

## Setup
This project is currently setup for Unix/OSx.

## Requirements
Download and install from https://nodejs.org
- Node >= 6
- NPM >= 3

## How to Install
- Clone this repo
```
$ git clone https://github.com/girikuncoro/cageur.git
```
- Install package dependencies
```
$ cd cageur-api
$ npm install
```
- Install heroku command line from https://devcenter.heroku.com/articles/heroku-command-line or brew
```
$ brew install heroku-toolbelt
```

## Common Development Task
- Run the mocha test scripts (make sure docker compose for test is running)
```
$ npm run test
```
- Run the eslint for all js files
```
$ npm run lint
```
- Run development server with filewatch
```
$ npm run server:dev
```
