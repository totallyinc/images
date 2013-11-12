
$(function () {
    form_login_submit(); // init form login
    form_patient_basic(); // init form create patient.
    form_patient_about(); // init form for patient about.
    form_patient_measurements();// init form patient measurement.
    form_patient_note(); // init form patient note.
    form_submit_order(); // init form submit order.
    on_page_change(); // action that will trigger after page is changed.
    btn_triggers(); // init for all btn on the app.


});

var originalCaller = null;
var img = null;
$(document).ready(function(){
    // Now safe to use the PhoneGap API
    $('.camera_image').click(function(e){
        // use camera and take picture.
        try {
            alert(navigator);
//            alert('navigator.notification: ' + navigator.notification);
            //navigator.notification.alert(num);
            originalCaller = $(this);
            navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 1});
            window.localStorage.setItem('id',$(this).attr('id'));
        } catch (err) {
            navigator.notification.alert("An error occurred during capture: " + err, null, "Uh oh!");
        }
    });
});

function captureSuccess(mediaFiles) {
    try {
        img = mediaFiles[0];
        uploadFiles();
        originalCaller.attr("src",img.fullPath);
    } catch (err) {
        navigator.notification.alert("success Error: " + err);
    }
}

function captureError(error) {
    var msg = "An error occurred during capture: " + error;
    navigator.notification.alert(msg, null, "Uh oh!");
}

function uploadFiles() {
    var url = "http://qa.sols.co/reseller/api_update_patient_foot_images?format=jsonp&image_id="+originalCaller.attr('id')+'&'+patient_api_data()+'&'+user_api_data();
    try {
        var ft = new FileTransfer();
        path = img.fullPath;
        name = img.name;
        navigator.notification.alert(window['localStorage'].id);
        ft.upload(path,
            url,
            function(result) {
                navigator.notification.alert('Response message: '+result.response);
                navigator.notification.alert('Upload success: ' + result.responseCode);
                navigator.notification.alert('bytes sent: ' + result.bytesSent);
                navigator.notification.alert('actual size: ' + medFiles[index].size);
            },
            function(error) {
                navigator.notification.alert('Error uploading file ' + path + ': ' + error);
            },
            {
                fileKey : originalCaller.attr('id'),
                params:{
                    'shoe_size':'1'
                }
            }
        );
    } catch(err){
        navigator.notification.alert("Exception: " + err);
    }
    alert('finishing upload');
}





/** redirect **/
function redirect(page_id) {
    $.mobile.changePage('#'+page_id, { transition:"none"});
}

/***  show / hide  */
function hide_footer_menu() { $('.footer_buttons').hide(); }
function show_footer_menu() { $('.footer_buttons').show(); }

/*** Alerting */
function alert_login_fail() {
    alert("User login failed");
}


/** reset form value */
function reset_form_value(form_id) {
    $(':input','#'+form_id).not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');
}

// should removed on production
function btn_triggers() {
    $('#btn-logout').click(function () {
        window.localStorage.clear();
        $.mobile.changePage('#page-login', { transition:"none"});
        hide_footer_menu();
    });

    $('#btn-goto-patient-info-review').click(function (e) {
        $.mobile.changePage('#page-patient-info-review', { transition:"none"});
        e.preventDefault();
    });

    $('a[href="#page-add-new-patient"]').click(function(e){
        // reset add new patient form
        reset_form_value('form_patient_basic');
    });
}

// on page change.
function on_page_change() {
    /* pageshow */
    $('html').on("pagechange", function (e) {
        console.log('pagechange: ' + $.mobile.activePage.attr("id"));
        var current_page = $.mobile.activePage.attr("id");
        if (current_page != 'page-login') { // if on login page, hide the footer. if user logged in, forward to home page.
            show_footer_menu();
            console.log('user is login: ' + user_is_login());
            if (user_is_login() === false) {
                hide_footer_menu();
                $.mobile.changePage('#page-login', { transition:"none"});
            }

            switch (current_page) {

                case 'page-home':

                    break;

                case 'page-patients':
                    update_patients_list('');
                    break;

                case 'page-patient-form-about':
                    patient_show_target_patient_name();
                    populate_form_values('form_patient_about');
                    break;

                case 'page-patient-form-foot-measurements':
                    patient_show_target_patient_name();
                    populate_form_values('form_patient_measurements');
                    break;

                case 'page-patient-form-note':
                    patient_show_target_patient_name();
                    populate_form_values('form_patient_note');
                    break;

                case 'page-patient-form-scan-foot':
                    //patient_show_target_patient_name();
                    check_images_for_order();
                    break;

                case 'page-patient-info-review':
                    patient_show_target_patient_name();
                    get_patient_info_for_roder(patient_get_user_id());
                    break;

            }
        }
    });
}

