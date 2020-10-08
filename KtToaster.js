(function () {
    "use strict";
  
    function KtToaster(params) {
      //create default options if not assigned
      this.timeout_id = null;
      this.duration = 2500;
      this.text = "This is a notifcation text";
      this.textFontSize = 13;
      this.textFontWeight = 500;
      this.allowTextCopy = false;
  
      if (!params || typeof params !== "object") {
        return false;
      }
  
      if (params.duration) {
        this.duration = parseFloat(params.duration);
      }
  
      if (params.text) {
        this.text = params.text;
      }
  
      if (params.textFontSize) {
        this.textFontSize = params.textFontSize;
      }
  
      if (params.textFontWeight) {
        this.textFontWeight = parseFloat(params.textFontWeight);
      }
  
      if (params.allowTextCopy) {
        if (typeof params.allowTextCopy !== "boolean") {
          return false;
        }
  
        this.allowTextCopy = params.allowTextCopy;
      }
  
      this.createToaster();
      this.textCopy();
    }
  
    KtToaster.prototype.textCopy = function () {
      var toastContainer = document.getElementById("toast-container");
      var self = this;
  
      if (toastContainer) {
        if (self.allowTextCopy) {
          toastContainer.classList.add("copyable-text");
          toastContainer.classList.remove("no-select");
        } else {
          toastContainer.classList.remove("copyable-text");
          toastContainer.classList.add("no-select");
        }
      }
  
      return true;
    };
  
    KtToaster.prototype.createToaster = function () {
      var rootElem = document.getElementsByTagName("body")[0];
      var toastContainer = document.createElement("div");
      var toastText = document.createElement("p");
      var self = this;
  
      //clear
      clearTimeout(self.timeout_id);
  
      if (rootElem) {
        //remove previous widget
        var prev_container = document.getElementById("toast-container");
        if (prev_container) {
          rootElem.removeChild(prev_container);
        }
  
        //toast container
        toastContainer.setAttribute("id", "toast-container");
        toastContainer.setAttribute("class", "toast_container");
  
        //toast text
        toastText.setAttribute("id", "toast-text");
        toastText.setAttribute("class", "toast_text");
        toastText.style.fontSize = self.textFontSize + "px";
        toastText.style.fontWeight = self.textFontWeight;
        toastText.innerText = self.text;
        toastContainer.appendChild(toastText);
  
        //append to DOM
        rootElem.appendChild(toastContainer);
  
        toastContainer.classList.add("toast_open");
      }
  
      self.timeout_id = setTimeout(self.hideToaster, self.duration);
  
      return true;
    };
  
    KtToaster.prototype.hideToaster = function () {
      var toastContainer = document.getElementById("toast-container");
      var self = this;
  
      if (!toastContainer) {
        return false;
      }
  
      clearTimeout(self.timeout_id);
  
      function remove_toaster() {
        var toastContainer = document.getElementById("toast-container");
        if (toastContainer) {
          toastContainer.classList.remove("toast_open");
        }
  
        toastContainer.parentNode.removeChild(toastContainer);
      }
  
      remove_toaster();
  
      return true;
    };
  
    window.KtToaster = KtToaster;
  })();
  