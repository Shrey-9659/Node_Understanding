const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring")
const PORT = 8080;

const userDataFile = path.join(__dirname, "public/JSON/userData.json")

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".svg": "image/svg+xml",
  ".json": "application/json",
};

const app = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url);
  if (reqUrl.pathname === "/") {
    fs.readFile(
      path.join(__dirname, "public/Html/homePage.html"),
      "utf8",
      (err, data) => {
        if (err) console.log(err);
        else {
          res.end(data);
        }
      }
    );
  }else if(reqUrl.pathname === "/api/users"){
    fs.readFile(path.join(__dirname, "public/JSON/userData.json"), "utf-8", (err, data) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(data);
    })
  } else if (reqUrl.pathname.startsWith("/public")) {
    const filePath = path.join(__dirname, reqUrl.pathname);
    const extname = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extname];

    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("404 Not Found");
        } else {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("500 Server Error");
        }
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
      }
    });
  } else if (reqUrl.pathname === "/form") {
    fs.readFile(
      path.join(__dirname, "public/Html/formPage.html"),
      "utf8",
      (err, data) => {
        if (err) console.log(err);
        else {
          res.end(data);
        }
      }
    );
  } else if (reqUrl.pathname === "/formSubmit" && req.method === "POST") {
    let body = "";
    req.on("data", (chunks) => {
      body += chunks.toString();
    });
    req.on("end", () => {
      let parsedData = querystring.parse(body);
          fs.readFile(userDataFile, "utf-8", (err, data) => {
              if(data == ""){
                  parsedData = [parsedData];
                  fs.writeFile(userDataFile, JSON.stringify(parsedData), (err) => {
                      if(err) console.log(err)
                  })
              } else {
                  const userData = JSON.parse(data)
                  userData.push(parsedData);
                  fs.writeFile(userDataFile, JSON.stringify(userData), (err) => {
                      if(err) console.log(err)
                  })
              }
          })
    });
    res.writeHead(302, { 'Location': '/' });
    res.end()
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
