/* Helper function to display errors in browser console */
function errLog() {
    var a = arguments || '';
    if(window["console"]) { console["log"](a); }
    else if(window["opera"]) { opera["postError"](a); }
    else { alert(a); };
};

/* Helper functions to stop event behaviours */
function stopBubble(evt) {
    var e = evt ? evt : window.event;
    if(e.stopPropagation) { e.stopPropagation(); };
    if(e.cancelBubble !== null) { e.cancelBubble = true; };
};
function stopDefault(evt) {
    var e = evt ? evt : window.event;
    if(e.preventDefault) { e.preventDefault(); };
    e.returnValue = false;
    return false;
};
function stopAll(evt) {
    stopBubble(evt);
    return stopDefault(evt);
};

/* Helper functions to return live DOM objects */
function getNextSib(id) {
    var n = id || null;
    do { n = n["nextSibling"]; } while(n && n["nodeType"] !== 1) ;
    return n || false;
};
function getPrevSib(id) {
    var p = id || null;
    do { p = p["previousSibling"]; } while(p && p["nodeType"] !== 1);
    return p || false;
};
function getById(id) {
    var i = id || null;
    return document["getElementById"](i) || false;
};
function getByTag(id) {
    var t = id || null;
    return document["getElementsByTagName"](t) || false;
};
function getByClass(id) {
    var c = id || null;
    return document["getElementsByClassName"](c) || false;
};


/* Application enclosure, protecting from outside influence, allowing shorthand references to window(w) and document(d) objects */
;(function main(w, d) {

/* Protected storage object (isolation using closure) */
    var globvar = (function globvar() {
        var protectedConstruct = function proConst() {
            var UndefConst;
            this["undefined"] = (function undef() { return UndefConst; }());

            var vars = {
                popupTimer  :   null,
                rotTimer    :   null,
            };
            this["setVar"] = function(indvar, inddat) { vars[indvar] = inddat; };
            this["getVar"] = function(udvar) { return vars[udvar]; };
        };
        return new protectedConstruct();
    }());

/* Helper function to determine data validity */
    function checkData(data) {
        var tmpData = data || null;
        return ((tmpData === null) || (tmpData === '') || (tmpData === globvar["undefined"])) ? false : true;
    };

/* Determine browser and return correct animation event handles */
    function whichAnimationEvent(){
        var t, el = d["createElement"]("fakeelement"), animations = {
          animation : "animationend",
          OAnimation : "oAnimationEnd",
          MSAnimation : "MSAnimationEnd",
          MozAnimation : "animationend",
          WebkitAnimation : "webkitAnimationEnd",
        };
        for(t in animations){
            if(el["style"][t] !== globvar["undefined"]){
                return animations[t];
            };
        };
    };
    function whichAnimationName(){
        var t, el = d["createElement"]("fakeelement"), animations = {
          animation : "animationname",
          OAnimation : "oAnimationName",
          MSAnimation : "MSAnimationName",
          MozAnimation : "animationname",
          WebkitAnimation : "webkitAnimationName",
        };
        for(t in animations){
            if(el["style"][t] !== globvar["undefined"]){
                return animations[t];
            };
        };
    };

/* Start the animation and attach animation event to keep it running */
    function newImageRot(id) {
        var tmpID = id, parent = getById("spinner"), animEnd = whichAnimationEvent(), animName = whichAnimationName(), next = getNextSib(tmpID), prev = getPrevSib(tmpID);
        if(false === next) { next = parent["children"][0]; };
        tmpID["className"] = "spinanim";
        next["className"] = "spinnext";
        tmpID["addEventListener"](animEnd, function animEndEvt() {
            tmpID["className"] = "spinturned";
            tmpID["style"][animName] = "";
            tmpID["removeEventListener"](animEnd, function animEndEvt() {}, false);
            if(false !== prev) {
                var klon = prev["cloneNode"](true);
                parent["removeChild"](prev);
                klon["className"] = "";
                klon["style"][animName] = "";
                klon["removeEventListener"](animEnd, function animEndEvt() {}, false);
                parent["appendChild"](klon);
            };
            globvar["setVar"]("rotTimer", w["setTimeout"](function imgRotTmr() {
                globvar["setVar"]("rotTimer", null);
                newImageRot(next);
            }, 2000));
        }, false);
    };

/* When web page is loaded and rendered in DOM - same as jQuery $(document).ready */
    d["addEventListener"]("DOMContentLoaded", function onReady() {

/* Add event handlers */
//        getById("adminknap")["onclick"]             = function clickAdmin(event) { adminknap(event); };
//        getById("nyhedsbrevtilmeld")["onsubmit"]    = function clickSubmit(event) { nyEmail(event); };

/* Check if DOM object exists then start animation */
        if(getById("spisebord")) {
            globvar["setVar"]("rotTimer", w["setTimeout"](function imgRotTmr() {
                newImageRot(getById("spinner")["children"][0]);
                globvar["setVar"]("rotTimer", null);
            }, 2000));
        };

    });
}(window, document));
