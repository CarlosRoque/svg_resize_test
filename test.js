var fonts = ["Roboto","Open Sans Condensed","Indie Flower","Pacifico","Shadows Into Light"]
function update_text(text){
  // get SVG
  svg = $("#test");
  // get text element
  svg_text = svg.children("#test_text");
  // update text element use [0] because of jquery?
  svg_text[0].textContent = text;

  // get the selected font
  font = parseInt($('#fonts').val());
  // get the selected size
  size = $('#sizes').val();

  // update details
  svg_text.attr("font-family",fonts[font])
  svg_text.attr("font-size",size)

  box = svg_text[0].getBoundingClientRect()
  svg_text.attr("y",box.height)

}


$(document).ready(function(){
  $('#button').click(function(){
    update_text($('#text').val());
  });
});
