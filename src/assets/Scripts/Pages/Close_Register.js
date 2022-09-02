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
                document.querySelector("header").classList.add("hidden");
                document.querySelector("main > .step1").classList.add("hidden");
                document.querySelector("main > .step2").classList.remove("hidden");
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

document.getElementById("saveCount").addEventListener("click", () => {
    document.querySelector("main > .step2").classList.add("hidden")
    document.querySelector("main > .step3").classList.remove("hidden")
})

document.getElementById("printReport").addEventListener("click", () => {
    //PRINT REPORT
})

document.getElementById("closeRegister").addEventListener("click", () => {
    //GO SOMEWHERE
})

document.getElementById("cancelButton").addEventListener("click", () => {
    location.href = "./Idle_Register.html"
})