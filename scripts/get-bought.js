import { getUserData } from "./firebase-backend/firebase.js";

export let getAndSetData = async ({data=null, getDataFromFirebase=true}={}) =>{
    //set it to localstorage to be easier to access
    data = localStorage.getItem("userdatainfirebase");

    if(data !== null){
        data = JSON.parse(data);
    }

    if(getDataFromFirebase){
        data = await getUserData();
        if(data?.bundle == undefined){
            console.log("here...", data, data?.bundle, data?.bundle == undefined);
            localStorage.setItem("userdatainfirebase", JSON.stringify(data));
        }
    }

    console.log(data);

    return data;
}

export let getBought = async (name, fromFirebase=true) => {
    let checkIfBought = async () => {
        let data = await getAndSetData({getDataFromFirebase: false});
        if(data?.bought?.[name]){
            return data.bought[name];
        }
    }

    let disqualifyImpossibilities = async () => {
        if(window.user != null){
            let data = await getAndSetData({getDataFromFirebase: fromFirebase});
            console.log(data, data.bought);
            if(data?.bought == null){
                return false;
            } else{
                return true;
            }
        } else{
            return false;
        }
    }

    console.log("disqualify?");
    if(await disqualifyImpossibilities()){
        return await checkIfBought();
    }

    return false;
}