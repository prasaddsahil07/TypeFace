import {Router} from 'express';
import {registerUser, loginUser, logoutUser, getUser, updateUserDetails, changeCurrentUserPassword, refreshAccessToken} from "../controllers/user.controller.js";
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.get("/info", verifyJWT, getUser);
router.put("/update", verifyJWT, updateUserDetails);
router.put("/change-password", verifyJWT, changeCurrentUserPassword);
router.get("/refresh-token", refreshAccessToken);

export default router;