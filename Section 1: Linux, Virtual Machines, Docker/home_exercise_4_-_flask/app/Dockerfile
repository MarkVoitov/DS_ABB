FROM ubuntu:20.04
MAINTAINER Mark Voytov <marchello-sobaka@yandex.ru>

ENV TZ=Europe/Moscow 
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt-get clean && \
    apt-get update && \
    apt-get install -y python3-pip python3-dev build-essential sqlite3 libsqlite3-dev

# возможно потребуется
# RUN apt-get install -y mc
 
RUN mkdir /app
COPY app.py IMDB.db IMDB.db README.md requirements.txt /app/
WORKDIR /app 
RUN pip3 install -r requirements.txt
EXPOSE 5000

CMD python3 /app/app.py
