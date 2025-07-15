import express from 'express';

// Array of subcategories with keywords for automatic search and matching
import { subcategories } from './subcategories.js';

//An array used to normalize the name
//Each object contains a normalized name and a list of keys that can match the normalized name
import { nameMappings } from './names.js';

const app = express();
app.use(express.json());

app.get('/NormalizeName/:name', (req, res) => {
    
    for (const nameM of nameMappings) {
        if (nameM.keywords.includes(req.params.name)) {
            res.send(nameM.normalizedName);
        }
    }
    res.send(req.params.name)
});

app.get('/Category/:category', (req, res) => {

    for (const subC of subcategories) {
        if (subC.keywords.includes(req.params.category)) {
            res.send(subC.name);
        }
    }
    res.send("אחר");
});

app.post('/categorize-products', (req, res) => {
  const products = req.body.products;
  const categoryNames = req.body.tags;

  const normalize = (str) =>
    str.toLowerCase().replace(/[^\w\s\u0590-\u05FF]/g, "");

  const filteredSubcategories = subcategories.filter(subC =>
    categoryNames.includes(subC.name)
  );

  const result = products.map((product, index) => {
    const productName = typeof product === "string" ? product : product.name;
    const normalizedName = normalize(productName);

    const matchedCategories = filteredSubcategories
      .filter(subC =>
        subC.keywords.some(kw =>
          normalizedName.includes(normalize(kw))
        )
      )
      .map(subC => subC.name);

    // אם זה מוצר שלישי – נוסיף "מבצע" כעוד קטגוריה
    if ((index + 1) % 3 === 0) {
      matchedCategories.push("מבצע");
    }

    return `${productName}: ${matchedCategories.join(",")}`;
  });

  res.send(result.join(" ; "));
});



app.listen(8080, () => {
    console.log('Server running on port 8080');
});