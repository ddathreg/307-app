import express from "express";
import cors from "cors";
import { addUser } from "./user-services.js";
import { findUserById } from "./user-services.js";
import { findUserByName } from "./user-services.js";
import { findUserByJob } from "./user-services.js";
import { getUsers } from "./user-services.js";
import { deleteUserById } from "./user-services.js";




const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

// const users = {
//   users_list: [
//     {
//       id: "xyz789",
//       name: "Charlie",
//       job: "Janitor"
//     },
//     {
//       id: "abc123",
//       name: "Mac",
//       job: "Bouncer"
//     },
//     {
//       id: "ppp222",
//       name: "Mac",
//       job: "Professor"
//     },
//     {
//       id: "yat999",
//       name: "Dee",
//       job: "Aspring actress"
//     },
//     {
//       id: "zap555",
//       name: "Dennis",
//       job: "Bartender"
//     }
//   ]
// };


// helper functions //////////

// const findUserByName = (name) => {
//   return users["users_list"].filter(
//     (user) => user["name"] === name
//   );
// };

// const findUserById = (id) =>
//   users["users_list"].find((user) => user["id"] === id);


// const addUser = (user) => {
//   users["users_list"].push(user);
//   return user;
// };

// const deleteUser = (index) => {
//   users["users_list"].splice(index, 1);
// };



// GET FUNCTIONS /////

// app.get("/users", (req, res) => {
//   const name = req.query.name;
//   if (name != undefined) {
//     let result = findUserByName(name);
//     result = { users_list: result };
//     res.send(result);
//   } else {
//     res.send(users);
//   }
// });

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if ((name != undefined) && (job != undefined)){
    // let result = findUserByName(name).findUserByJob(job);
    let result = getUsers(name, job);
    // result = { users_list: result };
    // res.send(result);
    result.then( (result) => res.send(result)).catch( () => res.status(404).send("Resource Not Found."));
  } else if (name != undefined) {
    let result = findUserByName(name);
    // result = { users_list: result };
    // res.send(result);
    result.then( (result) => res.send(result)).catch( () => res.status(404).send("Resource Not Found."));
  } else if (job != undefined) {
    let result = findUserByJob(job);
    result.then( (result) => res.send(result)).catch( () => res.status(404).send("Resource Not Found."));
  } else {
    let result = getUsers();
    result.then( (result) => res.send(result)).catch( () => res.status(404).send("Resource Not Found."));
  }
});


app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  // result = { users_list: result};
  result.then( (result) => res.send(result)).catch( () => res.status(404).send("Resource not found."));
});



// DELETE FUNCTIONS /////////////////

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  // const index = users["users_list"].findIndex(item => item.id === id);
  // if (index === -1) {
  //   res.status(404).send("Resource not found.");
  // } else {
  //   deleteUser(index);
  // }
  // res.send();
   let userToDelete = deleteUserById(id);
   userToDelete.then( () => res.status(204).send("Resource Deleted Successfully.")).catch( () => res.status(404).send("Resource Not Found."));
});


// POST FUNCTIONS ///////

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  let newid = Math.round(Math.random() * 99999).toString();
  req.body.id = newid;
  const addsuc = addUser(userToAdd);
  addsuc.then((userToAdd) => res.status(201).send("Content created.").send(userToAdd));
  // if (addsuc) {
  //   res.status(201).send("Content created.").send(userToAdd);
  // }
});
