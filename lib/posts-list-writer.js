var constants = require('./constants');
var utils = require('./utils');
var path = require('path');

exports.writePostsList = function(config, posts, callback) {

  var jadeTemplate = path.join(config.directory, constants.FILE_JADE_POSTLIST);
  var postsPath = path.join(config.directory, constants.FILE_HTML_POSTS);

  var postsReversed = posts.slice(); // create another copy
  postsReversed.reverse(); // posts.htmls lists posts in reverse order

  postsReversed.forEach(function(post) {
      post.showTags = '';
      post.filters = [];
      post.tags.split(',').reverse().forEach(function(tag) {
          if(tag) {
              post.showTags += ' || active.' + tag.trim().toLowerCase();
              post.filters.push(tag.trim());
          }
      });
  });

  var file = [{
      locals: { posts: postsReversed },
      name: postsPath
  }];

  utils.renderWithJade(file, jadeTemplate, function(err) {
      callback(err, posts);
  });
};
