define("modules/common/gigyaLoggedInChecker",["jquery","modules/iconHelper","modules/helpers/gigyaHelper","addons/services/accountButtonService"],function(e,t,a,r){var o=function(){var i={selector:'[data-value="gigya_sign_in"]'},n=function(t){e.when(a.checkUserStatus()).done(function(e){0===e.errorCode?(l(t),r.renderLogoutButton(t),a.hasUserData()&&c(t,a.getUserData())):o.removeTrackingCookies()}).fail(function(){window.console.log("User is not logged in")})},l=function(a){var o=a.$target.data("custom-properties"),i=o&&o.title?o.title:"",n=o&&o.link?o.link:"/account/",l=t.get("user","medium"),c=e("<a>",{title:i,href:n.concat(r.appendRedirectUrl())});c.attr("aria-label","Open your profile page"),c.html(l),a.$target.replaceWith(c)},c=function(t,a){if(window._satellite&&!e.isEmptyObject(a)){try{a.data&&a.data.league&&a.data.league.favoriteTeams&&a.data.league.favoriteTeams[0]&&o.track("favoriteTeam",a.data.league.favoriteTeams[0])}catch(e){window._satellite.logger.error(e)}try{o.track("gigyaUID",a.gigyaUID)}catch(e){window._satellite.logger.error(e)}try{o.track("hashedEmail",a.hashedEmail)}catch(e){window._satellite.logger.error(e)}try{o.track("hashedProfileID",a.hashedProfileID)}catch(e){window._satellite.logger.error(e)}}};return{init:function(t){var o=this;if(o.options=e.extend(i,t||{}),o.$target=e(o.options.selector),o.$parent=o.$target.parent(),o.$target.length&&a.skdEnabled())return o.$target.attr("href",o.$target.attr("href").concat(r.appendRedirectUrl())),e.when(a.loadSDK()).done(function(){n(o)}),o},track:function(e,t){e.length&&t.length&&window._satellite.cookie.set(e,t,{path:"/",domain:window.location.hostname})},removeTrackingCookies:function(){for(var e=["favoriteTeam","gigyaUID","hashedEmail","hashedProfileID"],t=0;t<e.length;t++){var a=e[t];try{window._satellite.cookie.remove(a)}catch(e){window._satellite.logger.error(e)}}}}}();return o.init({}),o});
//# sourceMappingURL=gigyaLoggedInChecker.js.map