const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/repositories/:id", (request, response, next) => {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({sucess: false, message: 'Invalid Repo ID'});
  }
  return next();
})

const repositories = [];

app.get("/repositories", (_request, response) => { 
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repo => repo.id == id);
  if (index < 0) {
    return response.status(400).json({sucess: false, message: 'Repository not found'});
  } 
  const { title, url, techs } = request.body; 

  repositories[index].title = title;
  repositories[index].url = url;
  repositories[index].techs = techs; 

  return response.json(repositories[index]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repo => repo.id == id);
  if (index < 0) {
    return response.status(400).json({sucess: false, message: 'Repository not found'});
  }

  repositories.splice(index, 1);

  return response.status(204).json({sucess: true, message: 'Repository successfully removed'});
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repo => repo.id == id);
  if (index < 0) {
    return response.status(400).json({sucess: false, message: 'Repository not found'});
  } 
  repositories[index].likes++;

  return response.json(repositories[index]);
});

module.exports = app;
