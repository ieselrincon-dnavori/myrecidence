module.exports = app => {
    const userRecidence = require("../controllers/user.recidence.controllers.js");
    
    var router = require("express").Router();


    
    // Create a new UserRecidence
    router.post("/", userRecidence.create);
    // Retrieve all UserRecidence
    router.get("/", userRecidence.findAll);
    // Retrieve a single UserRecidence with id
    router.get("/:id", userRecidence.findOne);
    // Update a UserRecidence with id
    router.put("/:id", userRecidence.update);   
    // Delete a UserRecidence with id
    router.delete("/:id", userRecidence.delete);

    app.use('/api/users_recidence', router);
};