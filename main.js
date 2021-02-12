function run() {
  var id = document.getElementById("songid").value;
  var output = document.getElementById("run");

  var text = document.createElement("p");

  if(id == "") {
    text.innerHTML = "Song ID is empty!";
    output.appendChild(text);
    return;
  }

  text.innerHTML = "Starting download with ID "+id;
  output.appendChild(text);


  // fuck CORS >:3
  getPage("https://api.allorigins.win/get?url=https%3A%2F%2Fwww.newgrounds.com%2Faudio%2Flisten%2F" + id).then(function(body) {
    // work with the data we got
    body = body.contents;

    // scrape the shit out of the site
    var url = body.substring(body.indexOf("<![CDATA[")+9);
    url = url.substring(url.indexOf("embedController([")+17);
    url = url.substring(0, url.indexOf("// ]]>"));
    url = url.substring(0, url.lastIndexOf("playlist"));
    url = url.substring(0, url.lastIndexOf(","));
    url = url.substring(0, url.indexOf("\",\""));
    url = url.substring(0, url.indexOf("?"));
    url = url.substring(url.indexOf("url")+3);
    url = url.substring(url.indexOf(":\"")+2);
    url = url.replace(/\\\//g, "/");

    var title = body.substring(body.indexOf("<title>")+7);
    title = title.substring(0, title.lastIndexOf("</title>"))

    var msg = document.createElement("p");
    msg.innerHTML = "Done!";
    output.appendChild(msg);

    var out = document.createElement("a");
    out.href = url;
    out.innerHTML = "Download \""+title+"\"";
    output.appendChild(out);

  }, function(status) {
    if(status == 404) {
      outMSG("The song could not be found! Please check the song id and try again! (error 404)");
      return;
    }
    outMSG("Something went wrong! Please check your internet connection and try again! Error Code: "+status);
  });
}

var getPage = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'text';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};


function outMSG(text) {
  var output = document.getElementById("run");

  var msg = document.createElement("p");
  msg.innerHTML = text;
  output.appendChild(msg);
}
