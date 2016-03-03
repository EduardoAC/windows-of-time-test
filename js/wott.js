var temporaryData = [];
var updateServerData;

var domReady = function (callback) {
    document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
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