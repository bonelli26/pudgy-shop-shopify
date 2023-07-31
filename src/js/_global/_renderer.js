/*
	Load Plugins / Functions
-------------------------------------------------- */
import {getViewport, beforeScroll, afterScroll, tracking, loadGlobalScopeImages, Prefetch, getReviewOverviews} from "./helpers";
import {domStorage, globalStorage} from "./storage";
import {globalEntrance, pageEntrance} from "./anims";
import { ScrollBasedAnims } from "../_classes/ScrollBasedAnims";
import { gsap } from "gsap";
import {LazyLoadWorker} from "../_worker/LazyLoadWorker";
import {AddToCart} from "../_extensions/Shopify/AddToCart";
import {MiniCart} from "../_classes/MiniCart";
import {MobileMenu} from "../_classes/MobileMenu";


/* --- Scroll variable --- */
export let $scroll;
export let ImageLoad = new LazyLoadWorker(window.worker);
/* --- Global Events - Fire on Every Page --- */
const globalEvents = (namespace = null)=>{
	globalStorage.namespace = namespace;

	/*
	 *	Load Critical Images
	 *
	 *	The callback is meant to fire DOM Critical related
	 *	global functions. Everything page specific needs to
	 *	go within it's respective file.
	 */

	/* --- Critical Done --- */
	globalEntrance(namespace);
	let criticalMedia = document.querySelectorAll('.preload-critical');

	if (globalStorage.isMobile) {
		const hoverTiles = document.querySelectorAll(".product-tile")
		for (let i = 0; i < hoverTiles.length; i++) {
			const hoverImg = hoverTiles[i].querySelector("img + img")
			if (hoverImg) {
				hoverImg.removeAttribute("data-preload-mobile")
			}
		}
	}

	ImageLoad.break = false;
	ImageLoad.loadImages(criticalMedia, "nodeList", (returned)=>{

	});

	let transitionFinished = setInterval(()=>{
		if(globalStorage.transitionFinished){
			clearInterval(transitionFinished);
			beforeScroll();

			$scroll = new ScrollBasedAnims({});

			afterScroll();

			new AddToCart();

			pageEntrance(namespace);

			globalStorage.imagesLoaded = false;
		}
	}, 20);
};

/* --- DOMContentLoaded Function --- */
export let $mobileMenu = true;
export let $miniCart = true;
let idleCallback
export const onReady = ()=>{
	let namespace = document.querySelector("[data-router-view]").dataset.routerView;
	globalStorage.windowHeight = getViewport().height;
	globalStorage.windowWidth = getViewport().width;

	let vh = getViewport().height * 0.01;

	globalStorage.isGreaterThan767 = (globalStorage.windowWidth > 767 && !document.body.classList.contains("force-mobile"));
	let type = "mobile"
	if (globalStorage.isGreaterThan767) {
		type = "desktop"
		ImageLoad.size = "desktop"
	}

	document.body.style.setProperty('--vh', `${vh}px`);



	globalEvents(namespace);

	getReviewOverviews();

	// let prefetchArr;
	// const domain = window.location.origin
	//
	// switch (namespace) {
	// 	case "home":
	// 		prefetchArr = [domain+'/products/dream-gummies'];
	// 		new Prefetch(prefetchArr);
	// 		break;
	// }

	const newsletterBtns = document.querySelectorAll(".newsletter:not(.prepped)");

	for(let i = 0; i < newsletterBtns.length; i++){
		newsletterBtns[i].classList.add("prepped");
		newsletterBtns[i].addEventListener("click", event => {
			window._klOnsite = window._klOnsite || [];
			window._klOnsite.push(['openForm', 'T4Jdp7']);
		})
	}



	loadGlobalScopeImages(type);


	if (globalStorage.windowWidth < 767) {
		$mobileMenu = new MobileMenu();
	}

	$miniCart = new MiniCart();

	if (window.location.href.indexOf("cart=true") > -1) {
		$miniCart.open();
		window.history.replaceState("", "", "/");
	}

};


/* --- window.onload Function --- */
export const onLoad = ()=>{

};

/* --- window.onresize Function --- */
export const onResize = ()=>{
	let newWidth = getViewport().width;
	let omnibar = false;
	if (globalStorage.windowWidth === newWidth && globalStorage.isMobile) {
		omnibar = true;
	}

	globalStorage.windowHeight = getViewport().height;
	globalStorage.windowWidth = newWidth;

	let vh = globalStorage.windowHeight * 0.01;
	if (!omnibar) {
		document.body.style.setProperty('--vh', `${vh}px`);
		if ($scroll) {
			$scroll.resize();
		}
	}

	// $miniCart.resize();
};

/*
 *	Highway NAVIGATE_OUT callback
 *
 *	onLeave is fired when a highway transition has been
 *	initiated. This callback is primarily used to unbind
 *	events, or modify global settings that might be called
 *	in onEnter/onEnterCompleted functions.
 */
export const onLeave = (from, trigger, location)=>{
	if (ImageLoad.loadingImages) {
		ImageLoad.break = true;
		ImageLoad.loadingImages = false;
	} else {
		ImageLoad.loadingImages = false;
	}
	/* --- Remove our scroll measurements --- */
	$scroll.destroy();
	$scroll = false
	gsap.set(domStorage.clickMask, { pointerEvents: "all" });
	/* --- Flag transition for load in animations --- */
	globalStorage.transitionFinished = false;
	globalStorage.imagesLoaded = false;
	// if (window.location.pathname !== "/")  {
	// 	domStorage.nav.classList.add("change-color");
	// 	gsap.to(domStorage.headerBackdrop, { opacity: 1, duration: 0.28, force3D: true, ease: "sine.out" });
	// }
};

/*
 *	Highway NAVIGATE_IN callback
 *
 *	onEnter should only contain event bindings and non-
 *	DOM related event measurements. Both view containers
 *	are still loaded into the DOM during this callback.
 */
export const onEnter = (to, trigger, location)=>{

	/* --- This needs to stay here --- */
	globalEvents(to.view.dataset.routerView);
};

/*
 *	Highway NAVIGATE_END callback
 *
 *	onEnterCompleted should be your primary event callback.
 *	The previous view's DOM node has been removed when this
 *	event fires.
 */
export const onEnterCompleted = (from, to, trigger, location)=>{

	/* --- Track Page Views through Ajax --- */
	// tracking("google", "set", "page", location.pathname);
	// tracking("google", "send", {
	// 	hitType: "pageview",
	// 	page: location.pathname,
	// 	title: to.page.title
	// });
};




