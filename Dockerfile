#############
### build ###
#############

# base image
FROM ubuntu:18.04

RUN apt-get update -y && apt install curl -y


RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - &&\
    apt-get install -y nodejs &&\
    npm install -g @angular/cli


# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# add app
COPY . /app

# install and cache app dependencies
RUN npm install

# generate build
RUN ng build --aot=true

# Start mean application
CMD ["node", "app.js"]
