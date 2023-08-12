import {globalStorage} from "./storage";
import {$scroll} from "./_renderer";
import {
	Marquees,
	prepSliders,
	prepDrawers,
	prepModals,
	prepTabs,
	newTabs,
	filterTabs,
	prepVideos,
	seeMore
} from "./anims";
import {gsap} from "gsap";
import * as serialize from "form-serialize";
import {GlobalLazyLoadWorker} from "../_worker/GlobalLazyLoadWorker";
import { subscribe } from "klaviyo-subscribe";
/*
 	Store any predefined global functions in here,
	useful for rewriting your favorite jquery function
	into a vanilla JS function.

-------------------------------------------------- */

/*
 	Get viewport
-------------------------------------------------- */
export const getViewport = function(){

	let e = window, a = "inner";

	if(!("innerWidth" in window)){
		a = "client";
		e = document.documentElement || document.body;
	}

	return { width: e[ a + "Width" ], height: e[ a + "Height" ] };
};

/*
 	Remove from array
-------------------------------------------------- */
export const remove = (array, key)=>{
	return array.filter(e => e !== key);
};

/*
	Analytics Helpers

-------------------------------------------------- */
/* global fbq analytics ga */
export const tracking = (type, var1 = null, var2 = null, var3 = null, var4 = null)=>{

	// console.log(type, var1, var2, var3);

	switch(type){
		case "facebook":

			if(typeof fbq === "undefined"){
				// Pixel not loaded
				console.log("FB not initialized");
			} else {

				if(var3){
					fbq(var1, var2, var3);
				} else if(var4) {
					fbq(var1, var2, var3, var4);
				} else {
					fbq(var1, var2);
				}
			}

			break;

		case "segment":

			if(typeof analytics === "undefined"){
				// Segment not loaded
				console.log("Segment not initialized");
			} else {

				switch(var1){
					case "track":

						// analytics.track(event, [properties], [options]);
						if(var4){
							analytics.track(var2, var3, var4);
						} else {
							analytics.track(var2, var3);
						}

						break;

					case "page":
						/* falls through */
					default:

						analytics.page();

						break;
				}
			}

			break;

		case "google":
			/* falls through */
		default:

			if(typeof ga === "undefined"){
				// GA not initialized
				console.log("GA not initialized");
			} else {

				if(var3){
					ga(var1, var2, var3);
				} else if(var4) {
					ga(var1, var2, var3, var4);
				} else {
					ga(var1, var2);
				}
			}

			break;
	}
};
const clearError = (elem)=>{

	let label = elem.previousElementSibling;

	if(!label || label === undefined){
		label = elem.nextElementSibling;
	}

	let placeholder = elem.getAttribute("placeholder");

	if(label.tagName.toLowerCase() == "label"){

		label.textContent = placeholder;
		label.classList.remove("error");
	}

	elem.parentElement.classList.remove("error");
};

const errorHandle = (elem, msg)=>{

	let label = elem.previousElementSibling;

	if(!label || label === undefined){
		label = elem.nextElementSibling;
	}

	if(label.tagName.toLowerCase() == "label"){
		label.textContent = msg;
		label.className += " error";
	}

	elem.parentElement.classList.add("error");
};
/*
 	Form Validation
-------------------------------------------------- */
const formValidation = (form)=>{

	let isValid = true;
	let passwordField = form.querySelector(".password");
	if (passwordField.value !== "") {
		return false;
	}
	let validate = form.querySelectorAll(".validate");


	validate.forEach((field)=>{

		// Clear Errors
		clearError(field);

		let type  = field.getAttribute("type");
		let tag   = field.tagName;
		let name  = field.getAttribute("name");
		let val   = field.value;

		// Account for Textarea
		if(tag == "textarea"){
			type = "textarea";
		}

		// Switch through Types
		switch(type){

			case "password":

				if(name == "customer[password_confirmation]"){

					let origElem = form.querySelectorAll("input[type='password']");
					let	origPass = origElem[0].value;

					// Check if Passwords Do Not Match
					if(origPass !== val){

						errorHandle(field, "Password's Do Not Match");

						isValid = false;
					}
				}

				// Check Password Length
				if(val.length < 5){

					errorHandle(field, "Your Password Must Be At Least 5 Characters");

					isValid = false;
				}

				break;

			case "text":
			case "textarea":

				if(val === ""){

					errorHandle(field, field.placeholder + " Can Not Be Blank");

					isValid = false;
				}

				break;

			case "email":

				let emailReg = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

				if(val === "" || !(val).match(emailReg)){
					errorHandle(field, "Please enter a valid email");

					isValid = false;
				}

				break;

			default:

				break;
		}
	});

	return isValid;
};


