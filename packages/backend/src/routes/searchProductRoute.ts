import { Router } from "express";
import searchProductController from "../controllers/searchProductController";

const searchProductRoute = Router();

searchProductRoute.post('/:itemTxt', (req, res) =>
  searchProductController.searchPriceForStoresByItemTxtAndStorePKs(req, res));

export default searchProductRoute;