function check_images_for_order() {
    $('.camera_image').click(function(){
        // send file to server with given patient_id (patient_get_user_id()) and image location id (this.id);  ;
        //var url = "http://qa.sols.co/reseller/api_update_patient_foot_images?format=jsonp&image_id="+this.id+'&'+patient_api_data()+'&'+user_api_data();
        //alert(url);
    });
}


function get_patient_info_for_roder(patient_user_id) {
    //TODO: get user info and populate it.

}

function populate_form_values(form_name) {
    switch (form_name) {
        case'form_patient_about':
            /*
             for(i =1; i<3.01; i=i+0.01) {
             $('#form_patient_about select[name="customer_info[shoe_size_raw_left]"]').append('<option value="'+parseFloat(i).toFixed(2)+'">'+parseFloat(i).toFixed(2)+'</option>');
             } alert('injected 6');
             */
            break;
        case 'form_patient_measurements':
            break;

    }
}


/**
 * patients page;
 */
function update_patients_list(params) {
    $('#patients_list').html('Loading');

    $.ajax({
        dataType:'jsonp',
        data:user_api_data(),
        url:'http://qa.sols.co/reseller/api_get_patients?format=jsonp',
        success:function (data) {
            if (data.connected) {
                var patients = data.patients
                $('#patients_list').html('');
                for (var i in patients) {
                    console.log(patients[i]);
                    var row = '<div onclick="goto_patient_page('+patients[i].user_id+');">' + patients[i].last_name + ', ' + patients[i].first_name + '</div>';
                    $('#patients_list').append(row);
                }
            }
            else {
                alert('fail to connect');
            }
        },
        error:function () {
            console.log(data);
            alert('There was an unexpected error.');
        }
    });
}




/**
 * form create order
 */
function form_submit_order() {
    $('#form_submit_order').submit(function(){
        var postData = $(this).serialize();
        postData = postData + '&' + patient_api_data();
        postData = postData + '&' + 'product_set_id=1';
        postData = postData + '&' + user_api_data();
        $.ajax({
            dataType:'jsonp',
            data:postData,
            url:'http://qa.sols.co/reseller/api_form_submit_order?format=jsonp',
            success:function (data) {
                console.log(data);
                if (data.connected) {
                    console.log(data);

                    $.mobile.changePage('#page-patient-form-about', { transition:"none"});

                }
                else {
                    alert('fail to connect');
                }
            },
            error:function () {
                console.log(data);
                alert('There was an unexpected error when you try to login.');
            }
        });
        return false;
    });
}

/**
 * form for add new patient basic info
 */
function form_patient_basic() {
    $('#form_patient_basic').submit(function () {
        var postData = $(this).serialize();
        $.ajax({
            dataType:'jsonp',
            data:postData + '&' + user_api_data(),
            url:'http://qa.sols.co/reseller/api_patient_form_basic?format=jsonp',
            success:function (data) {
                console.log(data);
                if (data.connected) {
                    if (data.new_customer_id) { // new customer id created.
                        var patient_user_id = data.new_customer_id;
                        patient_set_user_id(patient_user_id)
                        $.mobile.changePage('#page-patient-form-about', { transition:"none"});
                    } else {

                    }
                }
                else {
                    alert('fail to connect');
                }
            },
            error:function () {
                console.log(data);
                alert('There was an unexpected error when you try to login.');
            }
        });
        return false;
    });
}


/**
 *
 */
function form_patient_about() {
    $('#form_patient_about').submit(function () {
        var postData = $(this).serialize();
        $.ajax({
            dataType:'jsonp',
            data:postData + '&patient_user_id=' + patient_get_user_id() + '&' + user_api_data(),
            url:'http://qa.sols.co/reseller/api_patient_form_about?format=jsonp',
            success:function (data) {
                console.log(data);
                if (data.connected) {
                    $.mobile.changePage('#page-patient-form-foot-measurements', { transition:"none"});
                }
                else {
                    alert('fail to connect');
                }
            },
            error:function () {
                console.log(data);
                alert('There was an unexpected error when you try to login.');
            }
        });
        return false;
    });
}


