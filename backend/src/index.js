import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import cors from 'cors';
import { exec } from 'child_process';
import https from 'https';
import fs from 'fs';
const express = require("express");
var bodyParser = require('body-parser')
const options = {
	key: fs.readFileSync('/root/.ssl/indexit_club.key'),
	cert: fs.readFileSync('/root/.ssl/indexit_club.crt')
};

const app = express();
app.use(express.json());
var jsonParser = bodyParser.json();
var crypto = require("crypto");

const PORT = 3001;
var queue = 0;

app.use(cors({
	origin: [
						'https://indexit.xyz',
						'https://indexit.club',
						'https://indexit.eth.limo',
						'https://indexit.eth.link'
					],
	headers: [
				    'Content-Type',
					 ],
}));

console.log("Hello World!");
app.get('/state', async function (request, response) {
	response.end('NodeJS is running on port ' + PORT + '\n');
});

app.post('/write', jsonParser, function (request, response) {
	console.log('Waiting in queue ...');
	console.log(queue);
	if (queue === 0) {
		queue = 1;
		console.log('Processing ...');
		let signature = request.body.signature.slice(0,-4);
		let ens = request.body.ens;
		let message = request.body.message;
		let toSign = request.body.toSign;
		let id = crypto.randomBytes(20).toString('hex');
		console.log(JSON.stringify(request.body));
		let command = 'bash /root/indexit/src/rarity.sh ' + ens + ' ' + signature;
		let res = { signature: signature, uri: `https://indexit.club/public/${signature}/${signature}.json`, image: `https://indexit.club/public/${signature}/${signature}.png` };
		var yourscript = exec(command, (error, stdout, stderr) => {
			console.log(stderr);
	    if (error !== null) {
	      console.log(`exec error: ${error}`);
				console.log(stderr);
	    } else {
				const traits = stdout.split(',');
				const metadata = toSign.split(' ');
				const jsonData = {
					"ens": `${ens}.eth`,
					"description": "Rarity Cards for Digit Club v0",
	  			"image": `https://indexit.club/public/${signature}/${signature}.png`,
					"svg": `https://indexit.club/public/${signature}/${signature}.svg`,
	  			"name": `Rarity Card for ${ens}.eth`,
					"mintedBy": `${metadata[0]}`,
					"timestamp": `${metadata[1]}`,
					"toSign": toSign,
					"message": message,
					"signature": signature,
					"club": `${traits[0]}`,
					"index": `${traits[1]}`,
					"isEven": `${traits[2]}`,
					"isOdd": `${traits[3]}`,
					"isPalindrome": `${traits[4]}`,
					"isPrime": `${traits[5]}`,
					"primeCount": `${traits[6]}`,
					"isRepeating": `${traits[7]}`,
					"isAlternating": `${traits[8]}`,
					"isIncrementing": `${traits[9]}`
				};
				const content = jsonData;
				fs.writeFile(`/var/www/html/public/${signature}/${signature}.json`, JSON.stringify(content, null, 4), err => {
			  	if (err) {
			    	console.error(err);
						queue = 0;
			  	} else {
						console.log('tokenURI generated');
						queue = 0;
					}
				});
				console.log(res);
				response.json(res);
			}
		});
	} else {
		queue = 1;
		console.log('Back in queue ...');
		let res = { signature: 'wait', uri: 'Please wait for last job to finish', image: 'empty' };
		console.log(res);
		response.json(res);
	}
});
console.log("IndexIt server is listening on port " + PORT);
https.createServer(options,app).listen(PORT);
