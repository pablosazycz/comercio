const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middlewares/auth");
const {ensureAuthenticated} = require("../middlewares/auth");

router.get("/", isAdmin,ensureAuthenticated, (req, res) => {
  res.render("operator");
});

module.exports = router;