export const beforeScroll = () => {
	new Marquees();
	newTabs();
	filterTabs();
	prepTabs();
	prepDrawers();
	prepVideos();
	// seeMore();
	prepModals(document.querySelectorAll(".modal-trigger"));
	globalStorage.windowWidth = getViewport().width;
};

export const afterScroll = () => {
	prepSliders();
	//optionsToggle();
	$scroll.playPauseMarquees(true);
	$scroll.checkScrollBasedLoadins(true);
	bindGorgiasForms();
	bindKlaviyoForms();
	filterPosts();
	const videowiseSection = document.getElementById("videowise-section")
	if (videowiseSection) {
		let cachescript = document.getElementById("__st")
		if (cachescript) {
			cachescript.remove()
		}
		if (window.initVideowise && typeof window.initVideowise === "function") {
			window.initVideowise()
		}
	}
	const placeReviewInt = setInterval(() => {
		if (globalStorage.reviewOverviews.length > 0 && globalStorage.allReviewsOverview !== "") {
			clearInterval(placeReviewInt);
			placeReviewOverviews();
		}
	}, 30);
};

export const filterPosts = () => {
	const allTags = document.querySelectorAll(".blog-tag");
	const allTiles = document.querySelectorAll(".blog-parent-body .article-tile:not(.dummy)");
	const allTilesSection = document.querySelector(".blog-parent-body");
	for (let i = 0; i < allTags.length; i++) {
		let el = allTags[i],
			associatedTiles = el.dataset.tiles === 'all' ? allTiles : document.querySelectorAll('[data-tag="'+ el.dataset.tiles +'"]');

		el.addEventListener("click", () => {
			if (el.classList.contains("active")) { return; }
			document.querySelector(".blog-tag.active").classList.remove('active');
			el.classList.add("active");

			gsap.to(allTiles, { autoAlpha: 0, duration: 0.3, force3D: true, ease: "sine.inOut", onComplete: () => {
					gsap.set(allTiles, { display: 'none' });
					gsap.set(associatedTiles, { display: 'flex' });
					gsap.to(associatedTiles, { autoAlpha: 1, force3D: true, duration: 0.3, ease: "sine.inOut" });
				}
			});

			const yPos = allTilesSection.getBoundingClientRect().top + $scroll.data.scrollY - 150;
			$scroll.scrollTo(yPos, 0.7);
		});
	}
};

export const bindGorgiasForms = () => {
	const gorgiasForms = document.querySelectorAll(".bind-gorgias:not(.bound)");

	for (let i = 0; i < gorgiasForms.length; i++) {
		let form = gorgiasForms[i];
		form.classList.add("bound");
		let submittedOnce = false;
		form.addEventListener("submit", (event)=>{
			event.preventDefault();
			if (submittedOnce) { return }
			submittedOnce = true;
			gsap.to(document.querySelectorAll(".form-fade-el"), { autoAlpha: 0, duration: 0.3, ease: "sine.inOut" });
			gsap.to(form.querySelector(".success-content"), { autoAlpha: 1, duration: 0.25, delay: 0.3, ease: "sine.inOut" });

			let ajax = new XMLHttpRequest(),
				name = form.querySelector("#name").value,
				email = form.querySelector("#email").value,
				subject = form.classList.contains("wholesale") ? "Wholesale request" : form.querySelector("#subject").value,
				message = form.querySelector("#message").value;

			ajax.onreadystatechange = () => {
				if (ajax.readyState === 4 && ajax.status === 200) {
					// console.log(ajax.response);
				}
			};

			ajax.open("POST","https://joshkirk.dev/server/gorgias-ticket-sweet-dreams.php",true);
			ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");

			ajax.send("name="+name+"&email="+email+"&subject="+subject+"&message="+message);
		});

	}
};

