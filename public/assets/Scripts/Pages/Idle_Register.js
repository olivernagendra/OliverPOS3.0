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

// document.getElementById("closeRegister1").addEventListener("click", () => {
//     location.href = "./Close_Register.html"
// })

// document.getElementById("closeRegister2").addEventListener("click", () => {
//     location.href = "./Close_Register.html"
// })