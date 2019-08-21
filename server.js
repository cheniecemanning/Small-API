const http = require("http");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("dew.db");

http
  .createServer(function(req, res) {
    var args = req.url.split("/");
    if (args[1] == "api") {
      if (args[2] == "plant") {
        if (req.method == "GET") {
          db.get("SELECT * FROM plants WHERE id = ?", [args[3]], (err, row) => {
            if (err) {
              console.error(err.message);
            }

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(JSON.stringify(row) + "\n");
          });
        } else if (req.method == "POST") {
          let body = "";
          req.on("data", chunk => {
            body += chunk.toString(); // convert Buffer to string
          });
          req.on("end", () => {
            let data = parseFormData(body);
            let sql =
              "INSERT INTO plants(name, scientificName, description, image, wateringFrequency) VALUES(?,?,?,?,?)";
            db.run(
              sql,
              [
                data.name,
                data.scientificName,
                data.description,
                data.image,
                data.wateringFrequency
              ],
              function(err) {
                if (err) {
                  console.error(err.message);
                }
                res.writeHead(201, { "Content-Type": "text/html" });
                console.log(this.lastID);
                res.end(this.lastID + "\n");
              }
            );
          });
        }
      }
    } else {
      res.writeHead(201, { "Content-Type": "text/html" });
      res.end(
        `<!DOCTYPE html>
        <body>
        <form action="api/plant" method="POST">
              <label>Name</label>
              <input type="text" name="name">

              <label>Scientific Name</label>
              <input type="text" name="scientificName">

              <label>Description</label>
              <input type="text" name="description">

              <label>Image URL</label>
              <input type="text" name="image">

              <label>Watering Frequency</label>
              <input type="text" name="wateringFrequency">

              <button type="submit">Submit</button>
          </form>
          </body> 
        </html>`
      );
    }
  })
  .listen(8080);

console.log("Listening on port 8080");

const parseFormData = reqBody => {
  const pojo = {};
  reqBody.split("&").forEach(element => {
    let matches = element.match(/([^=]+)=(.*)/);
    pojo[matches[1]] = matches[2];
  });
  return pojo;
};