export const bindKlaviyoForms = () => {
	const forms = document.querySelectorAll(".bind-form:not(.bound)");
	for (let i = 0; i < forms.length; i++) {
		let form = forms[i];
		form.classList.add("bound");
		form.addEventListener("submit", (event)=>{
			event.preventDefault();
			const listId = form.dataset.id;
			const email = form.querySelector("#email").value;
			gsap.to(form, { opacity: 0, duration: 0.3, ease: "sine.inOut", onComplete: () => {
					// form.removeChild(form.querySelector("#email"));
					// form.removeChild(form.querySelector("button"));
					gsap.to(form.nextElementSibling, { autoAlpha: 1, duration: 0.3, ease: "sine.inOut" });
				}
			});
			subscribe(listId, email, {
				// any optional traits
			}).then((response) => {
				// console.log(response)
			});
		});
	}
};
export const normalizeRange = (value, originalMin, originalMax, newMin, newMax) => {
	const originalRange = originalMax - originalMin;
	const newRange = newMax - newMin;
	return (((value - originalMin) * newRange) / originalRange) + newMin;
};


export const loadGlobalScopeImages = (type) => {
	let images = document.querySelectorAll(".preload-global");

	let GlobalImageWorker = new GlobalLazyLoadWorker(window.worker);
	GlobalImageWorker.size = type;
	GlobalImageWorker.loadImages(images, "nodeList", (returned)=>{
		console.log("global scope images loaded");
	});
};

export const getReviewOverviews = () => {

	let xhr = new XMLHttpRequest();

	xhr.open("GET", "https://api.juniphq.com/v1/products", true);

	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("Junip-Store-Key", "Ym754F12HUwCn3vADLszPmor");

	xhr.send();

	xhr.onreadystatechange = ()=>{
		if(xhr.readyState === 4 && xhr.status === 200){
			globalStorage.reviewOverviews.push(JSON.parse(xhr.response).products);
		}
	};

	let overviewXhr = new XMLHttpRequest();

	overviewXhr.open("GET", "https://api.juniphq.com/v1/product_overviews", true);

	/* --- Add our Headers --- */
	overviewXhr.setRequestHeader("Accept", "application/json");
	overviewXhr.setRequestHeader("Junip-Store-Key", "Ym754F12HUwCn3vADLszPmor");

	/* --- Send our request --- */
	overviewXhr.send();

	/* --- Let's check our state change --- */
	overviewXhr.onreadystatechange = ()=>{
		if(overviewXhr.readyState === 4 && overviewXhr.status === 200){
			globalStorage.allReviewsOverview = JSON.parse(overviewXhr.response).product_overviews;
		}
	};
};

export const placeReviewOverviews = () => {
	const reviewEls = document.querySelectorAll(".review-overview:not(.all)");
	for (let i = 0; i < reviewEls.length; i++) {
		const el = reviewEls[i];
		const id = el.dataset.id;
		for (let j = 0; j < globalStorage.reviewOverviews[0].length; j++) {
			const overview = globalStorage.reviewOverviews[0][j];
			if (overview.remote_id === id) {
				if (overview.rating_count === 0) {
					gsap.set(el, { display: "none" });
					break;
				}
				// const countEl = el.querySelector(".review-count");
				const avgStars = (Math.round(overview.rating_average*2)/2).toString().replace(".", "-");

				el.classList.add("stars-" + avgStars);
				// countEl.textContent = overview.rating_count;
				break;
			}
		}
	}

	const allReviewEls = document.querySelectorAll(".review-overview.all");
	for (let i = 0; i < allReviewEls.length; i++) {
		const el = allReviewEls[i];
		// const countEl = el.querySelector(".review-count");
		const overview = globalStorage.allReviewsOverview[0]
		const avgStars = (Math.round(overview.rating_average*2)/2).toString().replace(".", "-");

		el.classList.add("stars-" + avgStars);
		// countEl.textContent = overview.rating_count;
	}
};

