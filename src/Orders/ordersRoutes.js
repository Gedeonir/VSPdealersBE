const express=require("express");
const {getOrders,placeOrder, checkProducts,changeOrderStatus, getMyOrders, getOneOrder}=require("./ordersController")
const {protect,restrictTo}=require('../Middlewares/Middlewares')

const router=express.Router();

router.get("/",protect,restrictTo("administrator","operator"),getOrders);
router.post("/placeOrder",protect,checkProducts,placeOrder);
router.get("/myOrders",protect,getMyOrders);
router.get("/:order",getOneOrder);
router.patch("/:order/changeStatus",changeOrderStatus);

module.exports=router