//Fix problem with all the elements after the element deleted
var fixIdForm = function (id, newTotal) {
    for (var i = id + 1; i <= newTotal; i++) {
        document.getElementById("form_wott-" + i).id = "form_wott-" + (i - 1);
        document.getElementById("hpb-" + i).id = "hpb-" + (i - 1);
        document.getElementById("pb-" + i).id = "pb-" + (i - 1);
    }
};

//Delete a element from our application
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

//Render the items stored in our JSON when we load the Web app
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


