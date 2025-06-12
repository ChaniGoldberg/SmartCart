import { Router } from 'express';
import { Item, ItemsResponse, ItemResponse } from '@smartcart/shared';
import { databaseService } from '../services/database';
const router = Router();

// Fallback mock data (used if database is not available)
const mockItems: Item[] = [
  {
    id: '1',
    name: 'Laptop',
    type: 'Electronics',
    amount: 1200
  },
  {
    id: '2',
    name: 'Coffee Beans',
    type: 'Food',
    amount: 25
  },
  {
    id: '3',
    name: 'Office Chair',
    type: 'Furniture',
    amount: 350
  },
  {
    id: '4',
    name: 'Notebook',
    type: 'Stationery',
    amount: 15
  }
];

// Determine if we should use database or mock data
const useDatabase = !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);

// GET /api/items - Get all items
router.get('/', async (req, res) => {
  try {
    let items: Item[];
    
    if (useDatabase) {
      items = await databaseService.getAllItems();
    } else {
      console.log('Using mock data - database not configured');
      items = mockItems;
    }

    const response: ItemsResponse = {
      success: true,
      data: items
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching items:', error);
    
    // Fallback to mock data if database fails
    const response: ItemsResponse = {
      success: true,
      data: mockItems
    };
    res.json(response);
  }
});



// router.get('/store/:storeId', async (req, res) => {
//   debugger
//   console.log('Fetching last file for storeId:', req.params.storeId);
  
//     const storeId = req.params.storeId;

//     try {
//       const aa=["PriceFull7290803800003-004-202506100415",
// "PriceFull7290803800003-004-202506100930","PriceFull7290803800003-007-202506101210",
// ]
      
//     const firstFileName = await databaseService.lastFileForStoreId(aa,storeId); // המתנה לתוצאה מהפונקציה
//     console.log(firstFileName)
//     if (firstFileName!=null) {
//       res.json({
//         success: true,
//         message: 'הפונקציה לקריאת קבצי פרומו הופעלה בהצלחה.',
//         firstFile: firstFileName // הוספת שם הקובץ לתגובה
//       });
//     } else {
//       res.json({
//         success: true,
//         message: 'הפונקציה לקריאת קבצי פרומו הופעלה, אך התיקייה ריקה.',
//         firstFile: null
//       });
//     }
//   } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });


// GET /api/items/:id - Get specific item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let item: Item | null = null;
    
    if (useDatabase) {
      item = await databaseService.getItemById(id);
    } else {
      console.log('Using mock data - database not configured');
      item = mockItems.find(item => item.id === id) || null;
    }
    
    if (!item) {
      const response: ItemResponse = {
        success: false,
        error: 'Item not found'
      };
      return res.status(404).json(response);
    }
    
    const response: ItemResponse = {
      success: true,
      data: item
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching item:', error);
    
    // Fallback to mock data if database fails
    const item = mockItems.find(item => item.id === req.params.id);
    if (!item) {
      const response: ItemResponse = {
        success: false,
        error: 'Item not found'
      };
      return res.status(404).json(response);
    }
    
    const response: ItemResponse = {
      success: true,
      data: item
    };
    res.json(response);
  }
});

export default router;