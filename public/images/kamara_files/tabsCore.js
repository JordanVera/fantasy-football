define("modules/core/tabsCore",["jquery"],function(e){var t={selector:".d3-o-tabs__wrap",events:{onItemClick:e.noop,onItemKeyUp:e.noop,onTabKeyUp:e.noop,onInit:e.noop,onNavigate:e.noop,onTabClick:function(t,n){var o=e(t.target);o.is("button")||(o=o.closest("button"));var i=e(o.attr("href"));n.events.onItemClick(n,o,i)}}};return function(n){var o=e.extend(!0,{},t,n),i=e(o.selector).not(function(t,n){return"mobile"===e(n).attr("data-device")&&!window.isMobileViewport()}),a=i.find('button[href!=""]').off("click.tabs").on("click.tabs",function(e){o.events.onTabClick(e,o)}).off("keyup.tabs").on("keyup.tabs",function(e){o.events.onTabKeyUp(e,o)}),c=(i.find('button[class$="_prev"]').off("click.tabs").on("click.tabs",function(e){e.direction="prev",o.events.onNavigate(e,o)}),i.find('button[class$="_next"]').off("click.tabs").on("click.tabs",function(e){e.direction="next",o.events.onNavigate(e,o)}),i.find("nav li").off("keyup.tabs.item").on("keyup.tabs.item",function(e){o.events.onItemKeyUp(e,o)}),a.filter('[aria-selected="true"]'));a.filter('[aria-selected="false"]').each(function(){var t=this,n=e(t.getAttribute("href"));n.length&&n.attr("aria-hidden","true").removeClass("d3-is-selected").hide()}),o.events.onInit(c)}});
//# sourceMappingURL=tabsCore.js.map