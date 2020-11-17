This scenario continues to explore how to build and deploy your applications as a Docker container. The previous scenario covered deploying a static HTML website. This scenario explores how to deploy a Node.js application within a container.
The environment is configured with access to a personal Docker instance, and the code for a default Expressjs application is in the working directory. To view the code use ls and cat <filename> or use the editor.
The machine name Docker is running on is called docker. If you want to access any of the services then use docker instead of localhost or 0.0.0.0.



Step 1 - Base Image
As we described in the previous scenario, all images started with a base image, ideally as close to your desired configuration as possible. Node.js has pre-built images available with tags for each released version.
The image for Node 10.0 is node:10-alpine. This is an Alpine-based build which is smaller and more streamlined than the official image.
Alongside the base image, we also need to create the base directories of where the application runs from. Using the RUN <command> we can execute commands as if they're running from a command shell, by using mkdir we can create the directories where the application will execute from. In this case, an ideal directory would be /src/app as the environment user has read/write access to this directory.
We can define a working directory using WORKDIR <directory> to ensure that all future commands are executed from the directory relative to our application.
Task: Define Base Environment
Set the FROM <image>:<tag>, RUN <command> and WORKDIR <directory> on separate lines to configure the base environment for deploying your application.

FROM node:10-alpine
RUN mkdir -p /src/app
WORKDIR /src/app




Step 2 - NPM Install
In the previous set, we configured the foundation of our configuration and how we want the application to be deployed. The next stage is to install the dependencies required to run the application. For Node.js this means running NPM install.
To keep build times to a minimum, Docker caches the results of executing a line in the Dockerfile for use in a future build. If something has changed, then Docker will invalidate the current and all following lines to ensure everything is up-to-date.
With NPM we only want to re-run npm install if something within our package.json file has changed. If nothing has changed then we can use the cache version to speed up deployment. By using COPY package.json <dest> we can cause the RUN npm install command to be invalidated if the package.json file has changed. If the file has not changed, then the cache will not be invalidated, and the cached results of the npm install command will be used.
Task: Add Dockerfile Lines
The following two lines are required in order Dockerfile to run npm install.
Copy to EditorCOPY package.json /src/app/package.json
RUN npm install
Copy the lines to the Dockerfile now so they can be used in the build later.
Protip
If you don't want to use the cache as part of the build then set the option --no-cache=true as part of the docker build command.

COPY package.json /src/app/package.json
RUN npm install




Step 3 - Configuring Application
After we've installed our dependencies, we want to copy over the rest of our application's source code. Splitting the installation of the dependencies and copying out source code enables us to use the cache when required.
If we copied our code before running npm install then it would run every time as our code would have changed. By copying just package.json we can be sure that the cache is invalidated only when our package contents have changed.
Task: Deploy Application
Create the desired steps in the Dockerfile to finish the deployment of the application.
We can copy the entire directory where our Dockerfile is using COPY . <dest dir>.
Once the source code has been copied, the ports the application requires to be accessed is defined using EXPOSE <port>.
Finally, the application needs to be started. One neat trick when using Node.js is to use the npm start command. This looks in the package.json file to know how to launch the application saving duplication of commands.
In the next step, we'll build and launch the image.

COPY . /src/app
EXPOSE 3000
CMD [ "npm", "start" ]




Step 4 - Building & Launching Container
To launch your application inside the container you first need to build an image.
Example: Build & Launch
The command to build the image is docker build -t my-nodejs-app .
The command to launch the built image is docker run -d --name my-running-app -p 3000:3000 my-nodejs-app
Testing Container
You can test the container is accessible using curl. If the application responds then you know that everything has correctly started.
curl http://docker:3000

Your Interactive Bash Terminal. A safe place to learn and execute commands.
$
$ docker build -t my-nodejs-app .
Sending build context to Docker daemon  17.92kB
Step 1/8 : FROM node:10-alpine
10-alpine: Pulling from library/node
cbdbe7a5bc2a: Pull complete
ca38b11cdc56: Pull complete
70377bd3b746: Pull complete
4ba0c0bc3a37: Pull complete
Digest: sha256:34d01a98b50563abff4a8e18269f35d4eb1f33e911a38dd14e4798e430af5cac
Status: Downloaded newer image for node:10-alpine
 ---> b328632eb00c
Step 2/8 : RUN mkdir -p /src/app
 ---> Running in 493815e09b9d
Removing intermediate container 493815e09b9d
 ---> cca0376613eb
Step 3/8 : WORKDIR /src/app
Removing intermediate container 2ea0f00a451a
 ---> 7cf552d677b6
Step 4/8 : COPY package.json /src/app/package.json
 ---> 0db189aedff4
Step 5/8 : RUN npm install
 ---> Running in 33feb91f4c38
npm WARN deprecated jade@1.6.0: Jade has been renamed to pug, please install the latest version of pug instead of jade
npm WARN deprecated constantinople@2.0.1: Please update to at least constantinople 3.1.1
npm WARN deprecated transformers@2.1.0: Deprecated, use jstransformer
npm notice created a lockfile as package-lock.json. You should commit this file.
added 78 packages from 74 contributors and audited 79 packages in 2.931s
found 31 vulnerabilities (11 low, 12 moderate, 7 high, 1 critical)
  run `npm audit fix` to fix them, or `npm audit` for details
Removing intermediate container 33feb91f4c38
 ---> 654313f2ab48
Step 6/8 : COPY . /src/app
 ---> 027755a8554b
Step 7/8 : EXPOSE 3000
 ---> Running in d6a8f65074b1
Removing intermediate container d6a8f65074b1
 ---> 971205eb38e8
Step 8/8 : CMD [ "npm", "start" ]
 ---> Running in 6a43c68158c3
Removing intermediate container 6a43c68158c3
 ---> 6e4c93a79f21
Successfully built 6e4c93a79f21
Successfully tagged my-nodejs-app:latest
$ docker run -d --name my-running-app -p 3000:3000 my-nodejs-app
b9ab9525801f50f30368b0e5a88946d5361107fcc9aeced2aef61efb71415b7b
$ curl http://docker:3000
<!DOCTYPE html><html><head><title>Express</title><link rel="stylesheet" href="/stylesheets/style.css"></head><body><h1>Express</h1><p>Welcome to Express</p></body></html>$ docker run -d --name my-production-running-app -e NODE_ENV=production -p 3000:3000 my-nodejs-app
402914d90ba275b0a763b82f4d5f083dfb4a26e52f78e2adc066a35b3e23b08b




Step 5 - Environment Variables
Docker images should be designed that they can be transferred from one environment to the other without making any changes or requiring to be rebuilt. By following this pattern you can be confident that if it works in one environment, such as staging, then it will work in another, such as production.
With Docker, environment variables can be defined when you launch the container. For example with Node.js applications, you should define an environment variable for NODE_ENV when running in production.
Using -e option, you can set the name and value as -e NODE_ENV=production
Example
docker run -d --name my-production-running-app -e NODE_ENV=production -p 3000:3000 my-nodejs-app

$ docker run -d --name my-production-running-app -e NODE_ENV=production -p 3000:3000 my-nodejs-app
docker: Error response from daemon: Conflict. The container name "/my-production-running-app" is already in use by container "402914d90ba275b0a763b82f4d5f083dfb4a26e52f78e2adc066a35b3e23b08b". You have to remove (or rename) that container to be able to reuse that name.
See 'docker run --help'.
