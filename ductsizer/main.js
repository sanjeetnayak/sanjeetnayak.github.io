$(document).ready(function(){
    $('.btn-dark').on('click', function () {
      $(".num").val('');
      $("#inlineFormInput-1").val('');
      $("#inlineFormInput-2").val('');
    });

    // Allow at most 2 known inputs so the calculator stays solvable.
    var limit = 2;
    $('input.checkbox').on('click', function () {
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

    // SI <-> US unit toggle
    $('input#togBtn').click(function () {
      if (this.checked == false){
        $(".append").val('1');
        create_post_4();
      }else{
        $(".append").val('0.0393701');
        create_post_3();
      }
    });

    $('#myform').on('submit', function (e) {
      if($('.checkbox:checked').length == 2){
        e.preventDefault();
        if($("#inputDia").prop('disabled') == true ){
          $("#inputDia").val('');
        }
        if($("#inputVel").prop('disabled') == true ){
          $("#inputVel").val('');
        }
        if($("#inputHead").prop('disabled') == true ){
          $("#inputHead").val('');
        }
        if($("#inputFlow").prop('disabled') == true ){
          $("#inputFlow").val('');
        }
        $("#inlineFormInput-1").val('');
        $("#inlineFormInput-2").val('');
      }
    });

    $('.btn-dark').click(function() {
      $('.table').hide();
      $("#inlineFormInput-1").prop('disabled', true);
      $("#inlineFormInput-2").prop('disabled', true);
      clearCalcAlert();
      setResultsPane(false);
    });

    function showCalcAlert(msg) {
      $('#calc-alert').text(msg).prop('hidden', false);
    }
    function clearCalcAlert() {
      $('#calc-alert').prop('hidden', true);
    }

    // Fold the results pane shut until a calculation lands.
    function setResultsPane(open) {
      $('.calc-row').toggleClass('pane-closed', !open);
    }

    $('.forms').click(function() {
      $('.table').hide();
      $("#inlineFormInput-1").val('');
      $("#inlineFormInput-2").val('');
      $("#inlineFormInput-1").prop('disabled', true);
      $("#inlineFormInput-2").prop('disabled', true);
      setResultsPane(false);
    });

    var delay = (function(){
      var timer = 0;
      return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
      };
    })();

    $("#inlineFormInput-1").keyup(function(){
        $("#inlineFormInput-2").val('');
        create_post_2();
    });

    $("#inlineFormInput-2").keyup(function(){
      delay(function(){
        create_post_2();
      }, 1);
    });

    $('#myform').on('submit', function (e) {
      e.preventDefault();
      clearCalcAlert();
      // The backend errors on the flow+diameter branch, so derive the
      // velocity (V = Q/A) and let its working diameter+velocity branch answer.
      if ($("#inputDia").val() !== '' && $("#inputFlow").val() !== '' &&
          $("#inputVel").val() === '' && $("#inputHead").val() === '') {
        var q = parseFloat($("#inputFlow").val());
        var d = parseFloat($("#inputDia").val());
        if ($('.flow-unit option:selected').text() === 'CFM') { q = q / 2.118888; }
        if ($('.dia-unit option:selected').text() === 'IN') { d = d * 25.4; }
        var area = Math.PI * d * d / 4e6; // d in mm -> m²
        forMdata = {"vel":(q / 1000 / area).toFixed(4), "dia":d, "hl":"", "flowrate":""};
      } else {
        forMdata = {"vel":$("#inputVel").val(), "dia":$("#inputDia").val(), "hl":$("#inputHead").val(), "flowrate":$("#inputFlow").val()};
      }
      var formData = JSON.stringify(forMdata);
      $.ajax({
         url: 'https://webcalc-backend.onrender.com/calc/',
         contentType: false,
         data: formData,
         type: 'post',
         success: function (response) {
          clearCalcAlert();
          $('.table').show();
          setResultsPane(true);
          $("#rn").text(response.rn.toFixed(0));
          $("#ff").text(response.ff.toFixed(4));
          $("#fv").text(response.fv.toFixed(2));
          $("#ed").text(response.ed.toFixed(2));
          $("#vp").text(response.vp.toFixed(2));
          $("#hl").text(response.hl.toFixed(3));
          $("#fa1").text(response.fa.toFixed(2));
          $("#inputDia").val(response.dia_new.toFixed(0));
          $("#inputVel").val(response.vel_new.toFixed(2));
          $("#inputHead").val(response.hl_new.toFixed(3));
          $('#inputFlow').val(response.flowrate_new.toFixed(0));
          $("#inlineFormInput-1").prop('disabled', false);
          $("#inlineFormInput-2").prop('disabled', false);
         },
         error: function (response) {
           showCalcAlert(response && response.status === 500
             ? 'The calculator service hit an error (HTTP 500). Try a different pair of inputs, or check the backend.'
             : 'Could not reach the calculator service. Check that the backend is running, then try again.');
         }
      });
   });

    function create_post_2() {
      forMdata = {"vel":$("#inputVel").val(), "dia":$("#inputDia").val(), "hl":$("#inputHead").val(), "flowrate":$("#inputFlow").val(), "dw":$("#inlineFormInput-1").val(), "dh":$("#inlineFormInput-2").val()};
      var formData = JSON.stringify(forMdata);
      $.ajax({
        url: 'https://webcalc-backend.onrender.com/calc/',
        contentType: false,
        data: formData,
        type: 'post',
        success: function (response) {
          clearCalcAlert();
          $("#rn").text(response.rn.toFixed(0));
          $("#ff").text(response.ff.toFixed(4));
          $("#fv").text(response.fv.toFixed(2));
          $("#ed").text(response.ed.toFixed(2));
          $("#vp").text(response.vp.toFixed(2));
          $("#hl").text(response.hl.toFixed(3));
          $("#fa1").text(response.fa.toFixed(2));
          $("#inlineFormInput-2").val(response.dh.toFixed(0));
        },
        error: function () {
          showCalcAlert('The calculator service could not answer — check that the backend is running, then try again.');
        }
      });
    }

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
      $(".fa1+.unit").html("ft<sup>2</sup>");
      $(".vel+.unit").text("fpm");
      $(".vp+.unit").text("in.WC");
      $(".hl+.unit").text("in.WC/100 ft");

      $(".fa1").text((parseFloat($(".fa1").text()) * 10.7639).toFixed(2));
      $(".dia").text((parseFloat($(".dia").text()) * 0.0393701).toFixed(0));
      $(".vel").text((parseFloat($(".vel").text()) * 196.85).toFixed(2));
      $(".vp").text((parseFloat($(".vp").text()) * 0.00401865).toFixed(2));
      $(".hl").text((parseFloat($(".hl").text()) * 0.1225).toFixed(3));
      if($("#inlineFormInput-1").val()!=0 && $(".append").val() == "0.0393701"){
        $("#inlineFormInput-1").val(($("#inlineFormInput-1").val() * 0.0393701).toFixed(2));
        $("#inlineFormInput-2").val(($("#inlineFormInput-2").val() * 0.0393701).toFixed(2));
      }
    }

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
      $(".fa1").text((parseFloat($(".fa1").text()) / 10.7639).toFixed(2));
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
      $(".fa1+.unit").html("m<sup>2</sup>");
      $(".vel+.unit").text("m/sec");
      $(".vp+.unit").text("Pa");
      $(".hl+.unit").text("Pa/m");
    }
  });
