import {$miniCart} from "../../_global/_renderer";
import {domStorage, globalStorage} from "../../_global/storage";
import { gsap } from "gsap";

export class AddToCart {

	constructor(){
		this.forms = document.querySelectorAll(".atc-form:not(.bound)");
		this.bindATCEvents();
		this.getCurrentCart(true);
	}

	bindATCEvents(){
		for (let i = 0; i < this.forms.length; i++) {
			let form = this.forms[i];
			form.classList.add("bound");
			const variantBtns = document.querySelectorAll(".pdp-hero .option");
			if (variantBtns.length > 0) {
				/* --- Bind variant change (reflect active choice in UI, change var id on atc button) --- */
				this.bindOptions(form);
			}

			/* --- Setup our form listener --- */
			form.addEventListener("submit", (event)=>{
				event.preventDefault();
				this.addToCart(form);
			});

			/* --- Bind form incrementer (change product count to be added) --- */
			let productIncrements = form.querySelector(".atc-form .increment-wrapper");
			if (productIncrements) {
				let el = productIncrements,
					countEl = el.querySelector(".count"),
					decrease = el.querySelector(".decrease"),
					increase = el.querySelector(".increase"),
					count = 1;

				decrease.addEventListener("click", () => {
					if (count === 1) { return; }
					count = count - 1;
					countEl.textContent = count;
				});
				increase.addEventListener("click", () => {
					count = count + 1;
					countEl.textContent = count;
				});
			}
		}

	}

	/* bindOptions(form) {

		// break apart and store variants
		let addToCartBtn = form.querySelector(".add-to-cart") || form.querySelector(".newsletter");
		let variants = addToCartBtn.dataset.variants;
		if (variants) { variants = variants.split("|||"); } else { return; }
		if (variants[0].length < 2) { return; }

		const varData = [];
		for (let i = 0; i < variants.length; i++) {
			let data = variants[i].split("||"),
				id = data[0],
				title = data[1],
				price = data[2],
				comparePrice = data[3],
				image = data[4],
				available = data[5];

			varData.push({id: id, title: title, price: price, comparePrice: comparePrice, image: image, available: available});

		}

		// addToCartBtn.removeAttribute("data-variants");

		// bind click event to update fields based currently active options
		const pdpHero = document.querySelector(".pdp-hero");
		let options = pdpHero.querySelectorAll(".option");
		const priceEls = pdpHero.querySelectorAll(".price");
		const comparePriceEl = pdpHero.querySelector(".compare-at-price");
		const imgEls = pdpHero.querySelectorAll(".primary-image, .primary-thumbnail");
		const imgTab = pdpHero.querySelectorAll(".img-tab img");
		const allOptionsArr = [];

		for (let i = 0; i < options.length; i++) {
			let option = options[i];

			option.addEventListener("click", () => {
				if (option.classList.contains("active")) { return; }

				const optionArr = [];

				// let img = imgTab[i];
				// if (img) {
				// 	if (img.classList.contains("active")) { return; }
				//
				// 	img.parentElement.querySelector(".active").classList.remove("active");
				// 	img.classList.add("active");
				// }

				option.parentElement.querySelector(".active").classList.remove("active");
				option.classList.add("active");

				const activeOptions = pdpHero.querySelectorAll(".option.active");

				for (let j = 0; j < activeOptions.length; j++) {
					optionArr.push(activeOptions[j].dataset.value);
				}


				let currentVariant = false;

				for (let j = 0; j < varData.length; j++) {
					let matches = 0;
					for (let z = 0; z < optionArr.length; z++) {
						console.log(varData[j].title, optionArr[z])
						if (varData[j].title === optionArr[z]) {
							matches++;
						} else {
							break;
						}
					}
					if (matches === optionArr.length) {
						currentVariant = varData[j];
						break;
					}
				}

				if (currentVariant) {
					priceEls.forEach((priceEl, i) => {
						priceEl.textContent = parseFloat(currentVariant.price.toString().slice(0, -2)).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
					});

					if (currentVariant.comparePrice !== "false") {
						comparePriceEl.textContent = parseFloat(currentVariant.comparePrice.toString().slice(0, -2)).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
					} else {
						comparePriceEl.textContent = "";
					}

					if (currentVariant.available !== "false") {
						addToCartBtn.dataset.id = currentVariant.id;
						addToCartBtn.classList.remove("disabled");
					} else {
						addToCartBtn.classList.add("disabled");
					}
				}
			});

			allOptionsArr.push(options[i].dataset.value);
		}

		if (varData[0].available === "false") {
			for (let j = 1; j < varData.length; j++) {
				if (varData[j].available === "true") {
					const winningOptions = varData[j].title.split(" / ");
					for (let z = 0; z < winningOptions.length; z++) {
						const thisOption = document.querySelector('.option[data-value="'+winningOptions[z]+'"]');
						thisOption.click()
					}
					break;
				}
			}
		}
	} */

