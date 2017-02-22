function getArray(array, val) {
  array.push(val);
  return array;
}

function postResult(array) {
  var html = "";
  
  for (var key in array) {
    if (array[key].status === "offline") {
      html += "<tbody><tr class='danger'><td><img class='img-circle' src='" + array[key].logo + "' alt='" + array[key].username + "'></td><td><a href='https://www.twitch.tv/" + array[key].username + "' target='_blank'>" + array[key].username + "</a></td><td><p>" + array[key].status + "</p></td></tr></tbody>";
  } else {
      html += "<tbody><tr class='info'><td><img class='img-circle' src='" + array[key].logo + "' alt='" + array[key].username + "'></td><td><a href='https://www.twitch.tv/" + array[key].username + "' target='_blank'>" + array[key].username + "</a></td><td><p>" + array[key].status + "</p></td></tr></tbody>";
  }
  }
 // console.log(html);
  return html;
}

$(document).ready(function() {

  var baseUrl = 'https://wind-bow.gomix.me/twitch-api';
  var usernames = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "RobotCaleb", "thomasballinger", "noobs2ninjas", "beohoff", "cretetion", "ESL_SC2"];
  var statusArr = [];
  var usersArr = [];
  var logoArr = [];

  for (var i in usernames) {
    var channelStreamUrl = baseUrl + '/streams/' + usernames[i];
    $.ajax({
      url: channelStreamUrl /*baseUrl + '/channels/' + i*/ ,
      dataType: 'json',
      type: 'GET',
      async: false,
      success: function(response) {
        if (response.stream === null) {
          statusArr.push('offline');
        } else {
          if (response.stream.channel.status.length <= 29) {
            statusArr.push(response.stream.channel.game + ': ' + response.stream.channel.status);
          } else {
            statusArr.push(response.stream.channel.game + ': ' + response.stream.channel.status.slice(0, 29) + "...");
          }
        }
      }
    });

    var channelUsersUrl = baseUrl + '/users/' + usernames[i];
    $.ajax({
      url: channelUsersUrl /*baseUrl + '/channels/' + i*/ ,
      dataType: 'json',
      type: 'GET',
      async: false,
      success: function(response) {
        if (response.logo === null) {
          logoArr.push("#");
        } else {
          logoArr.push(response.logo);
        }
      }
    });

  }
  for (var key in usernames) {
    usersArr.push({
      username: usernames[key],
      status: statusArr[key],
      logo: logoArr[key]
    })
  }
  
  var offlineUsers = usersArr.filter(function(val){
    return val.status === "offline";
  });
  var onlineUsers = usersArr.filter(function(val){
    return val.status !== "offline";
  });
  
  //console.log(onlineUsers);
  var html = postResult(usersArr);

  $('#filterOnline').click(function(){
    html = postResult(onlineUsers);
    $('#result').empty();
    $('#result').append(html);
  });
  
  $('#filterOffline').click(function(){
    html = postResult(offlineUsers);
    $('#result').empty();
    $('#result').append(html);
  });
  
  $('#filterAll').click(function(){
    html = postResult(usersArr);
    $('#result').empty();
    $('#result').append(html);
  });
  
  $('#result').append(html);
  //console.log(usersArr);
});