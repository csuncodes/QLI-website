/**
 * @author ISI
 */
$(document).ready(function(){

  var curr_slide = 0;
  var total_slides = parseInt($('#home-slide').attr('alt'));
  var slideshow_timer;

  $("#home-slideshow").hover(function(e){
    $("#slideshow-controls").fadeIn();
    clearInterval(slideshow_timer);
  }, function(){
    $("#slideshow-controls").fadeOut();
    start_slideshow_timer();
  });
  $("#slideshow-controls i").click(function(){
    var dir = '';
    if ( $(this).hasClass('next') ) {
      dir = 'next';
      curr_slide++;
    }
    else {
      dir = 'prev';
      curr_slide--;
    }
    home_page_slideshow(curr_slide, dir);
  });

  function start_slideshow_timer() {
    slideshow_timer = setInterval(function() {
      curr_slide++;
      home_page_slideshow(curr_slide, 'next');
    }, 6000);
  }
  start_slideshow_timer();


  function home_page_slideshow( slide_num, dir ) {
    var output = '', prev_num = 0, next_num = 0;

    if ( slide_num < 0 ) {
      curr_slide = slide_num = total_slides;
      prev_num = curr_slide - 1;
      next_num = 0;
    }
    else if ( slide_num > total_slides ) {
      curr_slide = slide_num = 0;
      prev_num = total_slides;
      next_num = 1;
    }
    else if ( slide_num == total_slides ) {
      prev_num = slide_num - 1;
      next_num = 0;
    }
    else {
      prev_num = slide_num - 1;
      next_num = slide_num + 1;
    }

    $("#" + dir + "-photo").show();
		$("#top-photo").fadeOut(1000, function() {
      $("#top-photo").attr('style', $('#' + dir + '-photo').attr('style'));
      $("#top-photo").html($('#' + dir + '-photo').html());

      // Next slide
      output = '<div class="slide_caption"><h3>' + slides[next_num].title + '</h3><p>' + slides[next_num].caption;
      if (slides[next_num].url !== '') {
        output += '<b><a href="' + slides[next_num].url + '" class="continue">Read More</a></b>';
      }
      output += '</p></div>';
      $("#next-photo").attr('style', 'background-image: url("/images/pictures/slides/' + slides[next_num].photo + '");');
      $('#next-photo').html(output);

      // Previous slide
      output = '<div class="slide_caption"><h3>' + slides[prev_num].title + '</h3><p>' + slides[prev_num].caption;
      if (slides[prev_num].url !== '') {
        output += '<b><a href="' + slides[prev_num].url + '" class="continue">Read More</a></b>';
      }
      output += '</p></div>';
      $("#prev-photo").attr('style', 'background-image: url("/images/pictures/slides/' + slides[prev_num].photo + '");');
      $('#prev-photo').html(output);

      $("#prev-photo").hide();
      $("#next-photo").hide();
    });
  }


  $("#events-subscribe button").click( function() {
    var email     = $("#events-subscribe-email").val();
    var url 		= '/events/isi_seminar_series/subscribe/';
    var frm 		= document.isi_seminar_series;

    if ( email.length === 0 ) {
      $('#isi_events .status').show().html('<span class="error">Please supply a valid email address.</span>');
    }
    else {
      var data_string	= $(frm).serialize();
      $('#events-subscribe').hide();
      $('#isi_events .status').show().html('Subscribing...');

      $.ajax({
        url: url,
        type: 'POST',
        data: data_string,
        dataType: 'json',
        success: function(data) {
          if ( data.status ) {
            $('#isi_events .status').html(data.msg);
            $('#events-subscribe-note').hide();
          }
          else {
            $('#isi_events .status').html('<span class="error">' + data.msg + '</span>');
            $('#events-subscribe').show();
            $('#events-subscribe-email').select();
          }
        },
        error: function(e) {
          console.log(e.message);
        }
      });
    }

    return false;
  });


  $('#isi-seminar-series-subscribe-manage-webform').submit(function() {
    var frm         = '#isi-seminar-series-subscribe-manage-webform';
    var url         = '/events/isi_seminar_series/ajax/manage/';
    var data_string	= $(document.isi_seminar_series_manage).serialize();
    var check_num   = $("#isi-seminar-series-subscribe-manage-webform input[name:topics]:checkbox:checked").length;

    // Unchecked all topics
    if ( check_num === 0 ) {
      if ( !confirm("Are you sure you wish to unsubscribe for all ISI Seminar Series notifications?") ) {
        return false;
      }
    }

    $.ajax({
      url: url,
      type: 'POST',
      data: data_string,
      dataType: 'json',
      success: function(data) {
        if ( data.status === 1 ) {
          $('.message.success').text(data.msg);
          $('.message.success').fadeIn(500, function () {
            setTimeout(function(){
              $('.message.success').fadeOut('slow');
            }, 3000);
          });
        }
        else if ( data.status === 2 ) {
          $(frm).hide();
          $('.intro').text(data.msg);
        }
      },
      error: function(e) {
        console.log(e.message);
      }
    });

    return false;
  });


  $('#isi-seminar-series-subscribe-request-webform').submit(function() {

    var url         = '/events/isi_seminar_series/subscribe/ajax/';
    var data_string	= $(document.isi_seminar_series_subscribe).serialize();

    $('.intro .message').removeClass('error');
    $('.intro .message').show();

    $.ajax({
      url: url,
      type: 'POST',
      data: data_string,
      dataType: 'json',
      success: function(data) {
        if ( data.status === 0 ) {
          $('.intro .message').addClass('error');
          $('.intro .message').html(data.msg);
        }
        else if ( data.status === 1 ) {
          $('#isi-seminar-series-subscribe-request-webform').hide();
          $('.intro .message').addClass('success');
          $('.intro .message').html(data.msg);
        }
      },
      error: function(e) {
        console.log(e.message);
      }
    });

    return false;
  });


  $('#past-event-year').change(function() {
    location.href = '/events/past/' + $(this).val();
  });


  function preload_image(new_img) {
    var cache = [];
    $.preLoadImages = function() {
      var cacheImage = document.createElement('img');
      cacheImage.src = new_img;
      cache.push(cacheImage);
    }
  }

});
