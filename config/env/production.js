'use strict';
var hostdb=process.env.OPENSHIFT_MONGODB_DB_HOST;
module.exports = {
    db: "mongodb://admin:LtiRSFcQ-Vzy@"+hostdb+":$OPENSHIFT_MONGODB_DB_PORT/kabarwonogiri",
    app: {
        name: ""
    },
    facebook: {
        clientID: "734043306635650",
        clientSecret: "5e778c0972657991f84b69701de8a1cf",
        callbackURL: "http://www.kabarwonogiri.com/auth/facebook/callback"
    },
    twitter: {
        clientID: "TCMcV3614KTiMnbZJWih1NbCU",
        clientSecret: "qHsqktKBL6KHv7T6d32AEybXbvBMZBpkl17nxxB8Pm1Uv99F9U",
        callbackURL: "http://www.kabarwonogiri.com/auth/twitter/callback"
    },
    github: {
        clientID: "APP_ID",
        clientSecret: "APP_SECRET",
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
    google: {
        clientID: "APP_ID",
        clientSecret: "APP_SECRET",
        callbackURL: "http://localhost:3000/auth/google/callback"
    }
}