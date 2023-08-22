import { gsap } from "gsap";
import {globalStorage} from "../_global/storage";

export class MobileMenu {

	constructor() {
		this.nav = document.querySelector("nav");
		if(!this.nav) { return; }
		if(!globalStorage.isGreaterThan767) {
			this.navDrawer = document.getElementById("nav-bar");
			this.navMask = document.querySelector(".nav-mask");
			gsap.set(this.navDrawer, { scale: 0 });
		}
		this.trigger = document.getElementById("hammy");
		this.bar1 = this.trigger.querySelector('svg path:first-of-type');
		this.bar2 = this.trigger.querySelector('svg path:nth-of-type(2)');
		this.bar3 = this.trigger.querySelector('svg path:last-of-type');
		this.isOpen = false;
		this.timeline = new gsap.timeline();
		this.main = document.querySelector("main > div");
		this.bindListeners();
	}

	bindListeners() {
		this.trigger.addEventListener("click", () => {
			if (this.isOpen) {
				this.close();
			} else {
				this.open();
			}
		});
	}

	open() {
		this.isOpen = true;
		this.timeline.clear();
		this.timeline.progress(0);
		this.timeline
			.set(this.navDrawer, {pointerEvents: "all"})
			.to(this.bar1, { rotate: 45, duration: 0.1, force3D: true, ease: "sine.out", transformOrigin: "top left" })
			.to(this.bar3, { rotate: -45, duration: 0.1, force3D: true, ease: "sine.out", transformOrigin: "bottom left" }, "<")
			.to(this.bar2, { autoAlpha: 0, duration: 0.1, force3D: true, ease: "sine.inOut" }, "<")
			.to(this.navDrawer, { scale: 1, duration: 1.1, force3D: true, ease: "expo.out", transformOrigin: "top left"}, 0);
			// .to(this.main, { scale: 1.1, duration: 1.2, force3D: true, ease: "elastic.out", transformOrigin: "top left"}, "<");


		this.trigger.classList.add('open');
	}

	close() {
		this.isOpen = false;
		this.timeline.clear();
		this.timeline.progress(0);
		this.timeline
			.set(this.navDrawer, {pointerEvents: "none"})
			.to(this.bar1, { rotate: 0, duration: 0.18, force3D: true, ease: "expo.out", transformOrigin: "top left" })
			.to(this.bar3, { rotate: 0, duration: 0.18, force3D: true, ease: "expo.out", transformOrigin: "bottom left" }, "<")
			.to(this.bar2, { autoAlpha: 1, rotate: 0, duration: 0.18, force3D: true, ease: "expo.out" }, "<")
			.to(this.navDrawer, { scale: 0, duration: 0.3, force3D: true, ease: "expo.in", transformOrigin: "top left" }, "<");
			// .to(this.main, { scale: 1, duration: 0.4, force3D: true, ease: "elastic.out", transformOrigin: "top left"}, "<");

		this.trigger.classList.remove('open');
	}
}
