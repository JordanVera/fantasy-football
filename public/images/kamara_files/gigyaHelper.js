define("modules/helpers/gigyaHelper",["jquery","md5","sha256","modules/helpers/nflTokenHelper"],function(e,r,n,o){window.md5||(window.md5=r);var t=function(r){var n=e.Deferred(),o={callback:function(e){n.resolve(e)}},t=e.extend({},r,o);return window.gigya.accounts.setAccountInfo(t),n.promise()},s=function(r){var n=e.Deferred();return r.deleteUserData(),r.checkUserStatus().done(function(e){n.resolve(e)}),n.promise()},a=function(){return{options:{ttl:6e4,screens:{accountDetails:"account-details",activate:"activate",editProfile:"edit-profile",changePassword:"gigya-change-password-screen",emailPreferences:"gigya-communication-screen",forgotPassword:"gigya-forgot-password-screen",forgotPasswordSuccess:"gigya-forgot-password-success-screen",signUp:"gigya-register-screen-2",signIn:"gigya-sign-in-screen",resetPassword:"reset-password",resetPasswordSuccess:"reset-password-success"}},skdEnabled:function(){var e=window.gigyaApiKey;return void 0!==e&&0!==e.length},loadSDK:function(){var r=e.Deferred();return window.gigya?r.resolve():window.requireQueue(["gigya"],function(e){r.resolve()}),r.promise()},checkUserStatus:function(){var r=e.Deferred();return a.hasUserDataExpired()?window.gigya.accounts.getAccountInfo({include:"loginIDs, profile, data",callback:function(e){0===e.errorCode?(a.storeUserData(e),o.getFullToken(e).done(function(n){o.storeToken(n),r.resolve(e)})):(a.deleteUserData(),o.getMvpdToken().done(function(n){o.storeToken(n),r.resolve(e)}).fail(function(){r.resolve(e)}))}}):r.resolve({errorCode:0}),r.promise()},setAccountInfo:function(e){return t(e).then(function(){return s(a)})},showScreenSet:function(r){e.isEmptyObject(r)||window.gigya.accounts.showScreenSet(r)},storeUserData:function(r){if(!e.isEmptyObject(r))try{localStorage.setItem("nfl.user",JSON.stringify({data:r.data,gigyaUID:r.UID?r.UID:"",hashedProfileID:r.loginIDs.username?n(r.loginIDs.username):"",hashedEmail:r.loginIDs.emails&&r.loginIDs.emails[0]?n(r.loginIDs.emails[0].toLowerCase()):"",exp:Date.now()+a.options.ttl}))}catch(e){window.console.error('gigyaHelper cannot store "nfl.user" into localStorage')}},hasUserData:function(){return null!==localStorage.getItem("nfl.user")},getUserData:function(){return JSON.parse(localStorage.getItem("nfl.user"))},deleteUserData:function(){localStorage.removeItem("nfl.user")},hasUserDataExpired:function(){if(!a.hasUserData())return!0;var e=a.getUserData();return null===e||!e.hasOwnProperty("exp")||Date.now()>e.exp},logout:function(){var r=e.Deferred();return window.gigya.accounts.logout({callback:function(e){r.resolve(e)}}),r.promise()}}}();return a});
//# sourceMappingURL=gigyaHelper.js.map