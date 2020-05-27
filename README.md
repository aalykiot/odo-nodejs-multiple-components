# Node.js multiple components using ODO

## Login to Openshift

```sh
$ odo login -u developer -p developer
```
For all of the above steps you have to be logged in to openshift.

## Create a new openshift project

```sh
$ odo project create nodejs-multi-project
```
A project is a workspace where we will deploy all of our components and services.

## Enable experimental mode

To be able to specify the deployment environment we have to enable odo's experimental mode.

```sh
$ odo preference set experimental true 
```

## Backend Service

Create new odo component
```sh
$ odo create nodejs nodejs-backend
```

Devfile
```
apiVersion: 1.0.0
metadata:
  generateName: nodejs-
projects:
  - name: nodejs-multiple-components-backend
    source:
      type: git
      location: "https://github.com/alexalikiotis/odo-nodejs-multiple-components.git"
components:
  - type: dockerimage
    alias: backend
    image: registry.access.redhat.com/ubi8/nodejs-12
    memoryLimit: 256Mi
    mountSources: true
    endpoints:
      - name: "nodejs-backend"
        port: 8080
commands:
  - name: devBuild
    actions:
      - type: exec
        component: backend
        command: npm install
        workdir: ${CHE_PROJECTS_ROOT}/nodejs-multiple-components-backend
  - name: devRun
    actions:
      - type: exec
        component: backend
        command: npm start
        workdir: ${CHE_PROJECTS_ROOT}/nodejs-multiple-components-backend
```

Deploy to openshift

```sh
$ odo push
```

## Frontend Service

Crete another odo component

```sh
$ odo create nodejs nodejs-frontend
```

Devfile

```
apiVersion: 1.0.0
metadata:
  generateName: nodejs-
projects:
  - name: nodejs-multiple-components-frontend
    source:
      type: git
      location: "https://github.com/alexalikiotis/odo-nodejs-multiple-components.git"
components:
  - type: dockerimage
    alias: frontend
    image: registry.access.redhat.com/ubi8/nodejs-12
    env:
      - name: BACKEND_COMPONENT_HOST
        value: "nodejs-backend"
      - name: BACKEND_COMPONENT_PORT
        value: "8080"
    memoryLimit: 256Mi
    mountSources: true
    endpoints:
      - name: "nodejs-frontend"
        port: 8080
commands:
  - name: devBuild
    actions:
      - type: exec
        component: frontend
        command: npm install
        workdir: ${CHE_PROJECTS_ROOT}/nodejs-multiple-components-frontend
  - name: devRun
    actions:
      - type: exec
        component: frontend
        command: npm start
        workdir: ${CHE_PROJECTS_ROOT}/nodejs-multiple-components-frontend
```

Expose a url for the frontend service

```sh
$ odo url create --port 8080 --host apps-crc.testing
```

Deploy to openshift

```sh
$ odo push
```

And we're done 👍
