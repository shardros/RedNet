var http = require('http');
var fs = require('fs');
var formidable = require('formidable');
var cmd = require('node-cmd');

// html file containing upload form
var upload_html = fs.readFileSync("upload_file.html");

// replace this with the location to save uploaded files
var upload_path = "/home/pi/red/websever/music/";

http.createServer(function (req, res) {
    console.log('Got connection!');
    if (req.url == '/uploadform') {
        res.writeHead(200);
        res.write(upload_html);
        return res.end();
    } else if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            // oldpath : temporary folder to which file is saved to
            var oldpath = files.filetoupload.path;
            var newpath = upload_path + files.filetoupload.name.replace(/\s/g, '');
            if (newpath.slice(-4) != '.mp3') {
                //Change the file name to something the computer gets
                newpath += '.mp3';
            };
            //Change the file name to something the computer gets
            // copy the file to a new location
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                // you may respond with another html page
                newpath = '/"' + newpath + '/"';
                var command = 'sudo python ../../lightshowpi/py/synchronized_lights.py --file=' + newpath;
                cmd.run(command);
                res.end();
            });
        });
    }
}).listen(8086);
