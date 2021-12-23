import express from 'express';
const app = express();
const port = 3030;

import glob from 'glob';

app.get('/', (req, res) => {
    glob('**/*.js', {cwd: 'scripts/'}, (err, files) => {
        if (err) {
            console.log('Error getting files.');
        } else {
            res.send(files);
        }
    });
});

app.use(express.static('scripts'));


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});