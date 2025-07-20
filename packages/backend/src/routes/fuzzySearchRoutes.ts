import { Router } from "express";
import { itemfuzzySearch, tagsfuzzySearch } from "../controllers/fuzzySearchController";

const routes=Router()
routes.get("/item/:itemText",itemfuzzySearch)
routes.get("/tags/:tagName",tagsfuzzySearch)
export default routes