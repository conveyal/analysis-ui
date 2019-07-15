# Analysis UI

This is the user interface component of [Conveyal Analysis](http://conveyal.com/analysis), which allows users to create public transport scenarios and evaluate them in terms of cumulative opportunities accessibility indicators. 

Please note that Conveyal does not provide technical support for third-party deployments of Analysis. We provide paid subscriptions to a cloud-based deployment of this system which performs these complex calculations hundreds of times faster using a compute cluster. This project is open source primarily to ensure transparency and reproducibility in public planning and decision making processes, and in hopes that it may help researchers, students, and potential collaborators to understand and build upon our methodology.

## Configuration

### [Analysis Backend](https://github.com/conveyal/analysis-backend)

The Scenario Editor needs an Analysis Backend running to point at. By default it expects it to be running at `http://localhost:7070`.

### Authentication with [Auth0](https://auth0.com/)

Copy the `/configurations/default/env.yml.tmp` to `/configurations/default/env.yml` and add your Auth0 credentials. If you're running locally (for testing or development) you don't need to use Auth0. Just comment out the Auth0 lines and it should work. You'll also need some tile URLs for Leaflet. The default Mapbox URLs require an access key. If you're at Conveyal, you can grab these keys and other settings from our se-configurations repository on Github.

## Install & Run with [Node 6+](https://nodejs.org/en/download/current/)

First make sure you're running the latest Node and NPM. For example, on a Mac using Homebrew:

```bash
$ brew update
$ brew upgrade node
```

Then build and start the scenario editor:
```bash
$ npm install && npm start
```


