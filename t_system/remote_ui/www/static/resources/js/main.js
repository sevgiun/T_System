// -*- coding: utf-8 -*-

/**
 * @module main
 * @fileoverview the top-level module of T_System that contains the communication methods with python flask of T_System.
 * @author cem.baybars@gmail.com (Cem Baybars GÜÇLÜ)
 */

let admin_id = false;
let timer;

/** @type {!Object} */
const jquery_manager = JQueryManager;

/** @type {!Element} */
const create_new_event_div = document.getElementById("create_new_event");
const controlling_template_container = document.getElementById("controlling_template_container");
const settings_template_container = document.getElementById("settings_template_container");
const on_work_template_container = document.getElementById("on_work_template_container");
const managing_bar = document.getElementById("managing_bar");

/** @type {!Element} */
const control_btn = document.getElementById("control_btn");
const settings_btn = document.getElementById("settings_btn");
const on_work_btn = document.getElementById("on_work_btn");

window.onload = function () {
    //to check if javascript is disabled like in anroid preview
    // document.getElementById('warningmsg').style.display = 'none';
    connectdlg();
};

/**
 * The low-level method to create drop-down language selection menu.
 */
function build_language_menu() {
    let content = "";
    for (let lang_i = 0; lang_i < language_list.length; lang_i++) {
        content += "<a href='#' onclick=\"translate_text('";
        content += language_list[lang_i][0];
        content += "'); update_ui_text();\"><span >";
        content += language_list[lang_i][1];
        content += "</span><span class=\"clearfix\"></span></a>";
        if (language_list[lang_i][0] === language) {
            document.getElementById("translate_menu").innerHTML = language_list[lang_i][1];
        }
    }
    document.getElementById("lang_menu").innerHTML = content;
}

function update_ui_text() {
    build_HTML_setting_list(current_setting_filter);
}

function show_element(element) {
    element.style.opacity = "1";
    element.style.visibility = "visible";
}

function hide_element(element) {
    element.style.opacity = "0";
    element.style.visibility = "hidden";
}

function refresh_page() {
    window.location.reload();
}

settings_btn.addEventListener("click", function () {

    show_element(settings_template_container);
    hide_element(controlling_template_container);
    hide_element(on_work_template_container);


});

control_btn.addEventListener("click", function () {

    show_element(controlling_template_container);
    hide_element(settings_template_container);
    hide_element(on_work_template_container);
});

on_work_btn.addEventListener("click", function () {

    show_element(on_work_template_container);
    hide_element(controlling_template_container);
    hide_element(settings_template_container)
});
