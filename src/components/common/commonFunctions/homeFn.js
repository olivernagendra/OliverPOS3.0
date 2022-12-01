import CalendarArrowLeft from '../../../assets/images/svg/CalendarArrowLeft.svg'
export const initHomeFn = () => {
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

    // //App Launcher App Buttons
    // document.querySelectorAll(".app-launcher > .body > button").forEach((button) => {
    //     button.addEventListener("click", (e) => {
    //         navbarCloseAll();
    //         iframeSetup(e.currentTarget, "./Placeholder_Iframe.html", "Author Name");
    //         toggleSubwindow("iframe-popup");
    //     });
    // });

    // //Navbar App Buttons
    // document.querySelectorAll(".navbar button.launcher.app").forEach((button) => {
    //     button.addEventListener("click", (e) => {
    //         if (document.getElementById("userInfoWrapper")) {
    //             document.getElementById("userInfoWrapper").classList.add("hidden");
    //         }
    //         navbarCloseAll();
    //         iframeSetup(e.currentTarget, "./Placeholder_Iframe.html", "Author Name");
    //         toggleSubwindow("iframe-popup");
    //     });
    // });

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
    // if (document.getElementById("linkLauncherButton")) {
    //     document.getElementById("linkLauncherButton").addEventListener("click", (e) => {
    //         if (document.getElementById("userInfoWrapper")) {
    //             document.getElementById("userInfoWrapper").classList.add("hidden");
    //         }
    //         document.getElementById("appLauncherWrapper").classList.add("hidden");
    //         document.getElementById("appLauncherButton").classList.remove("filter");
    //         document.getElementById("linkLauncherWrapper").classList.toggle("hidden");
    //         e.currentTarget.classList.toggle("filter");
    //     });
    // }

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
    // if (document.getElementById("notificationsButton")) {
    //     document.getElementById("notificationsButton").addEventListener("click", () => {
    //         document.getElementById("notificationsWrapper").classList.toggle("hidden");
    //     });
    // }

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
    // let holdDownTimer,
    // hasFired = false,
    // currentProductButton = null, //For touch screen
    // touchMoved = false;

    //Handles Product section buttons for touch devices
    //For each button there is a regular touch and then a touch and hold to be able to delete buttons

    //  document.querySelectorAll(".products > button").forEach((button) => {
    // // 	//Touch start
    // 	button.addEventListener("touchstart", (e) => {
    // 		touchMoved = false;
    // 		currentProductButton = e.currentTarget;
    // 		holdDownTimer = setTimeout(() => {
    // 			if (!currentProductButton.classList.contains("add-tile") && !currentProductButton.classList.contains("remove-state")) {
    // 				currentProductButton.classList.add("remove-state");
    // 				currentProductButton.insertAdjacentHTML(
    // 					"beforeend",
    // 					`<div class="remove-cover"><div class="remove-button"><img src="../../../Assets/Images/SVG/X-Icon-DarkBlue.svg" alt=""></div></div>`
    // 				);
    // 				hasFired = true;
    // 			}
    // 		}, 1000);
    // 	});
    // // 	//Touch up
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


export const calenderInit = () => {
    document.querySelectorAll(".date-selector-wrapper > button").forEach((button) => {
        button.addEventListener("click", (e) => {
            let currentDateSelector = e.currentTarget.parentNode.querySelector(".date-selector");
            let openDateSelector = document.querySelector(".date-selector.open");
            if (openDateSelector) {
                openDateSelector.classList.remove("open");
            }
            if (currentDateSelector != openDateSelector) {
                initCalendarDate(new Date(), currentDateSelector);
                currentDateSelector.classList.add("open");
            }
        });
    });

    let monthTranslate = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    function initCalendarDate(date, dateSelector) {
        dateSelector.innerHTML = `<div class="header-row"><button class="calendar-left"><img src="../../../Assets/Images/SVG/CalendarArrowLeft.svg" alt=""></button><button class="raise-level">${monthTranslate[date.getMonth()]
            } ${date.getFullYear()}</button><button class="calendar-right"><img src="../../../Assets/Images/SVG/CalendarArrowRight.svg" alt=""></button></div><div class="day-row"><div class="day">Su</div><div class="day">Mo</div><div class="day">Tu</div><div class="day">We</div><div class="day">Th</div><div class="day">Fr</div><div class="day">Sa</div></div>`;
        dateSelector.firstElementChild.children[0].addEventListener("click", (e) => {
            let monthYear = e.currentTarget.nextElementSibling.innerHTML.split(" ");
            let monthIndex = monthTranslate.indexOf(monthYear[0]) - 1;
            if (monthIndex == -1) {
                monthIndex = 11;
                monthYear[1]--;
            }
            initCalendarDate(new Date(monthYear[1], monthIndex, 1), e.currentTarget.parentNode.parentNode);
        });
        dateSelector.firstElementChild.children[1].addEventListener("click", (e) => {
            initCalendarMonths(parseInt(e.currentTarget.innerHTML.split(" ")[1]), e.currentTarget.parentNode.parentNode);
        });
        dateSelector.firstElementChild.children[2].addEventListener("click", (e) => {
            let monthYear = e.currentTarget.previousElementSibling.innerHTML.split(" ");
            let monthIndex = monthTranslate.indexOf(monthYear[0]) + 1;
            if (monthIndex == 12) {
                monthIndex = 0;
                monthYear[1]++;
            }
            initCalendarDate(new Date(monthYear[1], monthIndex, 1), e.currentTarget.parentNode.parentNode);
        });
        let daysInCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        let dayIndex = 1;
        let nextMonthIndex = 1;
        let daysInLastMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
        let firstWeekday = new Date(date.getFullYear(), date.getMonth(), 1).getDay() - 1;
        let dateArray = [];
        for (let i = 0; i < 42; i++) {
            if (firstWeekday > -1) {
                dateArray.push(daysInLastMonth - firstWeekday);
                firstWeekday--;
            } else if (dayIndex <= daysInCurrentMonth) {
                dateArray.push(dayIndex);
                dayIndex++;
            } else {
                dateArray.push(nextMonthIndex);
                nextMonthIndex++;
            }
        }
        let isDisabled = true;
        for (let i = 0; i < 6; i++) {
            let dateRow = document.createElement("div");
            dateRow.classList.add("date-row");
            for (let j = 0; j < 7; j++) {
                let cell = document.createElement("button");
                cell.classList.add("cell");
                let dateContent = dateArray[i * 7 + j];
                if (dateContent == 1) {
                    isDisabled = !isDisabled;
                }
                // console.log(dateContent)
                cell.textContent = dateContent;
                cell.disabled = isDisabled;
                cell.addEventListener("click", (e) => {
                    let currentSelector = e.currentTarget.parentNode.parentNode;
                    let monthYear = currentSelector.firstElementChild.children[1].innerHTML.split(" ");
                    let monthIndex = monthTranslate.indexOf(monthYear[0]) + 1;
                    currentSelector.parentNode.querySelector("input").value = `${e.currentTarget.innerHTML.length == 2 ? e.currentTarget.innerHTML : "0" + e.currentTarget.innerHTML
                        }/${monthIndex.toString().length == 2 ? monthIndex : "0" + monthIndex}/${monthYear[1]}`;
                    currentSelector.classList.remove("open");
                });
                dateRow.appendChild(cell);
            }
            dateSelector.appendChild(dateRow);
        }
    }

    function initCalendarMonths(year, dateSelector) {
        dateSelector.innerHTML = `<div class="header-row"><button class="calendar-left"><img src="../../../Assets/Images/SVG/CalendarArrowLeft.svg" alt=""></button><button>${year}</button><button class="calendar-right"><img src="../../../Assets/Images/SVG/CalendarArrowRight.svg" alt=""></button></div><div class="month-row"><button class="cell">January</button><button class="cell">February</button><button class="cell">March</button></div><div class="month-row"><button class="cell">April</button><button class="cell">May</button><button class="cell">June</button></div><div class="month-row"><button class="cell">July</button><button class="cell">August</button><button class="cell">September</button></div><div class="month-row"><button class="cell">October</button><button class="cell">Novemeber</button><button class="cell">December</button></div>`;
        dateSelector.firstElementChild.children[0].addEventListener("click", (e) => {
            e.currentTarget.nextElementSibling.innerHTML = parseInt(e.currentTarget.nextElementSibling.innerHTML) - 1;
        });
        dateSelector.firstElementChild.children[1].addEventListener("click", (e) => {
            initCalendarYears(parseInt(e.currentTarget.innerHTML), e.currentTarget.parentNode.parentNode);
        });
        dateSelector.firstElementChild.children[2].addEventListener("click", (e) => {
            e.currentTarget.previousElementSibling.innerHTML = parseInt(e.currentTarget.previousElementSibling.innerHTML) + 1;
        });
        dateSelector.querySelectorAll(".month-row > button.cell").forEach((button) => {
            button.addEventListener("click", (e) => {
                let dateSelector = e.currentTarget.parentNode.parentNode;
                initCalendarDate(
                    new Date(parseInt(dateSelector.firstElementChild.children[1].innerHTML), monthTranslate.indexOf(e.currentTarget.innerHTML), 1),
                    dateSelector
                );
            });
        });
    }

    function initCalendarYears(startYear, dateSelector) {
        dateSelector.innerHTML = `<div class="header-row"><button class="calendar-left"><img src="../../../Assets/Images/SVG/CalendarArrowLeft.svg" alt=""></button><div>${startYear} - ${startYear + 11
            }</div><button class="calendar-right"><img src="../../../Assets/Images/SVG/CalendarArrowRight.svg" alt=""></button></div><div class="year-row"><button class="cell">${startYear}</button><button class="cell">${startYear + 1
            }</button><button class="cell">${startYear + 2}</button></div><div class="year-row"><button class="cell">${startYear + 3
            }</button><button class="cell">${startYear + 4}</button><button class="cell">${startYear + 5
            }</button></div><div class="year-row"><button class="cell">${startYear + 6}</button><button class="cell">${startYear + 7
            }</button><button class="cell">${startYear + 8}</button></div><div class="year-row"><button class="cell">${startYear + 9
            }</button><button class="cell">${startYear + 10}</button><button class="cell">${startYear + 11}</button></div>`;
        dateSelector.firstElementChild.children[0].addEventListener("click", (e) => {
            initCalendarYears(parseInt(e.currentTarget.nextElementSibling.innerHTML.split(" - ")[0]) - 12, e.currentTarget.parentNode.parentNode);
        });
        dateSelector.firstElementChild.children[2].addEventListener("click", (e) => {
            initCalendarYears(parseInt(e.currentTarget.previousElementSibling.innerHTML.split(" - ")[1]) + 1, e.currentTarget.parentNode.parentNode);
        });
        dateSelector.querySelectorAll(".year-row > button.cell").forEach((button) => {
            button.addEventListener("click", (e) => {
                initCalendarMonths(parseInt(e.currentTarget.innerHTML), e.currentTarget.parentNode.parentNode);
            });
        });
    }

}