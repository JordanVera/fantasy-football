define("modules/sharebar",["jquery","clipboard","facebook","twitter"],function(o,e){var t={selector:".d3-o-share-bar",copyLink:{selector:".d3-o-share-bar__link",tooltipSelector:".d3-o-tooltip",initClipboard:function(t){return function(){o(t.options.copyLink.selector).each(function(){new e(this,{text:function(){return window.location.href}}).on("success",t.options.events.onCopyLinkClick(t))})}}},events:{onFacebookClick:function(o){o.preventDefault(),FB.ui({method:"share",href:window.location.href})},onCopyLinkClick:function(e){return function(t){t.clearSelection();var n=o(t.trigger);n.closest(e.options.copyLink.selector).length&&(n=n.closest(e.options.copyLink.selector)),n.find(e.options.copyLink.tooltipSelector).show().stop(!0,!0).delay(1e3).fadeOut(800)}}}},n=function(){return{options:void 0,$sharebar:void 0,init:function(){var e=this;e.options=o.extend({},t),e.$sharebar=o(e.options.selector);var i=window.location.href;e.$sharebar.find(".d3-o-share-bar__facebook").each(function(){this.setAttribute("href",this.getAttribute("data-href").replace("[currenturl]",i))}),e.$sharebar.find('a[class*="d3-o-share-bar__"]:not(".d3-o-share-bar__facebook")').each(function(){this.setAttribute("href",this.getAttribute("data-href").replace("[currenturl]",encodeURIComponent(i)))}),FB.init({appId:window.fbappid,version:"v2.12",xfbml:!0}),e.$sharebar.find(".d3-o-share-bar__facebook").on("click.share.facebook",e.options.events.onFacebookClick),e.options.copyLink.initClipboard(n)()}}}();return n.init(),n});
//# sourceMappingURL=sharebar.js.map