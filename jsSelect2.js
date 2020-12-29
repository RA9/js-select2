/**
 * Created 12/2020
 * @author: Carlos S. Nah
 * @package: jsSelect
 * @description jsSelect is a minimalist js select library that allows developer
 * build customizable select UIs.
 */
(function (root) {
  lib = {}; // Initialize the library object

  lib.version = "0.0.1"; // This is the lastest version of jsSelect

  const settings = {
    elName: "", // The name of the element you're applying jsSelect2 on with the attribut eg: ".jsSelect"
    data: [],
    dom: "Ssm", // Select what should be display in the dom S is for search, s is for search
    labelName: "Select an option",
    theme: {
      mainWrapperClass: "select",
      selectLabelClass: "selectLabel",
      selectWrapperClass: "selectWrapper",
      selectListsClass: "selectCustom js-selectCustom",
      selectListsOptionsClass: "selectCustom-options",
      selectListsOptionsItemsClass: "selectCustom-option",
      searchWrapperClass: "",
      selectedWrapperClass: "",
    },
    templateWrapper: ``,
    // TODO
    attributes: ["data-search", "data-placeholder", "data-valuewrapper"],
  };

  lib.jsSelect2Cache = {}; // get cache of each select element

  const types = (val, typeName) => {
    if (typeof val === typeName) {
      return true;
    }
    return false;
  };

  const isValueValid = (val) => {
    if (types(val, "undefined") || types(val, "null") || !!value) {
      return true;
    }
    return false;
  };

  const cel = ele => document.createElement(ele);

  const query = (el, all = false) => {
    if (all) {
      return document.querySelectorAll(el);
    }
    return document.querySelector(el);
  };

  const hashId = () => {
    let hash_string = '$';
    const plain_string =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ#$%^&*!~@,.-";
      for (let index = 0; index < 8; index++) {
        const random = Math.ceil(Math.random() * plain_string.length);
        const element = plain_string[random];
        hash_string += element;
      }
      return hash_string;
  };

  const getOptionsFromSelectEl = (element) => {
    const options = [];
    for (const ele of element) {
      options.push({
        text: ele.textContent,
        value: ele.value,
        selected: ele.getAttribute("selected") ?? false,
        id: ele.getAttribute("id") ?? hashId(),
      });
    }
    return options;
  };


  const addClassToEl = (el, klass) => {
    for(const klas of klass.split(" ")) {
      el.classList.add(klas)
    }
  }


  const createOptionsEl = () => {
    const options = [];
    if (settings.data.length !== 0) {
      for (const option of settings.data) {
        const optionEl = cel("div");
        // for(const klass of settings.theme.selectListsOptionsItemsClass.split(" ")) {
        //   optionEl.classList.add(klass)
        // }
        addClassToEl(optionEl, settings.theme.selectListsOptionsItemsClass)
        optionEl.textContent = option.name;
        optionEl.setAttribute('data-value', option.value);
        optionEl.id = option.id;
        options.push(optionEl);
      }
    }
    return options;
  }


  const createTemplate = () => {
    const mainWrapperEl = cel("div");
    const selectLabelEl = cel("div");
    const selectWrapperEl = cel("div");
    const selectListsEl = cel("div");
    const selectListsOptionsEl = cel("div");
    const options = createOptionsEl();

    // Add classes to an element
    addClassToEl(mainWrapperEl, settings.theme.mainWrapperClass)
    addClassToEl(selectLabelEl, settings.theme.selectLabelClass)
    addClassToEl(selectWrapperEl, settings.theme.selectWrapperClass)
    addClassToEl(selectListsEl, settings.theme.selectListsClass)

    selectLabelEl.textContent = settings.labelName;
    mainWrapperEl.appendChild(selectLabelEl);
    mainWrapperEl.appendChild(selectWrapperEl);

    for (const option of options) {
      selectListsOptionsEl.appendChild(option);
    }

    selectListsEl.appendChild(selectListsOptionsEl);
  }

  /**
   * sets the setting passed to the settings object
   */
  const setSettings = () => {
    if (!!settings.elName && settings.data.length !== 0) {
      const selectEl = query(settings.elName);
      settings.data = getOptionsFromSelectEl(selectEl.children);
    }
  };

  /**
   * takes in an object and pair it with the default settings object
   * @param {{}} opt takes in an options object
   */
  const pairSettings = (opt) => {
    for (const key in opt) {
      settings[key] = opt[key];
    }
    return setSettings();
  };

  /**
   *
   */
  const jsSelect2 = (lib.jsSelect2 = function (options) {
    if (options === "activate") {
      return this;
    }

    if (types(options, "object")) {
      pairSettings(options);
    }
  });

  const activate = (lib.activate = function (config) {
    if (types(config, "object")) {
      return pairSettings(config);
    }
  });

  /* --- Module Definition --- */

  // Export jsSelect  for CommonJS. If being loaded as an AMD module, define it as such.
  // Otherwise, just add `jsSelect` to the global object
  if (typeof exports !== "undefined") {
    if (typeof module !== "undefined" && module.exports) {
      exports = module.exports = lib;
    }
    exports.jsSelect = lib;
  } else if (typeof define === "function" && define.amd) {
    // Return the library as an AMD module:
    define([], function () {
      return lib;
    });
  } else {
    lib.noConflict = (function (jsSelect) {
      return function () {
        root.jsSelect = jsSelect;
        // Delete the noConflict method:
        lib.noConflict = undefined;
        // Return reference to the library to re-assign it:
        return lib;
      };
    })(root.jsSelect);

    // Declare `fx` on the root (global/window) object:
    root["jsSelect"] = lib;
  }

  // Root will be `window` in browser or `global` on the server:
})(this);
