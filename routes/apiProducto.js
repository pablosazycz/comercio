const express = require("express");
const router = express.Router();
const apiProductoController = require("../controllers/apiProductoController");
const {isAdmin} = require('../middlewares/auth');

router.get("/productos", apiProductoController.getAllProducts);

router.get("/productos/:id", apiProductoController.getProductById);

router.post("/productos",isAdmin, apiProductoController.createProduct);

router.put("/productos/:id",isAdmin, apiProductoController.updateProduct);

router.delete("/productos/:id", isAdmin,apiProductoController.deleteProduct);


module.exports = router;