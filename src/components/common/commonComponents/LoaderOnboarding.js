import React from 'react';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';


const LoaderOnboarding = (props) => {

    var isDemoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
    return (
        <div className="user_login">
            <div className="user__login_header">
                <div className="user_login_container">
                    {/* <img alt="Logo" src="../assets/img/onboarding/logo-2-sm.png" /> */}
                    <img src="../assets/images/logo-dark.svg" alt="" />
                </div>
            </div>
            <div className="user_login_pages">
                <div className="user_login_container">
                    <div className="user_login_row">
                        <div className="user_login_form_wrapper">
                            <div className="user_login_form_wrapper_container">
                                <div className="user_login_form">
                                    <div className="">
                                        <div className="user_login_scroll_in">
                                            <div className="user_login_center">
                                                <div className="user_login_head user_login_join">
                                                    {/* {<h3 className="user_login_head_title">
                                                        {isDemoUser == false ? LocalizedLanguage.pleaseWait
                                                            : (isDemoUser == true || this.props.isDemoUser == true || this.props.isDemoUser == "true") ? LocalizedLanguage.Thankyouforjoiningthemovement
                                                                : ""}
                                                    </h3>
                                                    } */}
                                                    {isDemoUser == false && <h3 className="user_login_head__title">{LocalizedLanguage.loadIndexDBMsg}</h3>}

                                                    <div className="user_login_head_logo">
                                                        <div className="w-100 text-center">

                                                            <svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="120" height="120" viewBox="0 0 400 400" enableBackground="new 0 0 400 400">
                                                                <g>
                                                                    <rect x="249.28" y="156.01" className="st0 ologo-1" width="103.9" height="103.9"></rect>
                                                                    <path id="teal" className="st1 ologo-2" d="M249.28,363.81V259.91h103.9C353.17,317.29,306.66,363.81,249.28,363.81z"></path>
                                                                    <rect id="cyan" x="145.38" y="259.91" className="st2 ologo-3" width="103.9" height="103.89"></rect>
                                                                    <path id="blue" className="st3 ologo-4" d="M41.49,259.91L41.49,259.91h103.9v103.89C88,363.81,41.49,317.29,41.49,259.91z"></path>
                                                                    <rect id="purple" x="41.49" y="156.01" className="st4 ologo-5" width="103.9" height="103.9"></rect>
                                                                    <path id="red" className="st5 ologo-6" d="M41.49,156.01L41.49,156.01c0-57.38,46.52-103.9,103.9-103.9v103.9H41.49z"></path>
                                                                    <rect id="orange" x="145.38" y="52.12" className="st6 ologo-7" width="103.9" height="103.9"></rect>
                                                                    <path id="yellow" className="st7 ologo-8" d="M281.3,123.99V20.09c57.38,0,103.9,46.52,103.9,103.9H281.3z"></path>
                                                                </g>
                                                            </svg>
                                                            <div>
                                                                {
                                                                    props.statusCompleted && props.statusCompleted !== 'NaN' &&
                                                                    <span className=""> {props.statusCompleted > 100 ? 100 : props.statusCompleted}% </span>
                                                                }
                                                                <p className="">{props.statusCompleted >= 100 ? "Completed" : "Loading..."}</p>
                                                            </div>
                                                        </div>                                                    {/* <a href="#">
                                                                    <img src="../assets/img/onboarding/logo-2-sm.png" alt="" />
                                                                </a> */}
                                                    </div>

                                                    {/* {this.props.isDemoUser == true || this.props.isDemoUser == "true" && <h3 className="user_login_head__title">{LocalizedLanguage.LoadingDemo}</h3>} */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )

}

export default LoaderOnboarding;