import { Request, Response } from 'express';
// import { SearchForProductByName } from '../services/tagServices/searchForProductByName';
import { searchItemsByTag } from '../services/tagServices/searchItemsByTag';
import { searchTagsByText } from '../services/tagServices/searchTagByText';
import { itemService, tagService } from '../injection.config';

export const searchItemsByName = async (req: Request, res: Response) => {
  const { name } = req.params;
  try {
    // const items = await SearchForProductByName(name);
    res.status(200).json({
      success: true,
      message: `The search by input ${name} is successfully!`,
      timestamp: new Date().toISOString(),
      // items
    });
  } catch (error) {
    res.status(500).json({ message: 'Search faile', error });
  }
};

export const searchItemByTag = async (req: Request, res: Response) => {
  const { tagName } = req.params;
  try {
    const items = await searchItemsByTag(tagName);
    res.status(200).json({
      success: true,
      message: `The search by tag ${tagName} is successfully!`,
      timestamp: new Date().toISOString(),
      items
    });
  } catch (error) {
    res.status(500).json({ message: 'Search faile', error });
  }
};

export const searchTagByText = async (req: Request, res: Response) => {
  const { text } = req.params;
  try {
    const items = await searchTagsByText(text);
    res.status(200).json({
      success: true,
      message: `The search by test tag: ${text} is successfully!`,
      timestamp: new Date().toISOString(),
      items
    });
  } catch (error) {
    res.status(500).json({ message: 'Search faile', error });
  }
};


export async function getAllItems(req: Request, res: Response) {
  try {
    const items = await itemService.getAllItem();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export async function getAllTags(req: Request, res: Response) {
  try {
    const tags = await tagService.getAllTags();
    if (!tags) {
      return res.status(404).json({ message: "No tags found" });
    }
    res.json(tags);
  } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
  
  export async function search(req: Request, res: Response) {
    const { name } = req.params;
    try {
      // מבצע חיפוש לפי שם מוצר
      // const itemsByName = await SearchForProductByName(name) || [];
  
      // מבצע חיפוש לפי תג
      const itemsByTag = await searchItemsByTag(name) || [];
  
      // מאחד את כל התוצאות
      const results = [
        // ...itemsByName,
        ...itemsByTag
      ];
  
      res.status(200).json({
        success: true,
        message: `Search results for ${name} retrieved successfully!`,
        timestamp: new Date().toISOString(),
        results
      });
    } catch (error) {
      res.status(500).json({ message: 'Search failed', error });
    }
  }

