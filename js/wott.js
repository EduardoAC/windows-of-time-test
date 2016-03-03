var temporaryData = [];
var updateServerData;
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

var save = function () {
    clearTimeout(updateServerData);
    updateServerData = setTimeout(function () {
        writeJSON('server.php', temporaryData, function (response) {
            console.log("Complete save on server");
        });
    }, 500);
}
Date.prototype.yyyymmdd = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]); // padding
};

var createForm = function (wottData) {
    //To avoid overwrite date values
    var formTemplate = JST["templates/form-wott.hbs"];

    if (wottData['sdate']) {
        var sDate = new Date(wottData['sdate'] * 1000);
        wottData['sdate'] = sDate.yyyymmdd();
    }
    if (wottData['edate']) {
        var eDate = new Date(wottData['edate'] * 1000);
        wottData['edate'] = eDate.yyyymmdd();
    }
    return formTemplate(wottData);
};
var createViewResult = function (wottData) {
    var viewTemplate = JST["templates/view-result-wott.hbs"];
    var letters = ['727272', 'f1595f', '79c36a', '599ad3', 'f9a65a', '9e66ab', 'cd7058', 'd77fb3'];
    //1E5 because we are only interested in the difference in days
    wottData['percent'] = 0;
    if (typeof wottData['edate'] !== "undefined" && typeof wottData['sdate'] !== "undefined") {
        wottData['percent'] = parseInt(((wottData['edate'] - wottData['sdate']) / wottData['edate']) * 1E5);
        wottData['percent'] = Math.min(wottData['percent'], 100);
        wottData['percent'] = Math.max(wottData['percent'], 0);
    }
    wottData['color'] = '#' + letters[Math.floor(Math.random() * letters.length)];
    return viewTemplate(wottData);
};
var fixIdForm = function (id, newTotal) {
    for (var i = id + 1; i <= newTotal; i++) {
        document.getElementById("form_wott-" + i).id = "form_wott-" + (i - 1);
        document.getElementById("hpb-" + i).id = "hpb-" + (i - 1);
        document.getElementById("pb-" + i).id = "pb-" + (i - 1);
    }
};
var removeWott = function (fwott) {
    var cplxId = fwott.id.split('-');
    var id = parseInt(cplxId[1]);
    var hpb = document.getElementById("hpb-" + id);
    var pb = document.getElementById("pb-" + id).parentNode; //Progres bar is a group of two items
    pb.parentNode.removeChild(pb);
    hpb.parentNode.removeChild(hpb);
    fwott.parentNode.removeChild(fwott);
    temporaryData.splice(id, 1);
    fixIdForm(id, temporaryData.length);
    save();
};
var render = function (arrayOfWott) {
    var length = arrayOfWott.length;
    var item, htmlForms = "", htmlViewResults = "";
    var spinners = document.getElementById("spinner-form");
    spinners.className += " hidden";
    for (var i = 0; i < length; i++) {
        item = JSON.parse(JSON.stringify(arrayOfWott[i]));
        item['index'] = i;
        htmlViewResults += createViewResult(item);
        htmlForms += createForm(item);
    }

    document.getElementById("form-collection").insertAdjacentHTML('beforeend', htmlForms);
    document.getElementById("view-results").insertAdjacentHTML('beforeend', htmlViewResults);

    var removeButtons = document.getElementById("form-collection").querySelectorAll(".remove-wott");
    length = removeButtons.length;

    for (var j = 0; j < length; j++) {
        removeButtons[j].addEventListener('click', function (event) {
            var formDOM = event.target.parentNode.parentNode;
            removeWott(formDOM);
        });
    }
};

var domReady = function (callback) {
    document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};


var processData = function (id, type, value) {
    var wottData = temporaryData[id];
    if (type === 'wn') {
        document.getElementById('hpb-' + id).innerHTML = value;
        wottData['name'] = value;
    } else {
        var time = new Date(value).getTime();
        if (type === 'wsd') {
            wottData['sdate'] = time;
        } else {
            wottData['edate'] = time;
        }
        var percent = parseInt(((wottData['edate'] - wottData['sdate']) / wottData['edate']) * 1E5);
        percent = Math.min(percent, 100);
        percent = Math.max(percent, 0);
        document.getElementById('pb-' + id).style.width = percent + "%";
    }
};

var initializeWott = function () {
    var jsonObject = null;

    loadJSON('data/info.json', function (jsonObject) {
        temporaryData = jsonObject;
        render(jsonObject);
    });
};
domReady(function () {
    document.getElementById("form-collection").addEventListener('change', function (event) {
        var typeId = event.target.id.split("-");
        processData(typeId[1], typeId[0], event.target.value);
        save();
    });

    document.getElementById("get-data").addEventListener('click', function () {
        console.log(JSON.stringify(temporaryData));
    });
    document.getElementById("add-window").addEventListener('click', function () {
        var index = temporaryData.length;
        temporaryData[index] = {};
        var item = {};
        item['index'] = index;
        document.getElementById("form-collection").insertAdjacentHTML('beforeend', createForm(item));
        document.getElementById("view-results").insertAdjacentHTML('beforeend', createViewResult(item));
        document.getElementById("form_wott-" + index)
                .querySelector(".remove-wott")
                .addEventListener('click', function (event) {
                    var formDOM = event.target.parentNode.parentNode;
                    removeWott(formDOM);
                });
        save();
    });
});
window.onload = initializeWott;