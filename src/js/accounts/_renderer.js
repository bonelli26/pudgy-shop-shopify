import Highway from "@dogstudio/highway";
import { gsap } from "gsap";
import {CustomerAddresses} from "../customer";
import { tabSelection, prepFormFeedback } from "./anims";
import { prepDrawers } from "../_global/anims";
/*
    View Events for Highway

	- Account Page
    - Events are listed in their execution order
-------------------------------------------------- */
class AccountRenderer extends Highway.Renderer{

	onEnter(){
		let customerAddresses = new CustomerAddresses();
	}

	onEnterCompleted(){

		prepDrawers();
		tabSelection();
		prepFormFeedback();

		if (document.querySelector("[data-router-view]").dataset.routerView === "login") {

			let showForgotTrigger = document.getElementById("show-forgot-password"),
				hideForgotTrigger = document.getElementById("hide-forgot-password"),
				loginContent = document.getElementById("login-wrapper"),
				forgotContent = document.getElementById("recover-wrapper");

			showForgotTrigger.addEventListener("click", () => {
				gsap.set(loginContent, { display: "none" });
				gsap.set(forgotContent, { display: "block" });
			});

			hideForgotTrigger.addEventListener("click", () => {
				gsap.set(forgotContent, { display: "none" });
				gsap.set(loginContent, { display: "block" });
			});

		} else {
			let showTriggers = document.querySelectorAll(".show-trigger:not(.prepped)"),
				allContents = document.querySelectorAll(".hide-show-content:not(.prepped)"),
				hideTriggers = document.querySelectorAll(".hide-trigger:not(.prepped)");

			for (let i = 0; i < showTriggers.length; i++) {
				let trigger = showTriggers[i],
					hideTrigger = hideTriggers[i],
					content = allContents[i],
					isOpen = false;

				trigger.classList.add("prepped");
				content.classList.add("prepped");

				trigger.addEventListener("click", () => {
					if (isOpen) {
						isOpen = false;
						gsap.set(content, { display: "none" });
					} else {
						isOpen = true;
						gsap.set(content, { display: "block" });
					}
				});

				hideTrigger.addEventListener("click", () => {

					if (isOpen) {

						isOpen = false;
						gsap.set(content, { display: "none" });
					}
				});

			}
		}
	}

	onLeave(){

	}

	onLeaveCompleted(){

	}
}

export default AccountRenderer;
