var fs = require('fs');
var crypto = require('crypto');

exports.uploadImage = function(path, name, callback){
	fs.readFile(path, function(err, data){
		if(err){
			callback(err, null);
		}else{
			var newPath = appRoot + "/uploads/image/" + name;

			fs.writeFile(newPath, data, function(err){
				if(err){

					callback(err, null);
				}else{
					callback(null, newPath);
				}
			});
		}
	});
};

exports.deleteImage = function(name, callback){
	var path = appRoot + "/uploads/image/" + name;
	fs.exists(path, function(exist){
		if(exist)
			fs.unlinkSync(path);
	});
}
