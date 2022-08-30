// var searchData = [];
 let searchData = [
                    "Plant 1",
                    "Plant 2",
                    "Plant 3",
                    "Plant 4",
                    "Plant 5",
                    "Plant 6",
                    "Ice",
                    "Fire",
                    "Air",
                    "Earth",
                    "Dragon",
                    "Simpsons",
                    "Covid Cure",
                ];
export const getData=()=>
{
    return searchData;
}
export const setData=(searchData)=>
{
    searchData=searchData;
}
export const initDropDown = (searchData) => {
    setData(searchData);
    let dropdownInputs = document.querySelectorAll(".search-dropdown");
    dropdownInputs.forEach((input) => {
        input.addEventListener("input", dropdownChange);
        input.addEventListener("click", dropdownInputClick);
    });
}
export const dropdownChange = (e) => {
    dropdownCleanup(e.target.parentNode);
    document.body.addEventListener("click", dropdownClick);
    let value = e.target.value;
    if (value) {
        let optionWords = [];
        getData().forEach((word) => {
            if (word.Title.toLowerCase().includes(value.toLowerCase())) {
                optionWords.push(word);
            }
        });
        if (optionWords) {
            e.target.parentNode.classList.add("open");
            optionWords.sort();
            let inputHeight = e.target.offsetHeight;
            for (let i = 0; i < (10 > optionWords.length ? optionWords.length : 10); i++) {
                let option = document.createElement("div");
                option.setAttribute("class", "option");
                option.innerHTML = optionWords[i];
                option.style.top = `${(i + 1) * inputHeight}px`;
                e.target.parentNode.appendChild(option);
            }
        }
    }
}

export const dropdownInputClick = (e) => {
    if (!e.target.classList.contains("open")) {
        dropdownCleanup(e.target.parentNode);
        document.body.addEventListener("click", dropdownClick);
        let value = e.target.value;
        if (value) {
            let optionWords = [];
            getData().forEach((word) => {
                if (word.Title.toLowerCase().includes(value.toLowerCase())) {
                    optionWords.push(word);
                }
            });
            if (optionWords) {
                e.target.parentNode.classList.add("open");
                optionWords.sort();
                let inputHeight = e.target.offsetHeight;
                for (let i = 0; i < (5 > optionWords.length ? optionWords.length : 5); i++) {
                    let option = document.createElement("div");
                    option.setAttribute("class", "option");
                    option.innerHTML = optionWords[i];
                    option.style.top = `${(i + 1) * inputHeight}px`;
                    e.target.parentNode.appendChild(option);
                }
            }
        }
    }
}


export const dropdownClick = (e) => {
    console.log(e.target);
    let openDropdown = document.querySelector(".search-dropdown.open");
    if (openDropdown && openDropdown.contains(e.target)) {
        if (e.target.classList.contains("option")) {
            openDropdown.querySelector("input[type=text]").value = e.target.innerHTML;
            document.getElementById("product_search_field_pro").value = e.target.innerHTML;
            // $("#product_search_field_pro").val(encodeHtml(e.target.innerHTML)) ;  
            //$("#product_search_field_pro").focus()          
            dropdownCleanup(openDropdown);
        }
    } else {
        dropdownCleanup(openDropdown);
    }
}

export const dropdownCleanup = (dropdown) => {
    let children = dropdown && dropdown.querySelectorAll(".option");
    if (children) {
        children.forEach((child) => {
            child.remove();
        });
        dropdown.classList.remove("open");
        document.body.removeEventListener("click", dropdownClick);
    }
}