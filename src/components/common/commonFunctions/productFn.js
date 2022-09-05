export const initProuctFn = () => {
   // imageFit([document.getElementById("productImage")])

    //Increment Input
    // document.querySelectorAll(".increment-input").forEach((inputContainer) => {
    //     let buttons = inputContainer.querySelectorAll("button");
    //     buttons &&  buttons[0] && buttons[0].addEventListener("click", (e) => {
    //         let input = e.currentTarget.nextElementSibling;
    //         if (input.value && input.value > 0) {
    //             input.value -= 1;
    //         } else {
    //             input.value = 0;
    //         }
    //     });
    //     buttons &&  buttons[1] && buttons[1].addEventListener("click", (e) => {
    //         let input = e.currentTarget.previousElementSibling;
    //         if (input.value) {
    //             input.value = parseInt(input.value) + 1;
    //         } else {
    //             input.value = 1;
    //         }
    //     });
    // });

    // document.getElementById("clearModsButton") && document.getElementById("clearModsButton").addEventListener("click", () => {
    //     document.querySelectorAll(".mod-product input[type=radio]").forEach((input) => {
    //         input.checked = false;
    //     });
    // });

    document.getElementById("mobileExitProductButton") && document.getElementById("mobileExitProductButton").addEventListener("click", () => {
       // location.href = "./Homepage.html";
    });

    document.getElementById("desktopExitProductButton") &&  document.getElementById("desktopExitProductButton").addEventListener("click", () => {
       // location.href = "./Homepage.html";
    });
}