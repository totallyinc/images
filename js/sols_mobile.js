function debug(msg) {
    console.log(msg);
}

var images = [];
// Only put handing image upload on this doc ready
$(document).ready(function(){
    // Now safe to use the PhoneGap API
    $('.camera_image').click(function(e){
        function captureSuccess(mediaFiles) {
            function uploadFiles() {
                // alert('begin uploadFiles()');
                var url = config.api_url+"/api/api_update_patient_foot_images?format=jsonp&image_id="+originalCaller.attr('id')+'&'+patient.api_data()+'&'+reseller.api_data();
                try {
                    var ft = new FileTransfer();
                    var path = images[id][0].fullPath;
                    var name = images[id][0].name;
                    ft.upload(path,
                        url,
                        function(result) {
                            // alert('successfully uploaded');
                            originalCaller.attr("src",path);
                            // alert('done setting image to html');
                        },
                        function(error) {
                            // originalCaller.attr("src","img/broken-link-image.jpg");
                            // alert(error.code);
                            // navigator.notification.alert('Error uploading image, please try again');
                            window.setTimeout(
                                ft.upload(path,
                                    url,
                                    function(result){
                                        originalCaller.attr("src",path);
                                    },
                                    function(error){
                                        navigator.notification.alert('Error uploading image, please try again');
                                        originalCaller.attr("src","img/broken-link-image.jpg");
                                    },
                                    {
                                        fileKey : originalCaller.attr('id'),
                                        params : { 'shoe_size' : '1'}
                                    }),
                                1000);
                        },
                        {   fileKey : originalCaller.attr('id'),
                            params:{ 'shoe_size':'1' }
                        });
                }
                catch(err){
                    navigator.notification.alert("Exception: " + err);
                }
            }
            try {
                // alert('begin captureSuccess()');
                originalCaller.attr("src", "img/loading.gif");
                images[id] = mediaFiles;
                uploadFiles();
            }
            catch (err) {
                navigator.notification.alert("success Error: " + err);
            }
        }
        try{
            var originalCaller = $(this);
            var id = originalCaller.attr('id');
            // alert('begin listener');
            fileManagement.read();
            var user_data = fileManagement.data;
            alert(user_data);
            navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 1});
        }
        catch (err) {
            alert("An error occurred during capture: " + err + "\nMake sure your mobile device is supported.", null, "Uh oh!");
        }
    });
});

var fileManagement = {
    file : null,
    data : "",
    write :     function(data) {
                    try{
                    window.requestFileSystem(
                        LocalFileSystem.PERSISTENT, 
                        0, 
                        function(fileSystem) {
                            fileSystem.root.getFile(
                                "user.txt", 
                                {create: true}, 
                                function(fileEntry) {
                                    fileEntry.createWriter(
                                        function(writer) {
                                            writer.onwrite = function(evt) {
                                                console.log("write success");
                                            };

                                            writer.write(data);
                                                writer.abort();
                                                // contents of file now 'some different text'
                                        }, 
                                        fileManagement.fail
                                    );
                                }, 
                                fileManagement.fail
                            );
                        }, 
                        fileManagement.fail
                    );
                    }
                    catch(err){
                        alert(err);
                    }
                },

    startRead : function() {
                    window.requestFileSystem(
                        LocalFileSystem.PERSISTENT, 
                        0, 
                        function(fileSystem) {
                            fileSystem.root.getFile(
                                "user.txt", 
                                {create: true}, 
                                function(fileEntry) {
                                    fileManagement.file = fileEntry.file(
                                        function() {
                                            alert('obtaining file success');
                                        },
                                        fileManagement.fail
                                    );
                                }, 
                                fileManagement.fail
                            );
                        }, 
                        fileManagement.fail
                    );
                },

    delete : function() {
                    window.requestFileSystem(
                        LocalFileSystem.PERSISTENT, 
                        0, 
                        function(fileSystem) {
                            fileSystem.root.getFile(
                                "user.txt", 
                                {create: true}, 
                                function(fileEntry) {
                                    fileEntry.remove(deleteSuccess,deleteFail);
                                }, 
                                fileManagement.fail
                            );
                        }, 
                        fileManagement.fail
                    );
                },

    deleteSuccess : function() {
        alert('Succesfully deleted');
    },

    deleteFail : function() {
        alert('Unable to delete file');
    },

    fail : function(error) {
        console.log("error : "+error.code);
    },

    read : function() {
        fileManagement.startRead();
        var reader = new FileReader();
        reader.onload = function() {
            fileManagement.data = reader.result;
        }
        reader.onloadend = function(evt) {
            console.log("read success");
            console.log(evt.target.result);
        };
        reader.readAsDataURL(fileManagement.file);
    }
}

