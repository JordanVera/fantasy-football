define("modules/nfl-components/draft-strip",["react","reactDOM"],function(e,t){return function(){"use strict";return{initByElement:function(n){window.requireQueue(["NFLVendor","NFLCommon","DraftStrip"],function(r,i,d){if(d){var a=JSON.parse(n.getAttribute("data-is-club")),o=function(){var e=window.gptconfig||{},t=window.googletag||{};t.cmd=window.googletag.cmd||[];var n=window.adUnit||"",r=[];document.getElementById("adv_draft-strip")&&r.push(t.defineSlot(n,e.adSizes,"adv_draft-strip").setTargeting("slot","draft-strip").defineSizeMapping(e.responsiveMappings["draft-strip"]).addService(t.pubads())),r.length>0&&t.pubads().refresh(r,{changeCorrelator:!1})},s=e.createElement,f=d.default;t.render(s(f,{forge:!0,clubs:a,renderBlings:o}),n)}})}}}()});
//# sourceMappingURL=draft-strip.js.map