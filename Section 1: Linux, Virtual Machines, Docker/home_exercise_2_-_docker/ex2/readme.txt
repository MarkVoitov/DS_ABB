Состояние:
Создание на основе ubuntu:20.04, установленной на виртуальной машине Oracle VM VirtualBox 6.1.16 r140961.

Исходник пробовал получать по-разному: с git.репо и из файла.
Но потом понял, что это лишнее, т.к. нужно создать пользователя, а для этого нужен сам файл исходник и уже далее его корреткировка.
Поэтому файл brat последней версии присоединил, но не менял install.sh, файл заменён программно.

В файл #build.sh прописываем логин, пароль, почту админа:
docker build --build-arg username=admin --build-arg password=123 --build-arg admin_email=admin@example.com -t m.voy/brat .
после его выполнения создастся образ m.voy/brat

Запуск: #run.sh
Порт 80 мапится на локальный порт хоста:
docker run -d --name brat_instance -p 80:80 m.voy/brat
Сайт будет доступен по адресу: http://localhost

Cайт лежит в контейнере по адресу: /var/www/brat



Используемые команды:

== создание образа
./build.sh 
docker build -t docker.your.domain/brat-nlplab-org:latest  ./

== список образов
docker images

Остановка и удаление всех контейнеров
docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q)

Удаление образа
docker rmi nginx

Удаление неиспользуемых (dangling) томов
docker volume ls

docker stop brat_instance
docker rm brat_instance

Находим имя или ID контейнера:
    docker ps
        6ee6223a3ce3        ubuntu              "/bin/bash"         2 hours ago         Up 2 hours                              gloomy_lumiere
Подключаемся:
    docker exec -i -t 6ee6223a3ce3 bash
выходим по Ctrl+D.

cd /etc/apache2/mods-enabled
ln -s ../mods-available/cgi.load