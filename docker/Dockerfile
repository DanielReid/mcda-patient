FROM ubuntu:14.04

RUN apt-get update
RUN apt-get install -y curl unzip
RUN curl -sL https://deb.nodesource.com/setup_5.x | bash -
RUN apt-get install -y nodejs git
RUN npm install -g bower

ARG sha=master

RUN curl -sL https://github.com/gertvv/mcda-patient/archive/$sha.zip -o mcda-patient.zip
RUN unzip mcda-patient.zip && mv mcda-patient-* mcda-patient

RUN cd /mcda-patient/ && npm install --production
RUN cd /mcda-patient/resources/public && bower install --allow-root

ADD run.sh /
RUN chmod +x /run.sh

EXPOSE 8080
CMD /run.sh
