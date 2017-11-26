var express = require('express');
var router = express.Router();
var http = require('http');
var jsonQuery = require('json-query');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

router.get('/get-data', function(req, res, next){
	var emp = [];
	var host = 'localhost';
	var port = 3000;
	var path = '';
	var method = 'GET';
	var nombre = req.query.nombre || '';
	var año = req.query.ano || '';
	var genero = req.query.genero || '';
	if(nombre == '' && año == '' && genero == ''){
		res.render('index', {error: 'Ingrese algo'});
	}
	else if(nombre != ''){
		var responseString = '';
		path = '/Movies';
		options = {
			host: host,
			port: port,
			path: path,
			method: method,
		};
		http.get(options, function(resto){
		  	resto.setEncoding("utf8");
		  	resto.on('data', function(data) {
		      responseString += data;
		    });
		  	resto.on('end', function() {
		  		var responseObject = JSON.parse(responseString);
		  		var result = jsonQuery('[title='+req.query.nombre+']', {data: responseObject});
		  		console.log(result['value']);
			    if(result['value'] == null){
		      		res.render('index', {error: 'No se encontraron coincidencias :('});
		      	}
		      	else{
		      		var title = result['value']['title'];
			      	var year = result['value']['year'];
			      	var id = result['value']['movieid'];
					res.render('index',{title: 'Nombre: '+title,year: 'Año: '+year,id: 'id: '+id, items2: emp, items3: emp});
				
		      	}
		    });
		}).on('error', (e) => {
		  console.error(e);
		});

	}
	else if(año != ''){
		var responseString = '';
		path = '/Movies';
		options = {
			host: host,
			port: port,
			path: path,
			method: method
		};
		http.get(options, function(resto){
		  	resto.setEncoding("utf8");
		  	resto.on('data', function(data) {
		      responseString += data;
		    });
		  	resto.on('end', function() {
		  		var responseObject = JSON.parse(responseString);
		      	var result = jsonQuery('[title='+req.query.ano+']', {data: responseObject});
		      	if(result['value'] == null){
		      		res.render('index', {error: 'No se encontraron coincidencias :('});
		      	}
		      	else{
			      	var title = result['value']['title'];
			      	var id = result['value']['movieid'];
			      	path = '/genre/'+id;
			      	options2 = {
			      		host: host,
						port: port,
						path: path,
						method: method
			      	};
			      	console.log(options2);
			      	http.get(options2, function(resto2){
			      		resto2.setEncoding("utf8");
			      		responseString = '';
				  		resto2.on('data', function(data) {
				      		responseString += data;
						});
				  		resto2.on('end', function(){
				  			var rObj = JSON.parse(responseString);
				  			res.render('index',{title: '',year: '',id: '',title2: 'Pelicula: '+title,items2: rObj, items3: emp});
				  		});
			      	}).on('error', (e) => {
					  console.error(e);
					});
				}
			});
		}).on('error', (e) => {
		  console.error(e);
		});
	}
	else if(genero != ''){
		var responseString = '';
		path = '/genre/type/'+req.query.genero;
		options = {
			host: host,
			port: port,
			path: path,
			method: method,
		};
		http.get(options, function(resto){
		  	resto.setEncoding("utf8");
		  	resto.on('data', function(data) {
		      responseString += data;
		    });
		  	resto.on('end', function() {
		      	var responseObject = JSON.parse(responseString);
		      	if(isEmptyObject(responseObject)){
		      		res.render('index', {error: 'No se encontraron coincidencias :('});
		      	}
		      	else{
		      		res.render('index',{title: '',year: '',id: '', items2: emp, items3: responseObject});
		      	}
		      	
		    });
		}).on('error', (e) => {
		  console.error(e);
		});
	}
});
module.exports = router;
//