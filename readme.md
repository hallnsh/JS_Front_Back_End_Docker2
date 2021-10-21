# Python Hack to generate primes
## Subtitle  Experiments with Lists and simple i/o

Nick name is Nico

Docker Experiments 

This is an example of a JavaScript hack to setup a Node.JS based server. It imports (requires)
modules from the express() server library and implements a relatively simple api to manage the
routing.  

The server/backend is written in JS (what else for NODE) and is contained within file 'server01.js'. 
The server connects to a mongodb database and updates the content of a single record, its all pretty simple 
but illustrates how to achieve persistence, the content is used to update the fields displayed on the browser.

Install Node.js and Express and then run the server with
node server01

There is some not too friendly console logs to show whats going on when the front end
browser tries to talk to it.

The front end code consists of a (very) simple 
index.html, 
save_edit.js    Some logic implemented in javascript to carry out actions when buttons on the browser are hit.
style.CSS
pic01.jpg
icon.png.

The mongodb database is run from a docker image to make it all work consistently.
To monitor what the browser front end and server backend are doing with the dB, I have setup a mongo-express client
that also connects to the mongodb dB and displays the contents of a simple collection called 'users'.
mongo-express is also run from a docker image that has been configured with appropriate port and environment details.

The next bit of fun is to create a docker image of the node.js based server so anyone 
can install it and experiment regardless of platform.
