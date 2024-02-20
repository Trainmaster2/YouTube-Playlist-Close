// ==UserScript==
// @name         YouTube Playlist Close
// @version      3.1
// @description  Allow quick closing of playlists
// @author       AjaxGb, Trainmaster2
// @match        http*://www.youtube.com/*
// @run-at       document-start
// @noframes
// @downloadURL  https://github.com/Trainmaster2/YouTube-Playlist-Close/raw/master/YouTube%20Playlist%20Close.user.js
// @updateURL    https://github.com/Trainmaster2/YouTube-Playlist-Close/raw/master/YouTube%20Playlist%20Close.user.js
// ==/UserScript==

(function() {
    'use strict';

    function getQueryArgs(query) {
        query = (query || window.location.search).substring(1);
        if(!query) return {};
        return query.split('&').reduce(function(prev, curr) {
            const p = curr.split('=');
            prev[decodeURIComponent(p[0])] = p[1] ? decodeURIComponent(p[1]) : p[1];
            return prev;
        }, {});
    }

    function setQueryArgs(query) {
        if(!query) return;
        let search = '';
        for(let prop in query){
            if(query[prop] === undefined){
                search += '&'+encodeURIComponent(prop);
            }else{
                search += '&'+encodeURIComponent(prop)+'='+encodeURIComponent(query[prop]);
            }
        }
        return '?' + search.substr(1);
    }

    function replaceButton(b) {
        if (b) {
            b.title = 'Close Playlist';
            b.addEventListener("click", (event) => {
                event.stopImmediatePropagation();
                let q = getQueryArgs(b.search);
                delete q.list;
                delete q.index;
                delete q.t;
                const t = document.getElementById('movie_player').getCurrentTime()|0;
                if (t > 0) {
                    q.time_continue = t;
                }
                location.search = setQueryArgs(q);
            }, true);
        }
    }

    const observer = new MutationObserver(function(mrs) {
        const b =  [...document.getElementsByTagName("ytd-playlist-panel-renderer")].find(x => !x.classList.contains("ytd-miniplayer")).querySelector("#trailing-button");
        if (b.title !== "Close Playlist") {replaceButton(b)};
    });
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