export const getQueryVariable = (variable) => {
	const query = window.location.search.substring(1);
	const vars = query.split("&");
	for (let i = 0; i < vars.length; i++) {
		const pair = vars[i].split("=");
		if (pair[0] === variable) { return pair[1]; }
	}
	return false;
};


export const bindForm = (form, validation = false, url = null, callback = null)=>{

	if(!form.classList.contains("bound")){
		form.className += " bound";
		let submittedOnce = false
		let showingError
		const emailField = form.querySelector('#email');
		const re = /\S+@\S+\.\S+/
		form.addEventListener("submit", (event)=>{
			event.preventDefault();
			if (submittedOnce) { return }
			const email = emailField.value
			if (!re.test(email)) {
				showingError = true
				emailField.classList.add('error')
				return
			}
			submittedOnce = true
			gsap.delayedCall(0.5, () => {
				form.classList.add("success")
				gsap.set(form.parentElement.previousElementSibling, { autoAlpha: 0, duration: .25, ease: "sine.inOut" })
			})
			formSubmit(form, validation, url, (data)=>{
				callback(data);
			});
		});

		if (globalStorage.isMobile) {
			emailField.addEventListener('change', () => {
				if (!showingError) {
					return
				}
				if (emailField.value.length > 0) {
					if (re.test(emailField.value)) {
						showingError = false
						emailField.classList.remove('error')
					}
				}
			} )
		} else {
			emailField.addEventListener('keyup', () => {
				if (!showingError) {
					return
				}
				if (emailField.value.length > 0) {
					if (re.test(emailField.value)) {
						showingError = false
						emailField.classList.remove('error')
					}
				}
			} )
		}
	}
};

export const formSubmit = (form, validation = false, url = null, callback = null)=>{

	let action = url ? url : form.action;
	let method = form.method;
	let obj = serialize(form, { hash: true });
	if(method === "get"){
		obj = serialize(form);
	}

	if(method === "get"){

		ajax(action + "?" + obj, {
			method: method,
			type: "application/json"
		}, (result)=>{
			callback(JSON.parse(result));
		});

	} else {

		ajax(action, {
			method: method,
			type: "application/json",
			data: JSON.stringify(obj)
		}, (result)=>{
			callback(JSON.parse(result));
		});
	}
};

export const ajax = (url, options = {}, callback = null)=>{

	let method = (typeof options.method === "undefined") ? "get" : options.method;
	let type = (typeof options.type === "undefined") ? "json" : options.type.toLowerCase();
	let headers = (typeof options.headers === "undefined") ? [] : options.headers;
	let data = (typeof options.data === "undefined") ? null : options.data;

	/* --- Start our XHR connection --- */
	let xhr = new XMLHttpRequest();

	xhr.open(method, url, true);

	/* --- Add our Headers --- */
	if(type === "json"){
		xhr.setRequestHeader("Accept", "application/json");
		xhr.setRequestHeader("Content-Type", "application/json");
	}

	Array.prototype.slice.call(headers).forEach((header)=>{
		xhr.setRequestHeader(header[0], header[1]);
	});

	/* --- Send our request --- */
	xhr.send(data);

	/* --- Let's check our state change --- */
	xhr.onreadystatechange = ()=>{

		if(xhr.readyState === 4 && xhr.status === 200){

			if(type === "text"){
				callback(xhr.responseText);
			} else {
				callback(xhr.response);
			}
		}
	};
};
import { H } from "../routing"
export class Prefetch {
	constructor(arr) {
		this.fetch(arr)
	}
	fetch(arr) {
		for (let i = 0; i < arr.length; i++) {
			fetch(arr[i], {
				mode: 'same-origin',
				method: 'GET',
				credentials: 'same-origin'
			})
				.then(response => response.text())
				.then(data => {
					const properties = H.Helpers.getProperties(data);
					H.cache.set(arr[i], properties);
				})
		}
	}
}
