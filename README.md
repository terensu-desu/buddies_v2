# Buddies
Buddies is a project designed around bringing a service to the web that helps foreigners live in Japan. This peer to peer service would connect individuals to other individuals who provide their skills and knowledge as a service.
https://agile-scrubland-23791.herokuapp.com/

### Terminal Commands Reference
sudo service mongod start

cd /usr/ && ./bin/mongo


#### RESTFUL Route Guide

name			url					verb		description
===========================================
INDEX			/dogs				GET			Display a list of all dogs
NEW				/dogs/new		GET			Display a form to make a new dog
CREATE 		/dogs				POST		Add a new dog to DB
SHOW			/dogs/:id		GET			Show info about one dog

NEW				/dogs/:id/comments/new		GET
CREATE		/dogs/:id/comments				POST

==============================
##### Bugs solved

- Reference middleware in route calls, don't call them i.e. sumFunc().
- Heroku needs to have the process.env.DATABASEURL specified for the app on settings page! Don't forget.
- Avoid merging because Heroku seems to have some kind of problem with it.. Removed old app and created new one
- When nesting a route section within another, use mergeParams option: router.expressRouter({mergeParams: true})