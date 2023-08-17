import { gsap } from "gsap";
import { globalStorage, domStorage } from "./storage";
import {$scroll} from "./_renderer";
import EmblaCarousel  from "embla-carousel";
import {normalizeRange} from "./helpers";
import { SplitText } from "../_extensions/splitText";
gsap.registerPlugin(SplitText);
/*
	Page specific animations
-------------------------------------------------- */
export const pageEntrance = (namespace = null)=> {

	/* ----- Establish our timeline ----- */
	let timeline = new gsap.timeline({ paused: true });


	/* ----- Setup cases for specific load-ins ----- */
	switch(namespace){
		/* ----- Our default page entrance ----- */
		default:
			break;

	}
	timeline.to(domStorage.globalMask, { duration: 0.3, autoAlpha: 0, force3D: true, ease: "sine.inOut" })

	gsap.set(domStorage.clickMask, { pointerEvents: "none" });

	timeline.play();

	if(globalStorage.firstLoad){
		globalStorage.firstLoad = false
		gsap.set(domStorage.header, { zIndex: 98 })
	}
};

/*
	Global element animations
-------------------------------------------------- */
export let $slideShow;
export const globalEntrance = ()=>{

	if(globalStorage.firstLoad !== true){
		return;
	}
	new Marquees(true);

	/* ----- Establish our timeline ----- */
	let timeline = new gsap.timeline({ paused: true });

	const img = domStorage.globalMask.querySelector("img")
	const url = globalStorage.isGreaterThan767 ? domStorage.globalMask.dataset.url : domStorage.globalMask.dataset.urlMobile

	img.addEventListener("load", () => {
		globalStorage.pencilMarquee.tween.play()
		gsap.set(img, { opacity: 1 })
		timeline
			.to(domStorage.header,  { autoAlpha: 1, y: 0, duration: 0.3, ease: "sine.inOut", force3D: true, onComplete: ()=>{
					gsap.delayedCall(.1, () => {
						globalStorage.transitionFinished = true;
					})
				} }, 0.2)
	})

	img.src = url

	timeline.play();
}

export const prepDrawers = () => {
	const drawers = document.querySelectorAll(".drawer:not(.bound)")

	for (let i = 0; i < drawers.length; i++) {
		const thisDrawer = drawers[i]
		let width = parseInt(thisDrawer.dataset.at);
		if (globalStorage.windowWidth > width) {
			continue;
		}
		thisDrawer.classList.add("bound")
		const childrenWrapper = thisDrawer.querySelector(".drawer-items");
		const childrenWrapperItems = childrenWrapper.querySelectorAll("*");
		const childrenWrapperHeight = childrenWrapper.offsetHeight;
		const childrenItems = thisDrawer.querySelectorAll(".drawer-items > *");
		const bg = drawers[i].querySelector(".filters-bg");
		console.log(bg);
		if (thisDrawer.classList.contains("replace-label")) {
			let label = thisDrawer.querySelector(".current-label");
			childrenItems.forEach((item) => {
				item.addEventListener("click", () => {
					label.textContent = item.textContent;
				});
			});
		}

		thisDrawer.addEventListener("click", event => {
			if (!thisDrawer.classList.contains("open")) {
				const openDrawers = document.querySelectorAll(".drawer.open")
				for (let i = 0; i < openDrawers.length; i++) {
					openDrawers[i].classList.remove("open")
					if (globalStorage.isMobile && thisDrawer.classList.contains("faq-drawer")) {
						gsap.set(openDrawers[i].querySelector(".drawer-items"), { height: 0, force3D: true })
					} else {
						gsap.to(openDrawers[i].querySelector(".drawer-items"), 0.35, { height: 0, force3D: true, ease: "sine.inOut" })
					}
					gsap.to(openDrawers[i].querySelectorAll(".drawer-items > *"), 0.35, { opacity: 0, force3D: true, ease: "sine.inOut" })
				}
				thisDrawer.classList.add("open")

				if (globalStorage.isMobile && thisDrawer.classList.contains("faq-drawer")) {
					gsap.set(childrenWrapper, { height: childrenWrapperHeight, force3D: true })
					if ($scroll) {
						$scroll.resize();
					}
				} else {
					gsap.to(childrenWrapper, 0.35, { height: childrenWrapperHeight, force3D: true, ease: "sine.inOut", onComplete: () => {
							if ($scroll) {
								$scroll.resize();
							}
						} })
				}


				gsap.fromTo(childrenWrapperItems, 0.35, { opacity: 0 }, { opacity: 1, force3D: true, ease: "sine.in" })

				if (thisDrawer.classList.contains("replace-label")) {
					gsap.to(bg, { borderRadius: "13", force3D: true, ease: "sine.out", duration: 0.3, delay: .1 });
				}
			} else {

				thisDrawer.classList.remove("open")

				if (globalStorage.isMobile && thisDrawer.classList.contains("faq-drawer")) {
					gsap.set(childrenWrapper, { height: 0, force3D: true })
					if ($scroll) {
						$scroll.resize();
					}
				} else {
					gsap.to(childrenWrapper, 0.35, { height: 0, force3D: true, ease: "sine.inOut", onComplete: () => {
							if ($scroll) {
								$scroll.resize();
							}
						} })
				}

				gsap.to(childrenWrapperItems, 0.35, { opacity: 0, force3D: true, ease: "sine.inOut" })

				if (thisDrawer.classList.contains("replace-label")) {
					gsap.to(bg, { borderRadius: "53", force3D: true, ease: "sine.out", duration: 0.3, delay: .1 });
				}
			}
		})
		gsap.set(childrenWrapper, { height: 0 })
		let origOffsetTop = thisDrawer.getBoundingClientRect().top - 120
		if ((i === drawers.length - 1) && $scroll) {
			$scroll.resize();
		}
	}
};

