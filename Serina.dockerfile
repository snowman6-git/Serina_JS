FROM ubuntu:latest

RUN apt-get update -y && apt-get upgrade -y 
RUN apt-get install mysql-server -y 
RUN echo "work!"
CMD ["/usr/bin/mysql", "-u", "root"]