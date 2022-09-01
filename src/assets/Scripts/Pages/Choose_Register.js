document.querySelectorAll(".choose-body-default button").forEach((button) => {
	button.addEventListener("click", (e) => {
		if (e.currentTarget.classList.contains("assigned")) {
			toggleSubwindow("takeover-register");
		} else {
			location.href = "./Open_Register.html"
		}
	});
});

document.getElementById("backButton").addEventListener("click", () => {
	location.href = "./Choose_Location.html";
});

document.getElementById("cancelTakeover").addEventListener("click", () => {
	toggleSubwindow();
});

document.getElementById("takeoverRegister").addEventListener("click", () => {
	// location.href = UNFINISHED
});
