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
    xobj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send('json=' + encoded);
};

var createForm = function (item) {
    //To avoid overwrite date values
    var wottData = JSON.parse(JSON.stringify(item));
    var formTemplate = JST["templates/form-wott.hbs"];
    Date.prototype.yyyymmdd = function () {
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
        var dd = this.getDate().toString();
        return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]); // padding
    };

    var sDate = new Date(wottData['sdate'] * 1000);
    var eDate = new Date(wottData['edate'] * 1000);
    wottData['sdate'] = sDate.yyyymmdd();
    wottData['edate'] = eDate.yyyymmdd();
    return formTemplate(wottData);
};
var createViewResult = function (wottData) {
    var viewTemplate = JST["templates/view-result-wott.hbs"];
    var letters = ['727272','f1595f','79c36a','599ad3','f9a65a','9e66ab','cd7058','d77fb3'];
    //1E5 because we are only interested in the difference in days
    wottData['percent'] = parseInt(((wottData['edate'] - wottData['sdate']) / wottData['edate']) * 1E5);
    wottData['color'] = '#' + letters[Math.floor(Math.random() * letters.length)];
    return viewTemplate(wottData);
};
var render = function (arrayOfWott) {
    var length = arrayOfWott.length;
    var item, htmlForms = "", htmlViewResults = "";
    var spinners = document.getElementById("spinner-form");
    spinners.className += " hidden";

    for (var i = 0; i < length; i++) {
        item = arrayOfWott[i];
        item['index'] = i;
        htmlForms += createForm(item);
        htmlViewResults += createViewResult(item);
    }

    document.getElementById("form-collection").insertAdjacentHTML('beforeend', htmlForms);
    document.getElementById("view-results").insertAdjacentHTML('beforeend', htmlViewResults);
};
var domReady = function (callback) {
    document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};
var initializeWott = function () {
    var jsonObject = null;

    loadJSON('data/info.json', function (jsonObject) {
        console.log(jsonObject);
        render(jsonObject);
    });

    jsonObject = [{'1': 1}];
    writeJSON('server.php', jsonObject, function (response) {
        console.log(response);
    });

};

window.onload = initializeWott;
domReady(function () {
    document.getElementById("form-collection").addEventListener('change', function (event) {
        console.log(event.target);
    });
});