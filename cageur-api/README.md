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

## other option to install heroku-toolbet
go to this link, https://devcenter.heroku.com/articles/heroku-cli
download the package of osx to install heroku CLI.

- Verify your installation, type this command on your terminal
$ heroku --version

``` you will got something like heroku-cli/x.y.z 


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

## How to use cageur-api

## Clinic API
- Clinic API : Get Data
GET : http://localhost:5000/api/v1/clinic

- Clinic API : Detail Data
GET : http://localhost:5000/api/v1/clinic/:id

- Clinic API : Insert Data
POST : http://localhost:5000/api/v1/clinic

- Clinic API : Update Data
PUT : http://localhost:5000/api/v1/clinic/:id

- Clinic API : Delete Data
DELETE : http://localhost:5000/api/v1/clinic/:id

## Patient API
- Patient API : Get Data
GET : http://localhost:5000/api/v1/patient

- Patient API : Detail Data
GET : http://localhost:5000/api/v1/patient/:id

- Patient API : Insert Data
POST : http://localhost:5000/api/v1/patient

- Patient API : Update Data
PUT : http://localhost:5000/api/v1/patient/:id

- Patient API : Delete Data
DELETE : http://localhost:5000/api/v1/patient/:id

## Patient Disease Group API
- Patient Disease Group API : Get Data
GET : http://localhost:5000/api/v1/patient_disease_group

- Patient Disease Group API : Detail Data
GET : http://localhost:5000/api/v1/patient_disease_group/:id

- Patient Disease Group API : Insert Data
POST : http://localhost:5000/api/v1/patient_disease_group

- Patient Disease Group API : Update Data
PUT : http://localhost:5000/api/v1/patient_disease_group/:id

- Patient Disease Group API : Delete Data
DELETE : http://localhost:5000/api/v1/patient_disease_group/:id

## Disease Group API
- Disease Group API : Get Data
GET : http://localhost:5000/api/v1/disease_group

- Disease Group API : Detail Data
GET : http://localhost:5000/api/v1/disease_group/:id

- Disease Group API : Insert Data
POST : http://localhost:5000/api/v1/disease_group

- Disease Group API : Update Data
PUT : http://localhost:5000/api/v1/disease_group/:id

- Disease Group API : Delete Data
DELETE : http://localhost:5000/api/v1/disease_group/:id

- Notes :
`db installation`, please running the query that i push to this branch. 
named `clinic.sql` , `patient.sql` , and `disease_group.sql`.

update new branch to online git storage