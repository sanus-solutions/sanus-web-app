# SanusApp

## TODO
* Add in alerts for out of ratio. I will do 2 teachers for every 5 kids right now.

### Less Important TODOS
* Redo the entire schema design to make it more relatable to a daycare environment (not enough time atm to complete this)
* Implement Last Seen timestamp when a user clicks on a "room"
* Make sure node server can run without MongoDB Running
* Add in better login/user personalization 
* Add in a new API route to get the number of "rooms" so that map creation is dynamic instead of hardcoded
* Add RESET button for MongoDB




## MongoDB
Currently, the database is split into 3 parts.

`db.employees`
`db.map`
`db.cameras`
`db.account`

### Account
`account.[name].[alerts]`




This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
