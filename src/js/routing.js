/*
    Load Plugins / Functions
-------------------------------------------------- */
import Highway from "@dogstudio/highway";
import { onLeave, onEnter, onEnterCompleted } from "./_global/_renderer";
/* --- Highway Renderers --- */
import HomeRenderer from "./home/_renderer";
/* --- Highway Transitions --- */
import BasicFade from "./_transitions/basicFade";
import ProductsRenderer from "./products/_renderer";
import AccountRenderer from "./accounts/_renderer";
import CartRenderer from "./cart/_renderer";

/*
    Setup Core
-------------------------------------------------- */
export const H = new Highway.Core({
	renderers: {
		home: HomeRenderer,
		product: ProductsRenderer,
		account: AccountRenderer,
		cart: CartRenderer,
		addresses: AccountRenderer,
		login: AccountRenderer
	},
	transitions: {
		default: BasicFade
	}
});

/*
    Global Events
-------------------------------------------------- */
H.on("NAVIGATE_OUT", ({ from, trigger, location })=>{
	onLeave(from, trigger, location);
});

H.on("NAVIGATE_IN", ({ to, trigger, location })=>{
	onEnter(to, trigger, location);
});

H.on("NAVIGATE_END", ({ from, to, trigger, location })=>{
	onEnterCompleted(from, to, trigger, location);
});
