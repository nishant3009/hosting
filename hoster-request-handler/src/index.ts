import express from 'express';
import { fetchHtml } from './sendHtml';
const app = express();
const port = 3001;

app.get('/*', async (req, res) => {
    const id = req.query?.id;
    const path = req.query?.path;

    if (typeof id === 'string' && typeof path === 'string') {
        try {
            const data = await fetchHtml(id, path);
            if(data){
                res.set("Content-Type", data.type);
                res.send(data.content);
            }else{
                res.send("No data founded")
            }
        
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(400).send('Bad Request: id is required and should be a string');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});