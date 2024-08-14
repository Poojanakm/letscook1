import { Router } from "express";
import {registerUser, loginUser} from "../controllers/user.controller.js";

const router = Router()

router.get("/demo", function(req,res){
    res.send("hi")
})
router.route("/register").post(registerUser);

router.route("/login").post(loginUser)

export default router