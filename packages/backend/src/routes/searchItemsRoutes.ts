import express from "express"
import { search, searchItemByTag, searchItemsByName, searchTagByText } from "../controllers/searchItemsController";
const routes =express.Router();
routes.get("/name/:name",searchItemsByName)
routes.get("/tag/:tag",searchItemByTag)
routes.get("/textTag/:text",searchTagByText)
routes.get("/search/:name",search)
export default routes