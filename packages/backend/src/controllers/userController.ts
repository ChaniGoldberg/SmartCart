import { Request, Response } from "express";
import validate from "../validators/validator";
import { registerUser, updateUser, loginUser } from "../services/userService";


const userController = {
    register: async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password, userId, userName } = req.body;

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

            const { user, token } = await registerUser(userId, email, password, userName);

            res.status(201).json({ message: "User registered successfully", user, token });


        } catch (error: any) {
            res.status(500).json({ error: error.message || "Internal server error" });
            return;
        }
    },
    update: async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password, userId, userName } = req.body;

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

            const user = await updateUser(userId, email, password, userName);
            res.status(201).json({ message: "User update profile finished successfully", user: user });
            

        } catch (error: any) {
            res.status(500).json({ error: error.message || "Internal server error" });
            return;
        }},
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
    
    }}
export default userController;
