
# Targets
.PHONY: format

format :
	@for name in `find . -not -path "./.*" -name "*.py"`; do autopep8 -i $$name; echo Formating $$name; done
	@ echo "Code formated ..."# Dock
er commands
.PHONY: docker-build docker-run docker-stop docker-logs docker-rebuild

docker-build:
	docker-compose -f docker/docker-compose-simple.yml build

docker-run:
	docker-compose -f docker/docker-compose-simple.yml up -d

docker-stop:
	docker-compose -f docker/docker-compose-simple.yml down

docker-logs:
	docker-compose -f docker/docker-compose-simple.yml logs -f

docker-rebuild:
	docker-compose -f docker/docker-compose-simple.yml down
	docker-compose -f docker/docker-compose-simple.yml build --no-cache
	docker-compose -f docker/docker-compose-simple.yml up -d