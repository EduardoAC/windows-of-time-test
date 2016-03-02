var loadJSON = function (path, callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', path, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
};

var initializeWott = function () {
    var jsonObject = null;
    
    loadJSON('data/info.json', function(response){
        // Parse JSON string into object
        jsonObject = JSON.parse(response);
        console.log(jsonObject);
    });
};

window.onload = initializeWott;