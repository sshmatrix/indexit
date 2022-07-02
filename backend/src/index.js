import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import cors from 'cors';
import { exec } from 'child_process';
import https from 'https';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
const express = require("express");
var bodyParser = require('body-parser')
const options = {
	key: fs.readFileSync('/root/.ssl/indexit_club.key'),
	cert: fs.readFileSync('/root/.ssl/indexit_club.crt')
};
require('dotenv').config();
const key = process.env.PINATA_KEY;
const secret = process.env.PINATA_SECRET;
var pinataUrl = '';
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
	console.log('Queue: ' + queue);
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
		var name = '';
		if (prompt === 'mint') {
			direc = 'cards';
			holder = message;
			name = ens.slice(0,-4);
		} else if (prompt === 'sample') {
			direc = 'samples';
			name = ens.slice(0,-4);
			holder = name;
		} else {
			direc = '';
			holder = '';
			name = '';
			console.log('Unidentified Prompt!');
			queue = 0;
			console.log('Resetting queue ...');
			var res = { signature: 'reset', uri: 'Your number could not be generated. Devs have been notified', image: 'reset', link: 'empty' };
			pinataUrl = ''
			console.log(res);
			response.json(res);
		}
		console.log(direc);
		console.log(JSON.stringify(request.body));
		let command = 'bash /root/indexit/src/rarity.sh ' + ens + ' ' + message + ' ' + direc + ' ' + signature;
		console.log(command);
		if (fs.existsSync(`/var/www/html/public/${direc}/${name}/${holder}.json`)) {
			let res = { signature: signature, uri: `https://indexit.club/public/${direc}/${name}/${holder}.json`, image: 'exists', link: `https://indexit.club/public/${direc}/${name}/${holder}.png` };
			console.log('Card already exists');
			console.log(res);
			queue = 0;
			pinataUrl = ''
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
					let res = { signature: 'reset', uri: 'Your number could not be generated. Devs have been notified', image: 'reset', link: `https://indexit.club/public/${direc}/${name}/${holder}.png` };
					pinataUrl = ''
					console.log(res);
					response.json(res);
		    } else {
					{/*
					let dataImage = new FormData();
    			dataImage.append('file', fs.createReadStream(`/var/www/html/public/${direc}/${name}/${holder}.png`));
					const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
					if (prompt === 'mint') {
						axios.post(url, dataImage, {
							headers: {
								pinata_api_key: key,
								pinata_secret_api_key: secret,
								'Content-Type': 'multipart/form-data',
							}
						}).then(function (responsibility) {
							pinataUrl = "ipfs://" + responsibility.data.IpfsHash
						}).catch(function (error) {
							console.log(error.message);
							pinataUrl = ''
						});
					} else {
						pinataUrl = `https://indexit.club/public/${direc}/${name}/${holder}.png`
					}
					*/}
					pinataUrl = `https://indexit.club/public/${direc}/${name}/${holder}.png`
					if (pinataUrl) {
						const metadata = stdout.split(',');
						const messageStrip = toSign.split(' ');
						const traits = `${metadata[7]}`.split('-');
						const primeForm = `B${traits[1]}C${traits[2]}D${traits[3]}E${traits[4]}F${traits[5]}G${traits[6]}H${traits[7]}I${traits[8]}L${traits[9]}M${traits[10]}N${traits[11]}P${traits[12]}Q${traits[13]}R${traits[14]}S${traits[15]}T${traits[16]}U${traits[17]}W${traits[18]}`

						let values = JSON.parse('{"attributes": []}');
						let isEven = '';
						let isOdd = '';
						let isPalindrome = '';
						let isPrime = '';
						let isAlternating = '';
						let isIncrementing = '';
						/*Trait 1*/
						const clubType = {
							trait_type: 'Club',
							value: `${metadata[0]}`
						}
						values['attributes'].push(clubType);
						/*Trait 2*/
						const index = {
							display_type: "number",
							trait_type: 'Index',
							value: parseFloat(metadata[1])
						}
						values['attributes'].push(index);
						/*Trait 3*/
						if (`${metadata[2]}` === 'Y' && `${metadata[3]}` === 'N') {
							const index = {
								value: 'Even'
							}
							values['attributes'].push(index);
							isEven = true;
							isOdd = false;
						} else if (`${metadata[2]}` === 'N' && `${metadata[3]}` === 'Y') {
							const index = {
								value: 'Odd'
							}
							values['attributes'].push(index);
							isEven = false;
							isOdd = true;
						}
						/*Trait 4*/
						if (`${metadata[4]}` === 'Y') {
							const palindrome = {
								value: 'Palindrome'
							}
							values['attributes'].push(palindrome);
							isPalindrome = true;
						} else {
							isPalindrome = false;
						}
						/*Trait 5*/
						if (`${metadata[5]}` === 'Y') {
							const prime = {
								value: 'Prime'
							}
							values['attributes'].push(prime);
							isPrime = true;
						} else {
							isPrime = false;
						}
						/*Trait 6*/
						const primeCount = {
							display_type: "boost_number",
							trait_type: 'Prime Count',
							value: parseInt(metadata[6])
						}
						values['attributes'].push(primeCount);
						/*Trait 7*/
						const primeFormJSON = {
							trait_type: 'Prime Form',
							value: primeForm
						}
						values['attributes'].push(primeFormJSON);
						/*Trait 8*/
						if (`${metadata[8]}` === '1.0') {
							const repeating = {
								value: 'Repeating'
							}
							values['attributes'].push(repeating);
						}
						let isRepeating = metadata[8];
						/*Trait 9*/
						if (`${metadata[9]}` === 'Y') {
							const alternating = {
								value: 'Alternating'
							}
							values['attributes'].push(alternating);
							isAlternating = true;
						} else {
							isAlternating = false;
						}
						/*Trait 10*/
						if (`${metadata[10]}`.slice(0,-1) === 'Y') {
							const incrementing = {
								value: 'Incrementing'
							}
							values['attributes'].push(incrementing);
							isIncrementing = true;
						} else {
							isIncrementing = false;
						}
						var identifier = crypto.randomBytes(6).toString('hex');
						const jsonData = {
							"name": `Rarity Card for ${ens}`,
							"external_url": 'https://indexit.xyz/',
							"description": 'Rarity Cards for Digit Clubs (v0)',
							"image": `https://indexit.club/public/${direc}/${name}/${holder}.png`,
							"background_color" : '000000',
							"svg": `https://indexit.club/public/${direc}/${name}/${holder}.svg`,
							"metadata": `https://indexit.club/public/${direc}/${name}/${identifier}.json`,
							"ens": `${ens}`,
							"mintedBy": `${messageStrip[2]}`,
							"timestamp": parseInt(messageStrip[5]),
							"toSign": toSign,
							"message": message,
							"signature": signature,
							"club": `${metadata[0]}`,
							"index": parseFloat(metadata[1]),
							"isEven": isEven,
							"isOdd": isOdd,
							"isPalindrome": isPalindrome,
							"isPrime": isPrime,
							"primeCount": parseInt(metadata[6]),
							"primeForm": `${primeForm}`,
							"isRepeating": parseFloat(isRepeating),
							"isAlternating": isAlternating,
							"isIncrementing": isIncrementing,
							"attributes" : values['attributes']
						};
						const content = jsonData;
						console.log('JSON: ' + identifier)
						fs.writeFile(`/var/www/html/public/${direc}/${name}/${identifier}.json`, JSON.stringify(content, null, 4), err => {
							if (err) {
								console.error(err);
								console.log('Resetting queue ...');
								queue = 0;
								let res = { signature: 'reset', uri: 'Your number could not be generated. Devs have been notified', image: 'reset', link: 'empty' };
								pinataUrl = ''
								console.log(res);
								response.json(res);
							} else {
								console.log('tokenURI generated');
								queue = 0;
								let res = { signature: signature, uri: `https://indexit.club/public/${direc}/${name}/${identifier}.json`, image: pinataUrl, link: `https://indexit.club/public/${direc}/${name}/${holder}.png` };
								pinataUrl = ''
								console.log(res);
								response.json(res);
							}
						});
					} else {
						queue = 0;
						console.log('Failed to pin image');
						console.log('Resetting queue ...');
						let res = { signature: 'reset', uri: 'Your number could not be generated. Devs have been notified', image: 'reset', link: 'empty' };
						pinataUrl = ''
						console.log(res);
						response.json(res);
					}
				}
			});
		}
	} else {
		queue = 1;
		console.log('Back in queue ...');
		let res = { signature: 'reset', uri: 'Slow down champ. Let the previous request finish', image: 'empty', link: 'empty' };
		console.log(res);
		response.json(res);
	}
});
console.log("IndexIt server is listening on port " + PORT);
https.createServer(options,app).listen(PORT);
