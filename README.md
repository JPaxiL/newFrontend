# GLTRACKER

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.12.

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

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


## try new update
## second try new update

## create route module
## ng g m about --route=about -m app-routing.module.ts

## hotfix
## second hotfix
docker network create --subnet 10.10.0.0/24 service-network


docker run \
  --detach \
  --restart always \
  --publish 80:80 \
  --publish 443:443 \
  --name nginx-proxy \
  --network service-network \
  --volume /var/run/docker.sock:/tmp/docker.sock:ro \
  --volume nginx-certs:/etc/nginx/certs \
  --volume nginx-vhost:/etc/nginx/vhost.d \
  --volume nginx-html:/usr/share/nginx/html \
  jwilder/nginx-proxy



docker run \
  --detach \
  --restart always \
  --name nginx-proxy-letsencrypt \
  --network service-network \
  --volumes-from nginx-proxy \
  --volume /var/run/docker.sock:/var/run/docker.sock:ro \
  --volume /etc/acme.sh \
  --env "DEFAULT_EMAIL=mail@yourdomain.tld" \
  jrcs/letsencrypt-nginx-proxy-companion


docker run \
  --detach \
  --restart always \
  --name hello-world \
  --network service-network \
  --env VIRTUAL_HOST=hello-world.example.com \
  --env LETSENCRYPT_HOST=hello-world.example.com \
  --env LETSENCRYPT_EMAIL="youremail@example.com" \
  tutum/hello-world


  -- prod