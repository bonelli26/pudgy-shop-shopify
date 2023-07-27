import { gsap } from "gsap";
import {$scroll} from "../_global/_renderer";
import {$slideShow} from "../_global/anims";
export class Tilt {
    constructor(element, settings = {}) {
        this.width = null;
        this.height = null;
        this.clientWidth = null;
        this.clientHeight = null;
        this.left = null;
        this.top = null;

        this.transitionTimeout = null;
        this.updateCall = null;
        this.event = null;

        this.updateBind = this.update.bind(this);
        this.resetBind = this.reset.bind(this);

        this.element = element;
        this.tiltElement = element.querySelector(".inner");

        this.settings = this.extendSettings(settings);

        this.reverse = 1;

        this.elementListener = this.getElementListener();

        this.addEventListeners();
        this.updateInitialPosition();
    }

    getElementListener() {

        if (typeof this.settings["mouse-event-element"] === "string") {
            const mouseEventElement = document.querySelector(this.settings["mouse-event-element"]);

            if (mouseEventElement) {
                return mouseEventElement;
            }
        }

        if (this.settings["mouse-event-element"] instanceof Node) {
            return this.settings["mouse-event-element"];
        }

        return this.element;
    }

    addEventListeners() {
        this.onMouseEnterBind = this.onMouseEnter.bind(this);
        this.onMouseMoveBind = this.onMouseMove.bind(this);
        this.onMouseLeaveBind = this.onMouseLeave.bind(this);
        this.onWindowResizeBind = this.onWindowResize.bind(this);
        this.elementListener.addEventListener("mouseenter", this.onMouseEnterBind);
        this.elementListener.addEventListener("mouseleave", this.onMouseLeaveBind);
        this.elementListener.addEventListener("mousemove", this.onMouseMoveBind);
    }

    removeEventListeners() {
        this.elementListener.removeEventListener("mouseenter", this.onMouseEnterBind);
        this.elementListener.removeEventListener("mouseleave", this.onMouseLeaveBind);
        this.elementListener.removeEventListener("mousemove", this.onMouseMoveBind);
    }

    destroy() {
        clearTimeout(this.transitionTimeout);
        if (this.updateCall !== null) {
            cancelAnimationFrame(this.updateCall);
        }

        this.reset();

        this.removeEventListeners();
        this.element.vanillaTilt = null;
        delete this.element.vanillaTilt;

        this.element = null;
    }

    onMouseEnter() {

        this.updateElementPosition();
        gsap.to(this.tiltElement, { duration: 2, scale: 1.03, force3D: true, ease: "circ.out" });
    }

    onMouseMove(event) {
        if ($scroll.state.scrollingTo || $scroll.state.scrolling || $slideShow.changingSlide) {
            return;
        }

        if (this.updateCall !== null) {
            cancelAnimationFrame(this.updateCall);
        }

        this.event = event;
        this.updateCall = requestAnimationFrame(this.updateBind);
    }

    onMouseLeave() {
        if (this.settings.reset) {
            requestAnimationFrame(this.resetBind);
        }
    }

    reset() {
        if ($scroll.state.scrollingTo || $slideShow.changingSlide) {
            return;
        }
        this.event = {
            clientX: this.left + this.width / 2,
            clientY: this.top + this.height / 2
        };
        gsap.to(this.tiltElement, { duration: 1.5, scale: 1, rotationX: 0, rotationY: 0, x: 0, y: 0, force3D: true, ease: "circ.out" });
    }

    updateInitialPosition() {
        if (this.settings.startX === 0 && this.settings.startY === 0) {
            return;
        }

        this.onMouseEnter();

        this.event = {
            clientX: this.left + ((this.settings.startX + this.settings.maxX) / (2 * this.settings.maxX) * this.width),
            clientY: this.top + ((this.settings.startY + this.settings.maxY) / (2 * this.settings.maxY) * this.height)
        };


        let backupScale = this.settings.scale;
        this.settings.scale = 1;
        this.update();
        this.settings.scale = backupScale;
    }

    getValues() {
        let x, y;

        x = (this.event.clientX - this.left) / this.width;
        y = (this.event.clientY - this.top) / this.height;

        x = Math.min(Math.max(x, 0), 1);
        y = Math.min(Math.max(y, 0), 1);

        let tiltX = (-1 * (this.settings.maxX - x * this.settings.maxX * 2)).toFixed(2);
        let tiltY = (this.reverse * (y * this.settings.maxY * 2 - this.settings.maxY)).toFixed(2);

        return {
            tiltX: tiltX,
            tiltY: tiltY
        };
    }

    updateElementPosition() {
        let rect = this.element.

        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
        this.left = rect.left;
        this.top = rect.top;
    }

    update() {
        let values = this.getValues();
        gsap.to(this.tiltElement, { duration: 0.6, rotationX: (values.tiltY), rotationY: (values.tiltX * -1), force3D: true, ease: "sine.out" });

        this.updateCall = null;
    }

    updateClientSize() {
        this.clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        this.clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }

    onWindowResize() {
        this.updateClientSize();
    }

    extendSettings(settings) {
        let defaultSettings = {
            reverse: true,
            maxX: 4,
            maxY: 4,
            startX: 0,
            startY: 0,
            easing: "cubic-bezier(0, 0, 0, 1)",
            scale: 1.05,
            speed: 3000,
            transition: true,
            axis: null,
            "mouse-event-element": null,
            reset: true
        };

        let newSettings = {};
        for (let property in defaultSettings) {
            if (property in settings) {
                newSettings[property] = settings[property];
            } else if (this.element.hasAttribute("data-tilt-" + property)) {
                let attribute = this.element.getAttribute("data-tilt-" + property);
                try {
                    newSettings[property] = JSON.parse(attribute);
                } catch (e) {
                    newSettings[property] = attribute;
                }

            } else {
                newSettings[property] = defaultSettings[property];
            }
        }

        return newSettings;
    }
}
