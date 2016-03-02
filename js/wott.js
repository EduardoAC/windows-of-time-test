var loadJSON = function (path, callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', path, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(JSON.parse(xobj.responseText));
        }
    };
    xobj.send(null);
};

var writeJSON = function (path, data, callback) {
    var json = JSON.stringify(data);
    var encoded = btoa(json);
    var xobj = new XMLHttpRequest();
    xobj.open('POST', path, true); 
    xobj.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send('json=' + encoded);
};

var initializeWott = function () {
    var jsonObject = null;
    
    loadJSON('data/info.json', function(jsonObject){
        console.log(jsonObject);
    });
    
    jsonObject = [{'1':1}];
    writeJSON('server.php',jsonObject, function(response){
       console.log(response); 
    });
};

window.onload = initializeWott;