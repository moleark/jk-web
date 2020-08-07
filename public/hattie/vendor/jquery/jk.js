$(function(){
    $(".dropdown").hover(            
            function() {
                $('.dropdown-menu', this).stop( true, true ).fadeIn("fast");
                $(this).toggleClass('open');
                $('b', this).toggleClass("caret caret-up");                
            },
            function() {
                $('.dropdown-menu', this).stop( true, true ).fadeOut("fast");
                $(this).toggleClass('open');
                $('b', this).toggleClass("caret caret-up");                
            });
    });
    $(document).ready(function(){
        $(".ahover").click(function(){
        $(".stable").slideToggle("1000");
        });
        $(".ahover2").click(function(){
        $(".stable2").slideToggle("1000");
        });
      });