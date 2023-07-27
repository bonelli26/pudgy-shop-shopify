import {domStorage, globalStorage} from "../_global/storage";
import { gsap } from "gsap";

export class LandingSlideshow {
    constructor() {
        this.slideDur = parseFloat(domStorage.sceneWrapper.dataset.slideDur);
        this.slideIdx = -1;
        this.zIndex = 4;
        this.timelines = [];
        this.changingSlide = false;
        this.leaving = false;
        this.setupTimelines();
    }

    setupTimelines() {
        let tlOne = new gsap.timeline({ paused: true, onComplete: () => {
                this.changingSlide = false;
            }
        });
        let tlTwo = new gsap.timeline({ paused: true, onComplete: () => {
                this.changingSlide = false;
            }
        });
        let tlThree = new gsap.timeline({ paused: true, onComplete: () => {
                this.changingSlide = false;
            }
        });

        let imagesOne = domStorage.sceneOneFrames;
        let innerOne = domStorage.scenes[0].querySelector(".inner");
        if (globalStorage.windowWidth > 767) {
            tlOne
                .set(domStorage.scenes[0], { autoAlpha: 1 })
                .set(innerOne, { rotation: 0 })
                .fromTo(imagesOne[0], { autoAlpha: 0 }, { autoAlpha: 1, ease: "sine.inOut", duration: 0.35, force3D: true })
                .fromTo([imagesOne[1], imagesOne[2]], { autoAlpha: 0 }, { stagger: 0.09, autoAlpha: 1, ease: "none", duration: 0.2, force3D: true }, 0.1)
                .fromTo([imagesOne[1], imagesOne[2]], { y: 60 }, { stagger: 0.09, y: 0, ease: "sine.inOut", duration: 0.4, force3D: true }, 0.11)
                .fromTo(imagesOne[3], { autoAlpha: 0 }, { autoAlpha: 1, ease: "sine.inOut", duration: 0.35, force3D: true }, 0.15)
                .fromTo(imagesOne[4], { x: -70, y: 70, rotation: 1 }, { x: 0, y: 0, rotation: 0, ease: "sine.out", duration: 0.8, force3D: true }, 0.17)
                .fromTo(imagesOne[4], { autoAlpha: 0 }, { autoAlpha: 1, ease: "none", duration: 0.3, force3D: true }, 0.18)
                .fromTo(imagesOne[5], { autoAlpha: 0, y: 40, scale: 0.95 }, { transformOrigin: "0 100%", x: 0, y: 0, scale: 1, autoAlpha: 1, ease: "sine.out", duration: 0.8, force3D: true, onComplete: () => {
                        gsap.set(domStorage.scenes[2], { autoAlpha: 0 });
                        this.timelines[2].progress(0).pause();
                        this.changingSlide = false;
                    } }, 0.22);
        } else {
            tlOne
                .set(domStorage.scenes[0], { autoAlpha: 1 })
                .set(innerOne, { rotation: 0 })
                .fromTo(imagesOne[0], { autoAlpha: 0 }, { autoAlpha: 1, ease: "sine.inOut", duration: 0.3, force3D: true })
                .fromTo(imagesOne[1], { autoAlpha: 0 }, { autoAlpha: 1, ease: "none", duration: 0.2, force3D: true }, 0.1)
                .fromTo(imagesOne[1], { y: -35 }, { y: 0, ease: "sine.inOut", duration: 0.4, force3D: true }, 0.11)
                .fromTo(imagesOne[2], { x: -10, y: 10, rotation: 1 }, { x: 0, y: 0, rotation: 0, ease: "sine.out", duration: 0.8, force3D: true }, 0.17)
                .fromTo(imagesOne[2], { autoAlpha: 0 }, { autoAlpha: 1, ease: "none", duration: 0.37, force3D: true, onComplete: () => {
                        gsap.set(domStorage.scenes[2], { autoAlpha: 0 });
                        this.timelines[2].progress(0).pause();
                        this.changingSlide = false;
                    } }, 0.18)
        }


        this.timelines.push(tlOne);

        let imagesTwo = domStorage.sceneTwoFrames;
        let innerTwo = domStorage.scenes[1].querySelector(".inner");
        if (globalStorage.windowWidth > 767) {
            tlTwo
                .set(domStorage.scenes[1], { autoAlpha: 1 })
                .set(innerTwo, { rotation: 0 })
                .fromTo(imagesTwo[0], { autoAlpha: 0 }, { autoAlpha: 1, ease: "sine.inOut", duration: 0.35, force3D: true})
                .fromTo(imagesTwo[1], { autoAlpha: 0 }, { autoAlpha: 1, scaleX: 1, ease: "sine.out", duration: 0.5, force3D: true})
                .fromTo(imagesTwo[2], { autoAlpha: 0 }, { autoAlpha: 1, scale: 1, ease: "sine.out", duration: 0.6, force3D: true }, 0.2)
                .fromTo(imagesTwo[3], { y: 60, scale: 0.99 }, { y: 0, scale: 1, ease: "sine.out", duration: 0.5, force3D: true }, 0.3)
                .fromTo(imagesTwo[3], { autoAlpha: 0 }, { autoAlpha: 1, ease: "none", duration: 0.2, force3D: true }, 0.31)
                .fromTo(imagesTwo[4], { autoAlpha: 0 }, { autoAlpha: 1, ease: "sine.inOut", duration: 0.5, force3D: true, onComplete: () => {
                        gsap.set(domStorage.scenes[0], { autoAlpha: 0 });
                        this.timelines[0].progress(0).pause();
                    } }, 0.4);
        } else {
            tlTwo
                .set(domStorage.scenes[1], { autoAlpha: 1 })
                .set(innerTwo, { rotation: 0 })
                .fromTo(imagesTwo[0], { autoAlpha: 0 }, { autoAlpha: 1, ease: "sine.inOut", duration: 0.3, force3D: true})
                .fromTo(imagesTwo[1], { y: 30 }, { y: 0, ease: "sine.out", duration: 0.8, force3D: true}, 0.1)
                .fromTo(imagesTwo[1], { autoAlpha: 0 }, { autoAlpha: 1, ease: "none", duration: 0.3, force3D: true }, 0.11)
                .fromTo(imagesTwo[2], { autoAlpha: 0 }, { autoAlpha: 1, ease: "sine.out", duration: 0.37, force3D: true, onComplete: () => {
                        gsap.set(domStorage.scenes[0], { autoAlpha: 0 });
                        this.timelines[0].progress(0).pause();
                    } }, 0.2)
        }


        this.timelines.push(tlTwo);

        let imagesThree = domStorage.sceneThreeFrames;
        let innerThree = domStorage.scenes[2].querySelector(".inner");
        if (globalStorage.windowWidth > 767) {
            tlThree
                .set(domStorage.scenes[2], { autoAlpha: 1 })
                .set(innerThree, { rotation: 0 })
                .fromTo(imagesThree[0], { autoAlpha: 0 }, { autoAlpha: 1, ease: "sine.inOut", duration: 0.25, force3D: true })
                .fromTo(imagesThree[1], { scale: 0.96, rotation: -1 }, { scale: 1, rotation: 0, ease: "sine.inOut", duration: 0.6, force3D: true }, 0.05)
                .fromTo(imagesThree[1], { autoAlpha: 0 }, { autoAlpha: 1, ease: "sine.inOut", duration: 0.25, force3D: true }, 0.051)
                .fromTo(imagesThree[2], { y: 65, x: 70, rotation: -2 }, { y: 0, x: 0, rotation: 0, ease: "sine.out", duration: 0.65, force3D: true }, 0.17)
                .fromTo(imagesThree[2], { autoAlpha: 0 }, { autoAlpha: 1, ease: "sine.out", duration: 0.65, force3D: true }, 0.21)
                .fromTo(imagesThree[3], { scale: 1.03 }, { scale: 1, ease: "sine.out", duration: 0.5, force3D: true }, 0.12)
                .fromTo(imagesThree[3], { autoAlpha: 0 }, { autoAlpha: 1, ease: "sine.out", duration: 0.5, force3D: true }, 0.13)
                .fromTo(imagesThree[4], { scale: 1.03 }, { scale: 1, ease: "sine.out", duration: 0.5, force3D: true }, 0.12)
                .fromTo(imagesThree[4], { autoAlpha: 0 }, { autoAlpha: 1, ease: "sine.out", duration: 0.5, force3D: true, onComplete: () => {
                        gsap.set(domStorage.scenes[1], { autoAlpha: 0 });
                        this.timelines[1].progress(0).pause();
                    } }, 0.2);
        } else {
            tlThree
                .set(domStorage.scenes[2], { autoAlpha: 1 })
                .set(innerThree, { rotation: 0 })
                .fromTo(imagesThree[0], { autoAlpha: 0 }, { autoAlpha: 1, ease: "sine.inOut", duration: 0.3, force3D: true })
                .fromTo(imagesThree[1], { y: 30, x: 35, rotation: -1 }, { y: 0, x: 0, rotation: 0, ease: "sine.out", duration: 0.8, force3D: true }, 0.05)
                .fromTo(imagesThree[1], { autoAlpha: 0 }, { autoAlpha: 1, ease: "none", duration: 0.3, force3D: true }, 0.051)
                .fromTo(imagesThree[2], { autoAlpha: 0 }, { autoAlpha: 1, ease: "sine.inOut", duration: 0.37, force3D: true, onComplete: () => {
                        gsap.set(domStorage.scenes[1], { autoAlpha: 0 });
                        this.timelines[1].progress(0).pause();
                    } }, 0.17);
        }


        this.timelines.push(tlThree);

        // domStorage.sceneWrapper.addEventListener("click", () => {
        //    this.nextSlide();
        // });
    }

    nextSlide() {
        if (this.changingSlide || this.leaving) { return; }
        this.changingSlide = true;
        this.slideIdx++;
        if (this.slideIdx === 3) {
            this.slideIdx = 0;
        }

        gsap.set(domStorage.scenes[this.slideIdx], { zIndex: this.zIndex });

        switch(this.slideIdx) {
            case 0:
                this.timelines[0].play();
                break;
            case 1:
                this.timelines[1].play();
                break;
            case 2:
                this.timelines[2].play();
                break;
        }

        this.zIndex++;

        gsap.delayedCall(this.slideDur, () => {
            if (this.leaving) {
                return;
            }
           this.nextSlide();
        });
    }

    destroy() {
        this.leaving = true;
        this.slideIdx = -1;
        this.zIndex = 4;
        this.timelines = [];
        this.changingSlide = false;
    }
}
