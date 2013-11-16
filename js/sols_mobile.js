/***
 * Problem: when click image, camera doesn't show up. Missing plug-in????
 * Also, navigator.notification == undefined.
 * I believe something has to do with the navigator and device.capture
 *
 *
 * Note: I have moved var outside of the document.ready.
 * Also, i have moved the functions outside of the document.ready
 */

var originalCaller = null;
var img = null;
$(document).ready(function(){
    // Now safe to use the PhoneGap API
    $('.camera_image').click(function(e){
        // use camera and take picture.
        try {
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
        originalCaller.attr('height','128px');
        originalCaller.attr("src",'img/loading.gif');

    } catch (err) {
        navigator.notification.alert("success Error: " + err);
    }
}

function captureError(error) {
    var msg = "An error occurred during capture: " + error;
    navigator.notification.alert(msg, null, "Uh oh!");
}

function uploadFiles() {
    var url = "http://qa.sols.co/api/api_update_patient_foot_images?format=jsonp&image_id="+originalCaller.attr('id')+'&'+patient.api_data()+'&'+reseller.api_data();
    try {
        var ft = new FileTransfer();
        path = img.fullPath;
        name = img.name;
        //navigator.notification.alert(window['localStorage'].id);
        ft.upload(path,
            url,
            function(result) {
                originalCaller.attr("src",img.fullPath);
//                navigator.notification.alert('Response message: '+result.response);
//                navigator.notification.alert('Upload success: ' + result.responseCode);
//                navigator.notification.alert('bytes sent: ' + result.bytesSent);
//                navigator.notification.alert('actual size: ' + medFiles[index].size);
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
    //alert('finishing upload');
}









//var ref_gender = { 1: 'Female', 2: 'Male' };
//var ref_ethnicity = { 1: 'Asian', 2: 'African American' };
//var ref_activity_level = { 1: 'low', 2: 'med', 3: 'high' };

//var data_pickup_order_id = 0;




var forms = {
    form_login_submit : function(msg){
        $('#form_login').submit(function () {
            var postData = $(this).serialize();
            $.ajax({
                dataType:'jsonp',
                data:postData,
                url:'http://qa.sols.co/api/api_login?format=jsonp',
                success:function (data) {
                    console.log(data);
                    if (data.login) {
                        reseller.login(data);
                        //user_login(data);
                        actions.redirect('page-home');
                    }
                    else {
                        solerts.login_fail();
                    }
                },
                error:function () {
                    console.log(data);
                    alert('There was an unexpected error when you try to login.');
                }
            });
            return false;
        });
    },

    form_patient_basic: function() {
        $('#form_patient_basic').submit(function () {
            var postData = $(this).serialize();
            $.ajax({
                dataType:'jsonp',
                data:postData + '&' + reseller.api_data(),
                url:'http://qa.sols.co/api/api_patient_form_basic?format=jsonp',
                success:function (data) {
                    console.log(data);
                    if (data.connected) {
                        if (data.new_customer_id) { // new customer id created.
                            var patient_user_id = data.new_customer_id;
                            patient.set_user_id(patient_user_id)
                            actions.redirect('page-patient-form-about');
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
    },

    form_patient_about: function() {
        $('#form_patient_about').submit(function () {
            var postData = $(this).serialize();
            $.ajax({
                dataType:'jsonp',
                data:postData + '&patient_user_id=' + patient.get_user_id() + '&' + reseller.api_data(),
                url:'http://qa.sols.co/api/api_patient_form_about?format=jsonp',
                success:function (data) {
                    console.log(data);
                    if (data.connected) {
                        actions.redirect('page-patient-form-foot-measurements');
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
    },

    form_patient_measurements: function(){
        $('#form_patient_measurements').submit(function () {
            var postData = $(this).serialize();
            $.ajax({
                dataType:'jsonp',
                data:postData + '&patient_user_id=' + patient.get_user_id() + '&' + reseller.api_data(),
                url:'http://qa.sols.co/api/api_patient_form_measurements?format=jsonp',
                success:function (data) {
                    console.log(data);
                    if (data.connected) {
                        actions.redirect('page-patient-form-note');
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
    },

    form_patient_note: function(){
        $('#form_patient_note').submit(function () {
            var postData = $(this).serialize();
            $.ajax({
                dataType:'jsonp',
                data:postData + '&patient_user_id=' + patient.get_user_id() + '&' + reseller.api_data(),
                url:'http://qa.sols.co/api/api_patient_form_note?format=jsonp',
                success:function (data) {
                    console.log(data);
                    if (data.connected) {
                        actions.redirect('page-patient-form-scan-foot');
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
    },

    form_submit_order: function(){
        $('#form_submit_order').submit(function(){
            var postData = $(this).serialize();
            postData = postData + '&' + patient.api_data();
            postData = postData + '&' + 'product_set_id=1';
            postData = postData + '&' + reseller.api_data();
            $.ajax({
                dataType:'jsonp',
                data:postData,
                url:'http://qa.sols.co/api/api_form_submit_order?format=jsonp',
                success:function (data) {
                    if (data.connected) {
                        console.log(data);
                        alert('Thank for your order.');
                        actions.redirect('page-home');
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
}

var pages = {
    page_home: function() {
        var user_data = reseller.info();
        $('#btn-logout').html('Logout (ID: '+user_data.user_id+')');
    },

    page_add_new_patient: function() {
        populate_form_values('page_add_new_patient');
    },

    update_patients_list: function($params) {
        $('#patients_list').html('Loading');

        $.ajax({
            dataType:'jsonp',
            data:reseller.api_data(),
            url:'http://qa.sols.co/api/api_get_patients?format=jsonp',
            success:function (data) {
                if (data.connected) {
                    var patients = data.patients
                    $('#patients_list').html('');
                    for (var i in patients) {
                        console.log(patients[i]);
                        var row = '<div onclick="patient.goto_patient_page('+patients[i].user_id+');">' + patients[i].last_name + ', ' + patients[i].first_name + '</div>';
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
    },

    page_patient_form_about: function() {
        patient.show_target_patient_name();
        populate_form_values('form_patient_about');
    },

    page_patient_form_foot_measurements: function() {
        patient.show_target_patient_name();
        populate_form_values('form_patient_measurements');
    },

    page_patient_form_note: function () {
        patient.show_target_patient_name();
        populate_form_values('form_patient_note');
    },

    page_patient_form_scan_foot: function() {
    },

    page_patient_info_review: function () {
        patient.show_target_patient_name();

        $.ajax({
            dataType:'jsonp',
            data: 'patient_user_id='+patient.get_user_id()+'&'+reseller.api_data(),
            url:'http://qa.sols.co/api/api_get_patient_info_for_order?format=jsonp',
            success:function (data) {
                if (data.connected) {
                    console.log(data['patient']);
                    var patient_info = data['patient'];
                    for (var i in patient_info) {
                        $('.patient-info-'+i).html(patient_info[i]);
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
    },

    page_pickup: function() {
        $('#btn-pick-up').hide();
        $('#pickup-list').html('loading...');

        $.ajax({
            dataType:'jsonp',
            data:reseller.api_data(),
            url:'http://qa.sols.co/api/api_get_pickup?format=jsonp',
            success:function (data) {
                if (data.connected) {
                    $('#pickup-list').html('');

                    var pickups = data.pickup_order;

                    if(data.pickup_order.length) {

                        for (var i in pickups) {
                            html = '<div class="patient-pickup" data-patient-user-id="'+pickups[i].patient_user_id+'" data-pickup-order-id="'+pickups[i].order_id+'">' + pickups[i].patient_last_name + ', ' + pickups[i].patient_first_name + ' - <span> order id: '+pickups[i].order_id+'</span></div>';
                            $('#pickup-list').append(html);
                        }
                        $('.patient-pickup').click(function(){
                            $('.patient-pickup').removeClass('active');
                            $(this).addClass('active');
                            var patient_user_id = $(this).attr('data-patient-user-id');
                            patient.set_user_id(patient_user_id);
                            $('#btn-pick-up').show();
                        });

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
    },

    page_pickup_review: function() {
        patient.show_target_patient_name();

        if($('.patient-pickup.active').attr('data-pickup-order-id')) {
            console.log( 'pickup order id: ' + $('.patient-pickup.active').attr('data-pickup-order-id'));
        } else {
            actions.redirect('page-pickup');
            return false;
        }
    },

    page_profile: function () {
        patient.show_target_patient_name();

        console.log('get open order');
        // get patient open order
        $.ajax({
            dataType:'jsonp',
            data: patient.api_data()+'&'+reseller.api_data(),
            url:'http://qa.sols.co/api/api_get_patient_open_order?format=jsonp',
            success:function (data) {
                if (data.connected) {
                    if(data['open_orders'].length) {
                        $('#open-order').html(data['open_orders'].length + ' open order');
                        $('#btn_patient_shipment_tracking').html('Order ID: ' + data['open_orders'][0]['order_id']);
                        $('#btn_patient_shipment_tracking').show();
                    } else {
                        $('#open-order').html('There is no open order.');
                        $('#btn_patient_shipment_tracking').hide();
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

        // get patient order history
        $.ajax({
            dataType:'jsonp',
            data: patient.api_data()+'&'+reseller.api_data(),
            url:'http://qa.sols.co/api/api_get_patient_order_history?format=jsonp',
            success:function (data) {
                if (data.connected) {
                    if(data['order_history'].length) {
                        var order_history = data['order_history'];
                        var html = '';
                        for(var i in order_history) {
                            html += '<div style="border: 1px solid #ccc; margin: 3px;">';
                            html += 'order id: ' + order_history[i].order_id+'<br />';
                            html += 'qty: '+order_history[i].qty;
                            html += '</div>';
                        }

                        $('#order_history').html(html);
                    } else {
                        $('#order_history').html('There is no record.');
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

}

var buttons = {
    logout: function() {
        window.localStorage.clear();
        actions.redirect('page-login');
        actions.hide_footer_menu();
    },

    review_fits: function() {
        $('.patient-pickup.active').attr('data-pickup-order-id');
        $.ajax({
            dataType:'jsonp',
            data:reseller.api_data()+'&review=fits&order_id='+$('.patient-pickup.active').attr('data-pickup-order-id'),
            url:'http://qa.sols.co/api/api_get_pickup_review?format=jsonp',
            success:function (data) {
                console.log(data);
                if (data.connected) {
                    alert('I am glad it fits.');
                    actions.redirect('page-home');
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
    },

    review_remake_needed: function() {
        $('.patient-pickup.active').attr('data-pickup-order-id');
        $.ajax({
            dataType:'jsonp',
            data:reseller.api_data()+'&review=remake_needed&order_id='+$('.patient-pickup.active').attr('data-pickup-order-id'),
            url:'http://qa.sols.co/api/api_get_pickup_review?format=jsonp',
            success:function (data) {
                console.log(data);
                if (data.connected) {
                    alert('Sorry to hear that, we will contact you for the remake.');
                    actions.redirect('page-home');
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

}

var actions = {
    redirect: function(page_id){ $.mobile.changePage('#'+page_id, { transition:"none"}); },
    hide_footer_menu: function() { $('.footer_buttons').hide(); },
    show_footer_menu: function() { $('.footer_buttons').show(); },

    reset_form_value: function(form_id) { /* reset add new patient form */
        $(':input','#'+form_id).not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');
        actions.update_submit_btn_label('.btn_create_patient', "Create Patient");
    },

    update_submit_btn_label: function(selector, new_label) {
        $(selector).prev('span').find('span.ui-btn-text').text(new_label);
    }
}

var solerts = {
    login_fail: function(){ alert("User login failed"); }
}

/* RESELLER */
var reseller = {
    login: function(data) {
        window.localStorage.setItem("user", JSON.stringify(data));
    },
    info: function() {
        var user_data = window.localStorage.getItem("user");
        return JSON.parse(user_data);
    },
    is_login: function() {
        var u = this.info();
        if ($.type(u) === "null") {
            return false;
        } else {
            return u.user_id;
        }
    },
    api_data: function(){
        var userApiData = this.info();
        return $.param(userApiData, true);
    }
}

/* Patient */
var patient = {
    set_user_id: function (patient_user_id) {
        window.localStorage.setItem('patient_user_id', patient_user_id);
    },
    get_user_id: function () {
        return window.localStorage.getItem('patient_user_id');
    },
    api_data: function () {
        return 'patient_user_id='+this.get_user_id();
    },
    goto_patient_page: function (patient_user_id) {
        this.set_user_id(patient_user_id);
        actions.redirect('page-profile');
    },
    goto_patient_page_to_order: function (patient_user_id) {
        this.set_user_id(patient_user_id);
        actions.redirect('page-patient-info-review');
    },
    show_target_patient_name: function () {
        $('.target_patient_name').html();
        $.ajax({
            dataType:'jsonp',
            data:'patient_user_id=' + this.get_user_id() + '&' + reseller.api_data(),
            url:'http://qa.sols.co/api/api_get_patient_info?format=jsonp',
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
}


//starter
$(function () {
    forms.form_login_submit(); // init form login
    forms.form_patient_basic(); // init form create patient.
    forms.form_patient_about(); // init form for patient about.
    forms.form_patient_measurements();// init form patient measurement.
    forms.form_patient_note(); // init form patient note.
    forms.form_submit_order(); // init form submit order.
    on_page_change(); // action that will trigger after page is changed.
    btn_triggers(); // init for all btn on the app.



});

// should removed on production
function btn_triggers() {
    $('#btn-logout').click(function () {    buttons.logout();    });

    $('#btn-goto-patient-info-review').click(function (e) {
        actions.redirect('page-patient-info-review');
        return false;
    });

    $('#btn-pick-up').click(function(){
        actions.redirect('page-pickup-review');
        return false;
    });

    $('.btn-review_fits').click(function() { buttons.review_fits(); });

    $('.btn-review_remake_needed').click(function() {  buttons.review_remake_needed(); });

    $('#btn_patient_shipment_tracking').click(function(){
        alert('shipment tracking');
        return false;
    });

    $('.btn-goto-add-new-patient').click(function(){
        actions.reset_form_value('form_patient_basic');
        patient.set_user_id(0);
        actions.redirect('page-add-new-patient');
        return false;
    });
    $('.footer_buttons a[href="#page-add-new-patient"]').click(function(){
        actions.reset_form_value('form_patient_basic');
        patient.set_user_id(0);
        actions.redirect('page-add-new-patient');
        return false;
    });

    $('#btn_order_history').click(function(){
        $('#order_history').toggle();
    });

}

// on page change.
function on_page_change() {
    /* pageshow */
    $('html').on("pagechange", function (e) {
        console.log('pagechange: ' + $.mobile.activePage.attr("id"));
        var current_page = $.mobile.activePage.attr("id");
        if (current_page != 'page-login') { // if on login page, hide the footer. if user logged in, forward to home page.
            actions.show_footer_menu();
            console.log('user is login: ' + reseller.is_login());
            if (reseller.is_login() === false) {
                actions.hide_footer_menu();
                actions.redirect('page-login');
            }

            switch (current_page) {
                case 'page-home':                           pages.page_home();                              break;

                case 'page-add-new-patient':                pages.page_add_new_patient();                   break;
                case 'page-patient-form-about':             pages.page_patient_form_about();                break;
                case 'page-patient-form-foot-measurements': pages.page_patient_form_foot_measurements();    break;
                case 'page-patient-form-note':              pages.page_patient_form_note();                 break;
                case 'page-patient-form-scan-foot':         pages.page_patient_form_scan_foot();            break;
                case 'page-patient-info-review':            pages.page_patient_info_review();               break;

                case 'page-patients':                       pages.update_patients_list('');                 break;

                case 'page-pickup':                         pages.page_pickup();                            break;
                case 'page-pickup-review':                  pages.page_pickup_review();                     break;

                case 'page-profile':                        pages.page_profile();                           break;

                default:
                    alert(current_page);
                    break;

            }
        }
    });
}

// method for populate form values
function populate_form_values(form_name) {
    switch (form_name) {

        case 'page_add_new_patient':
            var editing = (patient.get_user_id() > 0);
            if(editing) {
                $.ajax({
                    dataType:'jsonp',
                    data:patient.api_data() + '&' + reseller.api_data(),
                    url:'http://qa.sols.co/api/api_get_patient_info?format=jsonp',
                    success:function (data) {
                        if (data.connected) {
                            console.log(data);
                            $('input[name="user[first_name]"]').val(data.patient['first_name']);
                            $('input[name="user[last_name]"]').val(data.patient['last_name']);
                            $('input[name="user[email]"]').val(data.patient['email']);

                            actions.update_submit_btn_label('.btn_create_patient', "Update Patient Info");

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
            } else {
                $('.btn_create_patient').val('Create Patient');
            }
            break;

        case 'form_patient_about':
            var editing = (patient.get_user_id() > 0);
            if(editing) {
                $.ajax({
                    dataType:'jsonp',
                    data:patient.api_data() + '&' + reseller.api_data(),
                    url:'http://qa.sols.co/api/api_get_patient_info_for_order?format=jsonp',
                    success:function (data) {
                        if (data.connected) {
                            console.log(data);
                            $('input[name="customer_info[height]"]').val(data.patient['height']);
                            $('input[name="customer_info[weight]"]').val(data.patient['weight']);
                            $('select[name="user[ref_ethnicity_id]"]').val(data.patient['ref_ethnicity_id']).selectmenu("refresh", true);
                            $('select[name="customer_info[shoe_size_raw_left]"]').val(data.patient['shoe_size_raw_left']).selectmenu("refresh", true);
                            $('select[name="customer_info[shoe_size_raw_right]"]').val(data.patient['shoe_size_raw_right']).selectmenu("refresh", true);
                            if(data.patient['ref_activity_level_id'])
                                $('input[name="customer_info[ref_activity_level_id]"]').filter('[value="'+data.patient['ref_activity_level_id']+'"]').next().click();
                            //$('input[name="customer_info[ref_activity_level_id]"]').filter('[value="1"]').parent().find("label[for].ui-btn").click();
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

            break;
        case 'form_patient_measurements':
            var editing = (patient.get_user_id() > 0);
            if(editing) {
                $.ajax({
                    dataType:'jsonp',
                    data:patient.api_data() + '&' + reseller.api_data(),
                    url:'http://qa.sols.co/api/api_get_patient_info_for_order?format=jsonp',
                    success:function (data) {
                        if (data.connected) {
                            console.log(data);
                            $('#form_patient_measurements input[type="text"]').each(function(){
                                var field_name = $(this).attr('name');
                                if( field_name.substring(0, field_name.lastIndexOf("[")) == 'customer_info' ) {
                                    var column_name = field_name.substring(field_name.lastIndexOf("[")+1,field_name.lastIndexOf("]"))
                                    $(this).val(data.patient[column_name]);
                                }
                            })
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
            break;

        case 'form_patient_note':
            var editing = (patient.get_user_id() > 0);
            if(editing) {
                $.ajax({
                    dataType:'jsonp',
                    data:patient.api_data() + '&' + reseller.api_data(),
                    url:'http://qa.sols.co/api/api_get_patient_info_for_order?format=jsonp',
                    success:function (data) {
                        if (data.connected) {
                            console.log(data);
                            $('textarea[name="customer_info[prescription_note]"]').val(data.patient['prescription_note']);
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
            break;

    }
}





/*
 shoe size: 5, 5.5, 6, ... 14 (for both left and right) US shoe size
 L/R foot size (inches): text input (4,2 decimal format) 00.00
 everything with inches use decimal 4,2

 "degree decimal"




 */