	/*
	 * addToCart
	 *	- trigger our add to cart
	 */
	addToCart(form){
		let varID = form.querySelector(".add-to-cart").dataset.id;
		console.log(varID);
		let formData = {
			'items': [{
				'id': varID,
				'quantity': 1
			}]
		};

		fetch(window.Shopify.routes.root + 'cart/add.js', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		}).then(response => {
			fetch(window.Shopify.routes.root + 'cart.js')
				.then(response => response.json())
				.then(data => {
					this.cartItems = data.items;
					this.getCurrentCart()
				});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}
	getCurrentCart(firstBuild = false) {
		fetch(window.Shopify.routes.root + 'cart.js')
			.then(response => response.json())
			.then(data => {
				this.cartItems = data.items;
				if (data.item_count > 0) {
					// domStorage.cartCountEl.textContent = data.item_count;
					// domStorage.miniCartTotal.textContent = "$" + ((data.total_price.toString()).slice(0, -2) + "." + (data.total_price.toString()).slice(-2));
					this.buildMiniCart(data.items);
					this.toggleEmptyCart(false);
					if (!firstBuild) {
						$miniCart.open()
					}
				} else {
					this.toggleEmptyCart(true, true);
					// domStorage.cartCountEl.textContent = "0";
				}
			});

	}

	removeProduct(key, lineItem) {
		let formData = {
			'id': key,
			'quantity': 0
		};
		if (this.cartItems.length === 1) {
			this.toggleEmptyCart(true)
		}
		fetch(window.Shopify.routes.root + 'cart/change.js', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		}).then(response => {
			fetch(window.Shopify.routes.root + 'cart.js')
				.then(response => response.json())
				.then(data => {
					this.getCurrentCart();
				});
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	modifyLineItem(key, quantity) {
		let formData = {
			'id': key,
			'quantity': quantity
		};
		fetch(window.Shopify.routes.root + 'cart/change.js', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		}).then(response => {
			fetch(window.Shopify.routes.root + 'cart.js')
				.then(response => response.json())
				// .then(data => {
				// 	domStorage.cartCountEl.textContent = data.item_count;
				// 	domStorage.miniCartTotal.textContent = "$" + ((data.total_price.toString()).slice(0, -2) + "." + (data.total_price.toString()).slice(-2));
				// });
		}).catch((error) => {
			console.error('Error:', error);
		});
	}

	toggleEmptyCart(empty, instant = false) {
		if (empty) {
			gsap.to(domStorage.miniCartEmptyWrapper, { autoAlpha: 1, ease: "sine.inOut", duration: 0.25 });
			gsap.to(domStorage.miniCartProductsWrapper, { autoAlpha: 0, ease: "sine.inOut", duration: 0.25 });
		} else {
			gsap.set(domStorage.miniCartEmptyWrapper, { autoAlpha: 0 });
			gsap.set(domStorage.miniCartProductsWrapper, { autoAlpha: 1 });
		}
	}

	buildMiniCart(items) {
		let html = ``;
		for (let i = 0; i < items.length; i++) {
			let item = items[i];
			console.log(item)
			/* --- Product --- */
			html += `
				<article class="line-item product" data-id="${item.variant_id}" data-key="${item.key}" data-quantity="${item.quantity}">
					<div class="left">
						<div class="img-wrapper">
							<img src="${item.image}" alt="${item.product_title} - ${item.variant_title}" />
						</div>
						
						<div class="inner">
							<div class="text-wrapper">
								<h1 class="product-name">${item.product_title}</h1>`;
			if (item.variant_title) {
				html += `<h2 class="line-item-subtitle">${item.variant_title}</h2>`
			}
			html += `</div>
							<div class="increment-wrapper">
								<button name="decrease item quantity" aria-label="decrease item quantity" type="button" class="increment decrease" data-type="minus"><svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 1.5H0V0.5H10V1.5Z" fill="black"/></svg></button>
								<span class="count">${item.quantity}</span>
								<button name="increase item quantity" aria-label="increase item quantity" type="button" class="increment increase" data-type="plus"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 1V5.5H1V6.5H5.5V11H6.5V6.5H11V5.5H6.5V1H5.5Z" fill="black"/></svg></button>
							</div>
						</div>						
					</div>
					<div class="right">
						<p class="price line-item-price" data-orig-price="${item.price.toString().slice(0, -2)}">${parseFloat((item.price * item.quantity).toString().slice(0, -2)).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
						
						<button name="remove item" aria-label="remove item" type="button" class="remove">Remove</button>
					</div>
				</article>
			`;
		}

		domStorage.miniCartProductsWrapper.innerHTML = html;

		this.bindMCevents();
	}

	bindMCevents() {
		/* --- Bind increments  --- */
		// let plus = this.form.querySelector()

		let removes = domStorage.miniCart.querySelectorAll(".remove");
		for (let i = 0; i < removes.length; i++) {
			removes[i].addEventListener("click", () => {
				let lineItem = removes[i].closest(".line-item"),
					key = lineItem.dataset.key;
				this.removeProduct(key, lineItem);
			});
		}

		let miniCartIncrements = domStorage.miniCart.querySelectorAll(".increment-wrapper");
		for (let i = 0; i < miniCartIncrements.length; i++) {
			let el = miniCartIncrements[i],
				countEl = el.querySelector(".count"),
				// decrease = el.querySelector(".decrease"),
				// increase = el.querySelector(".increase"),
				parentLineItem = el.parentElement.parentElement.parentElement,
				priceEl = parentLineItem.querySelector(".line-item-price"),
				price = parseFloat(priceEl.dataset.origPrice);
				// count = parseInt(countEl.textContent);

			// decrease.addEventListener("click", () => {
			// 	if (count === 1) {
			// 		this.removeProduct(parentLineItem.dataset.key, parentLineItem);
			// 		return;
			// 	}
			// 	count = count - 1;
			// 	countEl.textContent = count;
			// 	parentLineItem.dataset.quantity = count;
			// 	priceEl.textContent = "$"+(count * price).toFixed(2);
			// 	this.modifyLineItem(parentLineItem.dataset.key, count);
			// });
			// increase.addEventListener("click", () => {
			// 	count = count + 1;
			// 	countEl.textContent = count;
			// 	parentLineItem.dataset.quantity = count;
			// 	priceEl.textContent = "$"+(count * price).toFixed(2);
			// 	this.modifyLineItem(parentLineItem.dataset.key, count);
			// });
		}
	}
}
