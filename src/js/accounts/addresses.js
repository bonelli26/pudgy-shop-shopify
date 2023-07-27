import * as serialize from "form-serialize";
import { feedbackReceived } from "./anims";
import { gsap } from "gsap";
import { $scroll } from "../_global/_renderer";
import { ajax } from "../_global/helpers";

export const deleteAddress = (elem)=>{
	if (elem.classList.contains('processing')) { return; }
	let id = elem.getAttribute("data-address-id");
	let form = document.getElementById("address-edit_" + id);

	let obj = serialize(form, { hash: true });

	obj.type = "address-delete";

	elem.classList.add('processing');
	elem.textContent = "Processing...";

	ajax("/server/storefront-endpoints.php", {
		method: "post",
		type: "json",
		data: JSON.stringify(obj)
	}, (result)=>{
		let success = JSON.parse(result);
		feedbackReceived(JSON.parse(result), elem, form);
	});
};

export const editAddress = (elem, index)=>{
	if (elem.classList.contains('processing')) { return; }
	let id = elem.getAttribute("data-address-id");
	let form = document.querySelectorAll('.edit-forms form')[index];
	gsap.set(document.querySelector('.add-form'), { display: "none" });
	gsap.set(document.querySelector('.edit-forms'), { display: "block" });
	gsap.set(document.querySelectorAll('.edit-forms form'), { display: "none" });
	gsap.set(form, { display: "block" });
	let scrollToVal = (document.querySelector('.edit-forms').getBoundingClientRect().top + document.querySelector('main').scrollTop) - 60;
	$scroll.scrollTo(scrollToVal);
	$scroll.resize();
};
