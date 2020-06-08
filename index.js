const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
//console.log(json);
//console.log(__dirname);

const lapData = JSON.parse(json);
//console.log(lapData);

// Create req & res
const server = http.createServer((req, res) => {
    //console.log(req.url);
    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;
    //console.log(pathName, id);
    
    if(pathName === '/products' || pathName === '/'){
        res.writeHead(200, { 'Content-type': 'text/html'});
        //res.end('<-- Response of Products ! --> ');
        fs.readFile(`${__dirname}/templates/temp-overview.html`, 'utf-8', (err, data) => {
            //res.end(data);
            let oP = data;
            fs.readFile(`${__dirname}/templates/temp-card.html`, 'utf-8', (err, data) => {
                const card = lapData.map(el => repTemp(data, el)).join('');
                oP = oP.replace('{%CARDS%}', card);
                res.end(oP);
            });
        });
    } else if(pathName === '/laptop' && id < lapData.length){
        res.writeHead(200, { 'Content-type': 'text/html'});
       // res.end(`<-- Response of Laptop ! --> ${id} `);
       fs.readFile(`${__dirname}/templates/temp-laptop.html`, 'utf-8', (err, data) => {
           const lap = lapData[id];
           const output = repTemp(data, lap);
           res.end(output);
       });
    } else if((/\.(jpg|jpeg|png|gif)$/i).test(pathName)){
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, {'Content-type': 'image/jpg'});
            res.end(data);
        });
    } else {
        res.writeHead(404, { 'Content-type': 'text/html'});
        res.end('<-- URL not Found ! --> ');
    }
    
});

//Server is listening
server.listen(1337, '127.0.0.1', () => {
    //console.log('Listening..!');
});

function repTemp(org, lap) {
    let out = org.replace(/{%PRODUCTNAME%}/g, lap.productName);
    out = out.replace(/{%IMAGE%}/g, lap.image);
    out = out.replace(/{%SCREEN%}/g, lap.screen);
    out = out.replace(/{%CPU%}/g, lap.cpu);
    out = out.replace(/{%STORAGE%}/g, lap.storage);
    out = out.replace(/{%PRICE%}/g, lap.price);
    out = out.replace(/{%RAM%}/g, lap.ram);
    out = out.replace(/{%DESCRIPTION%}/g, lap.description);
    out = out.replace(/{%ID%}/g, lap.id);
    return out;
}