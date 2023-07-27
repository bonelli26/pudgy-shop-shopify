import {gsap, Sine} from "gsap";

export class Klaviyo {
    constructor() {
        this.bindMethods();
    }
    bindMethods() {
        ['addUser']
            .forEach(fn => this[fn] = this[fn].bind(this));
    }
    // checkUser(email) {
    //     let checkWinnerList = new XMLHttpRequest(),
    //         checkConsolationList = new XMLHttpRequest(),
    //         negativeOne = false,
    //         negativeTwo = false;
    //
    //     checkWinnerList.onreadystatechange= () => {
    //         if (checkWinnerList.readyState === 4 && checkWinnerList.status === 200) {
    //             if (checkWinnerList.response !== "{}") {
    //                 let responseObj = JSON.parse(checkWinnerList.response).result;
    //                 if (responseObj.length > 0) {
    //                     clearInterval(interval)
    //
    //                 } else {
    //                     negativeOne = true;
    //                 }
    //             }
    //         }
    //     };
    //
    //     checkConsolationList.onreadystatechange= () => {
    //         if (checkConsolationList.readyState === 4 && checkConsolationList.status === 200) {
    //             if (checkConsolationList.response !== "{}") {
    //
    //                 let responseObj = JSON.parse(checkConsolationList.response).result;
    //                 if (responseObj.length > 0) {
    //                     clearInterval(interval)
    //
    //                 } else {
    //                     negativeTwo = true;
    //                 }
    //             }
    //         }
    //     };
    //
    //     let interval = setInterval(() => {
    //         if (negativeOne && negativeTwo) {
    //             clearInterval(interval);
    //
    //         }
    //     }, 40);
    //
    //     checkWinnerList.open("POST","https://joshkirk.dev/server/klaviyo.php",true);
    //     checkWinnerList.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    //
    //     checkConsolationList.open("POST","https://joshkirk.dev/server/klaviyo.php",true);
    //     checkConsolationList.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    //
    //     checkWinnerList.send("g=Vwsgqd&email="+email+"&checking=true");
    //     checkConsolationList.send("g=SudxFV&email="+email+"&checking=true");
    // }

    addUser(email) {
        let ajax = new XMLHttpRequest();

        ajax.onreadystatechange=function() {
            if (ajax.readyState === 4 && ajax.status === 200) {
                //console.log(ajax.response);
            }
        };

        ajax.open("POST","https://joshkirk.dev/server/klaviyo-supervibe.php",true);
        ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");

        ajax.send("email="+email);
    }
}
