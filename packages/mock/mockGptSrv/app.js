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

app.listen(8080, () => {
    console.log('Server running on port 8080');
});