document.getElementById("openRegisterButton").addEventListener("click", () => {
	document.querySelector(".step1").classList.add("hidden");
	document.querySelector(".step2").classList.remove("hidden");
	document.getElementById("logout").classList.add("hidden");
});

document.getElementById("openFloatButton").addEventListener("click", () => {
	document.querySelector(".step2").classList.add("hidden");
	document.querySelector(".step3").classList.remove("hidden");
});

var fakePassword = "123456";
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
				// location.href = UNFINISHED
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

document.getElementById("cancel").addEventListener("click", () => {
	location.href = "./Choose_Register.html"
})

document.getElementById("logout").addEventListener("click", () => {
	document.querySelector(".logout-confirmation-wrapper").classList.remove("hidden");
})

document.getElementById("logoutConfirm").addEventListener("click", () => {
	location.href = "./Login.html"
})

document.getElementById("logoutCancel").addEventListener("click", () => {
	document.querySelector(".logout-confirmation-wrapper").classList.add("hidden");
})
