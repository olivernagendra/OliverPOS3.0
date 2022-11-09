
exports.key = {
    OP_API_URL: process.env.NODE_ENV == 'development' ? 'https://dev1.app.olivertest.com/api/' : 'https://app.oliverpos.com/api/',
    BRIDGE_DOMAIN: process.env.NODE_ENV == 'development' ? 'https://dev1.shop.olivertest.com/' : 'https://hub.oliverpos.com',
    AUTH_KEY: sessionStorage.getItem("AUTH_KEY"),
    //"posk_3dd80552ca15f4fe59bd42875d618e3ccf560bd6" + ":" +  "poss_5a3f7d8d34dc3605ea5796eda8d6dfcf6cf82254",
    // AUTH_NAME           : "posk_3dd80552ca15f4fe59bd42875d618e3ccf560bd6",
    // AUTH_PWD            : "poss_5a3f7d8d34dc3605ea5796eda8d6dfcf6cf82254",
    ENV: process.env.NODE_ENV,
    PPRODUCT_PAGE_SIZE: 100,
    CUSTOMER_PAGE_SIZE: 50,
    ACTIVITY_PAGE_SIZE: 100,
    FETCH_PRODUCTS_PAGESIZE: 100,
    ONLY_TIME: 'h:mm a',
    MONTH_DAY_FORMAT: 'MMMM,DD YYYY ,h:mm a',
    DATE_FORMAT: 'DD, MMMM YYYY',
    DATETIME_FORMAT: 'DD, MMMM YYYY, h:mm a',
    DATE_FORMAT_SAFARI: 'YYYY-MM-DD',
    DATETIME_FORMAT_SAFARI: 'YYYY-MM-DDTHH:mm:ss',
    TIMEDATE_FORMAT: 'h:mm A DD, MMMM YYYY',
    RECIEPT_IMAGE_DOMAIN: "https://" + (process.env.NODE_ENV == 'production' ? 'app.oliverpos.com' : 'dev1.app.olivertest.com'),
    NOTIFICATION_LIMIT: 100,
    NOTIFICATION_FORMAT: 'DD/MM/YY, h:mm a',
    SYNC_COUNT_LIMIT: 100,
    BUGSNAG_KEY: process.env.NODE_ENV == 'production' ? '1b6822fe1472fcdb1089ae3dbbc58d1c' : process.env.NODE_ENV == 'development' ? '36d2896ab825e64ceeffda1d5840cb4d' : '44dbab7bfa5373855271ad1de88669dc',
    PRODUCT_SEARCH_LENGHT: 2,
    DEMO_USER_PING_INTERVAL: 30000,
    GOOGLE_CLIENT_ID: '868968713299-g32dlt8ib214vh0ukc88bj909cp9cjp9.apps.googleusercontent.com',
    FACEBOOK_CLIENT_ID: "1066839183753303",
    DEMO_USER_NAME: "Demo User",
    OLIVERPOS_CONTACT_LINK: 'https://oliverpos.com/contact-oliver-pos/',
    OLIVERPOS_TUTORIAL_LINK: 'https://youtu.be/EoCdEwfIZww',
    OLIVERPOS_GETTING_STARTED: 'https://oliverpos.com/getting-started/',
    SEGMENT_ANALYTIC_KEY: 'xnSztkKDSndS5XpNN7rrj8sJBvfABbvh',
    FIREBASE_NOTIFICATION_COUNT: 5,
    ALTERNATIVE_PRODUCT_SEARCH_START: 20000, // starting the product searching on alternative input character by this limit
    APPLE_LOGIN_RETURN_URL: window.location.href.includes('qac.sell.oliverpos.com') ? 'https://qac.sell.oliverpos.com/login' : window.location.href.includes('qa1.sell.olivertest.com') ? 'https://qa1.sell.olivertest.com/login' : 'https://sell.oliverpos.com/login'
    //New google tag script has been placed in live branch
    // GA_KEY                  : process.env.ENVIRONMENT=='production'? 'UA-114926859-8':'UA-141287502-1'

}

exports.key_AssigneeType = { Category: 0, SubCategory: 1, Attribute: 2, SubAttribute: 3, Product: 4, Tag: 5 }
exports.key_InputTypes = { TextField: 0, NumberField: 1, RadioButton: 2, CheckBox: 3 }