function captureError(error) {
    var msg = "An error occurred during capture: " + error;
    navigator.notification.alert(msg, null, "Uh oh!");
}

// bind scrolling and focus on form fields
$(document).bind('pageinit', function () {
    $('input,select').keypress(function(event) {
        if(event.keyCode == 13) {
            $('html, body').animate({
                scrollTop:      $(this).offset().top
            }, 1000);
            $(this).blur(); /* just incase next field didn't get selected. */
            $(this).parent().parent().next().children().children('.ui-input-text').focus();
            event.preventDefault();
        }
        return event.keyCode != 13

    });
});

/* CONFIG */
var config = {
    'api_url' : 'http://qa.sols.co',
    'api_type': 'mvp',
    'api_version' : '0.9.1'
}

var translate = {
    ref_gender: function(key){
        var ref = { 1: 'Female', 2: 'Male' };
        if(key in ref)
            return ref[key];
        else
            return 'N/A';
    },
    ref_order_item_status: function(key){
        var ref = { 6: 'Picked Up'  };
        if(key in ref)
            return ref[key];
        else
            return 'N/A';
    }
}

//var data_pickup_order_id = 0;
var foot_images = {
    'l1':'https://dl.dropboxusercontent.com/u/10607473/www.sols.co/mobile_foot_images/photo_icon_left_bottom.png',
    'l2':'https://dl.dropboxusercontent.com/u/10607473/www.sols.co/mobile_foot_images/photo_icon_left_side.png',
    'l3':'https://dl.dropboxusercontent.com/u/10607473/www.sols.co/mobile_foot_images/photo_icon_left_back.png',
    'r1':'https://dl.dropboxusercontent.com/u/10607473/www.sols.co/mobile_foot_images/photo_icon_right_bottom.png',
    'r2':'https://dl.dropboxusercontent.com/u/10607473/www.sols.co/mobile_foot_images/photo_icon_right_side.png',
    'r3':'https://dl.dropboxusercontent.com/u/10607473/www.sols.co/mobile_foot_images/photo_icon_right_back.png'
};

