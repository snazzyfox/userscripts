// ==UserScript==
// @name         Marbles Gamba
// @version      0.1
// @description  Provides a button to auto fill usernames as options for marbles games.
// @author       SnazzyTheFox
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/comfy.js@latest/dist/comfy.min.js
// ==/UserScript==

/*
Adds a "Add Marbles user" button to the twitch prediction screen for mods. Once the button is visible, it records all users who typed
"!play" in the chat. Clicking on the button picks a user randomly from the list. The tool will not pick the same user twice, but everything 
is forgotten once the prediction modal exits.
*/

(function() {
    'use strict';

    const BUTTON_HTML = `
        <div class="Layout-sc-nxg1ff-0 bXhxYI">
          <button class="ScCoreButton-sc-1qn4ixc-0 ScCoreButtonSecondary-sc-1qn4ixc-2 kjYQDW kgzEiA" id="gamba">
            <div class="ScCoreButtonLabel-sc-lh1yxp-0 iiHmsB">
              <div data-a-target="tw-core-button-label-text" class="Layout-sc-nxg1ff-0 dWdTjI">Add Marble Player</div>
            </div>
          </button>
        </div>`;

    const GAMBA_CONTAINER_CLASS = "Layout-sc-nxg1ff-0 gdsWzp modal-wrapper__content modal-wrapper__content--info";
    const GAMBA_SCREEN_CLASS = "Layout-sc-nxg1ff-0 prediction-details-step__modal";
    const GAMBA_CANCEL_BUTTON_CLASS = "Layout-sc-nxg1ff-0 bXhxYI";

    const channelName = window.location.pathname.substr(1);
    let seenUsers = new Set(); 
    let pickableUsers = [];

    function observerCallback(mutations) {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.target.className === GAMBA_CONTAINER_CLASS) {
          mutation.addedNodes.forEach((node) => {
              if (node.className === GAMBA_SCREEN_CLASS) {
                  gambaWindowOpened();
              }
          })
          mutation.removedNodes.forEach((node) => {
              if (node.className === GAMBA_SCREEN_CLASS) {
                  gambaWindowClosed();
              }
          })
        }
      })
    }

    function gambaWindowOpened() {
        ComfyJS.Init(channelName);
        document.getElementsByClassName(GAMBA_CANCEL_BUTTON_CLASS)[0].insertAdjacentHTML("afterend", BUTTON_HTML);
        document.getElementById("gamba").addEventListener('click', pickGambaUser);
    }

    function gambaWindowClosed() {
        ComfyJS.Disconnect();
        pickableUsers = [];
        seenUsers = new Set();
    }

    function pickGambaUser() {
      // find the next empty prediction outcome box
      const titleNode = document.getElementById("prediction-details-step__prediction-name");
      if (!titleNode.value) {
        setInputValue(titleNode, "Who places highest?");
      }

      for (i = 0; i < 10; ++i) {
        const inputId = "prediction-outcome-" + i.toString();
        const inputNode = document.getElementById(inputId);
        if (inputNode && !inputNode.value) {
          const username = pickableUsers.splice(Math.floor(Math.random() * pickableUsers.length), 1);
          if (username[0]) {
            setInputValue(inputNode, username[0]);
          }
          break;
        }
      }
    }

    function setInputValue(inputNode, value) {
      const lastValue = inputNode.value;
      inputNode.value = value;
      let event = new Event('input', {bubbles: true});
      event.simulated = true;
      let tracker = inputNode._valueTracker;
      if (tracker) {
        tracker.setValue(lastValue);
      }
      inputNode.dispatchEvent(event);
      inputNode.dispatchEvent(new Event('focus', {bubbles: true}));
    }
  
    // On page load, watch the page for prediction modal to appear
    const observer = new MutationObserver(observerCallback);
    observer.observe(document.getElementsByClassName("ReactModalPortal")[0], {childList: true, subtree: true, }); // no subtree because modal causes a new element

    ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
      if (command === "play") {
        if (!seenUsers.has(user)) {
          pickableUsers.push(user);
          seenUsers.add(user);
        }
      }
    }

})();
