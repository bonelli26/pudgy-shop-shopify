import Highway from "@dogstudio/highway";
import { gsap } from "gsap";
import {domStorage, globalStorage} from "../_global/storage";
import {$mobileMenu, $miniCart, $scroll} from "../_global/_renderer";

let globalMask = document.getElementById("global-mask");
/*
	Default Highway Transition
-------------------------------------------------- */
class BasicFade extends Highway.Transition{

	out({from, trigger, done}){
		if ($mobileMenu.isOpen) {
			$mobileMenu.close()
		}
		if ($miniCart.isOpen) {
			$miniCart.close()
		}
		gsap.fromTo(globalMask, 0.3, { autoAlpha: 0 }, { autoAlpha: 1, ease: "sine.out", onComplete: () => {
			gsap.to(domStorage.header, { yPercent: 0, duration: 0.25, force3D: true, ease: "sine.inOut" });
			done();
		} });
	}

	in({from, to, trigger, done}){

		globalStorage.namespace = to.dataset.routerView;

		// Move to top of page
		window.scrollTo(0, 0);

		// Remove old view
		from.remove();
		globalStorage.transitionFinished = true;

		done();
	}
}

export default BasicFade;
