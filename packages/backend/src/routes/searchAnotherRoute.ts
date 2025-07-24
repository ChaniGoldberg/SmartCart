import { Router } from "express";
import searchAnotherController from "../controllers/searchAnotherController";

const searchAnotherRoute = Router();

// Change to POST method and expect storePKs in the request body
searchAnotherRoute.post('/:itemTxt', searchAnotherController.searchPriceForStoresByItemTxtAndStorePKs);

export default searchAnotherRoute;