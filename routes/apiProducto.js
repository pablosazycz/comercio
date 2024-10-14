const express = require("express");
const router = express.Router();
const apiProductoController = require("../controllers/apiProductoController");

router.get("/productos", apiProductoController.getAllProducts);

router.get("/productos/:id", apiProductoController.getProductById);

router.post("/productos", apiProductoController.createProduct);

router.put("/productos/:id", apiProductoController.updateProduct);

router.delete("/productos/:id", apiProductoController.deleteProduct);


module.exports = router;