

export const toggleSubwindow=(subwindowName = null)=> {
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
export const AddItemType = (arr, n) => {
    const newArry = arr.map((item) => {
        return { ...item, type: n };
    });
    return newArry
}
export const AddAttribute = (arr, _key,value) => {
    const newArry = arr.map((item) => {
        return { ...item, [_key]: value };
    });
    return newArry
}