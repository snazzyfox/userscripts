// ==UserScript==
// @name         Show Twitch Mod Buttons on Alt
// @namespace    https://github.com/snazzyfox/userscripts
// @version      0.1
// @description  Hide twitch mod buttons except when holding down Alt
// @author       snazzyfox
// @license      MIT
// @include      https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @homepage     https://github.com/snazzyfox/userscripts
// @homepageURL  https://github.com/snazzyfox/userscripts/
// @downloadURL  https://github.com/snazzyfox/userscripts/raw/main/twitch-mod-alt.user.js
// @updateURL    https://github.com/snazzyfox/userscripts/raw/main/twitch-mod-alt.user.js
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    const OVERLAY = `
.Layout-sc-nxg1ff-0.cJHgJH {
    background: #000c;
    border: 1px solid #333c;
    border-radius: 4px;
    position: absolute;
}
.Layout-sc-nxg1ff-0.cJHgJH .ScSvg-sc-1j5mt50-1.kMNUwy {
    fill: #ff2222;
}
`
    const HIDE_BUTTONS = `
.Layout-sc-nxg1ff-0.cJHgJH {
    display: none !important;
}
`
    const BUTTON = 'Alt'

    const style = GM_addStyle(HIDE_BUTTONS);
    
    document.addEventListener('keydown', (event) => {
        if (event.key === BUTTON) {
            style.innerHTML = OVERLAY
        }
    })
    document.addEventListener('keyup', (event) => {
        if (event.key === BUTTON) {
            style.innerHTML = HIDE_BUTTONS
        }
    })
})();