export class Marquees {

	constructor(pencilMarquee = false) {
		this.pencilMarquee = pencilMarquee
		if (pencilMarquee) {
			this.marquees = document.querySelectorAll('.pencil-bar');
		} else {
			this.marquees = document.querySelectorAll('.marquee:not(.prepped)');
		}

		this.init();

	}

	init() {
		this.getCache();

	}

	getCache(resize = false) {

		this.window2x = globalStorage.windowWidth * 2;

		for (let i = 0; i < this.marquees.length; i++) {
			let width = parseInt(this.marquees[i].dataset.at);
			if (globalStorage.windowWidth > width) {
				continue;
			}
			let inner = this.marquees[i].querySelector('.inner'),
				small = this.marquees[i].classList.contains('small'),
				containerWitdth = small ? this.marquees[i].offsetWidth : globalStorage.windowWidth,
				copyEl = this.marquees[i].querySelector('[aria-hidden]'),
				copyWidth = copyEl.offsetWidth,
				multiplier,
				resetElCount = 2;

			if (copyWidth > containerWitdth) {
				multiplier = 1;
			} else {
				multiplier = Math.ceil((containerWitdth * 2) / copyWidth);
				resetElCount = Math.ceil(containerWitdth / copyWidth);
			}

			let tween = this.prepMarkup(this.marquees[i], inner, multiplier, copyEl, resetElCount);

			if (small) {
				globalStorage.smallMarquees.push({
					tween: tween,
					playing: false
				});

			} else {
				if (this.pencilMarquee) {
					globalStorage.pencilMarquee = {
						el: this.marquees[i],
						tween: tween,
						playing: false
					};
				} else {
					globalStorage.marqueeData.push({
						el: this.marquees[i],
						tween: tween,
						playing: false
					});
				}
			}

		}

	}

	prepMarkup(marquee, inner, multiplier, copyEl, resetElCount) {

		for (let i = 1; i < multiplier; i++){
			let elementCopy = copyEl.cloneNode(true);
			elementCopy.classList.add("duplicate");
			inner.appendChild(elementCopy);
		}

		if(marquee.classList.contains('hover')) {
			inner.addEventListener("mouseenter", () => {
				tween.timeScale(0);
			});
			inner.addEventListener("mouseleave", () => {
				tween.timeScale(1);
			});
		}

		this.duplicates = inner.querySelectorAll(".duplicate");

		let mobDist =  inner.dataset.right ? marquee.querySelector(".inner > *:first-child").getBoundingClientRect().right : marquee.querySelector(".inner > *:nth-child("+resetElCount+")").offsetLeft ;

		let resetDist = inner.dataset.right ? mobDist : marquee.querySelector(".inner > *:nth-child("+resetElCount+")").offsetLeft;
		// let resetDist = marquee.querySelector(".inner > *:nth-child("+resetElCount+")").offsetLeft;

		let dur = parseInt(globalStorage.isGreaterThan767 ? inner.dataset.dur : inner.dataset.mobileDur);

		let direction = inner.dataset.right ? -1 : 1;

		let tween = gsap.fromTo(inner,{ x: 0 }, { duration: dur, repeat: -1, x: -resetDist * direction, ease: "none", force3D: true }, 0).pause();

		marquee.classList.add('prepped');
		// console.log(resetDist);
		return tween;

	}


