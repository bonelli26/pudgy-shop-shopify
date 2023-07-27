import { gsap } from "gsap";
import { $scroll } from "../_global/_renderer";
import { H } from "../routing";

export const tabSelection = () => {
    if (document.querySelector('.logged-out')) { return; }
    const tabAnchors = document.querySelectorAll('.tab-anchors .tab-anchor');
    const tabs = document.querySelectorAll('.all-tabs .tab');
    gsap.set(tabs, { display: "none" });
    gsap.set(tabs[0], { display: "flex" });
    let activeIdx = 0;

    tabAnchors.forEach((el, i) => {
        el.addEventListener('click', () => {
            if (el.classList.contains('active')) { return; }
            tabAnchors[activeIdx].classList.remove('active');
            activeIdx = i;

            el.classList.add('active');
            gsap.set(tabs, { display: "none" });
            gsap.set(tabs[i], { display: "flex" });
            $scroll.resize();
        });
    });
};

export const prepFormFeedback = () => {
    let submitBtns = document.querySelectorAll('.view-account .submit-block .button');

    submitBtns.forEach((el, i) => {
        el.addEventListener('click', () => {
            el.classList.add('processing');
            el.textContent = "Processing...";
        });
    });
};

export const feedbackReceived = (result, deleteTrigger, deletedForm) => {
    const context = result.context;
    const domain = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
    const processingBtn = document.querySelector('.processing');
    const errorBlock = document.querySelector('.errors');
    const addressErrorBlock = document.querySelector('.address-forms .errors');
    let friendlyErrorMessage = (rawMessage) => {

        let friendlyMessage = "";

        if(Array.isArray(rawMessage)){

            Array.prototype.slice.call(rawMessage).forEach((message, index)=>{

                // if(index !== 0) friendlyMessage += "<br>";

                switch(message.message){
                    case "Resetting password limit exceeded. Please try again later.":
                    case "Creating Customer Limit exceeded. Please try again later.":
                        friendlyMessage += "Please try again later.";
                        break;
                    case "Argument 'email' on InputObject 'CustomerCreateInput' is required. Expected type String!":
                        friendlyMessage += "Please enter an email. ";
                        break;
                    case "Argument 'password' on InputObject 'CustomerCreateInput' is required. Expected type String!":
                        friendlyMessage += "Please enter a password. ";
                        break;
                    case "Could not find customer":
                        friendlyMessage += "Customer not found. ";
                        break;
                    default:

                        if(message.message){
                            friendlyMessage += message.message;
                        } else {
                            friendlyMessage += message;
                        }
                        
                        break;
                }
            });

        } else {

            switch (rawMessage) {
                case "Resetting password limit exceeded. Please try again later.":
                case "Creating Customer Limit exceeded. Please try again later.":
                    friendlyMessage = "Please try again later.";
                    break;

                case "Argument 'password' on InputObject 'CustomerCreateInput' is required. Expected type String!":
                    friendlyMessage = "Please enter a password.";
                    break;
                default:
                    friendlyMessage = rawMessage;
                    break;
            }
        }

        return friendlyMessage;
    };
    let swapUpdatedContent = (context, updatedData) => {
        let html = "";
        switch (context) {
            case "customer-update":
                html += "<p>" + updatedData._firstName_ + " " + updatedData._lastName_ + "</p>";
                html += "<p>" + updatedData._email_ + "</p>";
                document.querySelector('.profile .tab-summary').innerHTML = html;
                document.querySelector('.logged-in-header h1').textContent = updatedData._firstName_;
                break;

            case "address-update":
                html += "<p>{updatedData}</p>";
                break;

        }
    };
    switch (context) {
        case "password-recover":
            if (result.error !== "") {
                processingBtn.textContent = "Recover password";
                processingBtn.classList.remove('processing');
                errorBlock.textContent = friendlyErrorMessage(result.error);
            } else {
                processingBtn.textContent = "Email sent";
                gsap.delayedCall(1, () => {
                    processingBtn.textContent = "Recover password";
                    processingBtn.classList.remove('processing');
                });
            }
            break;
        case "password-reset":
            if (result.error !== "") {
                processingBtn.textContent = "Reset password";
                processingBtn.classList.remove('processing');
                errorBlock.textContent = friendlyErrorMessage(result.error);
            } else {
                processingBtn.textContent = "Success...";
                gsap.delayedCall(1, () => {
                    H.redirect(domain + "/account/login/");
                });
            }
            break;
        case "customer-create":
            if (result.error !== "") {
                processingBtn.textContent = "Save";
                processingBtn.classList.remove('processing');
                errorBlock.textContent = friendlyErrorMessage(result.error);
            } else {
                H.redirect(domain + "/account/login/");
            }
            break;
        case "customer-update":
            if (result.error !== "") {
                processingBtn.textContent = "Save";
                processingBtn.classList.remove('processing');
                errorBlock.textContent = friendlyErrorMessage(result.error);
            } else {
                processingBtn.textContent = "Success";
                // swapUpdatedContent(context, result.updatedData);
                gsap.delayedCall(1, () => {
                    processingBtn.textContent = "Save";
                    processingBtn.classList.remove('processing');
                })
            }
            break;

        case "address-update":
            if (result.error !== "") {
                processingBtn.textContent = "Save";
                processingBtn.classList.remove('processing');
                addressErrorBlock.textContent = friendlyErrorMessage(result.error);
            } else {
                processingBtn.textContent = "Success";
                gsap.delayedCall(1, () => { location.reload(); });
            }

            break;
        case "address-create":
            processingBtn.textContent = "Success...";
            gsap.delayedCall(1, () => { location.reload(); });
            break;
        case "address-delete":
            processingBtn.textContent = "Success...";
            gsap.delayedCall(1, () => { gsap.delayedCall(1, () => { location.reload(); }); });
            break;
    }
};

