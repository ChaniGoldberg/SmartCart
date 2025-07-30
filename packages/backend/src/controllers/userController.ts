// packages/backend/src/controllers/userController.ts

import { Request, Response } from "express";
import validate from "../validators/validator";
import { registerUser, updateUser, loginUser } from "../services/userService";
import { UserRepository } from "../db/Repositories/userRepository";
import { supabase } from "../services/supabase";
import { AuthenticatedRequest } from "../authenticate";

const userRepository = new UserRepository(supabase);

const userController = {
    getMe: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                res.status(401).json({ error: "User not authenticated" });
                return;
            }

            const user = await userRepository.getUserById(userId);

            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            res.status(200).json(user);
        } catch (error: any) {
            res.status(500).json({ error: error.message || "Internal server error" });
        }
    },

    register: async (req: Request, res: Response): Promise<void> => {
        try {
            // הסר את userId מה-destructuring כאן
            const { email, password, userName, preferred_store } = req.body; 

            const emailValidation = validate.checkEmail(email);
            if (emailValidation !== true) {
                res.status(400).json({ error: emailValidation });
                return;
            }

            const passwordValidation = validate.checkPassword(password);
            if (passwordValidation !== true) {
                res.status(400).json({ error: passwordValidation });
                return;
            }

            // העבר את email כארגומנט הראשון במקום userId
            const { user, token } = await registerUser(email, password, userName, preferred_store);

            res.status(201).json({ message: "User registered successfully", user, token });


        } catch (error: any) {
            res.status(500).json({ error: error.message || "Internal server error" });
            return;
        }
    },
    update: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ error: "User not authenticated" });
                return;
            }

            const { password, userName, preferred_store } = req.body;

            if (password !== undefined && password !== '') {
                const passwordValidation = validate.checkPassword(password);
                if (passwordValidation !== true) {
                    res.status(400).json({ error: passwordValidation });
                    return;
                }
            }

            const { user, token } = await updateUser(userId, password, userName, preferred_store);

            res.status(200).json({ message: "User update profile finished successfully", user, token });
        } catch (error: any) {
            res.status(500).json({ error: error.message || "Internal server error" });
            return;
        }
    },
    login: async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ error: "Email and password are required" });
                return;
            }

            const { token, user } = await loginUser(email, password); // הפונקציה שלך שמחזירה JWT
            res.status(200).json({ message: "Login successful", token, user });
        } catch (error: any) {
            console.error("Login error:", error);
            res.status(401).json({ error: error.message || "Login failed" });
        }

    }
}
export default userController;