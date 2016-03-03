/**
 * MUST BE RUN IN A XMAP, LAMPP enviroment to be able to run PHP
*/

//Asynchronous connection with a tiny PHP code to load the info.json from the server
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
//Asynchronous connection with a tiny PHP code to save the info.json in the server
var writeJSON = function (path, data, callback) {
    var json = JSON.stringify(data);
    var encoded = btoa(json);
    var xobj = new XMLHttpRequest();
    xobj.open('POST', path, true);
    xobj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send('json=' + encoded);
};


