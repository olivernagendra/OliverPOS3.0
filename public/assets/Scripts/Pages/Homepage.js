//Open Mobile Cart Button
if (document.getElementById("openMobileCart")) {
    document.getElementById("openMobileCart").addEventListener("click", () => {
        document.querySelector(".cart").classList.add("open");
    });
}

//Close Mobile Cart
if (document.getElementById("exitCart")) {
    document.getElementById("exitCart").addEventListener("click", () => {
        document.querySelector(".cart").classList.remove("open");
    });
}