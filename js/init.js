// -- HTML Manipulations -- //
function disableBtnGoldhen() {
  var btn = document.getElementById("btn-goldhen");
  btn.disabled = true;
}

function enableBtnGoldhen() {
  var btn = document.getElementById("btn-goldhen");
  btn.disabled = false;
}

function showCachingProgress() {
  var element = document.getElementById("caching-progress");
  element.style.display = "block";
}

function hideCachingProgress() {
  var element = document.getElementById("caching-progress");
  element.style.display = "none";
}

function setCachingProgressPercent(percent) {
  var progressPercentElem = document.getElementById("progress-percent");
  progressPercentElem.innerText = percent;
  var progressBarElem = document.getElementById("progress-bar");
  progressBarElem.style.width = percent + "%";
}

function setStatusMessage(message) {
  var element = document.getElementById("status-message");
  element.innerText = message;
}

var debugLineCount = 1;
function debugLog(log) {
  var debugElem = document.getElementById("debug");
  var divElem = document.createElement("div");
  divElem.innerText = "[" + debugLineCount + "] >> " + log;
  if (debugLineCount < 10) {
    divElem.innerText = "[0" + debugLineCount + "] >> " + log;
  }
  debugElem.appendChild(divElem);
  debugLineCount += 1;
}

window.endExploit = function () {
  enableBtnGoldhen();
  setStatusMessage("READY");
  debugLog("Done");
};

document.getElementById("btn-goldhen").onclick = function (e) {
  debugLog("Loading GoldHen 2.0b2");
  setStatusMessage("Loading GoldHen 2.0b2");
  disableBtnGoldhen();
  setTimeout(() => {
    loadGoldhen();
  }, 5000);
};
// -- END HTML Manipulations -- //

disableBtnGoldhen();
hideCachingProgress();
setCachingProgressPercent(0);

function isCached() {
  const value = window.localStorage.getItem("CACHED");
  if (value) {
    return Boolean(parseInt(value));
  } else {
    window.localStorage.setItem("CACHED", "0");
    return false;
  }
}

function setCached(isCached) {
  if (isCached) {
    window.localStorage.setItem("CACHED", "1");
  } else {
    window.localStorage.setItem("CACHED", "0");
  }
}

if (window.applicationCache) {
  if (!window.localStorage.getItem("cached")) {
    window.localStorage.setItem("cached", "");
  }

  var checking = function (e) {
    debugLog("Checking for updates");
  };

  var noUpdate = function (e) {
    debugLog("No updates found");
    setStatusMessage("READY");
    enableBtnGoldhen();
  };

  var downloading = function (e) {
    debugLog("Installing cache");
    showCachingProgress();
    setStatusMessage("Installing cache");
  };

  var error = function (e) {
    if (isCached()) {
      debugLog("No updates found");
      setStatusMessage("READY");
      enableBtnGoldhen();
    } else {
      setStatusMessage("Error caching");
      debugLog("Error caching files");
    }
  };

  var progress = function (e) {
    var progressPercent = Math.round((e.loaded / e.total) * 100);
    setCachingProgressPercent(progressPercent);
    var message = "Caching file (" + e.loaded + " of " + e.total + ")";
    debugLog(message);
  };

  var cached = function (e) {
    setCached(true);
    debugLog("All files are cached");
    setStatusMessage("READY");
    enableBtnGoldhen();
  };

  window.applicationCache.addEventListener("checking", checking, false);
  window.applicationCache.addEventListener("noupdate", noUpdate, false);
  window.applicationCache.addEventListener("downloading", downloading, false);
  window.applicationCache.addEventListener("error", error, false);
  window.applicationCache.addEventListener("progress", progress, false);
  window.applicationCache.addEventListener("cached", cached, false);
} else {
  setStatusMessage("READY");
  debugLog("This browser is unsupported");
  document.getElementById("btn-goldhen").onclick = function () {
    debugLog("Unsupported browser");
    setStatusMessage("Unsupported");
  };
  enableBtnGoldhen();
}
