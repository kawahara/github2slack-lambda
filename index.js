/* jshint: indent:2 */
var request = require('request'),
    config  = require('./config.json');

var convertName = function (body) {
  return body.replace(/@[a-zA-Z0-9_\-]+/g, function (m) {
    return config.account_map[m] || m;
  });
};

var link = function (url, text) {
  return '<' + url + '|' + text + '>';
};

exports.handler = function (event, context) {
  console.log('Received GitHub event: ' + event.Records[0].Sns.Message);
  var msg = JSON.parse(event.Records[0].Sns.Message);
  var eventName = event.Records[0].Sns.MessageAttributes['X-Github-Event'].Value;
  var text = '';

  switch (eventName) {
    case 'issue_comment':
    case 'pull_request_review_comment':
      var comment = msg.comment;
      text += comment.user.login + ": \n";
      text += convertName(comment.body) + "\n";
      text += comment.html_url;
      break;
    case 'pull_request_review':
      var review = msg.review;
      text += review.user.login + ": \n";
      text += 'Review State: ' + review.state + "\n";
      text += convertName(review.body) + "\n";
      text += review.html_url;
      break;
    case 'issues':
      var issue = msg.issue;
      if (msg.action == 'opended' || msg.action == 'closed') {
          text += 'Issue ' + msg.action + "\n";
          text += link(issue.html_url, issue.title);
      }
      break;
    case 'push':
      text += 'Pushed' + "\n";
      text += msg.compare + "\n";
      for (var i = 0; i < msg.commits.length; i++) {
        var commit = msg.commits[i];
        text += link(commit.url, commit.id.substr(0, 8)) + ' ' + commit.message + ' - ' + commit.author.name + "\n";
      }
      break;
    case 'pull_request':
      var pull_request = msg.pull_request;
      if (msg.action == 'opended' || msg.action == 'closed') {
          text += 'Pull Request ' + msg.action + "\n";
          text += pull_request.title + "\n";
          text += pull_request.body + "\n";
          text += pull_request.html_url;
      }
      break;
  }

  if (!text) {
    context.done();
    return;
  }

  request({
    url: config.slack_web_hook_url,
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    json: {text: text, link_names: 1}
  }, function () {
    context.done();
  });
};
