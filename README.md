# Scenario editor

Conveyal's tools for editing land-use/transportation scenarios.

## Configuration

To use `Auth0`, copy the `/configurations/default/env.yml.tmp` to `/configurations/default/env.yml` and edit it with your credentials.

## Run with [`mastarm`](/conveyal/mastarm)

```bash
$ npm install -g mastarm
$ mastarm serve lib/index.js --proxy http://localhost:7070
```
