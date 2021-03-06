#!/bin/sh
# wget -qO- https://toolbelt.heroku.com/install-ubuntu.sh | sh
# heroku plugins:install heroku-container-registry
docker login -u _ -p $HEROKU_API_KEY registry.heroku.com
heroku container:push web --recursive --app $HEROKU_APP_NAME
heroku container:release web --app $HEROKU_APP_NAME
