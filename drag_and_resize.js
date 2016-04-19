function DragAndResize(options){
  // Require options
  if (!options.container){
    throw 'DragAndResize: constructor missing option "container"';
  }
  // Require options
  if (!options.otherBoxes){
    throw 'DragAndResize: constructor missing option "container"';
  }
  // OPTIONS
  this.eventFacade = new EventFacade({enableDebug: true});

  // mixes options.container into the object
  mix(options, this);

  this.anchor = '<div class="anchor" id="{id}" style="border: 0px solid #999; background-color:#aaa; width: 10px; height:10px; {pos}"></div>';
}

DragAndResize.fn = DragAndResize.prototype;

DragAndResize.prototype.init = function () {
  // init state
  this.box = this.container;
  this.usedAnchor = null;
  this.anchorCursorTop = 0;
  this.anchorCursorLeft = 0;

  this.wireEnableAnchors();

  this.eventFacade.bind('anchor.enabled',this.anchorEnabledCallbak,this);
  this.eventFacade.bind('resize.complete',this.resizeCompleteCallback,this);

};
DragAndResize.fn.wireEnableAnchors = function() {
    // enable anchors on when not present
    this.box.on('click', $.proxy(function(e){
      if (this.getAnchors().length == 0){
        this.removeAnchors();
        this.box.append(this.anchor.replace('{id}', "anchor_br").replace('{pos}', "position: absolute; bottom:0; right:0;"));
        this.eventFacade.trigger('anchor.enabled',"anchor_br");
      }
      e.preventDefault();
    },this));
}
DragAndResize.fn.wireRemoveAnchors = function(){
  // remove anchors on double click
  this.box.on('dblclick', $.proxy(function(e){
    if (this.getAnchors().length > 0){
      this.removeAnchors();
      this.usedAnchor = null;
      this.eventFacade.trigger('anchors.removed');
      e.preventDefault();
    }
  },this));
}
DragAndResize.fn.wireMouseEvents = function(){
  // move the anchor on the entire body and update its position
  this.getBody().on('mousemove', $.proxy(function(e){
    this.moveAnchor(e);
    e.preventDefault();
  },this));

  this.box.delegate('.anchor', 'mousedown', $.proxy(function(e){
    this.setInitAnchor(e);
    anchor = this.usedAnchor.position();
    e.preventDefault();
    this.eventFacade.trigger('resize.start',anchor);
  },this));
  this.box.delegate('.anchor', 'mouseup', $.proxy(function(e){
    data = {
      width: this.usedAnchor.position().left + this.usedAnchor.width() ,
      height: this.usedAnchor.position().top + this.usedAnchor.height()
    };
    this.usedAnchor = null;
    e.preventDefault();
    this.eventFacade.trigger('resize.complete',data);
  },this));
  this.eventFacade.trigger('mouseEvents.enabled');
}
DragAndResize.fn.anchorEnabledCallbak = function(e, data){
  this.wireRemoveAnchors();
  this.wireMouseEvents();
}
DragAndResize.fn.removeAnchors = function () {
  this.box.off('mousedown');
  this.box.off('mouseup');
  this.getBody().off('mousemove');
  this.box.children('.anchor').remove();
};
DragAndResize.fn.setInitAnchor = function (e) {
  this.usedAnchor = $(e.target);
  this.anchorCursorTop = e.pageY - this.box.position().top - this.usedAnchor.position().top;
  this.anchorCursorLeft = e.pageX - this.box.position().left - this.usedAnchor.position().left;
};
DragAndResize.fn.moveAnchor = function (e) {
  if(this.usedAnchor != null) {
    anchor_top = e.pageY - this.box.position().top - this.anchorCursorTop;
    anchor_left = e.pageX - this.box.position().left - this.anchorCursorLeft;

    this.usedAnchor.css('top',anchor_top);
    this.usedAnchor.css('left',anchor_left);

    width = this.usedAnchor.position().left + this.usedAnchor.width();
    height = this.usedAnchor.position().top + this.usedAnchor.height();
    this.box.width(width);
    this.box.height(height);
  }
};
DragAndResize.fn.getAnchors = function(){
  return this.box.children('.anchor');
}
DragAndResize.fn.getBody = function(){
  return $('body');
}
DragAndResize.fn.resizeCompleteCallback = function(e,data){
  $.each(this.otherBoxes, $.proxy(function(index, box){
    box.width(data.width);
    box.height(data.height);
  },this))
}


var box = ''
$(document).ready(function(){
  box = new DragAndResize({container: $("#container"), otherBoxes:[$('#test')]});
  box.init();
});
