import { Request, Response } from 'express';
import { tagService } from '../services/tagService';

export const addTag = async (req: Request, res: Response) => {
    const { tagName } = req.body;
    try {
        const newTag = await tagService.addTag(tagName);
        res.status(201).json({
            success: true,
            message: `Tag ${tagName} added successfully!`,
            timestamp: new Date().toISOString(),
            tag: newTag // הוסף את התג שנוסף בתגובה
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding tag', error });
    }
};
