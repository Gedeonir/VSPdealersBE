const express=require("express");
const {addProductsImage,addNewProductsDetails,deleteProduct,updateProduct,getAllProducts,getOneProduct}=require('./productsController')
const {protect,restrictTo}=require('../Middlewares/Middlewares')
const{ parser}=require('../utils/multer')


const router=express.Router();

router.patch('/addProductImages/:product',protect,restrictTo("administrator","operator"),parser.array('product_image'),addProductsImage);
router.post('/addNewProduct',protect,restrictTo("administrator","operator"),addNewProductsDetails);
router.route('/:product').get(getOneProduct).delete(protect,restrictTo("administrator","operator"),deleteProduct).patch(protect,restrictTo("administrator","operator"),updateProduct);
router.get('/',getAllProducts);


module.exports=router