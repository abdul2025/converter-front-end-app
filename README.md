# ConverterApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.13.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)


## Build Start the project
- docker-compose -f docker-compose.yml up --build ## if not exsited build it and start
- docker-compose -f docker-compose.yml build --no-cache ## force to create a new build even if exsited



## Build cloudflare server HTTPS testing
- cloudflared tunnel --url http://localhost:4200/

## Project Structure

```plaintext
.
├── converter/ # src
│   └── ** x Files **
├── converter/ # ** x configuration Files **
