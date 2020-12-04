���������:
�������� �� ������ ubuntu:20.04, ������������� �� ����������� ������ Oracle VM VirtualBox 6.1.16 r140961.

�������� �������� �������� ��-�������: � git.���� � �� �����.
�� ����� �����, ��� ��� ������, �.�. ����� ������� ������������, � ��� ����� ����� ��� ���� �������� � ��� ����� ��� �������������.
������� ���� brat ��������� ������ �����������, �� �� ����� install.sh, ���� ������ ����������.

� ���� #build.sh ����������� �����, ������, ����� ������:
docker build --build-arg username=admin --build-arg password=123 --build-arg admin_email=admin@example.com -t m.voy/brat .
����� ��� ���������� ��������� ����� m.voy/brat

������: #run.sh
���� 80 ������� �� ��������� ���� �����:
docker run -d --name brat_instance -p 80:80 m.voy/brat
���� ����� �������� �� ������: http://localhost

C��� ����� � ���������� �� ������: /var/www/brat



������������ �������:

== �������� ������
./build.sh 
docker build -t docker.your.domain/brat-nlplab-org:latest  ./

== ������ �������
docker images

��������� � �������� ���� �����������
docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q)

�������� ������
docker rmi nginx

�������� �������������� (dangling) �����
docker volume ls

docker stop brat_instance
docker rm brat_instance

������� ��� ��� ID ����������:
    docker ps
        6ee6223a3ce3        ubuntu              "/bin/bash"         2 hours ago         Up 2 hours                              gloomy_lumiere
������������:
    docker exec -i -t 6ee6223a3ce3 bash
������� �� Ctrl+D.

cd /etc/apache2/mods-enabled
ln -s ../mods-available/cgi.load