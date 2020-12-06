FROM ubuntu:20.04
MAINTAINER Mark Voytov <marchello-sobaka@yandex.ru>

ENV TZ=Europe/Moscow 
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt-get clean && \
    apt-get update && \
    apt-get install -y apache2 python

# fix "Problems with CGI"
RUN cd /etc/apache2/mods-enabled && \
    ln -s ../mods-available/cgi.load

COPY brat-v1.3_Crunchy_Frog.tar.gz /var/www/
RUN \
    cd /var/www && \
    tar -xvzf *.tar.gz && \
    rm *.tar.gz && \
    mv brat*/ brat/

ARG username
ARG password
ARG admin_email

ADD install.sh /var/www/brat/
RUN chmod +x /var/www/brat/install.sh
RUN /var/www/brat/install.sh $username $password $admin_email

ADD 000-default.conf /etc/apache2/sites-available/000-default.conf
# Make sure apache can access it
RUN chown -R www-data:www-data /var/www/brat/
EXPOSE 80
CMD /usr/sbin/apache2ctl -D FOREGROUND