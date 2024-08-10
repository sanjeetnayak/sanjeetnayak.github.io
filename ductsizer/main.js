$(document).ready(function(){

    $('.btn-dark').on('click', function (evt) {
      $(".num").val('');
      $("#inlineFormInput-1").val('');
      $("#inlineFormInput-2").val('');
    });
    var limit = 2;
    $('input.checkbox').on('click', function (evt) {
      if ($('.checkbox:checked').length > limit) {
        this.checked = false;
      }
    });


    $('input[name="first"]').click(function () {
      if (this.checked == false){
        $("#inputFlow").val('');
        $("#inputFlow").prop('disabled', true);
        $("#inputFlow1").prop('disabled', true);
      }else{
        $("#inputFlow").prop('disabled', false);
        $("#inputFlow1").prop('disabled', false);
      }
    });
  $('input[name="second"]').click(function () {
    if (this.checked == false){
      $("#inputHead").val('');
      $("#inputHead").prop('disabled', true);
      $("#inputHead1").prop('disabled', true);
    }else{
      $("#inputHead").prop('disabled', false);
      $("#inputHead1").prop('disabled', false);
    }
  });
  $('input[name="third"]').click(function () {
    if (this.checked == false){
      $("#inputVel").val('');
      $("#inputVel").prop('disabled', true);
      $("#inputVel1").prop('disabled', true);
    }else{
  $("#inputVel").prop('disabled', false);
  $("#inputVel1").prop('disabled', false);
    }
  });
  $('input[name="fourth"]').click(function () {
    if (this.checked == false){
      $("#inputDia").val('');
      $("#inputDia").prop('disabled', true);
      $("#inputDia1").prop('disabled', true);
    }else{
      $("#inputDia").prop('disabled', false);
      $("#inputDia1").prop('disabled', false);
    }     
  });
  $('input#togBtn').click(function () {
    if (this.checked == false){
      $(".append").val('1');
      create_post_4()
    }else{
      $(".append").val('0.0393701');
      create_post_3()
    }
  });
  // $('.table').hide();
  $('#myform').on('submit', function(event){
    if($('.checkbox:checked').length == 2){
      event.preventDefault();
      if($(".flow-unit option:selected").text() == 'CFM' ){
        $(".flow-unit").val('0.472')
      }   
      if($(".flow-unit option:selected").text() == 'LPS' ){
        $(".flow-unit").val('1')
      }
      if($(".hl-unit option:selected").text() == 'Pa/m' ){
        $(".hl-unit").val('1')
      }   
      if($(".hl-unit option:selected").text() == 'in.WC/100 ft' ){
        $(".hl-unit").val('8.163')
      }
      if($(".vel-unit option:selected").text() == 'm/sec' ){
        $(".vel-unit").val('1')
      }   
      if($(".vel-unit option:selected").text() == 'fpm' ){
        $(".vel-unit").val('0.00508')
      }
      if($(".dia-unit option:selected").text() == 'IN' ){
        $(".dia-unit").val('25.4')
      } 
      if($(".dia-unit option:selected").text() == 'MM' ){
        $(".dia-unit").val('1')
      }  
   
      if($("#inputDia").prop('disabled') == true ){
        $("#inputDia").val('')
      }
      if($("#inputVel").prop('disabled') == true ){
        $("#inputVel").val('')
      }
      if($("#inputHead").prop('disabled') == true ){
        $("#inputHead").val('')
      }
      if($("#inputFlow").prop('disabled') == true ){
        $("#inputFlow").val('')
      }
      $("#inlineFormInput-1").val('');
      $("#inlineFormInput-2").val('');
    }
    });
  $('.close-2').click(function(){
    $('#alert').hide();
  });

  $('#submit-2').click(function(){
    create_post_5();

  });

  $('.btn-dark').click(function() {
    $('.table').hide();
    $('#alert').hide();
    $('#submit-2').hide();
    $("#inlineFormInput-1").prop('disabled', true);
    $("#inlineFormInput-2").prop('disabled', true);
  });
  $('.forms').click(function() {
    $('.table').hide();
    $('#submit-2').hide();
    $("#inlineFormInput-1").val('');
    $("#inlineFormInput-2").val('');
    $("#inlineFormInput-1").prop('disabled', true);
    $("#inlineFormInput-2").prop('disabled', true);
  });

  var delay = (function(){
    var timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();
    
    $("#inlineFormInput-1").keyup(function(){
        // $('#inputVel').val('');
        // $('#inputHead').val('');
        if($(".flow-unit option:selected").text() == 'CFM' ){
        $(".flow-unit").val('0.472')
        }   
        if($(".flow-unit option:selected").text() == 'LPS' ){
          $(".flow-unit").val('1')
        }
        if($(".hl-unit option:selected").text() == 'Pa/m' ){
          $(".hl-unit").val('1')
        }   
        if($(".hl-unit option:selected").text() == 'in.WC/100 ft' ){
          $(".hl-unit").val('8.163')
        }
        if($(".vel-unit option:selected").text() == 'm/sec' ){
          $(".vel-unit").val('1')
        }   
        if($(".vel-unit option:selected").text() == 'fpm' ){
          $(".vel-unit").val('0.00508')
        }
        if($(".dia-unit option:selected").text() == 'IN' ){
          $(".dia-unit").val('25.4')
        } 
        if($(".dia-unit option:selected").text() == 'MM' ){
          $(".dia-unit").val('1')
        }  
        $("#inlineFormInput-2").val('');
        create_post_2();
    });
    
    $("#inlineFormInput-2").keyup(function(){
      delay(function(){
        // $('#inputVel').val('');
        // $('#inputHead').val('');
        if($(".flow-unit option:selected").text() == 'CFM' ){
          $(".flow-unit").val('0.472')
        }   
        if($(".flow-unit option:selected").text() == 'LPS' ){
          $(".flow-unit").val('1')
        }
        if($(".hl-unit option:selected").text() == 'Pa/m' ){
          $(".hl-unit").val('1')
        }   
        if($(".hl-unit option:selected").text() == 'in.WC/100 ft' ){
          $(".hl-unit").val('8.163')
        }
        if($(".vel-unit option:selected").text() == 'm/sec' ){
          $(".vel-unit").val('1')
        }   
        if($(".vel-unit option:selected").text() == 'fpm' ){
          $(".vel-unit").val('0.00508')
        }
        if($(".dia-unit option:selected").text() == 'IN' ){
          $(".dia-unit").val('25.4')
        } 
        if($(".dia-unit option:selected").text() == 'MM' ){
          $(".dia-unit").val('1')
        }  
        create_post_2();
      }, 1000);
    });

    fetch("https://webcalc-api.herokuapp.com/calc/");
    $('#myform').on('submit', function (e) {

      forMdata = {"vel":$("#inputVel").val(), "dia":$("#inputDia").val(), "hl":$("#inputHead").val(), "flowrate":$("#inputFlow").val()};
      var formData = JSON.stringify(forMdata);
      e.preventDefault();
      $.ajax({
         url: 'https://webcalc-api.herokuapp.com/calc/',
         contentType: false,
         data: formData,
         type: 'post',
         success: function (response) {
          $('.table').show();
          $("#rn").text(response.rn.toFixed(0));
          $("#ff").text(response.ff.toFixed(4));
          $("#fv").text(response.fv.toFixed(2));
          $("#ed").text(response.ed.toFixed(2));
          $("#vp").text(response.vp.toFixed(2));
          $("#hl").text(response.hl.toFixed(3));
          $("#fa").text(response.fa.toFixed(2));
          // console.log($("#inputHead").val())
          $("#inputDia").val(response.dia_new.toFixed(0));
          $("#inputVel").val(response.vel_new.toFixed(2));
          $("#inputHead").val(response.hl_new.toFixed(3));
          $('#inputFlow').val(response.flowrate_new.toFixed(0));
          $("#inlineFormInput-1").prop('disabled', false);
          $("#inlineFormInput-2").prop('disabled', false);
                  },
         error: function (response) {
                     // use response to update html
                  }
        });
   });
    // function create_post() {
      // $.ajax({
      //     url : "/", // the endpoint
      //     type : "POST", // http method
      //     data : { str_dia : $('#inputDia').val(),
      //     str_vel: $('#inputVel').val(),
      //     str_hl: $('#inputHead').val(),
      //     str_flow: $('#inputFlow').val(),
      //     str_width: $("#inlineFormInput-1").val(),
      //     str_ht: $("#inlineFormInput-2").val(),
      //     str_flow_uc: $(".flow-unit").val(),
      //     str_hl_uc: $(".hl-unit").val(),
      //     str_vel_uc: $(".vel-unit").val(),
      //     str_dia_uc: $(".dia-unit").val(),
      //     'csrfmiddlewaretoken': window.CSRF_TOKEN,
      //     }, // data sent with the post request

      //     // handle a successful response
      //     success : function(json) {
      //       console.log("here")
      //       $('.table').show();
      //       $("#inlineFormInput-1").prop('disabled', false);
      //       $("#inlineFormInput-2").prop('disabled', false);
      //       $(".dia").text(json.dia_new.toFixed(2));
      //       $(".fa").text(json.fa.toFixed(2));
      //       $(".vel").text(json.vel_new.toFixed(2));
      //       $(".rn").text(json.rn.toFixed(0));
      //       $(".ff").text(json.ff.toFixed(4));
      //       $(".vp").text(json.vp.toFixed(2));
      //       $(".hl").text(json.hl_new.toFixed(3));
      //       $("#inputDia").val(json.dia.toFixed(0));
      //       $("#inputVel").val(json.vel.toFixed(2));
      //       $("#inputHead").val(json.hl.toFixed(3));
      //       // $("#inlineFormInput-2").val(json.ht);
      //       $('#inputFlow').val(json.flow.toFixed(0));
      //       $('#submit-2').show();
      //       console.log("may be here")
      //       if($("input#togBtn:checkbox:checked").length > 0){
      //         $(".append").val('0.03937');
      //         create_post_3();
      //       };
      //     },

      //     // handle a non-successful response
      //     error : function(xhr,errmsg,err) {
      //         $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
      //             " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
      //     }
      // });
    // };
    function create_post_2() {

      forMdata = {"vel":$("#inputVel").val(), "dia":$("#inputDia").val(), "hl":$("#inputHead").val(), "flowrate":$("#inputFlow").val(), "dw":$("#inlineFormInput-1").val(), "dh":$("#inlineFormInput-2").val()};
      var formData = JSON.stringify(forMdata);
      $.ajax({
        url: 'https://webcalc-api.herokuapp.com/calc/',
        contentType: false,
        data: formData,
        type: 'post',
        success: function (response) {
          // $('.table').show();
          console.log("yes");
          $("#rn").text(response.rn.toFixed(0));
          $("#ff").text(response.ff.toFixed(4));
          $("#fv").text(response.fv.toFixed(2));
          $("#ed").text(response.ed.toFixed(2));
          $("#vp").text(response.vp.toFixed(2));
          $("#hl").text(response.hl.toFixed(3));
          $("#fa").text(response.fa.toFixed(2));
          // console.log($("#inputHead").val())
          // $("#inputDia").val(response.dia_new.toFixed(0));
          // $("#inputVel").val(response.vel_new.toFixed(2));
          // $("#inputHead").val(response.hl_new.toFixed(3));
          // $('#inputFlow').val(response.flowrate_new.toFixed(0));
          // $("#inlineFormInput-1").prop('disabled', false);
          $("#inlineFormInput-2").val(response.dh.toFixed(0));
                  },
        error: function (response) {
                    // use response to update html
                  }
        });
      };
    // function create_post_2() {
      // $.ajax({
      //     url : "/", // the endpoint
      //     type : "POST", // http method
      //     data : { str_dia : $('#inputDia').val(),
      //     str_vel: '',
      //     str_hl: '',
      //     str_flow: $('#inputFlow').val(),
      //     str_width: $("#inlineFormInput-1").val(),
      //     str_dim_uc: $(".append").val(),
      //     str_ht: $("#inlineFormInput-2").val(),
      //     str_flow_uc: $(".flow-unit").val(),
      //     str_hl_uc: $(".hl-unit").val(),
      //     str_vel_uc: $(".vel-unit").val(),
      //     str_dia_uc: $(".dia-unit").val(),
      //     'csrfmiddlewaretoken': window.CSRF_TOKEN,
      //     }, // data sent with the post request

      //     // handle a successful response
      //     success : function(json) {
      //       $('.table').show();
      //       $(".dia").text(json.dia_new.toFixed(2));
      //       $(".fa").text(json.fa.toFixed(2));
      //       $(".vel").text(json.vel_new.toFixed(2));
      //       $(".rn").text(json.rn.toFixed(0));
      //       $(".ff").text(json.ff.toFixed(4));
      //       $(".vp").text(json.vp.toFixed(2));
      //       $(".hl").text(json.hl_new.toFixed(3));
      //       // $("#inputDia").val(json.dia.toFixed(0));
      //       // $("#inputVel").val(json.vel.toFixed(2));
      //       // $("#inputHead").val(json.hl.toFixed(3));
      //       $("#inlineFormInput-2").val(json.ht.toFixed(0));
      //       // $('#inputFlow').val(json.flow.toFixed(0));)
      //       if($("input#togBtn:checkbox:checked").length > 0){
      //         if($("#inlineFormInput-1").val() != ''){
      //           $(".append").val('0.03937');
      //           create_post_3();
      //         }
      //       };
      //     },

      //     // handle a non-successful response
      //     error : function(xhr,errmsg,err) {
      //         $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
      //             " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
      //     }
      // });
    // };
    function create_post_3() {
      if($(".flow-unit option:selected").text() == 'LPS' && $('#inputFlow').val() !=0 && $(".append").val() == '0.0393701'){
        $('#inputFlow').val(($('#inputFlow').val() * 2.118888).toFixed(0));
      }
      if($(".hl-unit option:selected").text() == 'Pa/m' && $('#inputHead').val() !=0 && $(".append").val() == '0.0393701'){
        $("#inputHead").val(($("#inputHead").val() * 0.1225).toFixed(3));
      }
      if($(".vel-unit option:selected").text() == 'm/sec' && $('#inputVel').val() !=0 && $(".append").val() == '0.0393701'){
        $("#inputVel").val(($("#inputVel").val() * 196.85).toFixed(2));
      }
      // if($(".dia-unit option:selected").text() == 'MM' && $('#inputDia').val() !=0){
      //   $("#inputDia").val(($("#inputDia").val() * 0.0393701).toFixed(0));
      // }
      // if($('#inputFlow').val() !=0){
      //   $('#inputFlow').val(($('#inputFlow').val() * 2.118888).toFixed(0));
      // }
      // if($('#inputHead').val() !=0){
      //   $("#inputHead").val(($("#inputHead").val() * 0.1225).toFixed(3));
      // }
      // if($('#inputVel').val() !=0){
      //   $("#inputVel").val(($("#inputVel").val() * 196.85).toFixed(2));
      // }
      
      if($('#inputDia').val() !=0 && $(".dia-unit option:selected").text() == 'MM' && $(".append").val() == '0.0393701'){
        $("#inputDia").val(($("#inputDia").val() * 0.0393701).toFixed(0));
      }
      if($(".append").val() == '0.0393701'){
        $(".dia-unit>.form-control").prop('selectedIndex', 1);
        $(".vel-unit>.form-control").prop('selectedIndex', 1);
        $(".flow-unit>.form-control").prop('selectedIndex', 1);
        $(".hl-unit>.form-control").prop('selectedIndex', 1);
      }
      $(".append>.input-group-text").text("in");
      $(".dia+.unit").text("in");
      $(".fa+.unit").html("ft<sup>2</sup>");
      $(".vel+.unit").text("fpm");
      $(".vp+.unit").text("in.WC");
      $(".hl+.unit").text("in.WC/100 ft");
      // $(".dia").text(json.dia_new.toFixed(2));

      $(".fa").text((parseFloat($(".fa").text()) * 10.7639).toFixed(2));
      $(".dia").text((parseFloat($(".dia").text()) * 0.0393701).toFixed(0));
      $(".vel").text((parseFloat($(".vel").text()) * 196.85).toFixed(2));
      $(".vp").text((parseFloat($(".vp").text()) * 0.00401865).toFixed(2));
      $(".hl").text((parseFloat($(".hl").text()) * 0.1225).toFixed(3));
      if($("#inlineFormInput-1").val()!=0 && $(".append").val() == "0.0393701"){
        $("#inlineFormInput-1").val(($("#inlineFormInput-1").val() * 0.0393701).toFixed(2));
        $("#inlineFormInput-2").val(($("#inlineFormInput-2").val() * 0.0393701).toFixed(2));
      }




      // $(".vel").text(json.vel_new.toFixed(2));
      // $(".rn").text(json.rn.toFixed(0));
      // $(".ff").text(json.ff.toFixed(4));
      // $(".vp").text(json.vp.toFixed(2));
      // $(".hl").text(json.hl_new.toFixed(2));
    };
    function create_post_4() {
      
      if($(".flow-unit option:selected").text() == 'CFM' && $('#inputFlow').val() !=0){
        $('#inputFlow').val(($('#inputFlow').val() / 2.118888).toFixed(0));
      }
      if($(".hl-unit option:selected").text() == 'in.WC/100 ft' && $('#inputHead').val() !=0){
        $("#inputHead").val(($("#inputHead").val() / 0.1225).toFixed(3));
      }
      if($(".vel-unit option:selected").text() == 'fpm' && $('#inputVel').val() !=0){
        $("#inputVel").val(($("#inputVel").val() / 196.85).toFixed(2));
      }
      if($(".dia-unit option:selected").text() == 'IN' && $('#inputDia').val() !=0){
        $("#inputDia").val(($("#inputDia").val() / 0.0393701).toFixed(0));
      }
      $(".fa").text((parseFloat($(".fa").text()) / 10.7639).toFixed(2));
      console.log($(".dia").text())
      $(".dia").text((parseFloat($(".dia").text()) / 0.0393701).toFixed(0));
      $(".vel").text((parseFloat($(".vel").text()) / 196.85).toFixed(2));
      $(".vp").text((parseFloat($(".vp").text()) / 0.00401865).toFixed(2));
      $(".hl").text((parseFloat($(".hl").text()) / 0.1225).toFixed(3));

      if($("#inlineFormInput-1").val()!=0 && $(".append").val() == "1"){
        $("#inlineFormInput-1").val(($("#inlineFormInput-1").val() / 0.0393701).toFixed(0));
        $("#inlineFormInput-2").val(($("#inlineFormInput-2").val() / 0.0393701).toFixed(0));
      }

      $(".flow-unit>.form-control").prop('selectedIndex', 0);
      $(".dia-unit>.form-control").prop('selectedIndex', 0);
      $(".vel-unit>.form-control").prop('selectedIndex', 0);
      $(".hl-unit>.form-control").prop('selectedIndex', 0);
      $(".append>.input-group-text").text("mm");
      $(".dia+.unit").text("mm");
      $(".fa+.unit").html("m<sup>2</sup>");
      $(".vel+.unit").text("m/sec");
      $(".vp+.unit").text("Pa");
      $(".hl+.unit").text("Pa/m");


    };
    function create_post_5() {
      // $.ajax({
      //     url : "/", // the endpoint
      //     type : "POST", // http method
      //     data : {  str_dia : $('.dia').text(),
      //               str_vel: $('.vel').text(),
      //               str_hl: $('.hl').text(),
      //               str_flow: $('#inputFlow').val(),
      //               str_width: $("#inlineFormInput-1").val(),
      //               str_ht: $("#inlineFormInput-2").val(),
      //               str_fa: $(".fa").text(),
      //               str_rn: $(".rn").text(),
      //               str_ff: $(".ff").text(),
      //               str_vp: $(".vp").text(),
      //               str_uc: $(".append").val(),
      //               'csrfmiddlewaretoken': window.CSRF_TOKEN,
      //     }, // data sent with the post request
          
      //     success:function(json){
      //       $('#alert').show();
      //     },

      // });
    };

          
  });