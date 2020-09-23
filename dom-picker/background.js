let onCopy = function (info, tab) {
    chrome.tabs.sendMessage(tab.id, {target: "copy"});
}

chrome.contextMenus.create({
    id: "copy",
    title: "Element Pick",
    contexts: ["all"],
    "onclick": onCopy
});
chrome.browserAction.onClicked.addListener(function (tab) {
    var manifest = chrome.runtime.getManifest();
    var scripts = manifest.content_scripts.reduce((sc, cur) => sc.concat(cur.js || []), []);
    var styles = manifest.content_scripts.reduce((sc, cur) => sc.concat(cur.css || []), []);
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function (tabs) {
        var updateProperties = {
            "active": true
        };
        chrome.tabs.update(tabs[0].id, updateProperties, function (tab) {
            /* alert("update");*/
            if (tab.url.indexOf("https://chrome.google.com/webstore/detail") !== 0) {
                scripts.map((sc) => chrome.tabs.executeScript(tab.id, {file: sc, allFrames: true}));
                styles.map((sc) => chrome.tabs.insertCSS(tab.id, {file: sc, allFrames: true}));
            }
            chrome.tabs.executeScript(tab.id, {
                file: "content_script.js"
            }, function () {
                if (chrome.runtime.lastError) {
                    alert('Current page is blocking extension');
                    return;
                }
            });
        });
    });
});

chrome.runtime.onInstalled.addListener((details) => {
    if (["install", "update"].some((reason) => details.reason === reason)) {
        setTimeout(() => {
            injectScriptsInAllTabs();
        }, 5000);
    }
});

function injectScriptsInAllTabs() {
    console.log("reinject content scripts into all tabs");
    var manifest = chrome.runtime.getManifest();
    var scripts = manifest.content_scripts.reduce((sc, cur) => sc.concat(cur.js || []), []);
    var styles = manifest.content_scripts.reduce((sc, cur) => sc.concat(cur.css || []), []);
    chrome.tabs.query({url: "*://*/*"}, (tabs) => {
        var filtered = tabs.filter(_ => _.url.indexOf("https://chrome.google.com/webstore/detail") !== 0);
        filtered.forEach(tab => {
            /!* alert(tab.id + " js load");*!/
            scripts.map((sc) => chrome.tabs.executeScript(tab.id, {file: sc, allFrames: true}));
        });
        filtered.forEach(tab => {
            /!* alert(tab.id + " css load");*/
            styles.map((sc) => chrome.tabs.insertCSS(tab.id, {file: sc, allFrames: true}));
        });
    });
}
