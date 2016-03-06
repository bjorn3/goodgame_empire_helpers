var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var fs = require('fs');
var plugins = require('./config/plugins.js').plugins;
var jade = require('jade');

io.on('connection', function (io) {
    io.on("save-kastelen", function(data){
        console.log("Save kastelen:", data);
        
        fs.writeFile("./config/kastelen.js", "var afstanden = {json};".replace("{json}", data), function(err){
            if(err) throw err;
            console.log("Kastelen gesaved");
        });
    });
});


app.engine("jade", jade.__express);

app.get('/', function(req, res){
    res.render("index.jade", {plugins: plugins});
});

app.use('/config', express.static('config'));
app.use('/lib', express.static('lib'));
app.get('/page/:plugin', function(req, res){
    res.render(req.params.plugin + '.jade', {plugins: plugins});
});
app.use('/plugins', express.static('plugins'));
app.use('/jade', express.static('node_modules/jade'));
app.use(express.static('public'));

http.listen(8080, function(){
	console.log("Listening on localhost:8080");
});
