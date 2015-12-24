var constants = require('./constants');
var binPath = require('phantomjs').path;
var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');
var Q = require('q');

exports.prerender = function(config, posts, callback) {

  var args = getArguments(config, posts);

  removePreviousPosts(config, function(err) {

    if (err)
      callback(err);

    Q.all(args.map(function(arg) {
        return Q.nfcall(execPhantom, arg.pageName, arg.outputFile, arg.outputPath);
    }))
    .then(function() {
        callback(null);
    })
    .catch(function(err) {
        callback(err);
    });
  });
};

function execPhantom(pageName, outputFile, outputPath, callback) {

  var childArgs = [
    path.join(__dirname, 'phantomjs-script.js'),
    pageName,
    outputFile,
    outputPath
  ];

  childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
    console.log(stdout);
    callback(err);
  });
}

function getArguments(config, posts) {

  var args = [];

  posts.forEach(function(post) {

    var arg = {
      pageName: constants.STAGING_HOSTED_URL + '/' +  constants.FOLDER_POSTS.replace('\\', '') + '/' + post.url,
      outputFile: post.url,
      outputPath: config.directory + constants.FOLDER_POSTS
    };

    args.push(arg);
  });

  return args;
}

function removePreviousPosts(config, callback) {

  var dir = config.directory + constants.FOLDER_POSTS;

  fs.readdir(dir, function(err, files) {

    if (err)
      callback(err);

    Q.all(files.map(function(file) {

      var path = dir + '\\' + file;
      return Q.nfcall(fs.unlink, path);
    }))
    .then(function() {
      callback(null);
    })
    .catch(function(err) {
      callback(err);
    });
  });
}
