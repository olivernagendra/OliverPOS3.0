export const  initHomeFn=()=>{
    // if (document.querySelector(".subwindow-wrapper")) {
    //     document.querySelector(".subwindow-wrapper").addEventListener("click", (e) => {
    //         if (e.target.classList.contains("subwindow-wrapper")) {
    //             toggleSubwindow();
    //         }
    //     });
    // }
    
    // document.querySelectorAll(".subwindow-wrapper > .subwindow button.close-subwindow").forEach((button) => {
    //     button.addEventListener("click", () => {
    //         toggleSubwindow();
    //     });
    // });
    
    var fakePassword = "111111";
    var currentPassword = "";
    var pinEntries = document.querySelectorAll(".pinpad > .pin-entries > .pin-entry");
    
    document.querySelectorAll(".pinpad > .pin-button-row > button").forEach((button) => {
        button.addEventListener("click", (e) => {
            if (button.classList.contains("backspace")) {
                currentPassword = currentPassword.slice(0, -1);
            } else {
                currentPassword += e.currentTarget.innerHTML;
            }
            if (currentPassword.length == pinEntries.length) {
                if (currentPassword == fakePassword) {
                    //Sign Out
                } else {
                    document.querySelector(".pinpad > .pin-entries").classList.add("incorrect");
                    setTimeout(() => {
                        currentPassword = "";
                        document.querySelector(".pinpad > .pin-entries").classList.remove("incorrect");
                        for (let i = 0; i < pinEntries.length; i++) {
                            if (i < currentPassword.length) {
                                pinEntries[i].classList.add("entered");
                            } else {
                                pinEntries[i].classList.remove("entered");
                            }
                        }
                    }, 300);
                }
            }
            for (let i = 0; i < pinEntries.length; i++) {
                if (i < currentPassword.length) {
                    pinEntries[i].classList.add("entered");
                } else {
                    pinEntries[i].classList.remove("entered");
                }
            }
        });
    });
    
    // --------------------Homepage--------------------
    
    //Tablet Nav Toggle
    if (document.getElementById("navToggle")) {
        document.getElementById("navToggle").addEventListener("click", () => {
            if (document.getElementById("userInfoWrapper")) {
                document.getElementById("userInfoWrapper").classList.add("hidden");
            }
            document.querySelector(".navbar").classList.toggle("open");
            if (document.querySelector(".navbar").classList.contains("open") && document.getElementById("mobileNavToggle")) {
                document.getElementById("mobileNavToggle").classList.add("opened");
            } else if (document.getElementById("mobileNavToggle")) {
                document.getElementById("mobileNavToggle").classList.remove("opened");
            }
        });
    }
    
    //Navbar Open Cover
    if (document.getElementById("navCover")) {
        document.getElementById("navCover").addEventListener("click", () => {
            if (document.getElementById("mobileNavToggle")) {
                document.getElementById("mobileNavToggle").classList.remove("opened");
            }
            document.querySelector(".navbar").classList.remove("open");
        });
    }
    
    //Mobile Nav Toggle
    if (document.getElementById("mobileNavToggle")) {
        document.getElementById("mobileNavToggle").addEventListener("click", (e) => {
            e.currentTarget.classList.toggle("opened");
            document.querySelector(".navbar").classList.toggle("open");
            document.getElementById("linkLauncherWrapper").classList.add("hidden");
            if (document.getElementById("pageOptions")) {
                document.getElementById("pageOptions").classList.add("hidden");
            }
            if (document.getElementById("mobileOptionsButton")) {
                document.getElementById("mobileOptionsButton").classList.remove("filter");
            }
        });
    }
    
    //Tablet App Launcher Button
    // if (document.getElementById("appLauncherButton")) {
    //     document.getElementById("appLauncherButton").addEventListener("click", (e) => {
    //         if (document.getElementById("userInfoWrapper")) {
    //             document.getElementById("userInfoWrapper").classList.add("hidden");
    //         }
    //         document.getElementById("linkLauncherWrapper").classList.add("hidden");
    //         document.getElementById("linkLauncherButton").classList.remove("filter");
    //         document.getElementById("appLauncherWrapper").classList.toggle("hidden");
    //         e.currentTarget.classList.toggle("filter");
    //     });
    // }
    
    //App Launcher Cover
    // if (document.getElementById("appLauncherWrapper")) {
    //     document.getElementById("appLauncherWrapper").addEventListener("click", (e) => {
    //         if (e.target.classList.contains("app-launcher-wrapper")) {
    //             navbarCloseAll();
    //         }
    //     });
    // }
    
    //App Launcher App Buttons
    document.querySelectorAll(".app-launcher > .body > button").forEach((button) => {
        button.addEventListener("click", (e) => {
            navbarCloseAll();
            iframeSetup(e.currentTarget, "./Placeholder_Iframe.html", "Author Name");
            toggleSubwindow("iframe-popup");
        });
    });
    
    //Navbar App Buttons
    document.querySelectorAll(".navbar button.launcher.app").forEach((button) => {
        button.addEventListener("click", (e) => {
            if (document.getElementById("userInfoWrapper")) {
                document.getElementById("userInfoWrapper").classList.add("hidden");
            }
            navbarCloseAll();
            iframeSetup(e.currentTarget, "./Placeholder_Iframe.html", "Author Name");
            toggleSubwindow("iframe-popup");
        });
    });
    
    //Mobile App Launcher
    if (document.getElementById("mobileAppsButton")) {
        document.getElementById("mobileAppsButton").addEventListener("click", () => {
            document.getElementById("appLauncherWrapper").classList.toggle("hidden");
            document.getElementById("pageOptions").classList.add("hidden");
            document.getElementById("mobileOptionsButton").classList.remove("filter");
        });
    }
    
    //Mobile App Launcher Exit Button
    if (document.getElementById("appLauncherExit")) {
        document.getElementById("appLauncherExit").addEventListener("click", () => {
            document.getElementById("appLauncherWrapper").classList.add("hidden");
        });
    }
    
    //Tablet Link Launcher Button
    if (document.getElementById("linkLauncherButton")) {
        document.getElementById("linkLauncherButton").addEventListener("click", (e) => {
            if (document.getElementById("userInfoWrapper")) {
                document.getElementById("userInfoWrapper").classList.add("hidden");
            }
            document.getElementById("appLauncherWrapper").classList.add("hidden");
            document.getElementById("appLauncherButton").classList.remove("filter");
            document.getElementById("linkLauncherWrapper").classList.toggle("hidden");
            e.currentTarget.classList.toggle("filter");
        });
    }
    
    //Link Launcher Cover
    // if (document.getElementById("linkLauncherWrapper")) {
    //     document.getElementById("linkLauncherWrapper").addEventListener("click", (e) => {
    //         if (e.target.classList.contains("link-launcher-wrapper")) {
    //             navbarCloseAll();
    //         }
    //     });
    // }
    
    //Link Launcher Link Buttons
    document.querySelectorAll(".link-launcher > button").forEach((button) => {
        button.addEventListener("click", (e) => {
            navbarCloseAll();
            iframeSetup(e.currentTarget);
            toggleSubwindow("iframe-popup");
        });
    });
    
    //Mobile Link Launcher Exit Button
    if (document.getElementById("linkLauncherExit")) {
        document.getElementById("linkLauncherExit").addEventListener("click", () => {
            document.getElementById("linkLauncherWrapper").classList.add("hidden");
        });
    }
    
    //Mobile Page Options Toggle
    if (document.getElementById("mobileOptionsButton")) {
        document.getElementById("mobileOptionsButton").addEventListener("click", (e) => {
            navbarCloseAll();
            e.currentTarget.classList.toggle("filter");
            document.getElementById("pageOptions").classList.toggle("hidden");
        });
    }
    
    //Page Options Cover
    if (document.getElementById("pageOptions")) {
        document.getElementById("pageOptions").addEventListener("click", (e) => {
            if (e.target.classList.contains("page-options-wrapper")) {
                e.currentTarget.classList.add("hidden");
                document.getElementById("mobileOptionsButton").classList.remove("filter");
            }
        });
    }
    
    // //Tablet User Info Toggle
    // if (document.getElementById("userInfoButton")) {
    //     document.getElementById("userInfoButton").addEventListener("click", () => {
    //         document.getElementById("userInfoWrapper").classList.toggle("hidden");
    //     });
    // }
    
    // //User Info Cover
    // if (document.getElementById("userInfoWrapper")) {
    //     document.getElementById("userInfoWrapper").addEventListener("click", (e) => {
    //         if (e.target.classList.contains("user-info-wrapper")) {
    //             e.currentTarget.classList.add("hidden");
    //         }
    //     });
    // }
    
    //Same As Billing Checkbox
    if (document.getElementById("sameAsBillingCheckbox")) {
        document.getElementById("sameAsBillingCheckbox").addEventListener("change", (e) => {
            if (e.currentTarget.checked) {
                document
                    .getElementById("shippingAddress")
                    .querySelectorAll(".input-row")
                    .forEach((row) => {
                        row.classList.add("hidden");
                    });
            } else {
                document
                    .getElementById("shippingAddress")
                    .querySelectorAll(".input-row")
                    .forEach((row) => {
                        row.classList.remove("hidden");
                    });
            }
        });
    }
    
    //Open Cart Discount
    // if (document.getElementById("addDiscountButton")) {
    //     document.getElementById("addDiscountButton").addEventListener("click", () => {
    //         document.getElementById("pageOptions").classList.add("hidden");
    //         document.getElementById("mobileOptionsButton").classList.remove("filter");
    //         toggleSubwindow("cart-discount");
    //     });
    // }
    
    //Add Tile Buttons
    // document.querySelectorAll(".products > button.add-tile").forEach((button) => {
    //     button.addEventListener("click", () => {
    //         toggleSubwindow("add-tile");
    //     });
    // });
    
    //Add Note Button
    // if (document.getElementById("addNoteButton")) {
    //     document.getElementById("addNoteButton").addEventListener("click", () => {
    //         document.getElementById("pageOptions").classList.add("hidden");
    //         document.getElementById("mobileOptionsButton").classList.remove("filter");
    //         toggleSubwindow("add-order-note");
    //     });
    // }
    
    //Product not found exit
    if (document.getElementById("prodNotFoundExit")) {
        document.getElementById("prodNotFoundExit").addEventListener("click", () => {
            toggleSubwindow();
        });
    }
    
    //Upgrade to Unlock exit
    if (document.getElementById("upgradeToUnlockExit")) {
        document.getElementById("upgradeToUnlockExit").addEventListener("click", () => {
            toggleSubwindow();
        });
    }
    
    //Search Button
    if (document.getElementById("searchButton")) {
        document.getElementById("searchButton").addEventListener("click", () => {
            toggleSubwindow("advanced-search");
        });
    }
    
    //Mobile Search Modifier Toggle
    if (document.getElementById("mobileSearchModToggle")) {
        document.getElementById("mobileSearchModToggle").addEventListener("click", (e) => {
            e.currentTarget.classList.toggle("open");
        });
    }
    
    //Advanced Search radio buttons
    document.querySelectorAll(".subwindow.advanced-search .radio-group input[type=radio]").forEach((input) => {
        input.addEventListener("click", (e) => {
            let dropdownInput = document.getElementById("mobileSearchModToggle");
            dropdownInput.querySelector("p").innerHTML = `<b>Search for:</b> ${e.currentTarget.parentNode.querySelector("p").innerHTML}`;
            dropdownInput.classList.remove("open");
        });
    });
    
    //Sound Notifications Button
    if (document.getElementById("notiSoundOptions")) {
        document.getElementById("notiSoundOptions").addEventListener("click", () => {
            document.getElementById("soundNotificationsWrapper").classList.toggle("hidden");
            document.getElementById("notificationsContent").classList.toggle("no-scroll");
        });
    }
    
    //Sound Notifications Wrapper
    if (document.getElementById("soundNotificationsWrapper")) {
        document.getElementById("soundNotificationsWrapper").addEventListener("click", (e) => {
            if (e.target.classList.contains("sound-notifications-wrapper")) {
                e.currentTarget.classList.add("hidden");
                document.getElementById("notificationsContent").classList.remove("no-scroll");
            }
        });
    }
    
    //Notifications Button
    if (document.getElementById("notificationsButton")) {
        document.getElementById("notificationsButton").addEventListener("click", () => {
            document.getElementById("notificationsWrapper").classList.toggle("hidden");
        });
    }
    
    //Notifications Wrapper
    // if (document.getElementById("notificationsWrapper")) {
    //     document.getElementById("notificationsWrapper").addEventListener("click", (e) => {
    //         if (e.target.classList.contains("notifications-wrapper")) {
    //             e.currentTarget.classList.add("hidden");
    //         }
    //     });
    // }
    
    //Mobile Notifications Exit
    if (document.getElementById("mobileNotiExit")) {
        document.getElementById("mobileNotiExit").addEventListener("click", () => {
            document.getElementById("notificationsWrapper").classList.add("hidden");
        });
    }
    
    //Switch User Popup Button
    if (document.getElementById("switchUserButton")) {
        document.getElementById("switchUserButton").addEventListener("click", () => {
            document.getElementById("userInfoWrapper").classList.add("hidden");
            toggleSubwindow("switch-user");
        });
    }
    
    //End Session Popup Button
    if (document.getElementById("endSessionButton")) {
        document.getElementById("endSessionButton").addEventListener("click", () => {
            document.getElementById("userInfoWrapper").classList.add("hidden");
            toggleSubwindow("end-session");
        });
    }
    
    //End Session Popup Logout Button
    if (document.getElementById("logoutButton")) {
        // document.getElementById("logoutButton").addEventListener("click", () => {
        // 	location.href = "./Close_Register.html";
        // });
    }
    
    function toggleSubwindow(subwindowName = null) {
        // let subwindowWrapper = document.querySelector(".subwindow-wrapper");
        // let currentSubwindow = document.querySelector(".subwindow-wrapper > .subwindow.current");
        // if (subwindowName) {
        //     if (currentSubwindow) {
        //         currentSubwindow.classList.remove("current");
        //     }
        //     subwindowWrapper.classList.remove("hidden");
        //     document.querySelector(`.subwindow-wrapper > .subwindow.${subwindowName}`).classList.add("current");
        // } else {
        //     subwindowWrapper.classList.add("hidden");
        //     if (currentSubwindow) {
        //         currentSubwindow.classList.remove("current");
        //     }
        // }
    }
    
    //Sets up Iframe subwindow, if from link launcher then iframeSRC and author can be left null, if app being loaded then
    //all parameters are needed.
    function iframeSetup(clickedButton, iframeSRC = null, author = null) {
        let iframeContainer = document.getElementById("iframeSubwindow");
        if (clickedButton.parentNode.classList.contains("link-launcher")) {
            if (clickedButton.querySelector("p.style2").innerHTML.slice(0, 3) == "www") {
                iframeContainer.querySelector("iframe").src = "https://" + clickedButton.querySelector("p.style2").innerHTML;
            } else {
                iframeContainer.querySelector("iframe").src = clickedButton.querySelector("p.style2").innerHTML;
            }
            iframeContainer.querySelector("img").src = clickedButton.querySelector("img").src;
            iframeContainer.querySelector("p.style1").innerHTML = clickedButton.querySelector("p.style1").innerHTML;
            iframeContainer.querySelector("p.style2").innerHTML = clickedButton.querySelector("p.style2").innerHTML;
        } else {
            iframeContainer.querySelector("iframe").src = iframeSRC;
            iframeContainer.querySelector("img").src = clickedButton.querySelector("img").src;
            iframeContainer.querySelector("p.style1").innerHTML = clickedButton.querySelector("p").innerHTML;
            iframeContainer.querySelector("p.style2").innerHTML = author;
        }
    }
    
    //Function to close navbar and all related popups
    function navbarCloseAll() {
        document.getElementById("linkLauncherWrapper").classList.add("hidden");
        document.getElementById("linkLauncherButton").classList.remove("filter");
        document.getElementById("appLauncherWrapper").classList.add("hidden");
        document.getElementById("appLauncherButton").classList.remove("filter");
        if (document.getElementById("mobileNavToggle")) {
            document.getElementById("mobileNavToggle").classList.remove("opened");
        }
        document.querySelector(".navbar").classList.remove("open");
    }
    let holdDownTimer,
	hasFired = false,
	currentProductButton = null, //For touch screen
	touchMoved = false;

//Handles Product section buttons for touch devices
//For each button there is a regular touch and then a touch and hold to be able to delete buttons

// document.querySelectorAll(".products > button").forEach((button) => {
// 	//Touch start
// 	button.addEventListener("touchstart", (e) => {
// 		touchMoved = false;
// 		currentProductButton = e.currentTarget;
// 		holdDownTimer = setTimeout(() => {
// 			if (!currentProductButton.classList.contains("add-tile") && !currentProductButton.classList.contains("remove-state")) {
// 				currentProductButton.classList.add("remove-state");
// 				currentProductButton.insertAdjacentHTML(
// 					"beforeend",
// 					`<div class="remove-cover"><div class="remove-button"><img src="../Assets/Images/SVG/X-Icon-DarkBlue.svg" alt=""></div></div>`
// 				);
// 				hasFired = true;
// 			}
// 		}, 1000);
// 	});
// 	//Touch up
// 	button.addEventListener("touchend", (e) => {
// 		clearTimeout(holdDownTimer);
// 		if (!hasFired && !touchMoved) {
// 			if (e.currentTarget.classList.contains("add-tile")) {
// 				toggleSubwindow("add-tile");
// 			} else if (e.currentTarget.classList.contains("product")) {
// 				if (e.currentTarget.classList.contains("remove-state")) {
// 					if (
// 						(e.target.tagName == "IMG" && e.target.parentNode.classList.contains("remove-button")) ||
// 						e.target.classList.contains("remove-button")
// 					) {
// 						e.currentTarget.remove();
// 					}
// 				} else {
// 					//xlocation.href = "./Product.html";
// 				}
// 			} else if (e.currentTarget.classList.contains("category")) {
// 				if (e.currentTarget.classList.contains("remove-state")) {
// 					if (
// 						(e.target.tagName == "IMG" && e.target.parentNode.classList.contains("remove-button")) ||
// 						e.target.classList.contains("remove-button")
// 					) {
// 						e.currentTarget.remove();
// 					}
// 				} else {
// 					console.log("subpage");
// 				}
// 			}
// 		}
// 		hasFired = false;
// 		e.preventDefault();
// 	});

// 	button.addEventListener("touchmove", (e) => {
// 		if (!touchMoved) {
// 			touchMoved = true;
// 		}
// 	});
// });
// document.body.addEventListener("touchstart", (e) => {
// 	if (
// 		!e.targetTouches[0].target.classList.contains("remove-cover") &&
// 		!e.targetTouches[0].target.classList.contains("remove-button") &&
// 		!e.targetTouches[0].target.parentNode.classList.contains("remove-button")
// 	) {
// 		document.querySelectorAll("button.remove-state").forEach((button) => {
// 			button.classList.remove("remove-state");
// 			button.querySelector(".remove-cover").remove();
// 		});
// 	}
// });

//Handles Product section buttons for desktop
//For each button there is a regular click and then a click and hold to be able to delete buttons

// document.querySelectorAll(".products > button").forEach((button) => {
// 	//Mouse down
// 	button.addEventListener("mousedown", (e) => {
// 		currentProductButton = e.currentTarget;
// 		holdDownTimer = setTimeout(() => {
// 			if (!currentProductButton.classList.contains("add-tile") && !currentProductButton.classList.contains("remove-state")) {
// 				currentProductButton.classList.add("remove-state");
// 				currentProductButton.insertAdjacentHTML(
// 					"beforeend",
// 					`<div class="remove-cover"><div class="remove-button"><img src="../../assets/images/svg/X-Icon-DarkBlue.svg" alt=""></div></div>`
// 				);
// 				hasFired = true;
// 			}
// 		}, 1000);
// 	});
// 	//Mouse up
// 	button.addEventListener("mouseup", (e) => {
// 		clearTimeout(holdDownTimer);
// 		if (!hasFired) {
// 			if (e.currentTarget.classList.contains("add-tile")) {
// 				toggleSubwindow("add-tile");
// 			} else if (e.currentTarget.classList.contains("product")) {
// 				if (e.currentTarget.classList.contains("remove-state")) {
// 					if (
// 						(e.target.tagName == "IMG" && e.target.parentNode.classList.contains("remove-button")) ||
// 						e.target.classList.contains("remove-button")
// 					) {
// 						e.currentTarget.remove();
// 					}
// 				} else {
// 					//location.href = "./Product.html";
// 				}
// 			} else if (e.currentTarget.classList.contains("category")) {
// 				if (e.currentTarget.classList.contains("remove-state")) {
// 					if (
// 						(e.target.tagName == "IMG" && e.target.parentNode.classList.contains("remove-button")) ||
// 						e.target.classList.contains("remove-button")
// 					) {
// 						e.currentTarget.remove();
// 					}
// 				} else {
// 					console.log("subpage");
// 				}
// 			}
// 		}
// 		hasFired = false;
// 	});
// 	//Mouse out
// 	button.addEventListener("mouseout", (e) => {
// 		clearTimeout(holdDownTimer);
// 		// e.currentTarget.blur();
// 	});
// });

// document.body.addEventListener("mousedown", (e) => {
// 	if (
// 		!e.target.classList.contains("remove-cover") &&
// 		!e.target.classList.contains("remove-button") &&
// 		!e.target.parentNode.classList.contains("remove-button")
// 	) {
// 		document.querySelectorAll("button.remove-state").forEach((button) => {
// 			button.classList.remove("remove-state");
// 			button.querySelector(".remove-cover").remove();
// 		});
// 	}
// });

}