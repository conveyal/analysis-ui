# Scenario editor

Conveyal's tools for editing land-use/transportation scenarios.

## Configuration

### [Analyst](https://github.com/conveyal/analyst) Server

The Scenario Editor needs an Analyst backend running to point at. By default it expects it to be running at `http://localhost:7070`.

### Authentication with [Auth0](https://auth0.com/)

Copy the `/configurations/default/env.yml.tmp` to `/configurations/default/env.yml` and add your credentials.

## Install & Run with [Node 6+](https://nodejs.org/en/download/current/)

```bash
$ npm install && npm start
```


