import { gsap } from "gsap";
import {domStorage, globalStorage} from "../_global/storage";
import {$scroll} from "../_global/_renderer";

export class NavDrawer {
    constructor() {
        this.nav = document.querySelector("nav");
        this.trigger = globalStorage.windowWidth < 768 ? document.getElementById("hammy") : document.getElementById("nav-trigger");
        this.navDrawer = globalStorage.windowWidth < 768 ? document.getElementById("nav-drawer-mobile") : document.getElementById("nav-drawer");
        this.isOpen = false;
		this.headerScrolled = false;
        this.timeline = new gsap.timeline();
        this.bindListeners();
    }

    bindListeners() {
        if (globalStorage.windowWidth < 768) {
            this.triggerBars = this.trigger.querySelectorAll(".open-svg rect");
            this.closeBars = this.trigger.querySelectorAll(".close-svg rect");
            gsap.set(this.closeBars, { scaleX: 0, scaleY: 0.6, opacity: 1, transformOrigin: "center" });
            gsap.set(this.closeBars[0].parentElement, { autoAlpha: 1 });

            this.trigger.addEventListener("click", () => {
                if (this.isOpen) {
                    this.isOpen = false;
                    this.close();
                } else {
                    this.isOpen = true;
                    this.open();
                }
            });
        } else {
            this.trigger.addEventListener("mouseenter", () => {
                if (this.isOpen) { return; }
                this.isOpen = true;
                if (this.isOpen) {
                    this.open();
                }

            });
            this.trigger.addEventListener("mousemove", (event) => {
                if (this.isOpen) { return; }
                this.isOpen = true;
                if (this.isOpen) {
                    this.open();
                }
            });
            this.trigger.addEventListener("mouseleave", () => {
                if (!this.isOpen) { return; }
                this.isOpen = false;
                this.close();
            });
        }
    }

    open() {
        this.timeline.clear();
        this.timeline.progress(0);
        if (globalStorage.windowWidth < 768) {
            gsap.to(domStorage.header, { y: -32, ease: "sine.inOut", duration: 0.3, force3D: true });
            domStorage.nav.classList.add("change-color");
            this.timeline
					.set(this.navDrawer, { pointerEvents: "all", xPercent: -100  })
					.to(domStorage.headerBackdrop, { opacity: 1, duration: 0.28, force3D: true, ease: "sine.out" })
					.to(this.navDrawer, { duration: 0.22, autoAlpha: 1,  xPercent: 0, force3D: true, ease: "sine.inOut" }, 0);
            this.timeline
                .to(this.triggerBars, { scaleX: 0, scaleY: 0.2,  transformOrigin: "99% 50%", duration: 0.85, ease: "expo.out", stagger: 0.07 })
                .to(this.closeBars, { scaleX: 1, scaleY: 1, duration: 0.95, ease: "expo.inOut", force3D: true, stagger: 0.135 }, ">-.68");
        } else {
			if (globalStorage.namespace === "home") {
				domStorage.nav.classList.add("change-color");
				this.timeline
					.set(this.navDrawer, { pointerEvents: "all" })
					.to(domStorage.headerBackdrop, { opacity: 1, duration: 0.28, force3D: true, ease: "sine.out" })
					.to(this.navDrawer, { duration: 0.22, autoAlpha: 1, force3D: true, ease: "sine.inOut" }, 0);
			} else {
				this.timeline
					.set(this.navDrawer, { pointerEvents: "all" })
					.to(this.navDrawer, { duration: 0.22, autoAlpha: 1, force3D: true, ease: "sine.inOut" }, 0);
			}
		}
    }




    close(transitioning = false) {
        this.timeline.clear();
        this.timeline.progress(0);
        if (globalStorage.windowWidth < 768)  {
            if (!$scroll.headerScrolled) {
                gsap.to(domStorage.header, { y: 0, ease: "sine.inOut", duration: 0.3, force3D: true });
            }
            if (window.location.pathname === "home")  {
                domStorage.nav.classList.remove("change-color");
            }
            this.timeline
                .set(this.navDrawer, {pointerEvents: "none", xPercent: 0})
                .to(domStorage.headerBackdrop, {opacity: 1, duration: 0.28, force3D: true, ease: "sine.out"})
                .to(this.navDrawer, { duration: 0.2, autoAlpha: 0, xPercent: -100, force3D: true, ease: "sine.inOut" }, 0);
            this.timeline
                .to(this.closeBars, { scaleX: 0, scaleY: 0.6, transformOrigin: "center", duration: 0.2, ease: "expo.out", force3D: true, stagger: 0.1 })
                .to(this.triggerBars, { scaleX: 1, scaleY: 1, duration: 1.1, ease: "expo.out", stagger: -0.055 }, ">-.15");
        } else {
			if (window.location.pathname === "/" && $scroll.headerScrolled) {
				this.timeline
					.set(this.navDrawer, {pointerEvents: "none"})
					.to(this.navDrawer, { duration: 0.2, autoAlpha: 0, force3D: true, ease: "sine.inOut" }, 0);
			} else if (window.location.pathname === "/") {
                if (!transitioning) {
                    domStorage.nav.classList.remove("change-color");
                }
				this.timeline
					.set(this.navDrawer, {pointerEvents: "none"})
					.to(domStorage.headerBackdrop, {opacity: 0, duration: 0.28, force3D: true, ease: "sine.out"})
					.to(this.navDrawer, { duration: 0.2, autoAlpha: 0, force3D: true, ease: "sine.inOut" }, 0);
			} else {
				this.timeline
					.set(this.navDrawer, {pointerEvents: "none"})
					.to(this.navDrawer, {duration: 0.2, autoAlpha: 0, force3D: true, ease: "sine.inOut"}, 0);
			}
		}
    }
}