	resize() {
		for (let i = 0; i < this.duplicates.length; i++) {
			this.duplicates[i].remove();
		}

		this.getCache(true);
	}

}

export const prepSliders = () => {

	let prepControls = (slider, dots, prev, next) => {

		if (prev) {
			prev.addEventListener('click', () => {
				slider.scrollPrev();
			});
		}
		if (next) {
			next.addEventListener('click', () => {
				slider.scrollNext();
			});
		}
		if (dots) {
			for (let j = 0; j < dots.length; j++) {
				dots[j].addEventListener('click', () => {
					if (dots[j].classList.contains("active")) { return; }
					slider.scrollTo(j);
				});
			}
			slider.on("select", () => {
				dots[slider.previousScrollSnap()].classList.remove('active');
				dots[slider.selectedScrollSnap()].classList.add('active');
			});
		}

	};

	let sliders = document.querySelectorAll('.slider:not(.prepped)');
	for (let i = 0; i < sliders.length; i++) {
		const el = sliders[i];

		if (el.dataset.at) {
			let width = parseInt(el.dataset.at);

			if (globalStorage.windowWidth > width) {
				continue;
			}
		}

		const slideWrapper = el.querySelector('.slides');
		const prev = el.querySelector('.prev');
		const next = el.querySelector('.next');
		const dotsWrapper = el.querySelector('.dots');
		const track = el.querySelector(".track:not(.prepped)");

		let slideAlignment = globalStorage.windowWidth > 767 ? (el.dataset.align ? el.dataset.align : 'center') : (el.dataset.mobileAlign ? el.dataset.mobileAlign : (el.dataset.align ? el.dataset.align : 'center'));
		let startIndex = globalStorage.windowWidth > 767 ? (el.dataset.index ? el.dataset.index : '0') : (el.dataset.mobileIndex ? el.dataset.mobileIndex : (el.dataset.index ? el.dataset.index : '0'));

		let dots = false;
		if (dotsWrapper) {
			dots = dotsWrapper.querySelectorAll('.dot');
		}

		console.log(slideAlignment)

		const options = { loop: (globalStorage.windowWidth > 767 ? !el.classList.contains("no-loop") : !el.classList.contains("no-loop-mobile")), skipSnaps: true, inViewThreshold: el.dataset.inView ? Number(el.dataset.inView) : 0.3, startIndex: parseInt(startIndex), align: slideAlignment, dragFree: !el.classList.contains("no-drag-free") };

		const slider = EmblaCarousel(slideWrapper, options);

		prepControls(slider, dots, prev, next, track);

		el.classList.add("prepped");

		if (track) {
			track.classList.add("prepped");
			const bar = track.querySelector(".bar");
			const parentWrapper = track.parentElement;
			const measureEls = parentWrapper.querySelectorAll(".measure-el");

			let innerWidth = 0;
			for (let i = 0; i < measureEls.length; i++) {
				innerWidth += measureEls[i].offsetWidth;
			}
			const initialProgress = Number(bar.dataset.initial);
			//gsap.to(bar, { scaleX: initialProgress, ease: "expo.out", force3D: true, duration: 1.8 });
			slider.on("scroll", (bar) => {
				let scrollProgress = slider.scrollProgress();
				let normedProgress = normalizeRange(scrollProgress, 0, 1, initialProgress, 1);

				if (normedProgress > 0.99) {
					normedProgress = 1;
				}
				gsap.to(document.getElementById("bar"), { scaleX: normedProgress, duration: 0.1, ease: "sine.inOut" });
			});
		}
	}

};

