// -*- coding: utf-8 -*-

/**
 * @module main
 * @fileoverview the top-level module of T_System that contains the communication methods with python flask of T_System.
 * @author cem.baybars@gmail.com (Cem Baybars GÜÇLÜ)
 * @version 0.01
 */

let admin_id = false;
let timer;
let requested_data = undefined;
let response_data = undefined;

let disk_usage_percentage = 10;

$.put = function(url, data, callback, type){

  if ( $.isFunction(data) ){
    type = type || callback,
    callback = data,
    data = {}
  }

  return $.ajax({
    url: url,
    type: 'PUT',
    success: callback,
    data: data,
    contentType: type
  });
};

$.delete = function(url, data, callback, type){

  if ( $.isFunction(data) ){
    type = type || callback,
        callback = data,
        data = {}
  }

  return $.ajax({
    url: url,
    type: 'DELETE',
    success: callback,
    data: data,
    contentType: type
  });
}
/**
 * Class to define a AJAX JQuery communication method manager object.
 */
class JQueryManager {

    constructor() {
    }

    /**
     * The high-level method to sending data that is given with data parameter to the route.
     * @param {string} route: the route address of the flask
     * @param {dict} data
     * @return {string} Whether something occurred.
     */
    static post_data(route, data) {

        let success = "";
        // console.log(data);
        $.post(route, data, function (req, err, resp) {
            response_data = JSON.parse(resp.responseText);
            // console.log(response_datavfdv);

            success = err
        });
        // stop link reloading the page
        // event.preventDefault();

        return success
    }

    /**
     * The high-level method to getting data from given route as response.
     * @param {string} route: the route address of the flask
     * @return {requested_data} Getting dictionary data from python flask.
     */
    static get_data(route) {
        let success = "";

        $.get(route, function (data, err) {

            success = err;
            // console.log(data);
            // console.log(err);
            if (success === "success") {
                requested_data = data;
                // console.log(requested_data);
                if (timer !== undefined){
                    clearInterval(timer);
                }
            }
        });
    }

    static delete_data(route) {
        let success = "";

        $.delete(route, function (req, err, resp) {

            success = err;
            // console.log(data);
            // console.log(err);
            if (success === "success") {
                response_data = JSON.parse(resp.responseText);
                // console.log(response_datavfdv);

                success = err
            }
        });
    }
}

/** @type {!Object} */
const jquery_manager = JQueryManager;

const create_new_event_div = document.getElementById("create_new_event");
const controlling_template_container = document.getElementById("controlling_template_container");
const settings_template_container = document.getElementById("settings_template_container");
const on_work_template_container = document.getElementById("on_work_template_container");
const managing_bar = document.getElementById("managing_bar");


const control_btn = document.getElementById("control_btn");
const settings_btn = document.getElementById("settings_btn");
const on_work_btn = document.getElementById("on_work_btn");




window.onload = function() {
    //to check if javascript is disabled like in anroid preview
    // document.getElementById('warningmsg').style.display = 'none';
    connectdlg();

};

function build_language_menu(){
    let content = "";
    for (let lang_i =0 ; lang_i < language_list.length; lang_i++){
    content+="<a href='#' onclick=\"translate_text('";
    content+= language_list[lang_i][0];
    content+= "'); update_ui_text();\"><span >";
    content+= language_list[lang_i][1];
    content+= "</span><span class=\"clearfix\"></span></a>";
    if ( language_list[lang_i][0] === language){
        document.getElementById("translate_menu").innerHTML=language_list[lang_i][1];
        }
}
document.getElementById("lang_menu").innerHTML=content;
}

function update_ui_text(){
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

function refresh_page(){
    window.location.reload();
}

settings_btn.addEventListener("click", function () {

    get_system_info();
    let timer_settings_cont = setInterval(function () {

        if (requested_data !== undefined) {
            if (requested_data["status"] === "OK") {

                disk_usage_percentage = requested_data["data"]["disk_usage_percent"];

                new Chart(system_info_chart, {
                    "type": "doughnut",
                    "data": {
                        "labels": ["Used", "Free"],
                        "datasets": [{
                            "label": "Disk Usage",
                            "data": [disk_usage_percentage, 100 - disk_usage_percentage],
                            "backgroundColor": [
                                "rgb(210, 26, 11)",
                                "rgb(238, 237, 233)"
                            ],
                            "borderWidth": 5
                        }],
                    },
                    "options": {
                        "segmentShowStroke": true,
                        "segmentStrokeColor": "#fff",
                        "segmentStrokeWidth": 50,
                        "cutoutPercentage": 80,  // thin of the donut as inverse between 50-100.
                        "animation:": {
                            "animationSteps": 100,
                            "animationEasing": "easeOutBounce",
                            "animateRotate": true,
                            "animateScale": true
                        },
                        "responsive": true,
                        "maintainAspectRatio": true,
                        "showScale": true
                    }

                });

                requested_data = undefined;
                clearInterval(timer_settings_cont)
            }
        }
    }, 300);

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


/**
 * The high-level method of getting specified event's information with its id.
 * It is triggered via a click on event list members.
 */
function get_event_data(id) {

    let id_dict = {"id": id};
    // console.log(id_dict);

    jquery_manager.post_data("/get_event_data", id_dict);

    timer = setInterval(function() {
                // console.log("bla");
                // console.log(response);

                jquery_manager.get_data("/get_event_data");

            }, 500);
}

function get_system_info() {
    jquery_manager.get_data("/api/system_info?admin_id="+ admin_id);
}

