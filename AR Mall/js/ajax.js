function createXmlHttpRequest() {
  var xmlHttp;
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
  } else {
    xmlHttp = new ActiveXObject('Microsoft.XMLHTPP');
  }
  return xmlHttp;
}

function ajax(method, url, success, b) {
  var xmlHttp = createXmlHttpRequest();
  xmlHttp.open(method, url, b); //build connection with server
  xmlHttp.send(); //send request
  xmlHttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      success(JSON.parse(this.responseText));
    }
  };
}