export const prepModals = (modalTrigger) => {

	const modalWrapper = document.getElementById('modal-wrapper');
	if (!modalWrapper) return;
	const modalWrapperClone = modalWrapper.cloneNode(true)
	modalWrapper.remove()
	document.body.appendChild(modalWrapperClone)

	for (let i = 0; i < modalTrigger.length; i++) {
		const modalName = modalTrigger[i].dataset.modal;
		const modalBg = document.querySelector('.modal-bg');
		const modal = document.querySelector('.modal[data-modal="'+ modalName +'"]');
		const modalWrapper = modal.parentElement;
		const closeTrigger = modal.querySelector('.close-modal');
		const timeline = new gsap.timeline();

		if (globalStorage.windowWidth > 767) {
				gsap.set(modal, { autoAlpha: 0, xPercent: 100 })
				gsap.set(closeTrigger, {autoAlpha: 0, rotation: -360 })
		}

		gsap.set(modalBg, { autoAlpha: 0 })
		gsap.set(modalWrapper, { autoAlpha: 0, pointerEvents: "none"})
		gsap.set(modal, { autoAlpha: 0,  yPercent: 100 });
		gsap.set(closeTrigger, {autoAlpha: 0 })

		modalTrigger[i].addEventListener('click', () => {
			timeline.clear()
			timeline
				.to(modalBg, { autoAlpha: 1, ease: "sine.inOut", duration: 0.25, force3D: true })
				.to(modalWrapper, { autoAlpha: 1, pointerEvents: "all", ease: "sine.inOut", duration: 0.25, force3D: true })
				.to(modal, { autoAlpha: 1, yPercent: 0, ease: "sine.inOut", duration: 0.3, force3D: true }, 0.15)
				.to(closeTrigger, { autoAlpha: 1, ease: "sine.inOut", duration: 0.2, force3D: true });

			if (globalStorage.windowWidth > 767) {
				timeline.clear()
				timeline
					.to(modalBg, { autoAlpha: 1, ease: "sine.inOut", duration: 0.25, force3D: true })
					.to(modalWrapper, { autoAlpha: 1, pointerEvents: "all", ease: "sine.inOut", duration: 0.25, force3D: true  })
					.to(modal, { autoAlpha: 1,  xPercent: 0, ease: "sine.inOut", duration: 0.3, force3D: true }, 0.15)
					.to(closeTrigger, { autoAlpha: 1, rotation: 0, ease: "expo.out", duration: 1.2, force3D: true })
			}

		});

		modal.addEventListener('click', (e) => {
			e.stopPropagation()
		});

		closeTrigger.addEventListener('click', () => {
			timeline.clear()
			timeline.progress(0)
			timeline
				.to(closeTrigger, {  ease: "sine.inOut", duration: 0.2, force3D: true }, 0)
				.to(modalWrapper, { autoAlpha: 0, pointerEvents: "none", ease: "sine.inOut", duration: 0.25, force3D: true }, 0.05)
				.to(modal, { autoAlpha: 0, yPercent: 100, ease: "sine.inOut", duration: 0.25, force3D: true }, 0.05)
				.to(modalBg, { autoAlpha: 0, ease: "sine.inOut", duration: 0.2, force3D: true }, 0.05)

			if (globalStorage.windowWidth > 767) {
				timeline.clear()
				timeline.progress(0)
				timeline
					.to(closeTrigger, { autoAlpha: 1, rotation: -360, ease: "expo.out", duration: 1.2, force3D: true }, 0)
					.to(modalWrapper, { autoAlpha: 0, pointerEvents: "none", ease: "sine.inOut", duration: 0.25, force3D: true }, 0.05)
					.to(modal, { autoAlpha: 0, xPercent: 100, ease: "sine.inOut", duration: 0.25, force3D: true }, 0.05)
					.to(modalBg, { autoAlpha: 0, ease: "sine.inOut", duration: 0.2, force3D: true }, 0.05)
			}

		});

		modalWrapper.addEventListener('click', () => {
			timeline.clear()
			timeline.progress(0)
			timeline
				.to(closeTrigger, {  ease: "sine.inOut", duration: 0.2, force3D: true }, 0)
				.to(modalWrapper, { autoAlpha: 0, pointerEvents: "all", ease: "sine.inOut", duration: 0.25, force3D: true }, 0.05)
				.to(modal, { autoAlpha: 0, yPercent: 100, ease: "sine.inOut", duration: 0.25, force3D: true }, 0.05)
				.to(modalBg, { autoAlpha: 0, ease: "sine.inOut", duration: 0.2, force3D: true }, 0.05)

			if (globalStorage.windowWidth > 767) {
				timeline.clear()
				timeline.progress(0)
				timeline
					.to(closeTrigger, { autoAlpha: 1, rotation: -360, ease: "expo.out", duration: 1.2, force3D: true }, 0)
					.to(modalWrapper, { autoAlpha: 0, pointerEvents: "all", ease: "sine.inOut", duration: 0.25, force3D: true }, 0.05)
					.to(modal, { autoAlpha: 0, xPercent: 100, ease: "sine.inOut", duration: 0.25, force3D: true }, 0.05)
					.to(modalBg, { autoAlpha: 0, ease: "sine.inOut", duration: 0.2, force3D: true }, 0.05)
			}
		});

		document.addEventListener('keyup', (event) => {
			let key = event.key;
			if (key === 'Escape' || key === 'Esc') {
				timeline.clear()
				timeline.progress(0)
				timeline
					.to(closeTrigger, { autoAlpha: 0, ease: "expo.out", duration: 1, force3D: true }, 0)
					.to(modalWrapper, { autoAlpha: 0, pointerEvents: "none", ease: "sine.inOut", duration: 0.25, force3D: true }, 0.05)
					.to(modal, { autoAlpha: 0, yPercent: 100, ease: "sine.inOut", duration: 0.25, force3D: true }, 0.05)
					.to(modalBg, { autoAlpha: 0,  ease: "sine.inOut", duration: 0.2, force3D: true }, 0.05);

				if (globalStorage.windowWidth > 767) {
					timeline.clear()
					timeline.progress(0)
					timeline
						.to(closeTrigger, { autoAlpha: 1, rotation: -360, ease: "expo.out", duration: 1.2, force3D: true }, 0)
						.to(modalWrapper, { autoAlpha: 0, pointerEvents: "none", ease: "sine.inOut", duration: 0.25, force3D: true }, 0.05)
						.to(modal, { autoAlpha: 0, xPercent: 100, ease: "sine.inOut", duration: 0.25, force3D: true }, 0.05)
						.to(modalBg, {  autoAlpha: 0, ease: "sine.inOut", duration: 0.2, force3D: true }, 0.05);

				}

			}
		});
	}

};


