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
    labelName: "Names",
    placeholder: "Select an option",
    theme: {
      mainWrapperClass: "select",
      selectLabelClass: "selectLabel",
      selectWrapperClass: "selectWrapper",
      selectListsClass: "selectCustom js-selectCustom",
      selectListsOptionsClass: "selectCustom-options",
      selectListsOptionsItemsClass: "selectCustom-option",
      selectPlaceholderClass: "selectCustom-trigger",
      searchWrapperClass: "",
      selectedWrapperClass: "",
    },
    templateWrapper: ``,
    // TODO
    attributes: ["data-search", "data-placeholder", "data-valuewrapper"],
  };

  const jsSelectCache = {}; // get cache of each select element

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

  const cel = (ele) => document.createElement(ele);

  const query = (el, all = false) => {
    if (all) {
      return document.querySelectorAll(el);
    }
    return document.querySelector(el);
  };

  const hashId = () => {
    let hash_string = "$";
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
    for (const klas of klass.split(" ")) {
      el.classList.add(klas);
    }
  };

  const createOptionsEl = () => {
    const options = [];
    if (settings.data.length !== 0) {
      for (const option of settings.data) {
        const optionEl = cel("div");
        // for(const klass of settings.theme.selectListsOptionsItemsClass.split(" ")) {
        //   optionEl.classList.add(klass)
        // }
        addClassToEl(optionEl, settings.theme.selectListsOptionsItemsClass);
        optionEl.textContent = option.text;
        optionEl.setAttribute("data-value", option.value);
        optionEl.id = option.id;
        options.push(optionEl);
      }
    }
    return options;
  };

  const createSelectTemplate = () => {
    const select = cel("select");
    addClassToEl(select, "selectNative js-selectNative");
    for (const option of settings.data) {
      const optionEl = cel("option");
      optionEl.value = option.value;
      optionEl.textContent = option.text;
      optionEl.id = option.id;

      select.appendChild(optionEl);
    }
    return select;
  };

  const createTemplate = () => {
    const mainWrapperEl = cel("div");
    const selectLabelEl = cel("span");
    const selectWrapperEl = cel("div");
    const selectListsEl = cel("div");
    const selectPlaceholderEl = cel("div");
    const selectListsOptionsEl = cel("div");
    const options = createOptionsEl();

    // Add classes to an element
    addClassToEl(mainWrapperEl, settings.theme.mainWrapperClass);
    addClassToEl(selectLabelEl, settings.theme.selectLabelClass);
    addClassToEl(selectWrapperEl, settings.theme.selectWrapperClass);
    addClassToEl(selectListsEl, settings.theme.selectListsClass);
    addClassToEl(selectPlaceholderEl, settings.theme.selectPlaceholderClass);
    addClassToEl(selectListsOptionsEl, settings.theme.selectListsOptionsClass);

    selectListsEl.setAttribute("aria-hidden", "true");

    selectLabelEl.textContent = settings.labelName;
    for (const option of options) {
      selectListsOptionsEl.appendChild(option);
    }

    selectPlaceholderEl.textContent = settings.placeholder;

    selectListsEl.appendChild(selectPlaceholderEl);

    selectListsEl.appendChild(selectListsOptionsEl);

    selectWrapperEl.appendChild(createSelectTemplate());

    selectWrapperEl.appendChild(selectListsEl);

    mainWrapperEl.appendChild(selectLabelEl);
    mainWrapperEl.appendChild(selectWrapperEl);

    console.log("main: ", mainWrapperEl);

    return mainWrapperEl;
  };

  /**
   * sets the setting passed to the settings object
   */
  const setSettings = () => {
    if (
      !!settings.elName &&
      !jsSelectCache[settings.elName] &&
      settings.data.length === 0
    ) {
      console.log("Config: ", settings.elName);
      if (!query(settings.elName)) {
        return "Element not found!";
      }
      const selectEl = query(settings.elName);
      settings.data = getOptionsFromSelectEl(selectEl.children);
      selectEl.parentElement.insertBefore(createTemplate(), selectEl);
      selectEl.style.display = "none";

      jsSelectCache[settings.elName] = {
        data: settings.data,
        selectEl: selectEl,
      };
      console.log("Cache: ", jsSelectCache);
      settings.data = [];
      addEventsToEl()
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
    console.log("reach: ", opt);
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
    return;
  });

  function addEventsToEl() {
    /* Features needed to make the selectCustom work for mouse users.

        - Toggle custom select visibility when clicking the "box"
        - Update custom select value when clicking in a option
        - Navigate through options when using keyboard up/down
        - Pressing Enter or Space selects the current hovered option
        - Close the select when clicking outside of it
        - Sync both selects values when selecting a option. (native or custom)

      */

    const elSelectNative = document.getElementsByClassName("js-selectNative");
    const elSelectCustom = document.getElementsByClassName("js-selectCustom");

    for (let index = 0; index < elSelectCustom.length; index++) {
      console.log(elSelectCustom[index]);
      // const element = elSelectCustom[index];

      const elSelectCustomBox = elSelectCustom[index].children[0];
      const elSelectCustomOpts = elSelectCustom[index].children[1];
      const customOptsList = Array.from(elSelectCustomOpts.children);
      const optionsCount = customOptsList.length;
      const defaultLabel = elSelectCustomBox.getAttribute("data-value");

      let optionChecked = "";
      let optionHoveredIndex = -1;

      // Toggle custom select visibility when clicking the box
      elSelectCustomBox.addEventListener("click", (e) => {
       
        const isClosed = !elSelectCustom[index].classList.contains("isActive");

        if (isClosed) {
          console.log("index: ", index)
          openSelectCustom();
        } else {
          closeSelectCustom();
        }
      });

      function openSelectCustom() {
        elSelectCustom[index].classList.add("isActive");
        console.log("Great: ", elSelectCustom[index])
        // Remove aria-hidden in case this was opened by a user
        // who uses AT (e.g. Screen Reader) and a mouse at the same time.
        elSelectCustom[index].setAttribute("aria-hidden", false);

        if (optionChecked) {
          const optionCheckedIndex = customOptsList.findIndex(
            (el) => el.getAttribute("data-value") === optionChecked
          );
          updateCustomSelectHovered(optionCheckedIndex);
        }

        // Add related event listeners
        document.addEventListener("click", watchClickOutside);
        document.addEventListener("keydown", supportKeyboardNavigation);
      }

      function closeSelectCustom() {
        elSelectCustom[index].classList.remove("isActive");

        elSelectCustom[index].setAttribute("aria-hidden", true);

        updateCustomSelectHovered(-1);

        // Remove related event listeners
        document.removeEventListener("click", watchClickOutside);
        document.removeEventListener("keydown", supportKeyboardNavigation);
      }

      function updateCustomSelectHovered(newIndex) {
        const prevOption = elSelectCustomOpts.children[optionHoveredIndex];
        const option = elSelectCustomOpts.children[newIndex];

        if (prevOption) {
          prevOption.classList.remove("isHover");
        }
        if (option) {
          option.classList.add("isHover");
        }

        optionHoveredIndex = newIndex;
      }

      function updateCustomSelectChecked(value, text) {
        const prevValue = optionChecked;

        const elPrevOption = elSelectCustomOpts.querySelector(
          `[data-value="${prevValue}"`
        );
        const elOption = elSelectCustomOpts.querySelector(
          `[data-value="${value}"`
        );

        if (elPrevOption) {
          elPrevOption.classList.remove("isActive");
        }

        if (elOption) {
          elOption.classList.add("isActive");
        }

        elSelectCustomBox.textContent = text; // add text to selectBox
        optionChecked = value;
      }

      function watchClickOutside(e) {
        const didClickedOutside = !elSelectCustom[index].contains(event.target);
        if (didClickedOutside) {
          closeSelectCustom();
        }
      }

      function supportKeyboardNavigation(e) {
        // press down -> go next
        if (e.keyCode === 40 && optionHoveredIndex < optionsCount - 1) {
          let index = optionHoveredIndex;
          e.preventDefault(); // prevent page scrolling
          updateCustomSelectHovered(optionHoveredIndex + 1);
        }

        // press up -> go previous
        if (e.keyCode === 38 && optionHoveredIndex > 0) {
          e.preventDefault(); // prevent page scrolling
          updateCustomSelectHovered(optionHoveredIndex - 1);
        }

        // press Enter or space -> select the option
        if (e.keyCode === 13 || e.keyCode === 32) {
          e.preventDefault();

          const option = elSelectCustomOpts.children[optionHoveredIndex];
          const value = option && option.getAttribute("data-value");

          if (value) {
            elSelectNative[index].value = value;
            updateCustomSelectChecked(value, option.textContent);
          }
          closeSelectCustom();
        }

        // press ESC -> close selectCustom
        if (e.keyCode === 27) {
          closeSelectCustom();
        }
      }

      // Update selectCustom value when selectNative is changed.
      elSelectNative[index].addEventListener("change", (e) => {
        const value = e.target.value;
        const elRespectiveCustomOption = elSelectCustomOpts.querySelectorAll(
          `[data-value="${value}"]`
        )[0];

        updateCustomSelectChecked(value, elRespectiveCustomOption.textContent);
      });

      // Update selectCustom value when an option is clicked or hovered
      customOptsList.forEach(function (elOption, i) {
        elOption.addEventListener("click", (e) => {
          const value = e.target.getAttribute("data-value");

          // Sync native select to have the same value
          elSelectNative[index].value = value;
          updateCustomSelectChecked(value, e.target.textContent);
          closeSelectCustom();
        });

        elOption.addEventListener("mouseenter", (e) => {
          updateCustomSelectHovered(i);
        });

        // TODO: Toggle these event listeners based on selectCustom visibility
      });
    }
  }

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
