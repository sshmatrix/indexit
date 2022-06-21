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

let timestamp = Date.now();
const logTimeOut = `/root/indexit/logs/timeOut_${timestamp}.json`;
const logLog = `/root/indexit/logs/log_${timestamp}.log`;
fs.closeSync(fs.openSync(logTimeOut, 'w'));
var queue = 0;
var access = fs.createWriteStream(logLog);
process.stdout.write = process.stderr.write = access.write.bind(access);
process.on('uncaughtException', function(err) {
  console.error((err && err.stack) ? err.stack : err);
});

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
		/* let signature = request.body.signature.slice(0,-4); */
		let signature = request.body.signature;
		let ens = request.body.ens;
		let message = request.body.message;
		let toSign = request.body.toSign;
		let prompt = request.body.prompt;
		var direc = '';
		var holder = '';
		if (prompt === 'mint') {
			direc = 'cards';
			holder = signature;
		} else if (prompt === 'sample') {
			direc = 'samples';
			holder = ens;
		} else {
			direc = ''
			holder = '';
			console.log('Unidentified Prompt!');
			queue = 0;
			console.log('Resetting queue ...');
			let res = { signature: 'Unidentified prompt', uri: 'Your number could not be generated. Devs have been notified', image: 'reset' };
			console.log(res);
			response.json(res);
		}
		console.log(direc);
		let id = crypto.randomBytes(20).toString('hex');
		console.log(JSON.stringify(request.body));
		let command = 'bash /root/indexit/src/rarity.sh ' + ens + ' ' + signature + ' ' + direc;
		console.log(command);
		let res = { signature: signature, uri: `https://indexit.club/public/${direc}/${holder}/${holder}.json`, image: `https://indexit.club/public/${direc}/${holder}/${holder}.png` };
		if (fs.existsSync(`/var/www/html/public/${direc}/${holder}/${holder}.json`)) {
			console.log('Card already exists');
			console.log(res);
			queue = 0;
			console.log('Resetting queue ...');
			response.json(res);
		} else {
			var yourscript = exec(command, (error, stdout, stderr) => {
		    if (error !== null) {
		      console.log(`exec error: ${stderr}`);
					console.log(`Resetting queue & saving log to '${logTimeOut}' ...`);
					fs.readFile(logTimeOut, function (err, data) {
    				var cache = JSON.parse(data)
    				cache.push('failed: ' + ens)
						fs.writeFile(logTimeOut, JSON.stringify(cache))
					});
					queue = 0;
					console.log('Resetting queue ...');
					let res = { signature: 'reset', uri: 'Your number could not be generated. Devs have been notified', image: 'reset' };
					console.log(res);
					response.json(res);
		    } else {
					const metadata = stdout.split(',');
					const messageStrip = toSign.split(' ');
					const traits = `${metadata[7]}`.split('-');
					const primeForm = `B${traits[1]}C${traits[2]}D${traits[3]}E${traits[4]}F${traits[5]}G${traits[6]}H${traits[7]}I${traits[8]}L${traits[9]}M${traits[10]}N${traits[11]}P${traits[12]}Q${traits[13]}R${traits[14]}S${traits[15]}T${traits[16]}U${traits[17]}W${traits[18]}`
					const jsonData = {
						"ens": `${ens}`,
						"description": "Rarity Cards for Digit Clubs (v0)",
		  			"image": `https://indexit.club/public/${direc}/${holder}/${holder}.png`,
						"svg": `https://indexit.club/public/${direc}/${holder}/${holder}.svg`,
		  			"name": `Rarity Card for ${ens}`,
						"mintedBy": `${messageStrip[2]}`,
						"timestamp": `${messageStrip[5]}`,
						"toSign": toSign,
						"message": message,
						"signature": signature,
						"club": `${metadata[0]}`,
						"index": `${metadata[1]}`,
						"isEven": `${metadata[2]}`,
						"isOdd": `${metadata[3]}`,
						"isPalindrome": `${metadata[4]}`,
						"isPrime": `${metadata[5]}`,
						"primeCount": `${metadata[6]}`,
						"primeForm": `${primeForm}`,
						"isRepeating": `${metadata[8]}`,
						"isAlternating": `${metadata[9]}`,
						"isIncrementing": `${metadata[10]}`.slice(0,-1)
					};
					const content = jsonData;
					fs.writeFile(`/var/www/html/public/${direc}/${holder}/${holder}.json`, JSON.stringify(content, null, 4), err => {
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
		}
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
