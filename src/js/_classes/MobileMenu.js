import { gsap } from "gsap";

export class MobileMenu {
	constructor() {
		this.mobileMenu = document.getElementById("mobile-menu");
		this.trigger = document.getElementById("hammy-wrapper");
		this.hammy = document.getElementById("hammy");
		this.backdrop = document.getElementById("mobile-menu-backdrop");
		this.isOpen = false;
		this.text1 =  document.querySelector(".hammy-text span:first-of-type");
		this.text2 =  document.querySelector(".hammy-text span:last-of-type");
		this.line1 =  document.querySelector(".hammy line:first-of-type");
		this.line2 = document.querySelector(".hammy line:nth-of-type(2)");
		this.line3 = document.querySelector(".hammy line:last-of-type");
		this.timeline = new gsap.timeline();
		this.bindListeners();
		gsap.set(this.mobileMenu, { y: 40 });
	}

	bindListeners() {
		this.trigger.addEventListener("click", () => {
			if (this.isOpen) {
				this.close();
			} else {
				this.open();
			}
		});
		this.backdrop.addEventListener("click", () => {
			this.close();
		});
	}

	open() {
		this.isOpen = true;

		this.timeline.clear();
		this.timeline.progress(0);

		this.timeline
			.set(this.mobileMenu, { pointerEvents: 'all' })
			.to(this.backdrop, { duration: 0.25, autoAlpha: 1, force3D: true, ease: "sine.inOut" })
			.to(this.mobileMenu, { autoAlpha: 1, duration: 0.3, y: 0, force3D: true, ease: "sine.out" }, 0.1)

			.add("compressHammy", 0)
			.to(this.line1, { duration: 0.2, y: 4.5, transformOrigin:"center", force3D: true, ease: "sine.inOut" }, "compressHammy")
			.to(this.line2, { duration: 0.2, autoAlpha: 0, force3D: true, ease: "sine.inOut" }, "compressHammy")
			.to(this.line3, { duration: 0.2, y: -4.5, transformOrigin: "center", force3D: true, ease: "sine.inOut" }, "compressHammy")
			.to(this.text1, { duration: 0.2, autoAlpha: 0, force3D: true, ease: "sine.inOut" }, "compressHammy")
			.to(this.text2, { duration: 0.2, autoAlpha: 1, force3D: true, ease: "sine.inOut" }, "compressHammy")


			.add("rotateHammy", "<+=0.15")
			.to(this.hammy, { duration: 1.4, rotate: 315,  force3D: true, ease: "expo.out" }, "rotateHammy")
			.to(this.line3 , { duration: 1.3, rotate: 90, y: -3.5, transformOrigin:"center", force3D: true, ease: "expo.out" }, "rotateHammy");
	}


	close() {
		this.isOpen = false;
		this.timeline.clear();
		this.timeline.progress(0);
		this.timeline
			.set(this.mobileMenu, { pointerEvents: 'none' })
			.add("rotateHammy", 0)
			.to(this.hammy, { duration: 0.5, rotate: 0,  force3D: true, ease: "sine.out" }, "rotateHammy")
			.to(this.text1, { duration: 0.2, autoAlpha: 1, force3D: true, ease: "sine.inOut" }, "rotateHammy")
			.to(this.text2, { duration: 0.2, autoAlpha: 0, force3D: true, ease: "sine.inOut" }, "rotateHammy")

			.to(this.line3, { duration: 0.4, rotate: 0, force3D: true, ease: "expo.out" }, 0.3)
			.to(this.mobileMenu, { duration: 0.3, autoAlpha: 0, y: 40, force3D: true, ease: "sine.out" }, 0)

			.add("compressHammy", 0.4)
			.to(this.line1, { duration: 0.22, y: 0, force3D: true, ease: "sine.out" },"compressHammy")
			.to(this.line3, { duration: 0.22, rotate: 0, y: 0, force3D: true, ease: "sine.out"},"compressHammy")
			.to(this.line2, { duration: 0.22, autoAlpha: 1, force3D: true, ease: "sine.out" }, "compressHammy")

			.to(this.backdrop, { duration: 0.25, autoAlpha: 0, force3D: true, ease: "sine.inOut" }, 0);

	}
}
