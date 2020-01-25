#FROM ubuntu
#RUN apt-get update
#RUN apt-get install -y git nodejs npm
#RUN git clone git://github.com/DuoSoftware/DVP-LimitHandler.git /usr/local/src/limithandler
#RUN cd /usr/local/src/limithandler; npm install
#CMD ["nodejs", "/usr/local/src/limithandler/app.js"]

#EXPOSE 8815

# FROM node:9.9.0
# ARG VERSION_TAG
# RUN git clone -b $VERSION_TAG https://github.com/DuoSoftware/DVP-LimitHandler.git /usr/local/src/limithandler
# RUN cd /usr/local/src/limithandler;
# WORKDIR /usr/local/src/limithandler
# RUN npm install
# EXPOSE 8815
# CMD [ "node", "/usr/local/src/limithandler/app.js" ]


FROM node:10-alpine
WORKDIR /usr/local/src/limithandler
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8815
CMD [ "node", "app.js" ]