export const prepTabs = () => {
	let tabWrappers = globalStorage.isGreaterThan767 ? document.querySelectorAll(".tab-set") : document.querySelectorAll(".tab-set:not(.formula-tab)");
	for (let i = 0; i < tabWrappers.length; i++) {
		let el = tabWrappers[i],
			tabs = el.querySelectorAll('[data-tab="'+ el.dataset.tabs +'"]'),
			triggers = el.querySelectorAll('[data-trigger="'+ el.dataset.triggers +'"]'),
			activeIdx = 0,
			animating = false;

		for (let j = 0; j < triggers.length; j++) {
			let trigger = triggers[j],
				tab = tabs[j];

			trigger.addEventListener("click", () => {
				if (trigger.classList.contains("active") || animating) { return; }
				animating = true;
				let currentTab = tabs[activeIdx];
				el.querySelector(".trigger.active").classList.remove("active");
				trigger.classList.add("active");
				activeIdx = j;

				gsap.to(currentTab, { autoAlpha: 0, ease: "sine.inOut", duration: 0.2, onComplete: () => {
						gsap.set(currentTab, { position: "absolute" });
						gsap.set(tab, { position: "relative" });
						gsap.to(tab, { autoAlpha: 1, ease: "sine.inOut", duration: 0.25 } );
					}
				});

				gsap.delayedCall(.205, () => { animating = false; });
			});
		}
	}
};



