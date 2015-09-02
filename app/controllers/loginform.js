module.exports = function(url) {
  return 'Anda harus login lebih dahulu',content:'<div class="row">\
            <div class="col-md-6"><a href="/auth/facebook"><img src="/img/icons/facebook.png"></a><a href="/auth/twitter"><img src="/img/icons/twitter.png"></a></div>\
            <div class="col-md-6">\
              <form action="/users/session" method="post" class="signin form-horizontal">\
                <input type="hidden" name="url" value="'+url+'"><div class="control-group">\
                  <label for="email" class="control-label">Email</label>\
                  <div class="controls">\
                    <input id="email" type="text" name="email" placeholder="Email">\
                  </div>\
                </div>\
                <div class="control-group">\
                  <label for="password" class="control-label">Password</label>\
                  <div class="controls">\
                    <input id="password" type="password" name="password" placeholder="Password">\
                  </div>\
                </div>\
                <div class="form-actions">\
                  <button type="submit" class="btn btn-primary">Sign in</button>&nbsp;\
                  or&nbsp;<a href="/signup" class="show-signup">Sign up</a>\
                </div>\
              </form>\
            </div>\
          </div>';
}