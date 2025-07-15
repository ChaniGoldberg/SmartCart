import { Router } from "express";
import searchController from "../controllers/searchController";


const searchRouter=Router();
// router.get('/:itemTxt/:storePK', ()=>console.log("ללל"));

searchRouter.get('/:itemTxt/:storePK',searchController.searchPriceForStoreByItemTxtAndStorePK);
export default searchRouter;  
