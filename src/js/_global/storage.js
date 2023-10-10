/*
	Global Storage Object
-------------------------------------------------- */
export const globalStorage = {
	"assetPath": (document.getElementById("site-data") && window.location.host.indexOf("localhost") < 0) ? document.getElementById("site-data").getAttribute("data-asset-path") : "/assets/code/",
	"firstLoad": true,
	"isMobile": false,
	"isSafari": (navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") === -1) ? true : false,
	"isChrome": (navigator.userAgent.indexOf("Chrome") > -1) ? true : false,
	"isFirefox": (navigator.userAgent.indexOf("Firefox") > -1) ? true : false,
	"windowHeight": "",
	"windowWidth": "",
	"transitionFinished": false,
	"queryParams": {},
	"referrer": "",
	"reducedMotion": window.matchMedia("(prefers-reduced-motion: reduce)").matches,
	"headerShowing": true,
	"marqueeData": [],
	"prefetchedUrls": [],
	"reviewOverviews": [],
	"allReviewsOverview": ""
};

export const domStorage = {
	"header": document.getElementById("header"),
	"pencilMarquee": document.querySelector(".pencil-bar"),
	"pencilMarqueeDark": document.querySelector(".pencil-bar.giveaway"),
	"nav": document.getElementById("nav"),
	"navBar": document.getElementById("nav-bar"),
	"mainEl": document.getElementById("main"),
	"containerEl": document.getElementById("container"),
	"globalMask": document.getElementById("global-mask"),
	"eventMask": document.getElementById("event-mask"),
	"globalLoader": document.getElementById("global-loader"),
	"coinsEl": document.getElementById("services-section"),
	"miniCart": document.getElementById("mini-cart"),
	"miniCartTotal": document.getElementById("mini-cart-total"),
	"miniCartProductsWrapper": document.getElementById("products-wrapper"),
	"miniCartEmptyWrapper": document.getElementById("empty-wrapper"),
	"cartCountEl": document.getElementById("cart-count"),
	"openMobileMenu": ()=>{},
	"closeMobileMenu": ()=>{},
	"resetMobileMenu": ()=>{}
}