export const newTabs = () => {
	let tabWrappers = document.querySelectorAll(".new-tabs");

	for (let i = 0; i < tabWrappers.length; i++) {
		let el = tabWrappers[i],
			tabs = el.querySelectorAll('[data-tab="'+ el.dataset.tabs +'"]'),
			triggers = el.querySelectorAll('[data-trigger="'+ el.dataset.triggers +'"]'),
			currentWrapper = el.querySelectorAll(".tab-wrapper"),
			activeIdx = 0,
			animating = false;

		if(!triggers) { return; }

		for (let j = 0; j < triggers.length; j++) {
			let trigger = triggers[j],
				tab = tabs[j],
				splitEl = tab.querySelectorAll("p:not(.img-wrapper)"),
				img = tab.querySelector(".img-wrapper"),
				splitLines = false;

				console.log(splitEl);

			if (splitEl) {
				splitLines = new SplitText(splitEl, {type: "lines"}).lines;
				if (j !== 0) {
					gsap.set(splitLines, { autoAlpha: 0 });
				}
			}

			if (j !== 0) {
				gsap.set(img, { autoAlpha: 0 });
			}

			trigger.addEventListener("click", () => {
				if (trigger.classList.contains("is-selected") || animating) { return; }
				animating = true;
				gsap.delayedCall(.3, () => { animating = false; });
				let currentTab = tabs[activeIdx];
				let currentLines = currentTab.querySelectorAll("* > div");
				let currentImg = currentTab.querySelector(".img-wrapper");

				el.querySelector(".trigger.is-selected").classList.remove("is-selected");
				trigger.classList.add("is-selected");

				activeIdx = j;

				if (currentImg) {
					gsap.fromTo(currentImg, { autoAlpha: 1, y: 0 } ,{ y: 20, autoAlpha: 0, ease: "sine.inOut", duration: 0.2, force3D: true });
				} else {
					gsap.fromTo(currentLines, { autoAlpha: 1 } ,{ autoAlpha: 0, stagger: 0.06, ease: "sine.out", duration: 0.35, force3D: true  });
				}

				if (img) {
					gsap.fromTo(img, { autoAlpha: 0, y: 20 } ,{ autoAlpha: 1, y: 0, ease: "sine.inOut", duration: 0.5, force3D: true });
				} else {
					gsap.fromTo(splitLines, { autoAlpha: 0 } ,{ autoAlpha: 1, stagger: 0.06, ease: "sine.out", duration: 0.35, force3D: true, delay: .25  });
				}
			});

		}
	}
}

export const filterTabs = () => {
	if(globalStorage.namespace !== "collection") { return; }
	let tabParent = document.querySelector(".collection-grid");
	const triggers = globalStorage.isGreaterThan767 ? tabParent.querySelectorAll('.filter') : tabParent.querySelectorAll('.filter-mobile');
	const tabsWrapper = tabParent.querySelector('.grid');
	const tiles = tabsWrapper.querySelectorAll('.card-wrapper:not(.dummy)');

	for (let i = 0; i < triggers.length; i++) {
		let trigger = triggers[i],
			triggerData = trigger.dataset.trigger,
			animating = false;

		trigger.addEventListener("click", () => {
			if (animating || trigger.classList.contains("active")) { return; }

			animating = true;

			gsap.delayedCall(.19, () => { animating = false; });

			document.querySelector("button.active").classList.remove("active");

			trigger.classList.add("active");

			gsap.to(tabsWrapper, { autoAlpha: 0, ease: "sine.inOut", force3D: true, duration: .18, onComplete: () => {
					for (let j = 0; j < tiles.length; j++) {
						const tile = tiles[j];

						if (triggerData === 'all') {
							gsap.set(tile, { display: "flex" });
						} else if (tile.classList.contains(triggerData)) {
							gsap.set(tile, { display: "flex" });
						} else {
							gsap.set(tile, { display: "none" });
						}
					}

					gsap.to(tabsWrapper, { autoAlpha: 1, ease: "sine.inOut", duration: 0.3, force3D: true });
				} })

		});

	}
}

export const prepVideos = () => {
	const videoWrapper = document.querySelectorAll(".video-wrapper")
	if(!videoWrapper) { return; }

	for (let i = 0; i < videoWrapper.length; i++) {
		const video = videoWrapper[i]
		const cover = video.querySelector(".video-wrapper:after")
		const button = video.querySelector("button")

		video.addEventListener('click', () => {
			gsap.to(cover, { autoAlpha: 0, ease: "sine.inOut", force3D: true, duration: 0.01 })
			gsap.to(button, { autoAlpha: 0, ease: "sine.inOut", force3D: true, duration: 0.35 })
		})
	}

}

export const seeMore = () => {
	const seeMoreSection = document.querySelector(".fifty-fifty-tiles")
	if(!seeMoreSection) { return; }
	const tiles = seeMoreSection.querySelectorAll(".tile:nth-child(n+3)")
	const trigger = seeMoreSection.querySelector(".see-more")

	gsap.set(tiles, { display: "none", autoAlpha: 0 })
	console.log(trigger)
	trigger.addEventListener('click', () => {
		gsap.to(trigger, { display: "none" })
		gsap.to(tiles, { display: "flex", autoAlpha: 1, ease: "sine.inOut", force3D: true, duration: 0.2 })
	})

}
