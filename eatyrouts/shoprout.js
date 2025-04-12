const express=require("express");
const router = express.Router();
const { addProduct,update_product,delete_product } = require("../eatycontroller/creatingcontroller");
const upload = require("../uploadmiddlewere/upload"); 
const {AuthmiddlewareoWNER}=require('../authmiddleware/authmiddle')
const {fetchOrder,updateOrderStatus,cancelled_order,viewsingleorder}=require('../eatycontroller/ownercontroller')

router.post("/add_product",AuthmiddlewareoWNER,upload.single("image"), addProduct);
router.put("/update_product",AuthmiddlewareoWNER,upload.single("image"),update_product)
router.delete("/delete_product",AuthmiddlewareoWNER,delete_product)
router.get('/order',AuthmiddlewareoWNER,fetchOrder)
router.put('/status/:id',AuthmiddlewareoWNER,updateOrderStatus)
router.delete('/cancelled/:id',AuthmiddlewareoWNER,cancelled_order)
router.get('/singleorder/:id',AuthmiddlewareoWNER,viewsingleorder)
module.exports = router;
