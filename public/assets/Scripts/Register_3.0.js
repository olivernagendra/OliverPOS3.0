if (document.querySelector(".subwindow-wrapper")) {
	document.querySelector(".subwindow-wrapper").addEventListener("click", (e) => {
		if (e.target.classList.contains("subwindow-wrapper")) {
			toggleSubwindow();
		}
	});
}

document.querySelectorAll(".subwindow-wrapper > .subwindow > .subwindow-header > button.close-subwindow").forEach((button) => {
	button.addEventListener("click", () => {
		toggleSubwindow();
	});
});

function toggleSubwindow(subwindowName = null) {
	let subwindowWrapper = document.querySelector(".subwindow-wrapper");
	let currentSubwindow = document.querySelector(".subwindow-wrapper > .subwindow.current");
	if (subwindowName) {
		if (currentSubwindow) {
			currentSubwindow.classList.remove("current");
		}
		subwindowWrapper.classList.remove("hidden");
		document.querySelector(`.subwindow-wrapper > .subwindow.${subwindowName}`).classList.add("current");
	} else {
		subwindowWrapper.classList.add("hidden");
		if (currentSubwindow) {
			currentSubwindow.classList.remove("current");
		}
	}
}
