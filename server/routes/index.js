import { Router } from "express";
const router = Router();

//start listening to request
router.post("/converter", require("../converter").default);

export default router;
