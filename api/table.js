const express = require('express');
const router = express.Router();
const request = require('request');

/***
post handler fetches hotel listings for snaptravel and booking.com
responds with an html table string if successful
***/
router.post('/', function(req, res, next) {
//  const un = "username";
// const pw = "password";

  if(req && req.body){
  	const bodyJson = req.body;
	  bodyJson["provider"] = 'snaptravel';
	  //const urlwAuth = `https://${un}:${pw}@experimentation.getsnaptravel.com/interview/hotels`;
		const urlwAuth = `https://experimentation.getsnaptravel.com/interview/hotels`;

		let snaptravelPrices;
		let retailPrices;

	  //send request1
	  request.post({
		  headers: {'content-type' : 'application/json'},
		  url:     urlwAuth,
		  body:    JSON.stringify(bodyJson)
			}, function(error, response, body){
			  snaptravelPrices = JSON.parse(body).hotels;

			  if(retailPrices)
			  	res.send(filterEntriesReturnTable(snaptravelPrices, retailPrices));
		});

	  //send request2
	  bodyJson["provider"] = 'retail';
  	request.post({
		  headers: {'content-type' : 'application/json'},
		  url:     urlwAuth,
		  body:    JSON.stringify(bodyJson)
			}, function(error, response, body){
			  retailPrices = JSON.parse(body).hotels;

		  	if(snaptravelPrices)
		  		res.send(filterEntriesReturnTable(snaptravelPrices, retailPrices));
		});
  }
  else{
  	res.send('request was empty');
  }

});

/*filters hotels listings and returns an html table string*/
function filterEntriesReturnTable(snaptravel, retailer){
	let filteredHotels = snaptravel.filter((val, ind) =>{
		let id = val.id;
		for(let i = 0; i < retailer.length; i++){
			if(retailer[i].id === val.id){
				val["Snaptravel Price"] = val["price"];
				val["Hotel.com Price"] = retailer[i].price;

				return true;
			}
		}

		return false;
	});
	
	//create Table
	return createTable(filteredHotels);
}

/*takes in array of filtered hotels and returns a string of html table*/
function createTable(filteredHotels){
	let table = "<table><tbody>";
	let tableend = "</tbody></table>";

	if(filteredHotels.length == 0)
		return `${table}${tableend}`;

	let keys = Object.keys(filteredHotels[0]);

	//append headers first
	table += createHeaders(keys);
	
	for(let i = 0; i < filteredHotels.length; i++){
		let tr = "";
		for(let j = 0; j < keys.length; j++){
			//ignore vanilla price
			if(keys[j] === "price")
				continue;
			if(keys[j] === "image_url"){
				tr += wrap("td", `<img src="${filteredHotels[i][keys[j]]}">`);
			}
			else {
				tr += wrap("td", filteredHotels[i][keys[j]]);
			}
		}
		tr = wrap("tr", tr);
		table += tr;
	}
	return `${table}${tableend}`;
}

/*takes in headers and returns them in a row*/
function createHeaders(keys){
	let headers = "";
	for(let i = 0; i < keys.length; i++){
		  if(keys[i] === "price")
		  	continue;
			headers += wrap("th",keys[i].replace("_", " ").toUpperCase());
	}	
	return wrap("tr",headers);
}

function wrap(tag,content){

		return `<${tag}>${content}</${tag}>`;
}

module.exports = router;


