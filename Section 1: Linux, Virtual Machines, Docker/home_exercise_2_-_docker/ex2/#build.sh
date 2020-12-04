#/bin/bash
docker build --build-arg username=admin --build-arg password=123 --build-arg admin_email=admin@example.com -t m.voy/brat .

