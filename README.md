#Small API
A small API built with Node and SQLite.
Allows you to POST and GET using an SQL Database.

##To run the server:
<code>node server.js</code>

##View in the browser:
http://localhost:8080/

When you submit information using the form, an ID is created

To see your information navigate to

http://localhost:8080/api/plant/ID

Example: http://localhost:8080/api/plant/1 contains information for the plant named 'Rapunzel'

Running <code> sqlite3 dew.db < dew.sql </code> in the terminal resets the database to its initial state
