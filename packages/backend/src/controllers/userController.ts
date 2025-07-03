import { Request, Response } from "express";
import validate from "../validators/validator";
import { registerUser } from "../services/userService";


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

            const newUser = await registerUser(userId, email, password, userName);
            res.status(201).json({ message: "User registered successfully", user: newUser });
            

        } catch (error: any) {
            res.status(500).json({ error: error.message || "Internal server error" });
            return;
        }
    }
}

export default userController;
