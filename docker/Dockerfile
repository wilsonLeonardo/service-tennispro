# @version 3.7.5

FROM ubuntu:16.04
MAINTAINER Marcos Freitas <marcos@okn.com.br>

EXPOSE 80
EXPOSE 443
EXPOSE 3001

# !!! This condition will persists after the build, maybe we should use ARGS instead or define it on shell script
ENV DEBIAN_FRONTEND noninteractive

# fix locale error when running container
RUN apt-get update
RUN apt-get install -y locales locales-all sudo

ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8

ADD vhost /vhost
RUN rm /vhost/vhost-app.conf && mv /vhost/vhost-api.conf  /vhost/vhost-app.conf

ADD fail2ban /fail2ban

ADD configurations.sh /
ADD functions.sh /

RUN chmod +x /functions.sh
RUN chmod +x /configurations.sh

RUN cd / && ./configurations.sh -d -iall
RUN wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash    
CMD echo ~/.bashrc && nvm install v10.15.0
RUN apt-get -y install php7.2-pgsql postgresql-9.5
RUN sed -i 's/;extension=pdo_pgsql/extension=pdo_pgsql/g' /etc/php/7.2/fpm/php.ini

RUN curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
RUN apt-get install -y nodejs

WORKDIR /var/www/html

CMD service nginx start && service php7.2-fpm start && /bin/bash