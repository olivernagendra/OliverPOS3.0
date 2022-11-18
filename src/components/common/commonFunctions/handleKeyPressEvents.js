import { useNavigate } from "react-router-dom"

export function HandleShortKey(e) {
    const navigate = useNavigate()
    console.log("keyCode", e.keyCode)
    //alert(e.keyCode)
    if (e.keyCode == 173)
        navigate('/home')
    if (e.keyCode == 174)
        navigate('/customers')
    if (e.keyCode == 175)
        navigate('/transactions')
    if (e.keyCode == 255)
        navigate('/cashdrawer')
    // if(e.keyCode==255)
    // //navigate('/cashdrawer') //link lancher
    // if(e.keyCode==116)
    // //navigate('/cashdrawer') //link lancher

    // if (e.keyCode == 76 && e.ctrlKey) {
    //     console.log("keyPress", e.keyCode)
    // }
}

