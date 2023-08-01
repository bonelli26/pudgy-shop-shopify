import { gsap } from "gsap";
import {globalStorage} from "../_global/storage";

export class MiniCart {
    constructor() {
        this.backdrop = document.getElementById("mini-cart-backdrop");
        this.trigger = globalStorage.windowWidth > 767 ? document.getElementById("mini-cart-trigger") : document.getElementById("mini-cart-trigger-mobile") ;
        // this.homeTrigger = document.getElementById("mini-cart-trigger-home");
        this.miniCart = document.getElementById("mini-cart");
        this.fadeEls = document.querySelector(".mini-cart .inner");
        // this.yDist = this.fadeEls.getBoundingClientRect().height;
        this.closeCart = document.getElementById("nav-close");
        this.shippingBar = this.miniCart.querySelector("#shipping-meter-bar");
        this.isOpen = false;
        this.timeline = new gsap.timeline();
        this.bindListeners();
        gsap.set(this.miniCart, { xPercent: 100, autoAlpha: 0 });
        gsap.set(this.backdrop, { opacity: 0, pointerEvents: "none" });
    }

    bindListeners() {
        this.trigger.addEventListener("click", () => {
            this.open();
        });

        this.closeCart.addEventListener("click", () => {
            this.close();
        });
        document.addEventListener('keyup', (event) => {
            const key = event.key;
            if (key === 'Escape' || key === 'Esc') {
                this.close();
            }
        });
        this.backdrop.addEventListener("click", () => {
            this.close();
        });

    }

    open() {
        if (this.isOpen) { return; }
        this.isOpen = true;
        this.timeline.clear();
        this.timeline
            .to(this.backdrop, { duration: 0.25, opacity: 0.5, force3D: true, ease: "sine.inOut", pointerEvents: "all" })
            .to(this.miniCart, { duration: 0.8, autoAlpha: 1, xPercent: 0, force3D: true, ease: "expo.out" }, 0.05)
            .fromTo(this.shippingBar, { scaleX: 0.3 }, { scaleX: 1, ease: "expo.out", duration: 0.95 }, 0.1);
    }

    close() {
        if (!this.isOpen) { return; }
        this.isOpen = false;
        this.timeline.clear();
        this.timeline
            .to(this.miniCart, { duration: 0.6, autoAlpha: 0, xPercent: 100, force3D: true, ease: "expo.out" })
            .to(this.backdrop, { duration: 0.25, opacity: 0, force3D: true, ease: "sine.inOut", pointerEvents: "none" }, 0.1);

    }

    resize() {
        this.yDist = this.fadeEls.getBoundingClientRect().height;
        if (!this.isOpen) {
            gsap.set(this.fadeEls, { y: this.yDist });
        }
    }
}
