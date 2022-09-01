document.querySelectorAll(".choose-body-default > .button-container > button.option").forEach((button) => {
	button.addEventListener("click", () => {
		location.href = "./Choose_Location.html";
	});
});

document.getElementById("backButton").addEventListener("click", () => {
	location.href = "./Login.html";
});
