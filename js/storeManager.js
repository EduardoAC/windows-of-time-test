
//Update the information in the server but it try to avoid to many queries at
//the same time
var save = function () {
    clearTimeout(updateServerData);
    updateServerData = setTimeout(function () {
        writeJSON('server.php', temporaryData, function (response) {
            console.log("Complete save on server");
        });
    }, 500);
};

//Handle the element that must be updated in the persistent storage
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



