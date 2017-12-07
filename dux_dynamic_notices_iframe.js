/*******************************************************************************
 * Author: Pedro Dousseau <pedro@dousseau.com>
 * Copyright: Copyright 2017, Pedro Dousseau
 * Credits: Pedro Dousseau
 * License: GPLv3
 * Maintainer: Pedro Dousseau
 * Email: pedro@dousseau.com
 * Status: Production
 * Description:
 *
 * Code to create a Notice Modal on a iframe targeted document and on the host
 * document create an iframe to display the content. More information on README
 * file.
 ******************************************************************************/

function createDuxIframe(iframe_src) {
    // Create DOM element
    var dux_modal_iframe = document.createElement('iframe');
    // Set element style
    dux_modal_iframe.setAttribute('src', iframe_src);
    dux_modal_iframe.style.position = 'absolute';
    dux_modal_iframe.style.top = 0;
    dux_modal_iframe.style.left = 0;
    dux_modal_iframe.style.border = "none";
    dux_modal_iframe.style.width = "100%";
    dux_modal_iframe.style.height = "100%";
    // Append to document
    document.body.appendChild(dux_modal_iframe);
    // Hide iframe on message from it
    window.addEventListener("message", function(event) {
        if (event.data === 'hide_dux_iframe') {
            dux_modal_iframe.style.display = 'none';
        }
    }, false);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var DuxNoticeModal = function(wrapper, cookie_name, cookie_expiration) {
    var self = this;
    this.hide = function() {
        wrapper.parentElement.style.opacity = 0;
        setTimeout(function() {
            wrapper.parentElement.style.visibility = "hidden";
            parent.postMessage("hide_dux_iframe", "*");
        }, 500);
    }
    this.show = function() {
        if (getCookie(cookie_name) !== 'true') {
            wrapper.parentElement.style.visibility = "visible";
            wrapper.parentElement.style.opacity = 1;
            self.resize();
            window.onresize = self.resize;
            setCookie(cookie_name, "true", cookie_expiration);
        }
    }
    this.resize = function() {
        var wheight = wrapper.clientHeight;
        var wwidth = wrapper.clientWidth;
        wrapper.style.marginLeft = -parseInt(wwidth / 2) + "px";
        wrapper.style.marginTop = -parseInt(wheight / 2) + "px";
    }
    wrapper.getElementsByClassName('dux-modal-close')[0].onclick = this.hide;
    this.resize();
    this.show();
}
