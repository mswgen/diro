const http = require('http');
const fs = require('fs');
const list = require('./list.json');
const url = require('url');
const server = http.createServer(async (req, res) => {
    let parsed = url.parse(req.url, true);
    if (req.method == 'POST') {
        var post = '';
        req.on('data', data => {
            post += data;
        });
        req.on('end', () => {
            post = JSON.parse(post);
            if (!post || !post.url) {
                res.writeHead(400);
                res.end();
            } else {
                if (list.urls.find(x => x.to == decodeURIComponent(post.url)) && !post.custom) {
                    res.writeHead(200);
                    res.end(JSON.stringify({
                        code: list.urls.find(x => x.to == post.url).from
                    }));
                } else {
                    let chars = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                    var random = '';
                    for (var i = 0; i < 7; i++) {
                        random += chars[Math.floor(Math.random() * chars.length)];
                    }
                    if (post.custom && !list.urls.find(x => x.from == post.custom)) {
                        random = post.custom;
                    }
                    list.urls.push({
                        from: random,
                        to: decodeURIComponent(post.url)
                    });
                    fs.writeFile('./list.json', JSON.stringify(list), () => {
                        res.writeHead(200);
                        res.end(JSON.stringify({
                            code: random
                        }));
                    });
                }
            }
        });
    } else {
        if (parsed.pathname == '/') {
            fs.readFile('./index.html', 'utf8', (err, data) => {
                res.writeHead(200, {
                    'Content-Type': 'text/html; charset=utf-8'
                });
                res.end(data);
            });
        } else if (parsed.pathname == '/script.js') {
            fs.readFile('./script.js', 'utf8', (err, data) => {
                res.writeHead(200, {
                    'Content-Type': 'test/javascript; charset=utf-8'
                });
                res.end(data);
            });
        } else {
            if (list.urls.find(x => x.from == parsed.pathname.substr(1))) {
                res.writeHead(302, {
                    'Location': list.urls.find(x => x.from == parsed.pathname.substr(1)).to
                });
                res.end();
            } else if (list.urls.find(x => x.from == parsed.pathname.substr(1).split('/code')[0])) {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify({
                    from: `https://diro.ga/${list.urls.find(x => x.from == parsed.pathname.substr(1).split('/code')[0]).from}`,
                    to: list.urls.find(x => x.from == parsed.pathname.substr(1).split('/code')[0]).to
                }));
            } else if (list.urls.find(x => x.from == parsed.pathname.substr(1).split('/frame')[0])) {
                res.writeHead(200, {
                    'Contnet-Type': 'text/html; charset=utf-8'
                });
                res.end(`<iframe src="${list.urls.find(x => x.from == parsed.pathname.substr(1).split('/frame')[0]).to}"></iframe>`);
            } else {
                res.writeHead(302, {
                    'Location': 'https://diro.ga'
                });
                res.end();
            }
        }
    }
});
server.listen(3000);