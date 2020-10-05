//compose modal
var composeBtn = document.querySelector(".wxwidget");
var composeClose = document.querySelector(".wxcompose__closebtn--icon");
var composeModal = document.querySelector(".wxcompose");
var composeInputBtn = document.querySelector(".wxcompose__widget--btn");

//Settings modal
var WxIntent = document.querySelector(".wxintent");
var navbarIcon = document.querySelector("#navbarIcon");
var intentClose = document.querySelector("#intentClose");

var inputBox = document.querySelector("#inputbox");
var listview = document.querySelector(".wxcontainer__listwidgetview");
var emptyListView = document.querySelector(".wxcontainer__itemgridempty");
var WxCard = document.querySelector(".wxcard");
var btnRemoveAll = document.querySelector(".wxintent__widgetbox--btn");
var completeTask = document.querySelector("#completeTask");

var allElem = document.querySelectorAll("*");
var btnRemove = document.querySelector(".btn_remove");
var title_task = document.querySelector(".wxcontainer__titleview--text");

//icons
var autoRenewIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>`;
var taskIsCompleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none" /><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" /></svg>`;

/**
 * Enable PWA Options
 */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then((registration) => {
      return true;
    })
    .catch((error) => {
      console.log("SW failed");
      console.log(error);
    });
}

//check if localstorage exists
if (typeof window.localStorage == "undefined") {
  alert("Your browser does not support [Data Storage]");
}

//preloader
window.addEventListener("DOMContentLoaded", function () {
  allElem.forEach(function (elem) {
    if (elem.hasAttribute("cloak")) {
      elem.removeAttribute("cloak");
    }
  });
  check_list_empty();
  renderHtml();
});

//prevent image default event selection
document.querySelectorAll("img").forEach(function (elem) {
  elem.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });
});

/**
 * prevent context menu from displaying on screen
 */
window.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

/**
 * function to check if our store state is empty or not
 * the render UI
 */

function check_list_empty() {
  if (window.localStorage.length <= 0) {
    emptyListView.style.display = "block";
    listview.style.display = "none";
    title_task.style.visibility = "hidden";
  } else if (window.localStorage.length >= 0) {
    emptyListView.style.display = "none";
    listview.style.display = "block";
    title_task.style.visibility = "visible";
  }
}

//show compose task modal
composeBtn.addEventListener("click", function (e) {
  e.preventDefault();
  composeModal.classList.add("compose_open");
});

//close compose task modal
composeClose.addEventListener("click", function (e) {
  e.preventDefault();
  composeModal.classList.remove("compose_open");
});

/**
 * settings view
 */
navbarIcon.addEventListener("click", function (e) {
  e.preventDefault();
  WxIntent.classList.add("intent_open");
});

intentClose.addEventListener("click", function (e) {
  e.preventDefault();
  WxIntent.classList.remove("intent_open");
});

/**
 * set maxlength property
 */
inputBox.setAttribute("maxlength", 35);

/**
 * uniqId : { text, iscomplete}
 */

//create unique ID
function create_uniqueId() {
  var idA = Math.floor(Math.random() * 100);
  var r = Math.random().toString(36).substring(7);
  var idB = Math.floor(Math.random() * 1000);
  var output = idA + r + idB;
  return output;
}

/**
 * convert remove html tags before rendering to DOM
 */
function convertTxt(value) {
  if (!value) return "";
  var newAttr = document.createElement("div");
  newAttr.innerHTML = value;
  return filterHtml(newAttr.innerText);
}

/**
 * function to append new task to store and DOM
 */
function store_task() {
  var input_text = inputBox.value;

  if (input_text == null) {
    return false;
  }

  var store_data = {
    text: input_text,
    isComplete: false,
    dtime: new Date(),
  };

  var newId = create_uniqueId();

  var HTMLlayout = `
  <div id="wxcard" data-uniqid="${newId}" data-iscomplete="false" class="wxcard copyable-text">
      <p class="wxcard__textview">${convertTxt(store_data.text)}</p>
      <div class="wxcard__widgets">
          <div id="setIsComplete" onclick="setComplete('${newId}')" title="Complete" class="wxcard__iconview fill-green">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
          </div>
          <div onClick="removeTask('${newId}')"  title="Delete" class="wxcard__iconview fill-red">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path
                      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
          </div>
      </div>
  </div>`;

  listview.insertAdjacentHTML("beforeend", HTMLlayout);

  localStorage.setItem(newId, JSON.stringify(store_data));

  //close modal and clear input
  composeModal.classList.remove("compose_open");
  inputBox.value = "";
  check_list_empty();
}

