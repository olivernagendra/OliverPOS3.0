import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import imglogo from '../../assets/images/svg/Oliver-Horizontal.svg'
import imgGoogle from '../../assets/images/svg/google-logo.svg'
import imgFaceBook from '../../assets/images/svg/facebook-logo.svg'
import imgApple from '../../assets/images/svg/apple-logo.svg'
import Checkmark from '../../assets/images/svg/Checkmark.svg'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { userLogin, userExternalLogin, GetUserProfileLogin } from '../login/loginSlice';
import STATUSES from "../../constants/apiStatus";
import Config from "../../Config";
import { LoadingModal } from "../common/commonComponents/LoadingModal";
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { useIndexedDB } from 'react-indexed-db';
// import $ from 'jquery'
function Login() {
    var auth2 = ''
    const bridgDomain = "https://hub.oliverpos.com";
    const googleLoginBtn = useRef(null);
    const navigate = useNavigate();
    const [userEmail, setName] = useState("")

    const [password, setPassword] = useState("")
    const [loginError, setLoginError] = useState();

    //Clear index db-----------------------------
    var { clear } = useIndexedDB('products');
    clear().then(() => {
        console.log('All Clear products!');
    });
    var { clear } = useIndexedDB('customers');
    clear().then(() => {
        console.log('All Clear customers!');
    });
    var { clear } = useIndexedDB('modifiers');
    clear().then(() => {
        console.log('All Clear modifiers!');
    });
    //-------------------------------------------

    //It will clear all local storage items
    const clearLocalStorages = () => {
        //localStorage.clear();
        localStorage.removeItem("cloudPrinters");
        localStorage.removeItem("DemoGuid");
        localStorage.removeItem("VisiterUserID");
        localStorage.removeItem("VisiterUserEmail");
        localStorage.removeItem("shopstatus");
        localStorage.removeItem('UserLocations');
        localStorage.removeItem("userId");
        localStorage.removeItem("LANG");
        localStorage.removeItem('AdCusDetail')
        localStorage.removeItem("clientDetail");
        localStorage.removeItem("selectedRegister");
        localStorage.removeItem("RegisterPermissions");
        localStorage.removeItem('user');
        localStorage.removeItem('demoUser');
        localStorage.removeItem('productcount');
        localStorage.removeItem("PRODUCTX_DATA");
        localStorage.removeItem("GET_EXTENTION_FIELD");
        localStorage.removeItem("GroupSaleRecord")


        localStorage.removeItem("shopstatus");
        localStorage.removeItem('UserLocations');
        localStorage.removeItem("userId");
        localStorage.removeItem("LANG");
        localStorage.removeItem('AdCusDetail')
        localStorage.removeItem("clientDetail");
        localStorage.removeItem("selectedRegister");
        localStorage.removeItem("RegisterPermissions");
        localStorage.removeItem('user');
        localStorage.removeItem('demoUser');
        localStorage.removeItem("PRODUCTX_DATA");
        localStorage.removeItem('CART');
        localStorage.removeItem('firebaseStaffName');
        localStorage.removeItem('firebaseSelectedRegisters');

        localStorage.removeItem('pdf_format');
        localStorage.removeItem("CustomerList");
        localStorage.removeItem("FAV_LIST_ARRAY");
        localStorage.removeItem("FAVROUTE_LIST_ARRAY");
        localStorage.removeItem("categorieslist");
        localStorage.removeItem("WarehouseId");
        localStorage.removeItem('DEFAULT_TAX_STATUS');
        localStorage.removeItem('APPLY_DEFAULT_TAX');
        localStorage.removeItem("oliver_refund_order_payments");
    }



    const dispatch = useDispatch();
    const { status, data, error, is_success } = useSelector((state) => state.login)
    console.log("status", status, "data", data, "error", error, "is_success", is_success)
    if (status == STATUSES.IDLE && is_success) {
        navigate('/site')
    }



    const handleKey = (e) => {
        var key = e.which || e.keyCode;
        if (key === 13) {
            this.handleSubmit(e);
        }
    }




    const handleSubmit = (e) => {
        clearLocalStorages();
        if (userEmail && password) {
            setLoginError('');
            // if (this.state.check == false) {  //$('#remember').attr('checked')              

            //     cookies.set('user', '');
            //     cookies.set('pwd', '');
            // }
            dispatch(userLogin({ "email": userEmail, "password": password }))

            // this.state.username = "";
            // this.state.password = "";

        } else {
            if (!userEmail && !password) {
                setLoginError('Email and Password is required');
               // $('#username').focus();
            } else if (!userEmail) {
                setLoginError('Email is required');
                // $('#username').focus();
            } else {
                setLoginError('Password is required');
               // $('#password').focus();
            }
        }
        e.preventDefault();
    }

    const handleUserLogin = () => {
        dispatch(userLogin({ "email": userEmail, "password": password }))

    }
    // const SetErrro = () => useMemo(() => {
    //     //if (status == STATUSES.ERROR) {
    //     setLoginError(error)
    //     // }
    // })
    // if (status == STATUSES.ERROR) {
    //     SetErrro()
    // }
    if (status == STATUSES.IDLE && is_success) {
        var loginRes = data && data.content;
        if (loginRes && loginRes.subscriptions !== undefined && loginRes.subscriptions.length > 0) {
            var userSubscription = loginRes.subscriptions[0];
            userSubscription && sessionStorage.setItem("AUTH_KEY", userSubscription.subscription_detail.client_guid + ":" + userSubscription.subscription_detail.server_token);
            var lang = userSubscription && userSubscription.subscription_permission.language ? userSubscription.subscription_permission.language : 'en';
            localStorage.setItem("LANG", lang);
            localStorage.setItem('sitelist', JSON.stringify(loginRes))
            localStorage.setItem('userId', loginRes.UserId)
            localStorage.setItem("clientDetail", JSON.stringify(userSubscription));
            localStorage.setItem("hasPin", loginRes.HasPin && loginRes.HasPin);
        }
        navigate('/site')
    }



    const handleNameChange = (e) => {
        // console.log("event",e.target.value);
        setName(e.target.value);
    }

    const handlePasswordChange = (e) => {
        // console.log("event",e.target.value);
        setPassword(e.target.value);
    }


    const responseFacebook = (response) => {
        localStorage.removeItem('FGLoginData');
        console.log("responseFacebook", response);
        if (response && response.status !== "unknown") {
            //  this.setState({ isLoginSuccess: "true" })
            localStorage.setItem('FGLoginData', JSON.stringify(response))
            var dob = response && response.birthday ? response.birthday.split('/') : ''
            var formatedDob = dob && dob.length == 3 ? '' + dob[2] + '-' + dob[1] + '-' + dob[0] : ''
            var sendRes = {
                userLoginInfo: {
                    LoginProvider: response && response.graphDomain ? response.graphDomain : "",
                    ProviderKey: response && response.id ? response.id : ""
                },
                DefaultUserName: response && response.name ? response.name : "",
                Email: response && response.email ? response.email : '',
                ClientGuid: "",
                SendAuthToken: response && response.accessToken ? response.accessToken : "",
                ModelName: "",
                DeviceId: "",
                Version: "",
                FirstName: response && response.first_name ? response.first_name : "",
                LastName: response && response.last_name ? response.last_name : "",
                AccessToken: response && response.accessToken ? response.accessToken : "",
                Picture: response && response.picture ? response.picture.data && response.picture.data.url : "",
                Gender: response && response.gender ? response.gender : "",
                PhoneNumber: response && response.phoneNumber ? response.PhoneNumber : '',
                Dob: formatedDob,
                AgeRange: response && response.age_range && response.age_range.min ? response.age_range.min : "",
                // Address: response && response.address ? response.address : "",
                Address: response && response.location && response.location.name ? response.location.name : "",
                CountryName: response && response.country ? response.country : "",
                CityName: response && response.city ? response.city : "",

            }

            CallService(sendRes);
        } else {
            // this.setState({ isLoginSuccess: "false" })
        }
    }

    // call server on the bassis of facbook and google response 
    const CallService = (FGdata) => {
        console.log("FGdata", FGdata)
        dispatch(userExternalLogin(FGdata))
    }

    // get user profile ionformation
    const getProfileDetails = (param) => {
        var data = {
            access_token: param && param.access_token,
            userId: param && param.userLoginInfo.ProviderKey
        }
        dispatch(GetUserProfileLogin(data))


    }



    const componentClicked = () => {
        // this.setState({ isLoginSuccess: "" })
        console.log("componentClicked");
    }

    const responseGoogle = (response) => {
        console.log(response);
    }

    // Life Cycle Method-----------
    useEffect(() => {
        document.addEventListener('AppleIDSignInOnSuccess', (event) => {
            // Handle successful response.
            singInApple();
            console.log("---AppleIDSignInOnSuccess----" + JSON.stringify(event));
        });
        // Listen for authorization failures.
        document.addEventListener('AppleIDSignInOnFailure', (event) => {
            // Handle error.
            console.log("---AppleIDSignInOnFailure---" + event.detail.error);
        });
        //Apple login Listner END

        googleSDK();
        appleLogin();
    })

    //Apple login methods Start
    const appleLogin = () => {
        //let appleConnectLoaded = (AppleID) => {
        //     AppleID.auth.init({
        //         clientId: "sell.oliverpos.com",
        //         scope: 'name email',
        //         state: 'origin:web',
        //         redirectURI: Config.key.APPLE_LOGIN_RETURN_URL,
        //         usePopup: true
        //     });
        //     setTimeout(() => {//To Remove the default apple logo
        //         // $("svg text").text('Sign in with Apple')
        //         // $("svg text").text($("svg text").text().substring(1));
        //         //  $("svg text").removeAttr("textLength");
        //         // $("svg text").css("fontFamily", "Poppins, Helvetica, sans-serif");
        //         //   $("svg text").css("font-size", "0.8rem");           
        //     }, 100);
        // };

        // (function (d, s, cb) {
        //     var js, fjs = d.getElementsByTagName(s)[0];
        //     js = d.createElement(s);
        //     js.src = "//appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
        //     fjs.parentNode.insertBefore(js, fjs);
        //     js.addEventListener("load", () => cb(AppleID));
        // }(document, 'script', appleConnectLoaded));
    }





    const googleSDK = () => {
        // this.setState({ isLoginSuccess: "" })
        window['googleSDKLoaded'] = () => {
            window['gapi'].load('auth2', () => {
                auth2 = window['gapi'].auth2.init({
                    client_id: Config.key.GOOGLE_CLIENT_ID,
                    cookiepolicy: 'single_host_origin',
                    scope: 'openid profile email https://www.googleapis.com/auth/user.addresses.read https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/profile.agerange.read https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read',
                    include_granted_scopes: true
                    // access_type:"offline",
                    // response_type:"code"
                });
                prepareGoogleLoginButton();
            });
        }

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'google-jssdk'));

    }

    const prepareGoogleLoginButton = () => {
        localStorage.removeItem('FGLoginData');
        // console.log('------ref-----------', googleLoginBtn.current);
        auth2.attachClickHandler(googleLoginBtn.current, {},
            (googleUser) => {
                localStorage.setItem('FGLoginData', JSON.stringify(googleUser));
                var profile = googleUser.getBasicProfile();
                console.log("profile", profile);
                console.log('Token || ' + googleUser.getAuthResponse().id_token);
                console.log('ID: ' + profile.getId());
                console.log('Name: ' + profile.getName());
                console.log('Image URL: ' + profile.getImageUrl());
                console.log('Email: ' + profile.getEmail());
                // console.log("Birthday: " + profile.getBirthday());
                //YOUR CODE HERE           
                if (googleUser) {
                    var sendRes = {
                        userLoginInfo: {
                            LoginProvider: "google",
                            ProviderKey: profile && profile.getId() ? profile.getId() : ""
                        },
                        DefaultUserName: profile && profile.getName() ? profile.getName() : "",
                        Email: profile && profile.getEmail() ? profile.getEmail() : '',
                        ClientGuid: "",
                        SendAuthToken: googleUser && googleUser.getAuthResponse() && googleUser.getAuthResponse().id_token ? googleUser.getAuthResponse().id_token : "",
                        access_token: googleUser && googleUser.getAuthResponse() && googleUser.getAuthResponse().access_token ? googleUser.getAuthResponse().access_token : "",
                        ModelName: "",
                        DeviceId: "",
                        Version: "",
                        // FirstName: profile.getGivenName(),
                        // LastName: profile.getFamilyName(),
                        FirstName: '',
                        LastName: "",
                        Id: "",
                        picture: '',
                        Gender: '',
                        PhoneNumber: '',
                        Dob: '',
                        AgeRange: ''
                    }
                    //  this.setState({ userRes: sendRes })
                    getProfileDetails(sendRes)

                }

            }, (error) => {
                // this.setState({ isLoginSuccess: "false" })
                // alert(JSON.stringify(error, undefined, 2));
            });

    }

    const singInApple = async () => {
        try {
            const response = await window.AppleID.auth.signIn();
            if (response != null && typeof response != "undefined") {
                localStorage.removeItem('FGLoginData');
                localStorage.setItem('FGLoginData', JSON.stringify(response));
                console.log("successful login with apple--" + JSON.stringify(response))
                var code = '';
                var id_token = '';
                var state = '';
                var fname = '';
                var lname = '';
                var email = '';
                if (response.authorization && typeof response.authorization != "undefined") {
                    code = response.authorization.code;
                    id_token = response.authorization.id_token;
                    state = response.authorization.state;
                }
                if (response.user && typeof response.user != "undefined" && response.user.name && response.user.email) {
                    fname = response.user.name.firstName;
                    lname = response.user.name.lastName;
                    email = response.user.email;
                }
                if (id_token != "") {
                    var _data = parseJwt(id_token);
                    if (_data != null && _data.email) {
                        email = _data.email;
                    }
                }
                var data = {
                    FirstName: fname,
                    LastName: lname,
                    Email: email,
                    Id: '',
                    picture: '',
                    Gender: '',
                    Dob: '',
                    AgeRange: '',
                    Address: '',
                    AccessToken: id_token,
                    userLoginInfo: {
                        LoginProvider: "apple",
                        ProviderKey: ""
                    },
                    DefaultUserName: '',
                    PhoneNumber: '',
                    ClientGuid: '',
                    SendAuthToken: id_token != '' ? true : false,
                    ModelName: '',
                    DeviceId: '',
                    Version: '',
                    CountryName: '',
                    CityName: ''
                }
                CallService(data);

            }
        }
        catch (error) {
            console.log("---singInApple---catch--");
            // Handle error.
        }
    };

    const parseJwt = (token) => {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    };


    const handleSignInClick = () => {
        window.location = bridgDomain + '/Account/Register';
    }

    // if (status == STATUSES.LOADING) {
    //     return <div> Loading... </div>
    // }
    var _error = loginError != "" ? loginError : error !== "" ? error : "";
    return (
        <React.Fragment>{status == STATUSES.LOADING ? <LoadingModal></LoadingModal> : null}
            <div className="login-wrapper">
                <div className="auto-margin-top"></div>
                {/* counter: {counter} */}
                <img src={imglogo} />
                <p >Sign in to your Oliver POS Account</p>
                {/* {error !== "" && <div className="danger">{error} </div>} */}
                {(_error !== "") &&
                    <div className="error">
                        {_error}
                    </div>}
                <form className="login-form">
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" placeholder="Enter Email" onKeyDown={handleKey} onChange={(e) => handleNameChange(e)} />
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="Enter Password" onKeyDown={handleKey} onChange={(e) => handlePasswordChange(e)} />
                    <div className="row">
                        <a href={bridgDomain + "/Account/ForgotPassword?_refrence=sell"} >Forgot your Password?</a>
                        <label className="custom-checkbox-wrapper">
                            <input type="checkbox" />
                            <div className="custom-checkbox">
                                <img src={Checkmark} alt="" />
                            </div>
                            Remember Me?
                        </label>
                    </div>
                    <button type="button" onClick={handleSubmit} onKeyDown={handleKey}>{LocalizedLanguage.signin}</button>
                </form>
                <div className="or-row">
                    <div className="divider"></div>
                    <p>OR</p>
                    <div className="divider"></div>
                </div>
                <button id="googleButton" ref={googleLoginBtn} type="submit"   >
                    <div className="img-container">
                        <img src={imgGoogle} alt="" />

                    </div>
                    Sign in with Google

                </button>


                {/* <GoogleLogin
            clientId={Config.key.FACEBOOK_CLIENT_ID}
            buttonText=" Sign in with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
        /> */}


                <button id="facebookButton">
                    <div className="img-container">
                        <img src={imgFaceBook} alt="" />
                    </div>
                    <FacebookLogin cssClass="btn user_login_fb_on"
                        appId={Config.key.FACEBOOK_CLIENT_ID}
                        autoLoad={false}
                        fields="first_name, last_name,name,email"
                        scope="public_profile, email"
                        onClick={componentClicked}
                        callback={responseFacebook}
                        textButton="Sign in with Facebook"

                    />


                </button>


                <button type="submit" id="appleid-signin" title="Log in using your Apple account"
                    data-color="black" data-mode="center-align" data-height="40" data-border="true" data-type="sign-in" data-border-radius="4"
                    className="appleButton">
                    <div className="img-container" >
                        <img src={imgApple} alt="" />
                    </div>
                    Sign in with Apple
                </button>

                <div className="row">
                    <p>Don't have an account?</p>
                    <a href="#" onClick={() => handleSignInClick()} >Sign up Now!</a>
                </div>
                <div className="auto-margin-bottom"></div>

            </div></React.Fragment>
    )
};

export default Login;