import {$miniCart} from "../../_global/_renderer";
import {domStorage, globalStorage} from "../../_global/storage";
import { gsap } from "gsap";

export class AddToCart {

	constructor(){
		this.forms = document.querySelectorAll(".atc-form:not(.bound)");
		this.shippingMeterBar = document.getElementById("shipping-meter-bar")
		this.shippingNoteOne = document.getElementById("shipping-note-one")
		this.shippingNoteTwo = document.getElementById("shipping-note-two")
		this.shippingThreshold = Number(this.shippingMeterBar.dataset.threshold)
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

	bindOptions(form) {

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
	}

	/*
	 * addToCart
	 *	- trigger our add to cart
	 */
	addToCart(form){
		let varID = form.querySelector(".add-to-cart").dataset.id;

		const count = form.querySelector(".count")
		let quantity
		if (count) {
			quantity = Number(count.textContent)
		} else {
			quantity = 1
		}
		let formData = {
			'items': [{
				'id': varID,
				'quantity': quantity
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
					domStorage.miniCartTotal.textContent = "$" + ((data.total_price.toString()).slice(0, -2) + "." + (data.total_price.toString()).slice(-2));
					this.buildMiniCart(data.items);
					this.toggleEmptyCart(false);
					const easyPrice = Number(((data.total_price.toString()).slice(0, -2) + "." + (data.total_price.toString()).slice(-2)))

					this.incentiveBarPercent = easyPrice / this.shippingThreshold
					if (this.incentiveBarPercent >= 1) {
						this.incentiveBarPercent = 1
						gsap.set(this.shippingNoteOne, { display: "none" })
						gsap.set(this.shippingNoteTwo, { display: "block" })
					} else {
						gsap.set(this.shippingNoteOne, { display: "block" })
						gsap.set(this.shippingNoteTwo, { display: "none" })
					}
					if (!firstBuild) {
						$miniCart.open()
						gsap.to(this.shippingMeterBar, { scaleX: this.incentiveBarPercent, ease: "expo.inOut", duration: 0.8 })
					} else {
						gsap.set(this.shippingMeterBar, { scaleX: this.incentiveBarPercent })
					}
				} else {
					this.toggleEmptyCart(true, true);
					gsap.set(this.shippingNoteOne, { display: "block" })
					gsap.set(this.shippingNoteTwo, { display: "none" })
					if (!firstBuild) {
						gsap.to(this.shippingMeterBar, { scaleX: 0, ease: "expo.inOut", duration: 0.8 })
					} else {
						gsap.set(this.shippingMeterBar, { scaleX: 0 })
					}
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
				.then(data => {
					this.getCurrentCart();
					domStorage.miniCartTotal.textContent = "$" + ((data.total_price.toString()).slice(0, -2) + "." + (data.total_price.toString()).slice(-2));
				});
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
			/* --- Product --- */
			html += `
				<article class="line-item product-tile" data-id="${item.variant_id}" data-key="${item.key}" data-quantity="${item.quantity}">
					<div class="product-image">
						<img src="${item.image}" alt="${item.product_title} - ${item.variant_title}" />
					</div>					
					<div class="product-info">
						<div class="left">
							<div class="line-item-subtitle type">${item.product_type}</div>
							<h1 class="name">${item.product_title}</h1>`;
							if (item.variant_title) {
								html += `<p class="variant">${item.variant_title}</p>`;
							}
						html += `<div class="increment-wrapper quantity">
									<button name="decrease item quantity" aria-label="decrease item quantity" type="button" class="increment decrease" data-type="minus">-</button>
										<span class="count">${item.quantity}</span>
									<button name="increase item quantity" aria-label="increase item quantity" type="button" class="increment increase" data-type="plus">+</button>
								</div>
							</div>
							<div class="right">
								<button class="remove-btn remove" name="remove item" aria-label="remove item" type="button">
									<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
									<g filter="url(#filter0_d_1221_10272)">
									<path d="M3.94888 16.601L9.09662 11.4533L4.14687 6.50352L8.50265 2.14774L13.4524 7.09749L18.6001 1.94975L22.9559 6.30553L17.8082 11.4533L22.7579 16.403L18.4021 20.7588L13.4524 15.809L8.30466 20.9568L3.94888 16.601Z" fill="#FF8B8B"/>
									<path d="M3.59533 16.2474L3.24178 16.601L3.59533 16.9546L7.95111 21.3103L8.30466 21.6639L8.65822 21.3103L13.4524 16.5161L18.0486 21.1123L18.4021 21.4659L18.7557 21.1123L23.1115 16.7566L23.465 16.403L23.1115 16.0495L18.5153 11.4533L23.3095 6.65908L23.663 6.30553L23.3095 5.95197L18.9537 1.5962L18.6001 1.24264L18.2466 1.5962L13.4524 6.39038L8.85621 1.79419L8.50265 1.44063L8.1491 1.79419L3.79332 6.14996L3.43977 6.50352L3.79332 6.85707L8.38952 11.4533L3.59533 16.2474Z" stroke="#00142D"/>
									</g>
									<defs>
									<filter id="filter0_d_1221_10272" x="0.535156" y="0.535645" width="23.835" height="23.8354" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
									<feFlood flood-opacity="0" result="BackgroundImageFix"/>
									<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
									<feOffset dx="-2" dy="2"/>
									<feComposite in2="hardAlpha" operator="out"/>
									<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.0784314 0 0 0 0 0.176471 0 0 0 1 0"/>
									<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1221_10272"/>
									<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1221_10272" result="shape"/>
									</filter>
									</defs>
								</svg>
								</button>
								<div class="price-wrapper">
									<p class="line-item-price" data-orig-price="${(item.price.toString().slice(0, -2) + "." + (item.price.toString()).slice(-2))}">${"$" + ((item.price.toString().slice(0, -2) + "." + (item.price.toString()).slice(-2)) * item.quantity).toFixed(2)}</p>
								</div>
							</div>
						</div>						
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
				decrease = el.querySelector(".decrease"),
				increase = el.querySelector(".increase"),
				parentLineItem = el.parentElement.parentElement.parentElement,
				priceEl = parentLineItem.querySelector(".line-item-price"),
				price = Number(priceEl.dataset.origPrice),
				count = parseInt(countEl.textContent);

			decrease.addEventListener("click", () => {
				if (count === 1) {
					this.removeProduct(parentLineItem.dataset.key, parentLineItem);
					return;
				}
				count = count - 1;
				countEl.textContent = count;
				parentLineItem.dataset.quantity = count;
				priceEl.textContent = "$"+(count * price).toFixed(2);
				this.modifyLineItem(parentLineItem.dataset.key, count);
			});
			increase.addEventListener("click", () => {
				count = count + 1;
				countEl.textContent = count;
				parentLineItem.dataset.quantity = count;
				priceEl.textContent = "$"+(count * price).toFixed(2);
				this.modifyLineItem(parentLineItem.dataset.key, count);
			});
		}
	}
}