function filterHtml(html) {
  html = html.replace(/<style([\s\S]*?)<\/style>/gi, "");
  html = html.replace(/<script([\s\S]*?)<\/script>/gi, "");
  html = html.replace(/<p([\s\S]*?)<\/p>/gi, "");
  html = html.replace(/<div([\s\S]*?)<\/div>/gi, "");
  html = html.replace(/<body([\s\S]*?)<\/body>/gi, "");
  html = html.replace(/<span([\s\S]*?)<\/span>/gi, "");
  html = html.replace(/<section([\s\S]*?)<\/section>/gi, "");
  html = html.replace(/<html([\s\S]*?)<\/html>/gi, "");
  html = html.replace(/<head([\s\S]*?)<\/head>/gi, "");
  html = html.replace(/<ul([\s\S]*?)<\/ul>/gi, "");
  html = html.replace(/<li([\s\S]*?)<\/li>/gi, "");
  html = html.replace(/<\/div>/gi, "\n");
  html = html.replace(/<\/li>/gi, "\n");
  html = html.replace(/<li>/gi, "  *  ");
  html = html.replace(/<\/ul>/gi, "\n");
  html = html.replace(/<\/p>/gi, "\n");
  html = html.replace(/<br\s*[\/]?>/gi, "\n");
  html = html.replace(/<[^>]+>/gi, "");
  return html;
}

/**
 * Check if task is complete
 */
function check_if_complete() {
  var wxcard_checker = document.querySelectorAll("#wxcard");
  if (wxcard_checker) {
    wxcard_checker.forEach((elem) => {
      if (elem.hasAttribute("data-uniqid")) {
        var getId = elem.getAttribute("data-uniqid");
        var data = JSON.parse(localStorage.getItem(getId));
        if (data.isComplete) {
          elem.classList.add("task-complete");
          elem.setAttribute("data-iscomplete", "true");
        } else {
          elem.classList.remove("task-complete");
          elem.setAttribute("data-iscomplete", "false");
        }
      }
    });
  }
}

/**
 * fetch data from local storage and render to listview;
 */

function renderHtml() {
  for (var i = 0; i < window.localStorage.length; i++) {
    var key = window.localStorage.key(i);
    var data = JSON.parse(localStorage.getItem(key));

    if (data !== null) {
      var HTMLlayout = `
      <div id="wxcard" data-uniqid="${key}" data-iscomplete="${
        data.isComplete
      }" class="wxcard copyable-text">
          <p class="wxcard__textview">${convertTxt(data.text)}</p>
          <div class="wxcard__widgets">
              <div id="setIsComplete" onclick="setComplete('${key}')" title="Complete" class="wxcard__iconview fill-green">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                  </svg>
              </div>
              <div onClick="removeTask('${key}')" title="Delete" class="wxcard__iconview remove_task fill-red">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path
                          d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
              </div>
          </div>
      </div>`;
    }

    listview.insertAdjacentHTML("afterbegin", HTMLlayout);
  }
  check_if_complete();
}

/**
 * button to append new data
 */
composeInputBtn.addEventListener("click", function (e) {
  e.preventDefault();

  if (filterHtml(inputBox.value.toString()) == null) {
    return false;
  }

  if (filterHtml(inputBox.value.toString()) == undefined) {
    return false;
  }

  if (filterHtml(inputBox.value.toString()) == "") {
    return false;
  }

  check_list_empty();
  store_task();
});

/**
 * button to remove all data from localstorage and restore to default
 */
btnRemoveAll.addEventListener("click", function () {
  localStorage.clear();
  WxIntent.classList.remove("intent_open");
  check_list_empty();
  listview.innerHTML = "";
});

/**
 * function to set task as complete
 */
function setComplete(taskid) {
  var elem = document.querySelector(`[data-uniqid='${taskid}']`);

  if (taskid) {
    var getId = localStorage.getItem(taskid);
    var data = JSON.parse(getId);

    if (!data.isComplete) {
      var new_set = {
        text: data.text,
        isComplete: true,
        dtime: new Date(),
      };

      localStorage.setItem(taskid, JSON.stringify(new_set));
      elem.classList.add("task-complete");
    } else if (data.isComplete) {
      var new_set = {
        text: data.text,
        isComplete: false,
        dtime: new Date(),
      };

      localStorage.setItem(taskid, JSON.stringify(new_set));
      elem.classList.remove("task-complete");
    }
  }
}

/**
 * function to delete single task from list and local storage;
 */

function removeTask(taskid) {
  if (taskid) {
    var elem = document.querySelector(`[data-uniqid='${taskid}']`);
    elem.style.transform = "translateX(-1000px)";
    elem.style.transition = "transform 0.4s";
    elem.parentNode.removeChild(elem);
    localStorage.removeItem(taskid);
    //
    check_list_empty();
  }
}
