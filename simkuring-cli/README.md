# Simkuring CLI


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
$ cd simkuring-cli
$ npm install
```

## CLI Workflow
- Install cli globally
```
$ npm install -g
```

- Make symlink
```
$ npm link
```

- Set Cageur API target
```
$ simkuring target set http://localhost:5000
```

- Login with username and password
```
$ simkuring target login -u rudi@cageur.com -p Cageur@123!
```

- Perform various actions with format: `simkuring <object> <command> [flags]`
```
$ simkuring patient get
$ simkuring patient import -f data.csv
$ simkuring clinic get
$ simkuring about
```

- Help
```
$ simkuring --help
```
