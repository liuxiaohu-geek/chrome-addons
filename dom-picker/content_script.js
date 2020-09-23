var addonlastElement = null;
var addonDrag = false;
var clickElementInfo = {};

function mouseoutHandler(e) {
    $(this).removeClass("acddeb73-c0d0-4af3-a097-f15309e7aff1-addon-hover");
}

function mouseoverHandler(e) {
    if (addonDrag) return;
    if ($(".addon-footer").length === 0) return;
    if ($(".addon-footer").data("stop")) return;
    $(this).addClass("acddeb73-c0d0-4af3-a097-f15309e7aff1-addon-hover").parents().removeClass("acddeb73-c0d0-4af3-a097-f15309e7aff1-addon-hover");
    e.stopPropagation();
    let selectorGenerator = new SelectorGenerator({querySelectorAll: window.document.querySelectorAll.bind(window.document)});
    var currentElement = $(this)[0];
    let selector = selectorGenerator.getSelector(currentElement);
    let path = selectorGenerator.getPath(currentElement)
    //console.log({"selector": selector, "path": path});
    clickElementInfo = {"path": path, "selector": selector}
    $("#addonSelector").html(selector);
    //$("#addonPath").html($(this).getPath());
    $("#addonPath").html(path);
    if (typeof $(this).attr('id') == 'undefined') {
        $("#addonId").html("none");
        clickElementInfo['id'] = "none";
    } else {
        let id = $(this).attr('id');
        $("#addonId").html(id);
        clickElementInfo['id'] = id;

    }
    if (typeof $(this).attr('class') == 'undefined') {
        $("#addonClassName").html("none");
        clickElementInfo['class'] = "none";
    } else {
        //$("#addonClassName").html($(this).attr("class"));
        var class_array, result_class;
        $(this).hasClass("acddeb73-c0d0-4af3-a097-f15309e7aff1-addon-hover") && (class_array = $(this).attr("class").split(' ')),
            //console.log(class_array),
            result_class = class_array.filter(_ => _ !== "acddeb73-c0d0-4af3-a097-f15309e7aff1-addon-hover").join(" ")
        //console.log("result_class: " + result_class),
        result_class.trim() != "" ? $("#addonClassName").html(result_class) : $("#addonClassName").html("none");
        clickElementInfo['class'] = !result_class.trim() ? "none" : result_class;
    }

    document.getElementsByClassName('addon-copy-button')[0].setAttribute('data-clipboard-text', "Path: " + $("#addonPath").text() + ", Id: " + $("#addonId").text() + ", Class: " + $("#addonClassName").text());

    addonlastElement = $(this);


    addonlastElement.draggable({
        start: startDrag,
        stop: stopDrag
    });
}

function stopDrag() {
    addonDrag = false;
}

function startDrag() {
    addonDrag = true;
}

function initHover() {
    chrome.storage.sync.get('typeSettings', function (settings) {
        if (typeof settings.typeSettings != 'undefined' && settings.typeSettings != "") {
            $(settings.typeSettings.toString().replace(/,/g, ", ")).not(".addon-footer, .addon-footer " + settings.typeSettings.toString().replace(/,/g, ", .addon-footer ")).mouseover(mouseoverHandler).mouseout(mouseoutHandler);
        }
    });
};


function createFooter() {
    $("body").append("<div class=\"addon-footer\" data-stop=\"false\">" +
        "<div class=\"addon-close-button\" title=\"Close\"></div>" +
        "<div class=\"addon-copy-button\"   title=\"Copy to clipboard\"></div>" +
        "<div class=\"addon-settings-button\" title=\"Set finding element types\"></div>" +


        "<div class=\"addon-types\">" +
        "<div class=\"addon-label\">Element types</div>" +
        "<div class=\"addon-type addon-type-div\">DIV</div>" +
        "<div class=\"addon-type addon-type-span\">SPAN</div>" +
        "<div class=\"addon-type addon-type-ul\">UL</div>" +
        "<div class=\"addon-type addon-type-li\">LI</div>" +
        "<div class=\"addon-type addon-type-table\">TABLE</div>" +
        "<div class=\"addon-type addon-type-tr\">TR</div>" +
        "<div class=\"addon-type addon-type-td\">TD</div>" +
        "<div class=\"addon-type addon-type-a\">A</div>" +
        "<div class=\"addon-type addon-type-form\">FORM</div>" +
        "<div class=\"addon-type addon-type-frame\">FRAME</div>" +
        "<div class=\"addon-type addon-type-iframe\">IFRAME</div>" +
        "<div class=\"addon-type addon-type-button\">BUTTON</div>" +
        "<div class=\"addon-type addon-type-article\">ARTICLE</div>" +
        "<div class=\"addon-type addon-type-h1\">H1</div>" +
        "<div class=\"addon-type addon-type-h2\">H2</div>" +
        "<div class=\"addon-type addon-type-h3\">H3</div>" +
        "<div class=\"addon-type addon-type-h4\">H4</div>" +
        "<div class=\"addon-type addon-type-h5\">H5</div>" +
        "<div class=\"addon-type addon-type-h6\">H6</div>" +
        "<div class=\"addon-type addon-type-img\">IMG</div>" +
        "<div class=\"addon-type addon-type-input\">INPUT</div>" +
        "<div class=\"addon-type addon-type-textarea\">TEXTAREA</div>" +
        "<div class=\"addon-type addon-type-option\">OPTION</div>" +
        "<div class=\"addon-clearfix\"></div>" +
        "</div>" +
        "<div class=\"addon-label addon-selector\">Unique selector</div> <div class=\"addon-value\" id =\"addonSelector\">none</div>" +
        "<div class=\"addon-label addon-path\">Unique path</div> <div class=\"addon-value\" id =\"addonPath\">none</div>" +
        "<div class=\"addon-label addon-id\">Id</div> <div class=\"addon-value\" id =\"addonId\">none</div>" +
        "<div class=\"addon-label addon-class\">Class name</div> <div class=\"addon-value\" id =\"addonClassName\">none</div>" +
        "</div>");
};