var forms = {
    form_login_submit : function(msg){
        $('#form_login').submit(function () {

            //            if($("#form_login input[name='user[username]']").val().length < 1 || $("#form_login input[name='user[password]']").val().length < 1) {
            //              alert("Please enter your uesrname and password!");
            //              return false;
            //            }

            var postData = $(this).serialize();
            $.ajax({
                dataType:'jsonp',
                data:postData,
                url:config.api_url+'/api/api_login?format=jsonp',
                success:function (data) {
                    if (data.login) {
                        reseller.login(data);
                        //user_login(data);
                        actions.hide_login_form();
                        actions.redirect('page-home');
                    }
                    else {
                        sols_alerts.login_fail();
                    }
                },
                error:function () {
                    alert('There was an unexpected error when you try to login.');
                }
            });
            return false;
        });
    },

    form_patient_basic: function() {
        $('#form_patient_basic').submit(function () {

            if($("#form_patient_basic input[name='user[last_name]']").val().length < 1) {
                alert("Please enter patient's first name!");
                return false;
            }
            if($("#form_patient_basic select[name='dob_month']").val().length < 1) {
                alert("Month is required!");
                return false;
            }


            var postData = $(this).serialize();
            $.ajax({
                dataType:'jsonp',
                data:postData + '&' + reseller.api_data(),
                url:config.api_url+'/api/api_patient_form_basic?format=jsonp',
                success:function (data) {
                    debug(data);
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
                    debug(data);
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
                url:config.api_url+'/api/api_patient_form_about?format=jsonp',
                success:function (data) {
                    debug(data);
                    if (data.connected) {
                        actions.redirect('page-patient-form-foot-measurements');
                    }
                    else {
                        alert('fail to connect');
                    }
                },
                error:function () {
                    debug(data);
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
                url:config.api_url+'/api/api_patient_form_measurements?format=jsonp',
                success:function (data) {
                    debug(data);
                    if (data.connected) {
                        actions.redirect('page-patient-form-note');
                    }
                    else {
                        alert('fail to connect');
                    }
                },
                error:function () {
                    debug(data);
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
                url:config.api_url+'/api/api_patient_form_note?format=jsonp',
                success:function (data) {
                    debug(data);
                    if (data.connected) {
                        actions.redirect('page-patient-form-scan-foot');
                    }
                    else {
                        alert('fail to connect');
                    }
                },
                error:function () {
                    debug(data);
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
                url:config.api_url+'/api/api_form_submit_order?format=jsonp',
                success:function (data) {
                    if (data.connected) {
                        debug(data);
                        alert('Thank for your order.');
                        actions.redirect('page-home');
                    }
                    else {
                        alert('fail to connect');
                    }
                },
                error:function () {
                    debug(data);
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
        if(user_data != null) {
            $('#btn-logout').html('LOGOUT: '+user_data.username);


            // two ajax call to get patient count and order count
            $.ajax({
                dataType:'jsonp',
                data:reseller.api_data(),
                url:config.api_url+'/api/api_get_patients?format=jsonp',
                success:function (data) {
                    if (data.connected) {
                        if(data.patients.length) {
                            $('.patient-count').html(data.patients.length);
                        } else {
                            $('.patient-count').html(0);
                        }

                    }
                    else {
                        alert('fail to connect');
                    }
                },
                error:function () {
                    debug(data);
                    alert('There was an unexpected error.');
                }
            });

            $.ajax({
                dataType:'jsonp',
                data:reseller.api_data(),
                url:config.api_url+'/api/api_get_pickup?format=jsonp',
                success:function (data) {
                    if (data.connected) {
                        $('#pickup-list').html('');
                        var pickups = data.pickup_order;
                        if(data.pickup_order.length) {
                            $('.pick-up-count').html(data.pickup_order.length);
                        } else {
                            $('.pick-up-count').html(0);
                        }
                    }
                    else {
                        alert('fail to connect');
                    }
                },
                error:function () {
                    debug(data);
                    alert('There was an unexpected error.');
                }
            });



        }


    },

    page_add_new_patient: function() {
        populate_form_values('page_add_new_patient');
    },

    update_patients_list: function($params) {
        $('#patients_list').html('Loading');
        $.ajax({
            dataType:'jsonp',
            data:reseller.api_data(),
            url:config.api_url+'/api/api_get_patients?format=jsonp',
            success:function (data) {
                if (data.connected) {
                    var patients = data.patients
                    $('#patients_list').html('');
                    var first_letter = '';
                    for (var i in patients) {

                        if(first_letter != patients[i].last_name.substr(0,1)) {
                            first_letter = patients[i].last_name.substr(0,1);
                            var row = '<div class="patient_list_abbr">'+patients[i].last_name.substr(0,1)+'</div>';
                            $('#patients_list').append(row);
                        }
                        var row = '<div class="patient_row light-grey" onclick="patient.goto_patient_page('+patients[i].user_id+');"><span class="next_arrow"></span>' + patients[i].last_name + ', ' + patients[i].first_name + '</div>';
                        $('#patients_list').append(row);

                    }
                }
                else {
                    alert('fail to connect');
                }
            },
            error:function () {
                debug(data);
                alert('There was an unexpected error.');
            }
        });

        $('#searchinput3').keyup(function(){
            actions.filter();
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
        patient.update_foot_images();
    },

    page_patient_info_review: function () {
        patient.show_target_patient_name();

        $.ajax({
            dataType:'jsonp',
            data: 'patient_user_id='+patient.get_user_id()+'&'+reseller.api_data(),
            url:config.api_url+'/api/api_get_patient_info_for_order?format=jsonp',
            success:function (data) {
                if (data.connected) {
                    debug(data['patient']);
                    var patient_info = data['patient'];

                    patient_info['ref_gender_id'] = translate.ref_gender(patient_info['ref_gender_id']);
                    for (var i in patient_info) {
                        $('.patient-info-'+i).html(patient_info[i]);
                    }

                    patient.update_foot_images();
                }
                else {
                    alert('fail to connect');
                }
            },
            error:function () {
                debug(data);
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
            url:config.api_url+'/api/api_get_pickup?format=jsonp',
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
                            $('#btn-pick-up').show();
                            patient.set_user_id(patient_user_id);
                        });

                    }

                }
                else {
                    alert('fail to connect');
                }
            },
            error:function () {
                debug(data);
                alert('There was an unexpected error.');
            }
        });
    },

    page_pickup_review: function() {
        patient.show_target_patient_name();

        if($('.patient-pickup.active').attr('data-pickup-order-id')) {
            debug( 'pickup order id: ' + $('.patient-pickup.active').attr('data-pickup-order-id'));
        } else {
            actions.redirect('page-pickup');
            return false;
        }
    },

    page_profile: function () {
        patient.show_target_patient_name();
        $('#open-order').hide();

        // get patient open order
        $.ajax({
            dataType:'jsonp',
            data: patient.api_data()+'&'+reseller.api_data(),
            url:config.api_url+'/api/api_get_patient_open_order?format=jsonp',
            success:function (data) {
                if (data.connected) {
                    if(data['open_orders'].length) {
                        $('#open-order').show();
                        var html = '';
                        var open_orders = data['open_orders'];
                        for(var i in open_orders) {
                            html +='Order No. '+open_orders[i]['order_id']+'<br />';
                            html +='Status: '+ translate.ref_order_item_status(open_orders[i]['ref_order_item_status_id'])+'<br />';
                        }
                        $('#open-orders-status').html(html);
                    } else {
                        $('#open-order').hide();
                    }
                }
                else {
                    alert('fail to connect');
                }
            },
            error:function () {
                debug(data);
                alert('There was an unexpected error.');
            }
        });

        // get patient order history
        $.ajax({
            dataType:'jsonp',
            data: patient.api_data()+'&'+reseller.api_data(),
            url:config.api_url+'/api/api_get_patient_order_history?format=jsonp',
            success:function (data) {
                if (data.connected) {
                    if(data['order_history'].length) {
                        var order_history = data['order_history'];
                        debug(order_history);
                        var html = '';
                        for(var i in order_history) {
                            html += '<div style="border: 1px solid #ccc; margin: 3px;">';
                            html += '<span style="font-weight: bold;">' + convert_date(order_history[i].created)+'</span><br />';
                            html += 'Order No. ' + order_history[i].order_id+'<br />';
                            html += 'Status: ' + translate.ref_order_item_status(order_history[i].ref_order_item_status_id)+'<br />';
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
                debug(data);
                alert('There was an unexpected error.');
            }
        });



    },

    page_report: function() {
        var user_data = reseller.info();
        if(user_data != null) {
            $.ajax({
                dataType:'jsonp',
                data:reseller.api_data(),
                url:config.api_url+'/api/api_get_full_report?format=jsonp',
                success:function (data) {
                    if (data.connected) {

                        var pickup_ready_count = data.pickup_ready_count? data.pickup_ready_count: 0;
                        $('.pick-up-count').html(data.pickup_ready_count);

                        var in_production_count = data.in_production_count? data.in_production_count : 0;
                        $('.production-count').html(in_production_count);


                        var reseller_total_order_count = data.reseller_total_order_count? data.reseller_total_order_count: 0;
                        $('.total-sold-count').html(reseller_total_order_count);

                        var reseller_order_history = data.reseller_order_history;
                        $('#monthly-report-list').html('');
                        var count = 0;
                        var row_style = '';
                        for (var i in reseller_order_history) {
                            row_style = (count++ % 2 == 0)? 'odd' : 'even';
                            var row = '<div class="  '+row_style+' odd monthly-sale-report-item"><span>'+reseller_order_history[i].c+'</span><div>'+reseller_order_history[i].created+'</div></div>';
                            $('#monthly-report-list').append(row);
                        }
                    }
                    else {
                        alert('fail to connect');
                    }
                },
                error:function () {
                    debug(data);
                    alert('There was an unexpected error.');
                }
            });
        }

    }

}

var buttons = {
    logout: function() {
        window.localStorage.clear();
        fileManagement.delete();
        actions.redirect('page-login');
        actions.hide_footer_menu();
        actions.show_login_form();
    },

    review_fits: function() {
        $('.patient-pickup.active').attr('data-pickup-order-id');
        $.ajax({
            dataType:'jsonp',
            data:reseller.api_data()+'&review=fits&order_id='+$('.patient-pickup.active').attr('data-pickup-order-id'),
            url:config.api_url+'/api/api_get_pickup_review?format=jsonp',
            success:function (data) {
                debug(data);
                if (data.connected) {
                    alert('I am glad it fits.');
                    actions.redirect('page-home');
                }
                else {
                    alert('fail to connect');
                }
            },
            error:function () {
                debug(data);
                alert('There was an unexpected error.');
            }
        });
    },

    review_remake_needed: function() {
        $('.patient-pickup.active').attr('data-pickup-order-id');
        $.ajax({
            dataType:'jsonp',
            data:reseller.api_data()+'&review=remake_needed&order_id='+$('.patient-pickup.active').attr('data-pickup-order-id'),
            url:config.api_url+'/api/api_get_pickup_review?format=jsonp',
            success:function (data) {
                debug(data);
                if (data.connected) {
                    alert('Sorry to hear that, we will contact you for the remake.');
                    actions.redirect('page-home');
                }
                else {
                    alert('fail to connect');
                }
            },
            error:function () {
                debug(data);
                alert('There was an unexpected error.');
            }
        });
    },

    email_full_report: function() {
        $.ajax({
            dataType: 'jsonp',
            data: reseller.api_data(),
            url: config.api_url+'/api/api_email_full_report?format=jsonp',
            success:function (data) {
                if (data.connected) {
                    alert('Report has been mailed to your email address.');
                }
                else {
                    alert('Sorry, we are currently working on the reporting system.');
                }
            },
            error:function () {
                debug(data);
                alert('There was an unexpected error.');
            }
        });
    }

}

var actions = {
    redirect: function(page_id){ $.mobile.changePage('#'+page_id, { transition:"none"}); },
    hide_footer_menu: function() {  $('.footer_buttons').hide(); },
    show_footer_menu: function() {  $('.footer_buttons').show(); },

    reset_form_value: function(form_id) { /* reset add new patient form */
        actions.update_submit_btn_label('.btn_create_patient', "CREATE PATIENT");
        $(':input','#'+form_id).not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');
        $('#'+form_id+' div.ui-select span.ui-btn-inner span.ui-btn-text').html('--');

        $('#birth-date-input-group div.ui-select:eq(0) span.ui-btn-text').html('MM');
        $('#birth-date-input-group div.ui-select:eq(1) span.ui-btn-text').html('DD');
        $('#birth-date-input-group div.ui-select:eq(2) span.ui-btn-text').html('YYYY');
    },

    update_submit_btn_label: function(selector, new_label) {
        $(selector).prev('span').find('span.ui-btn-text').text(new_label);
    },

    filter: function() {
        var str = $('#searchinput3').val();
        if(str.length<1) {
            $( "#patients_list div" ).show();
        } else {
            $( "#patients_list div" ).hide();
            $( "#patients_list div:contains('"+str+"')" ).show();
        }
    },

    show_login_form: function() {
        $('#logged-in').hide();
        $('#form_login').show();
    },

    hide_login_form: function() {
        $('#form_login').hide();
        $('#logged-in').show();
    }

}

var sols_alerts = {
    login_fail: function(){ alert("User login failed"); }
}

/* RESELLER */
var reseller = {
    login: function(data) {
        window.localStorage.setItem("user", JSON.stringify(data));
        fileManagement.write(JSON.stringify(data));
    },
    info: function() {
        var user_data = window.localStorage.getItem("user");
        fileManagement.read();
        var user_data = fileManagement.data;
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
        userApiData.api_type = config.api_type;
        userApiData.api_version = config.api_version;
        return $.param(userApiData, true);
    }
}

/* Patient */
var patient = {
    update_foot_images: function() {
        // update images
        var patient_user_id = this.get_user_id();
        if(patient_user_id) {
            $.ajax({
                dataType:'jsonp',
                data: this.api_data() + '&' + reseller.api_data(),
                url:config.api_url+'/api/api_get_patient_foot_images?format=jsonp',
                success:function (data) {
                    if (data.connected) {
                        for (var i in data.images) {
                            $('.foot-'+i).attr('src',  config.api_url+data.images[i]);
                        }
                    }
                    else {
                        alert('fail to connect');
                    }
                },
                error:function () {
                    alert('There was an unexpected error when you try to login.');
                }
            });
        }

    },
    set_user_id: function (patient_user_id) {
        $('.db-data').html('');

        window.localStorage.setItem('patient_user_id', patient_user_id);
        if(patient_user_id) {
            patient.update_foot_images();
        }
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
            url:config.api_url+'/api/api_get_patient_info?format=jsonp',
            success:function (data) {
                if (data.connected) {
                    var fullname = data.patient.last_name + ', ' + data.patient.first_name;
                    $('.target_patient_name').html(fullname);
                }
                else {
                    alert('fail to connect');
                }
            },
            error:function () {
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

    $('.version').html('v: '+config.api_version);

});

// on image load in html. if failed to load image, it will trigger this function. MUST keep it.
function image_error(class_id) {
    $('.foot-'+class_id).each(function(){
        $(this).attr('src', foot_images[class_id]);
    });
}

function convert_date(msyql_data) {
    var dateParts = msyql_data.split(/[ -]+/);
    var jsDate = dateParts[1] +'/'+ dateParts[2] +'/'+ dateParts[0].substr(0,2);
    return  jsDate;
}

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

    $('#btn-email-full-report').click(function() { buttons.email_full_report(); });

}

// on page change.
function on_page_change() {

    /* pageshow */
    $('html').on("pagechange", function (e) {
        debug('pagechange: ' + $.mobile.activePage.attr("id"));
        var current_page = $.mobile.activePage.attr("id");
        if (current_page != 'page-login') { // if on login page, hide the footer. if user logged in, forward to home page.
            actions.show_footer_menu();
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

                case 'page-report':                         pages.page_report();                            break;

                default:
                    debug(current_page + ' : which has not page action yet.');
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
                    url:config.api_url+'/api/api_get_patient_info?format=jsonp',
                    success:function (data) {
                        if (data.connected) {
                            $('input[name="user[first_name]"]').val(data.patient['first_name']);
                            $('input[name="user[last_name]"]').val(data.patient['last_name']);
                            $('input[name="user[email]"]').val(data.patient['email']);
                            $('input[name="user[dob]"]').val(data.patient['dob']);
                            $('input[name="user[ss_num_last_four]"]').val(data.patient['ss_num_last_four']);
                            $('select[name="user[ref_gender_id]"]').val(data.patient['ref_gender_id']).selectmenu("refresh", true);
                            actions.update_submit_btn_label('.btn_create_patient', "UPDATE PATIENT INFO");

                        }
                        else {
                            alert('fail to connect');
                        }
                    },
                    error:function () {
                        alert('There was an unexpected error when you try to login.');
                    }
                });
            } else {
                actions.reset_form_value('form_patient_basic');
                $('.btn_create_patient').val('Create Patient');
            }
            break;

        case 'form_patient_about':
            var editing = (patient.get_user_id() > 0);
            if(editing) {
                $.ajax({
                    dataType:'jsonp',
                    data:patient.api_data() + '&' + reseller.api_data(),
                    url:config.api_url+'/api/api_get_patient_info_for_order?format=jsonp',
                    success:function (data) {
                        if (data.connected) {
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
                    url:config.api_url+'/api/api_get_patient_info_for_order?format=jsonp',
                    success:function (data) {
                        if (data.connected) {
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
                    url:config.api_url+'/api/api_get_patient_info_for_order?format=jsonp',
                    success:function (data) {
                        if (data.connected) {
                            $('textarea[name="customer_info[prescription_note]"]').val(data.patient['prescription_note']);
                        }
                        else {
                            alert('fail to connect');
                        }
                    },
                    error:function () {
                        alert('There was an unexpected error when you try to login.');
                    }
                });
            }
            break;

    }
}

function update_tab_menu() {
    $('.footer_buttons ul li.ui-block-a a').html('hi there');
    $('.footer_buttons ul li.ui-block-a a').html('hi there');
    $('.footer_buttons ul li.ui-block-a a').html('hi there');
    $('.footer_buttons ul li.ui-block-a a').html('hi there');
}

/*
 shoe size: 5, 5.5, 6, ... 14 (for both left and right) US shoe size
 L/R foot size (inches): text input (4,2 decimal format) 00.00
 everything with inches use decimal 4,2
 "degree decimal"
 */