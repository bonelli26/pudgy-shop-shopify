import Highway from "@dogstudio/highway";
import { H } from "../routing";
import { AddToCart } from "../_extensions/Shopify/AddToCart";
import {$scroll} from "../_global/_renderer";
import {globalStorage} from "../_global/storage";

/*
    View Events for Highway

	- Products Page
    - Events are listed in their execution order
-------------------------------------------------- */
class ProductsRenderer extends Highway.Renderer{

	onEnter(){
		// console.log("onEnter");
	}

	onEnterCompleted(){
		const loginWrapper = document.getElementById("login-wrapper");
		if (loginWrapper) {
			const loginLink = loginWrapper.querySelector(".form-wrapper a")
			loginLink.addEventListener(("click"), (e) => {
				e.preventDefault()
				console.log(loginLink.href)
				window.location.href = loginLink.href
			})
		}

		window.gtag('event', 'conversion', {
			'send_to': 'AW-10947310670/HOZjCMCvx-cYEM7oiuQo'
		});

		// let reviewsSection = document.querySelector(".junip-product-review");
		// let reviewsScrollTrigger = document.querySelector(".review-overview");
		// reviewsScrollTrigger.addEventListener("click", () => {
		// 	const yPos = reviewsSection.getBoundingClientRect().top + $scroll.data.scrollY - 50;
		// 	$scroll.scrollTo(yPos, 1.4);
		// });
		// Options for the observer (which mutations to observe)
		// const config = { attributes: true, childList: true, subtree: true };
		// let resized = false;
		// Callback function to execute when mutations are observed
		// const callback = (mutationList, observer) => {
		// 	for (const mutation of mutationList) {
		// 		if (mutation.type === 'childList') {
		// 			observer.disconnect();
		// 			if (!resized) {
		// 				if ($scroll) {
		// 					$scroll.resize();
		// 					$scroll.getMarqueeData();
		// 				}
		// 			}
		// 			resized	= true;
		// 		}
		// 	}
		// };

		// Create an observer instance linked to the callback function
		// const observer = new MutationObserver(callback);

		// Start observing the target node for configured mutations
		// observer.observe(reviewsSection, config);


		// const selector = 'fieldset[skio-plan-picker], [id="name"], .product-form__input';
		// Only loads the script if a plan picker is on the page, and only once
		// the main element is hovered over. doesn't load multiple times if there is are multiple plan pickers.
		// Defer loading to reduce load impact
		// const skioUrlEl = document.getElementById("skio-js-url");
		// if (window.skio_plan_picker_script_load === undefined && skioUrlEl) {
		// 	window.skio_plan_picker_script_load = true;
		//
		// 	const script = document.createElement('script');
		// 	script.type = 'text/javascript';
		// 	script.defer = true;
		// 	script.src = skioUrlEl.dataset.url;
		// 	document.head.append(script);
		// }

		// Handling async load of skio-plan-picker.liquid
		// if (window.SkioPlanPickerAutoInit) {
		// 	window.SkioPlanPickerAutoInit();
		// } else {
		// 	document.querySelectorAll(selector).forEach(el => {
		// 		el.addEventListener('mouseover', window.SkioLoadJS);
		// 		el.addEventListener('focus', window.SkioLoadJS, { capture: true });
		// 	});
		// }

	}

	onLeave(){
		// console.log("onLeave");
	}

	onLeaveCompleted(){
		// console.log("onLeaveCompleted");
	}
}

export default ProductsRenderer;
