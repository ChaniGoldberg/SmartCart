import express from "express"
import { getAllItems, getAllTags, searchItemByTag, searchItemsByName, searchTagByText } from "../controllers/searchItemsController";
const routes =express.Router();
routes.get("/name/:name",searchItemsByName)
routes.get("/tag/:tag",searchItemByTag)
routes.get("/textTag/:text",searchTagByText)
routes.get('/items', getAllItems);
routes.get('/tags', getAllTags);
export default routes