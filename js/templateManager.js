//A way to overwrite Date to format the text to allow send to input[type="date"]
Date.prototype.yyyymmdd = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]); // padding
};

//Create a indirect form using handlebars and data from our JSON object
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
//Create a view of day less using handlebars and data from our JSON object
var createViewResult = function (wottData) {
    var viewTemplate = JST["templates/view-result-wott.hbs"];
    var letters = ['727272', 'f1595f', '79c36a', '599ad3', 'f9a65a', '9e66ab', 'cd7058', 'd77fb3'];
    //1E5 because we are only interested in the difference in days
    wottData['percent'] = 0;
    if (typeof wottData['edate'] !== "undefined" && typeof wottData['sdate'] !== "undefined") {
        //Our percentage is based on how close you are of the date as much time you have
        //the higher value up to 100%
        wottData['percent'] = parseInt(((wottData['edate'] - wottData['sdate']) / wottData['edate']) * 1E5);
        wottData['percent'] = Math.min(wottData['percent'], 100);
        wottData['percent'] = Math.max(wottData['percent'], 0);
    }
    wottData['color'] = '#' + letters[Math.floor(Math.random() * letters.length)];
    return viewTemplate(wottData);
};