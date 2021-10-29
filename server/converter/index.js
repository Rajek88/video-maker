import { Router } from "express";
import { Converter } from "./Converter";
const router = Router();

//start listening to request
router.post("/convert", Converter);

export default router;
