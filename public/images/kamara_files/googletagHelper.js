define("modules/helpers/googletagHelper",["jquery"],function(e){return function(){var n=window.googletag||{};n.cmd=window.googletag&&window.googletag.cmd?window.googletag.cmd:[];var t=function(){return n&&n.pubads?n.pubads().getSlots()||[]:[]},r=function(){return t().length};return{setTargeting:function(e,o){var a=r();return!!a&&(n.cmd.push(function(){for(var n=t(),r=0;r<a;r++){var i=n[r];i.o.m.match(o)&&(i.clearTargeting(),i.setTargeting(e))}}),!0)},refreshSlot:function(e){var o=r();return!!o&&(n.cmd.push(function(){for(var r=t(),a=0;a<o;a++){var i=r[a],s=i.o.m;n.pubads&&s.match(e)&&n.pubads().refresh([i],{changeCorrelator:!1})}}),!0)},setSlots:function(t){("string"==typeof t||e.isArray(t))&&(t={ids:t,campaignID:"gameDay",size:"leaderboard"});for(var r=[],o=window.gptSlots||[],a=window.adUnit||"",i=window.gptconfig||{},s=0;s<t.ids.length;s++)n.cmd.push(function(e,r){return function(){var s=n.defineSlot(a,i.adSizes,e).setTargeting("slot",t.campaignID).defineSizeMapping(i.responsiveMappings[t.size]).addService(n.pubads());o.push(s),r.push(s)}}(t.ids[s],r));return n.pubads&&n.pubads().refresh(r,{changeCorrelator:!1}),r},destroySlots:function(e){!e||e.length<=0||n.cmd.push(function(){n.destroySlots(e)})},displaySlot:function(e){"string"==typeof e&&n.cmd.push(function(){n.display(e)})},refreshSlotByDivID:function(e){var r=t().filter(function(n){return n.getSlotElementId()===e});r.length&&n.pubads().refresh(r,{changeCorrelator:!1})},clearSlot:function(e){if("string"==typeof e){var o=r();o&&n.cmd.push(function(){for(var r=t(),a=0;a<o;a++){var i=r[a];i.getSlotElementId()===e&&n.pubads().clear([i])}})}}}}()});
//# sourceMappingURL=googletagHelper.js.map