/**
 *
 */
function form_patient_measurements() {
    $('#form_patient_measurements').submit(function () {
        var postData = $(this).serialize();
        $.ajax({
            dataType:'jsonp',
            data:postData + '&patient_user_id=' + patient_get_user_id() + '&' + user_api_data(),
            url:'http://qa.sols.co/reseller/api_patient_form_measurements?format=jsonp',
            success:function (data) {
                console.log(data);
                if (data.connected) {
                    $.mobile.changePage('#page-patient-form-note', { transition:"none"});
                }
                else {
                    alert('fail to connect');
                }
            },
            error:function () {
                console.log(data);
                alert('There was an unexpected error when you try to login.');
            }
        });
        return false;
    });
}


/**
 *
 */
function form_patient_note() {
    $('#form_patient_note').submit(function () {
        var postData = $(this).serialize();
        $.ajax({
            dataType:'jsonp',
            data:postData + '&patient_user_id=' + patient_get_user_id() + '&' + user_api_data(),
            url:'http://qa.sols.co/reseller/api_patient_form_note?format=jsonp',
            success:function (data) {
                console.log(data);
                if (data.connected) {
                    //$.mobile.changePage('#page-patient-form-scan-foot', { transition:"none"});
                    redirect('page-patient-form-scan-foot');
                }
                else {
                    alert('fail to connect');
                }
            },
            error:function () {
                console.log(data);
                alert('There was an unexpected error when you try to login.');
            }
        });
        return false;
    });
}


/**
 * form  for user login
 */
function form_login_submit() {
//$.mobile.changePage( '#page-home', { transition: "none"}  ); return true;


    $('#form_login').submit(function () {
        var postData = $(this).serialize();
        $.ajax({
            dataType:'jsonp',
            data:postData,
            url:'http://qa.sols.co/reseller/api_login?format=jsonp',
            success:function (data) {
                console.log(data);
                if (data.login) {
                    user_login(data);
                    $.mobile.changePage('#page-home', { transition:"none"});
                }
                else {
                    alert_login_fail();
                }
            },
            error:function () {
                console.log(data);
                alert('There was an unexpected error when you try to login.');
            }
        });
        return false;
    });
}





/* USER */
function user_login(data) {
    window.localStorage.setItem("user", JSON.stringify(data));
}
function user_info() {
    var user_data = window.localStorage.getItem("user");
    return JSON.parse(user_data);
}
function user_is_login() {
    var u = user_info();
    if ($.type(u) === "null") {
        return false;
    } else {
        return u.user_id;
    }
}
function user_api_data() {
    //return 'user_id=1';
    var userApiData = user_info();
    return $.param(userApiData, true);

}
/**
 * Patient
 */
function patient_show_target_patient_name() {

    $('.target_patient_name').html();

    $.ajax({
        dataType:'jsonp',
        data:'patient_user_id=' + patient_get_user_id() + '&' + user_api_data(),
        url:'http://qa.sols.co/reseller/api_get_patient_info?format=jsonp',
        success:function (data) {
            console.log(data);
            if (data.connected) {
                console.log(data.patient.first_name);
                console.log(data.patient.last_name);
                var fullname = data.patient.last_name + ', ' + data.patient.first_name;
                $('.target_patient_name').html(fullname);
            }
            else {
                alert('fail to connect');
            }
        },
        error:function () {
            console.log(data);
            alert('There was an unexpected error when you try to login.');
        }
    });
}
function patient_set_user_id(patient_user_id) {
    window.localStorage.setItem('patient_user_id', patient_user_id);
}
function patient_get_user_id() {
    return window.localStorage.getItem('patient_user_id');
}
function patient_api_data() {
    return 'patient_user_id=2';
    return 'patient_user_id='+patient_get_user_id();
}
function goto_patient_page(patient_user_id) {
    patient_set_user_id(patient_user_id);
    redirect('page-profile');
}
function goto_patient_page_to_order(patient_user_id) {
    patient_set_user_id(patient_user_id);
    redirect('page-patient-info-review');
}



