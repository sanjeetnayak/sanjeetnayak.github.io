$(document).ready(function(){
    // --- Clear / reset button ---
    // .btn-dark is the reset control: wipe every numeric quantity input
    // (.num = flow, head, velocity, diameter) plus the rectangular-duct
    // width (#inlineFormInput-1) and height (#inlineFormInput-2) fields.
    $('.btn-dark').on('click', function () {
      $(".num").val('');
      $("#inlineFormInput-1").val('');
      $("#inlineFormInput-2").val('');
    });

    // --- "Known quantity" checkboxes: cap at 2 selections ---
    // The duct equations have 4 variables (flow, head loss, velocity,
    // diameter). Picking 2 of them makes the system solvable for the other
    // 2, which is what the backend accepts. Any 3rd checkbox click is
    // reverted so the calculation can never be over-determined.
    var limit = 2;
    $('input.checkbox').on('click', function () {
      if ($('.checkbox:checked').length > limit) {
        this.checked = false;
      }
    });

    // --- Checkbox -> input enable/disable ---
    // Each "known quantity" checkbox drives its input pair: the value field
    // (e.g. #inputFlow) and its unit <select> (#inputFlow1). When unchecked,
    // that quantity is an UNKNOWN the backend must solve for, so its fields
    // are cleared and disabled — disabled inputs drop out of the payload.
    // Checking it marks the quantity as known and re-enables typing.
    // `first`=Flow, `second`=Head, `third`=Velocity, `fourth`=Diameter —
    // all four handlers are the identical pattern.
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
    // `second` = Head loss checkbox: same clear/disable-or-enable pattern.
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
    // `third` = Velocity checkbox: same clear/disable-or-enable pattern.
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
    // `fourth` = Diameter checkbox: same clear/disable-or-enable pattern.
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

    // --- SI <-> US (imperial) unit toggle ---
    // #togBtn switches the whole page between metric and US units. The
    // .append element stores the inch<->mm factor (0.0393701) as a
    // "which system is active" flag. Unchecked (default) = SI: US values are
    // converted down via create_post_4(). Checking the toggle = imperial:
    // SI values are converted up via create_post_3(), and the unit
    // dropdowns/labels switch to match.
    $('input#togBtn').click(function () {
      if (this.checked == false){
        $(".append").val('1');
        create_post_4();
      }else{
        $(".append").val('0.0393701');
        create_post_3();
      }
    });

    // --- Form submit (1 of 2): strip unknowns before validation ---
    // When exactly 2 quantities are marked known, stop the browser's default
    // submit (which would reload the page) so the AJAX handler below runs.
    // Any input whose checkbox is unchecked is an unknown the backend solves
    // for — stale values in those fields are wiped so they can't be mistaken
    // for known inputs. Rectangular-duct fields are cleared too, since this
    // path always solves the circular-duct case.
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

    // --- Reset button: tear down any previous result ---
    // Hides the results table, disables the rectangular width/height inputs
    // (they only matter for rectangular-duct mode), clears any visible error
    // alert, and folds the results pane shut.
    $('.btn-dark').click(function() {
      $('.table').hide();
      $("#inlineFormInput-1").prop('disabled', true);
      $("#inlineFormInput-2").prop('disabled', true);
      clearCalcAlert();
      setResultsPane(false);
    });

    // --- Small UI helpers ---
    // showCalcAlert / clearCalcAlert: write an error/notice message into the
    // #calc-alert element and show or hide it (via the hidden attribute,
    // not display). setResultsPane(open): unfold (true) or fold shut (false)
    // the results pane by toggling the 'pane-closed' class on the results
    // row, so the table stays hidden until a calculation actually lands.
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

    // --- Unit conversion helpers: display units <-> SI ---
    // The backend only accepts SI (flow L/s, head Pa/m, velocity m/sec,
    // diameter mm), so every request is sent in SI and every response is
    // SI. toSi() converts one input value from the unit currently shown in
    // a quantity's <select> down to SI; a blank value (an unknown the
    // backend solves for) passes through untouched. toSiRect() does the
    // same for a rectangular duct dimension, which has no <select> — its
    // mode comes from the .append toggle flag. usVal() scales one SI
    // response value up to US when that flag says the page is in US mode.
    // Per quantity, usFactor is the SI->US multiplier (2.118888 L/s->CFM,
    // 0.1225 Pa/m->in.WC/100ft, 196.85 m/sec->fpm, 0.0393701 mm->IN).
    function toSi(val, unitSel, usFactor, usLabel) {
      if (val === '') { return val; }
      return ($(unitSel + ' option:selected').text() === usLabel)
        ? parseFloat(val) / usFactor
        : val;
    }
    function toSiRect(val) {
      if (val === '') { return val; }
      return ($(".append").val() === '0.0393701') ? parseFloat(val) / 0.0393701 : val;
    }
    function usVal(siVal, usFactor) {
      return ($(".append").val() === '0.0393701') ? siVal * usFactor : siVal;
    }

    // --- Unit dropdown interaction ---
    // .forms is the class shared by every unit <select> (flow/head/velocity/
    // diameter) and the number inputs. Clicking one makes any current result
    // stale: the table is hidden, the rectangular width/height are blanked
    // and disabled, and the results pane is folded shut until a new
    // calculation runs.
    $('.forms').click(function() {
      $('.table').hide();
      $("#inlineFormInput-1").val('');
      $("#inlineFormInput-2").val('');
      $("#inlineFormInput-1").prop('disabled', true);
      $("#inlineFormInput-2").prop('disabled', true);
      setResultsPane(false);
    });

    // --- Debounce helper ---
    // delay(fn, ms) runs fn ms after the LAST call. Each invocation cancels
    // the pending timeout first, so rapid bursts of events (e.g. fast typing
    // in the duct-size fields) collapse into a single backend request once
    // the user pauses — avoids hammering the server on every keystroke.
    var delay = (function(){
      var timer = 1;
      return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
      };
    })();

    // --- Rectangular duct: width (#inlineFormInput-1) / height (-2) ---
    // Editing the width clears the height field and immediately recomputes
    // via create_post_2(). Editing the height recomputes too, but debounced
    // by 1ms so consecutive keystrokes coalesce into a single request after
    // the final key.
    $("#inlineFormInput-1").keyup(function(){
        $("#inlineFormInput-2").val('');
      delay(function(){
        create_post_2();
      }, 250);
    });

    $("#inlineFormInput-2").keyup(function(){
      delay(function(){
        create_post_5();
      }, 1);
    });

    // --- Form submit (2 of 2): circular-duct calculation ---
    // The real submit handler: prevents the page reload, clears any stale
    // alert, builds the payload, POSTs it to the backend via AJAX, then
    // fills the results table from the response.
    $('#myform').on('submit', function (e) {
      e.preventDefault();
      clearCalcAlert();
      // The backend errors on the flow+diameter branch, so derive the
      // velocity (V = Q/A) and let its working diameter+velocity branch answer.
      if ($("#inputDia").val() !== '' && $("#inputFlow").val() !== '' &&
          $("#inputVel").val() === '' && $("#inputHead").val() === '') {
        // Normalize flow and diameter to SI: CFM -> L/s (÷2.118888) and
        // inches -> mm (×25.4), then compute the cross-section area
        // (π·d²/4e6, d in mm gives m²) and velocity = Q/A (Q in L/s ÷1000
        // -> m³/s). Sent as the diameter+velocity pair the backend's
        // working branch consumes.
        var q = parseFloat($("#inputFlow").val());
        var d = parseFloat($("#inputDia").val());
        if ($('.flow-unit option:selected').text() === 'CFM') { q = q / 2.118888; }
        if ($('.dia-unit option:selected').text() === 'IN') { d = d * 25.4; }
        var area = Math.PI * d * d / 4e6; // d in mm -> m²
        forMdata = {"vel":(q / 1000 / area).toFixed(4), "dia":d, "hl":"", "flowrate":""};
      } else {
        // Default path: forward the user's values, but the backend is
        // SI-only, so toSi() converts each US-mode quantity to SI first.
        // Disabled (unknown) quantities arrive as "" for the backend to
        // solve for.
        forMdata = {
          "vel": toSi($("#inputVel").val(), '.vel-unit', 196.85, 'fpm'),
          "dia": toSi($("#inputDia").val(), '.dia-unit', 0.0393701, 'IN'),
          "hl": toSi($("#inputHead").val(), '.hl-unit', 0.1225, 'in.WC/100 ft'),
          "flowrate": toSi($("#inputFlow").val(), '.flow-unit', 2.118888, 'CFM')
        };
      }
      var formData = JSON.stringify(forMdata);
      $.ajax({
         url: 'https://webcalc-backend.onrender.com/calc/',
         contentType: false,
         data: formData,
         type: 'post',
         success: function (response) {
          // Backend answered in SI: reveal the table, unfold the results
          // pane, and stamp every result cell — Reynolds number (rn),
          // friction factor (ff), velocity (fv), equivalent diameter (ed),
          // velocity pressure (vp), head loss (hl), flow area (fa1).
          // usVal() scales the SI values to US when the toggle is in US
          // mode. The solved unknowns are written back into their input
          // fields (dia_new / vel_new / hl_new / flowrate_new), and the
          // rectangular-duct fields are re-enabled for the next run.
          clearCalcAlert();
          $('.table').show();
          setResultsPane(true);
          $("#rn").text(response.rn.toFixed(0));
          $("#ff").text(response.ff.toFixed(4));
          $("#fv").text(usVal(response.fv, 196.85).toFixed(2));
          $("#ed").text(usVal(response.ed, 0.0393701).toFixed(2));
          $("#vp").text(usVal(response.vp, 0.00401865).toFixed(2));
          $("#hl").text(usVal(response.hl, 0.1225).toFixed(3));
          $("#fa1").text(usVal(response.fa, 10.7639).toFixed(2));
          $("#inputDia").val(usVal(response.dia_new, 0.0393701).toFixed(0));
          $("#inputVel").val(usVal(response.vel_new, 196.85).toFixed(2));
          $("#inputHead").val(usVal(response.hl_new, 0.1225).toFixed(3));
          $('#inputFlow').val(usVal(response.flowrate_new, 2.118888).toFixed(0));
          $("#inlineFormInput-1").prop('disabled', false);
          $("#inlineFormInput-2").prop('disabled', false);
         },
         error: function (response) {
           // Distinguish a backend crash (HTTP 500) from an unreachable
           // service so the alert can point at the likely cause.
           showCalcAlert(response && response.status === 500
             ? 'The calculator service hit an error (HTTP 500). Try a different pair of inputs, or check the backend.'
             : 'Could not reach the calculator service. Check that the backend is running, then try again.');
         }
      });
   });

    // --- Rectangular-duct calculation (live, on keystroke) ---
    // Adds the rectangular duct's width (dw) and height (dh) to the same
    // payload the circular calculator uses and POSTs it. On success the
    // common result cells are repopulated plus the solved duct height is
    // written back into #inlineFormInput-2 (the width field keeps what the
    // user typed).
    function create_post_2() {
      // Same SI conversion as the circular submit: the four circular
      // quantities via toSi(), the duct dimensions via toSiRect() (no
      // <select>, so mode comes from the toggle flag).
      forMdata = {
        "vel": toSi($("#inputVel").val(), '.vel-unit', 196.85, 'fpm'),
        "dia": toSi($("#inputDia").val(), '.dia-unit', 0.0393701, 'IN'),
        "hl": toSi($("#inputHead").val(), '.hl-unit', 0.1225, 'in.WC/100 ft'),
        "flowrate": toSi($("#inputFlow").val(), '.flow-unit', 2.118888, 'CFM'),
        "dw": toSiRect($("#inlineFormInput-1").val()),
        "dh": toSiRect($("#inlineFormInput-2").val())
      };
      var formData = JSON.stringify(forMdata);
      $.ajax({
        url: 'https://webcalc-backend.onrender.com/calc/',
        contentType: false,
        data: formData,
        type: 'post',
        success: function (response) {
          // Same usVal() display conversion as the circular handler; the
          // solved duct height goes back into #inlineFormInput-2.
          clearCalcAlert();
          $("#rn").text(response.rn.toFixed(0));
          $("#ff").text(response.ff.toFixed(4));
          $("#fv").text(usVal(response.fv, 196.85).toFixed(2));
          $("#ed").text(usVal(response.ed, 0.0393701).toFixed(2));
          $("#vp").text(usVal(response.vp, 0.00401865).toFixed(2));
          $("#hl").text(usVal(response.hl, 0.1225).toFixed(3));
          $("#fa1").text(usVal(response.fa, 10.7639).toFixed(2));
          $("#inlineFormInput-2").val(usVal(response.dh, 0.0393701).toFixed(0));
        },
        error: function () {
          showCalcAlert('The calculator service could not answer — check that the backend is running, then try again.');
        }
      });
    }
function create_post_5() {
      // Same SI conversion as the circular submit: the four circular
      // quantities via toSi(), the duct dimensions via toSiRect() (no
      // <select>, so mode comes from the toggle flag).
      forMdata = {
        "vel": toSi($("#inputVel").val(), '.vel-unit', 196.85, 'fpm'),
        "dia": toSi($("#inputDia").val(), '.dia-unit', 0.0393701, 'IN'),
        "hl": toSi($("#inputHead").val(), '.hl-unit', 0.1225, 'in.WC/100 ft'),
        "flowrate": toSi($("#inputFlow").val(), '.flow-unit', 2.118888, 'CFM'),
        "dw": toSiRect($("#inlineFormInput-1").val()),
        "dh": toSiRect($("#inlineFormInput-2").val())
      };
      var formData = JSON.stringify(forMdata);
      $.ajax({
        url: 'https://webcalc-backend.onrender.com/calc/',
        contentType: false,
        data: formData,
        type: 'post',
        success: function (response) {
          // Same usVal() display conversion as the circular handler; the
          // solved duct height goes back into #inlineFormInput-2.
          clearCalcAlert();
          $("#rn").text(response.rn.toFixed(0));
          $("#ff").text(response.ff.toFixed(4));
          $("#fv").text(usVal(response.fv, 196.85).toFixed(2));
          $("#ed").text(usVal(response.ed, 0.0393701).toFixed(2));
          $("#vp").text(usVal(response.vp, 0.00401865).toFixed(2));
          $("#hl").text(usVal(response.hl, 0.1225).toFixed(3));
          $("#fa1").text(usVal(response.fa, 10.7639).toFixed(2));
        },
        error: function () {
          showCalcAlert('The calculator service could not answer — check that the backend is running, then try again.');
        }
      });
    }
    // --- Convert results from SI to US (imperial) units ---
    // Runs when the unit toggle is switched to imperial. Each input field
    // still holding a metric value is multiplied to its US equivalent
    // (LPS->CFM, Pa/m->in.WC/100ft, m/sec->fpm, MM->IN), the unit dropdowns
    // are moved to their US option, the row labels are reworded (mm->in,
    // m²->ft², Pa->in.WC, ...), and every displayed result is scaled to
    // imperial — including the rectangular width/height (mm -> inches). The
    // .append == '0.0393701' guard stops double-conversion when already in
    // imperial mode.
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

    // --- Convert results from US (imperial) back to SI ---
    // Inverse of create_post_3, run when the toggle returns to metric. US
    // inputs are divided to their SI equivalents (CFM->LPS, in.WC/100ft->
    // Pa/m, fpm->m/sec, IN->MM), unit dropdowns reset to metric, labels are
    // reworded back (in->mm, ft²->m², in.WC->Pa, ...), and all displayed
    // results are scaled down to SI, including the rectangular width/height
    // (inches -> mm). The .append == '1' guard avoids converting a second
    // time while already in metric.
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
