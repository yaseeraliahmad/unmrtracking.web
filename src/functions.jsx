import React,{useState} from 'react';
import { f7 } from 'framework7-react';

export var baseurl="https://unmrtracking-api-main-git-yaseeraliahmadinfo-dev.apps.sandbox-m4.g2pi.p1.openshiftapps.com";
export var role=(localStorage.getItem("role")===null)?[]:JSON.parse(localStorage.getItem("role"));
export function setRole(role1){
    role=(role1===null)?[]:role1;
}
export function formvalidate(d, targetform) {
    try {
        targetform = document.querySelector(targetform);
        Object.keys(d).forEach(function(key) {
            if (d[key].toString().trim() === "" && targetform.querySelectorAll('[name="' + key + '"][required]').length > 0) {
                f7.dialog.alert("Error: Required Input. (At " + targetform.querySelectorAll('[name="' + key + '"]')[0].getAttribute("placeholder") + ")");
                throw "Error.";
            } else if (d[key].toString().trim() !== "" && (targetform.querySelectorAll('[name="' + key + '"]')[0].closest("li").querySelectorAll(".item-input-invalid").length > 0 || targetform.querySelectorAll('[name="' + key + '"]')[0].closest("li.item-input-invalid") !== null)) {
                f7.dialog.alert("Error: " + targetform.querySelectorAll('[name="' + key + '"]')[0].closest("li").querySelector(".item-input-error-message").innerText + " (At " + targetform.querySelectorAll('[name="' + key + '"]')[0].getAttribute("placeholder") + ")");
                throw "Error.";
            }
        });
        return true;
    } catch (e) {
        return false;
    }
}
export async function fetcher(url,body=null,method="post") {
    var params={
        method: method,mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    };
    if(localStorage.getItem("token")!==null){
        params["credentials"]= "include";
        params["headers"]["Authorization"]="Bearer "+localStorage.getItem("token");
    }
    if(!(body===null||["get","delete"].indexOf(method.toLowerCase())!=-1)){
        params={...params,...{body:JSON.stringify(body)}}
    } else if(body===null&&["get","delete"].indexOf(method.toLowerCase())==-1){
        params.method="get";
    }

    var f=await fetch(url, params);
    return f;
}
export const resetdata = () =>{
    setRole(null);
    localStorage.clear();
    f7.views.main.router.navigate("/login/");
}
export const refresh = async () => {
    try{
      fetcher(baseurl+"/api/refresh").then(async(res1)=>{
        var res=await res1.json();
        if(res.value===undefined){
            resetdata();
        }
      }).catch((ex)=>{
        f7.dialog.alert(ex);
      })
    } catch (ex){
      f7.dialog.alert(ex);
    }
};