function saveFunction(e) {
    if (e.ctrlKey && e.keyCode == 83) {
        $(".addon-footer").data("stop", !$(".addon-footer").data("stop"));
        $(".addon-footer").toggleClass("addon-foter-save");
        e.stopPropagation();
        e.preventDefault();
    }

    if (addonlastElement != null && typeof addonlastElement != 'undefined') {
        if (e.keyCode == 46) {

            addonlastElement.remove();
            addonlastElement = null;
        }
    }
};

function removeAddon() {
    $(".addon-footer").remove();
};


function initButton() {
    $('.addon-close-button').click(function () {
        removeAddon();
    });

    $('.addon-type').click(function () {
        addOrRemoveType($(this));
    });

    $('.addon-types').hide();

    $('.addon-settings-button').click(function () {
        $('.addon-types').toggle();
    });


    new Clipboard('.addon-copy-button');

};

function addOrRemoveType(elem) {

    var html = elem.html().toLowerCase();
    var selectedClass = "addon-type-selected";
    var isAdded = !elem.hasClass(selectedClass);


    chrome.storage.sync.get('typeSettings', function (settings) {

        var arrayTypes = [];
        if (typeof settings.typeSettings != 'undefined') {
            arrayTypes = settings.typeSettings;
        }

        if (isAdded) {
            arrayTypes.push(html);
        } else {


            var index = arrayTypes.indexOf(html);
            if (index !== -1) {
                arrayTypes.splice(index, 1);
            }
        }

        chrome.storage.sync.set({
            'typeSettings': arrayTypes
        }, function () {
            if (isAdded) {
                elem.addClass(selectedClass);
            } else {
                elem.removeClass(selectedClass);
            }

            chrome.storage.sync.set({
                'userModifySettings': true
            }, function () {
            });
        });
    });
};

function initKeyCapture() {
    $(document).off('keydown');
    $(document).on('keydown', saveFunction);
};

function setDefaultTypes() {
    chrome.storage.sync.get('userModifySettings', function (settings) {
        if (typeof settings.userModifySettings == 'undefined') {
            chrome.storage.sync.set({
                //'typeSettings': ["div", "span", "ul", "table", "a", "button"]
                'typeSettings': ["div", "span", "ul", "li", "table", "tr", "td", "a", "form", "frame", "iframe", "button",
                    "article", "h1", "h2", "h3", "h4", "h5", "h6", "img", "input", "textarea", "option"]
            }, function () {
                setButtonTypes();
            });
        } else {
            setButtonTypes();
        }
    });
}

function setButtonTypes() {
    chrome.storage.sync.get('typeSettings', function (settings) {
        for (var i = 0; i < settings.typeSettings.length; i++) {
            $(".addon-type-" + settings.typeSettings[i]).addClass("addon-type-selected");
        }
        initHover();
    });
}

function setTypesChangesListener() {
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        for (key in changes) {
            if (key == "typeSettings") {
                if (changes.typeSettings.oldValue && changes.typeSettings.oldValue.toString() != "") {
                    $(changes.typeSettings.oldValue.toString().replace(/,/g, ", ")).not(".addon-footer, .addon-footer " + changes.typeSettings.oldValue.toString().replace(/,/g, ", .addon-footer ")).unbind("mouseover", mouseoverHandler);
                    $(changes.typeSettings.oldValue.toString().replace(/,/g, ", ")).not(".addon-footer, .addon-footer " + changes.typeSettings.oldValue.toString().replace(/,/g, ", .addon-footer ")).unbind("mouseout", mouseoutHandler);

                }
                initHover();
            }
        }
    });
}


function copyToClipboard(text) {
    console.log("copyToClipborad： " + text);
    const input = document.createElement("input");
    input.style.position = "fixed";
    input.style.opacity = 0;
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("Copy");
    document.body.removeChild(input);
}

chrome.runtime.onMessage.removeListener((request) => {
    if (request && request.target === "copy") {
        copyToClipboard(JSON.stringify(clickElementInfo));
    }
});
chrome.runtime.onMessage.addListener((request) => {
    if (request && request.target === "copy") {
        copyToClipboard(JSON.stringify(clickElementInfo));
    }
});

$(function () {
    removeAddon();
    setDefaultTypes();
    setTypesChangesListener();
    createFooter();
    initButton();
    initKeyCapture();
});