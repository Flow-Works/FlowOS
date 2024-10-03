import express from "express";
import wisp from "wisp-server-node";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { exec } from "child_process";
import { createServer } from "http";
import fs from "fs";
import path from "path";  // Add path module for correct file resolution

const publicPath = path.resolve("./public");  // Ensure absolute path resolution
const port = process.env.PORT || 8000;

const app = express();
const server = createServer(app);

// Serve all static files from the public directory, including nested directories
app.use(express.static(publicPath));

// Serve specific directories for Ultraviolet, Epoxy, and Baremux
app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));

// Add a route handler for the root path
app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));  // Serve the main index.html from public directory
});

// Serve uv.config.js
app.get("/uv/uv.config.js", (req, res) => {
    res.type("text/javascript").send(fs.readFileSync(`${publicPath}/uv/uv.config.js`));
});

// Version info route for git details
app.get("/ver", (req, res) => {
    exec("git rev-parse HEAD", (err1, hash) => {
        exec("git branch --show-current", (err2, branch) => {
            exec("git ls-remote --get-url", (err3, url) => {
                res.type("application/json").send({
                    hash: hash.replace(/\n/g, ""),
                    branch: branch.replace(/\n/g, ""),
                    url: url.replace(/\n/g, ""),
                });
            });
        });
    });
});

// Serve the projects.html file
app.get("/builtin/apps/games/3kh0-lite-main/projects.html", (req, res) => {
    res.sendFile(path.join(publicPath, "builtin/apps/games/3kh0-lite-main/projects.html"));
});

// Fallback for undefined routes (404)
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(publicPath, "404.html"));  // Custom 404 page, if available
});

// Handle upgrade requests for wisp
server.on("upgrade", (req, socket, head) => {
    wisp.routeRequest(req, socket, head);
});

// Server listening event
server.on("listening", () => {
    console.log(`Listening on: http://localhost:${port}`);
});

// Start server
server.listen({ port, hostname: "127.0.0.1" });
