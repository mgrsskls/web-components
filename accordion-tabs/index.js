customElements.define(
	"accordion-tabs",
	class AccordionTabs extends HTMLElement {
		#breakpoint;
		#mode;
		#prevMode;
		#resizeObserver;
		#accordion;
		#tabs;

		constructor() {
			super();
		}

		connectedCallback() {
			if (this.closest("code")) return;
			console.log("?");
			this.content = [];

			if (this.hasAttribute("breakpoint")) {
				const breakpoint = this.getAttribute("breakpoint");
				const bpParsed = parseInt(breakpoint, 10);
				let result;

				if (breakpoint.endsWith("rem")) {
					result =
						bpParsed *
						parseInt(
							window.getComputedStyle(document.documentElement).fontSize,
							10
						);
				} else if (breakpoint.endsWith("em")) {
					result =
						bpParsed * parseInt(window.getComputedStyle(this).fontSize, 10);
				} else {
					result = bpParsed;
				}

				this.#breakpoint = result;
			}

			window.requestAnimationFrame(() => {
				this.details = Array.from(this.children);

				this.details.forEach((child) => {
					const title = child.querySelector("summary");

					this.content.push({
						title: title.textContent,
						content: [...title.parentElement.children].filter(
							(el) => el.nodeType === 1 && el !== title
						),
					});
				});

				this.#resizeObserver = new ResizeObserver((entries) => {
					for (const entry of entries) {
						const inlineSize = entry.borderBoxSize[0].inlineSize;

						if (inlineSize < this.#breakpoint) {
							if (this.#mode !== "accordion") {
								this.#renderAccordion();
								this.#mode = this.#prevMode = "accordion";
							}
						} else if (this.#mode !== "tabs") {
							this.#renderTabs();
							this.#mode = this.#prevMode = "tabs";
						}
					}
				});

				this.#resizeObserver.observe(this);
			});
		}

		disconnectedCallback() {
			if (this.#resizeObserver) {
				this.#resizeObserver.disconnect();
			}
		}

		#renderAccordion() {
			if (!this.#accordion) {
				this.#accordion = new AccordionTabsAccordion(this);
			}

			if (this.#prevMode === "tabs") {
				this.#clear();

				this.#accordion.setElements();

				this.#accordion.elements.forEach((detail) => this.appendChild(detail));
			}
		}

		#renderTabs() {
			this.#clear();

			if (this.#tabs) {
				this.#tabs.index = typeof this.index === "number" ? this.index : 0;
				this.#tabs.setElements();
			} else {
				this.#tabs = new AccordionTabsTabs(this);
			}

			const [ol, content] = this.#tabs.elements;

			this.appendChild(ol);

			content.forEach((item) => {
				this.appendChild(item);
			});

			this.#tabs.render(false);
		}

		#clear() {
			Array.from(this.children).forEach((child) => this.removeChild(child));
		}
	}
);

class AccordionTabsAccordion {
	constructor(AccordionTabs) {
		this.AccordionTabs = AccordionTabs;
		this.elements = this.AccordionTabs.details;

		this.elements.forEach((detail, i) => {
			detail
				.querySelector("summary")
				.addEventListener("click", ({ target }) => {
					requestAnimationFrame(() => {
						this.#onToggle(target.closest("details"), i);
					});
				});
		});
	}

	setElements() {
		this.elements.forEach((detail, i) => {
			this.AccordionTabs.content[i].content.forEach((item) =>
				detail.appendChild(item)
			);

			detail.open = i === this.AccordionTabs.index;
		});
	}

	#onToggle(element, i) {
		if (element.open) {
			this.elements.forEach((el) => {
				if (element !== el) {
					el.open = false;
				}
			});
			this.AccordionTabs.index = i;
		} else {
			this.AccordionTabs.index = null;
		}
	}
}

class AccordionTabsTabs {
	#AccordionTabs;
	#buttons = [];
	#divs = [];
	#TabsList;

	constructor(AccordionTabs) {
		this.#AccordionTabs = AccordionTabs;
		this.elements = this.getElements();
		this.index =
			typeof this.#AccordionTabs.index === "number"
				? this.#AccordionTabs.index
				: 0;

		this.#TabsList = new AccordionTabsList(this);
	}

	getElements() {
		const ol = document.createElement("ol");
		const arr = [];

		this.#AccordionTabs.content.forEach(({ title, content }, i) => {
			const button = document.createElement("button");
			const li = document.createElement("li");
			const div = document.createElement("div");

			const id = crypto.randomUUID();
			const idTab = `tab-${id}`;
			const idPanel = `panel-${id}`;

			ol.setAttribute("role", "tablist");
			li.setAttribute("role", "presentation");

			button.textContent = title;
			button.type = "button";
			button.id = idTab;
			button.setAttribute("aria-selected", i === this.index ? "true" : "false");
			button.setAttribute("tabindex", i === this.index ? 0 : -1);
			button.setAttribute("aria-controls", idPanel);
			button.setAttribute("role", "tab");
			this.#buttons.push(button);

			li.appendChild(button);
			ol.appendChild(li);

			content.forEach((item) => {
				div.appendChild(item);
			});

			div.id = idPanel;
			div.hidden = this.index !== i;
			div.setAttribute("role", "tabpanel");
			div.setAttribute("tabindex", "0");
			div.setAttribute("aria-labelledby", idTab);

			arr.push(div);
			this.#divs.push(div);
		});

		return [ol, arr];
	}

	setElements() {
		this.elements[1].forEach((div, i) => {
			this.#AccordionTabs.content[i].content.forEach((item) =>
				div.appendChild(item)
			);
		});
	}

	/**
	 * @param {number} activeTab
	 */
	setActiveTab(activeTab) {
		this.#AccordionTabs.index = this.index = activeTab;

		this.render();
	}

	/**
	 * @returns {void}
	 */
	render(focus = true) {
		this.elements[1].forEach((tabpanel, i) => {
			tabpanel.hidden = i !== this.index;
		});

		this.#TabsList.render(focus);
	}
}

class AccordionTabsList {
	#Tabs;
	#elements;

	/**
	 * @param {object} Tabs
	 */
	constructor(Tabs) {
		this.#Tabs = Tabs;

		this.#elements = Array.from(
			this.#Tabs.elements[0].querySelectorAll("button")
		);

		this.#elements.forEach((button) => {
			button.addEventListener("click", this.#onClick.bind(this));
			button.addEventListener("keydown", this.#onKeydown.bind(this));
		});
	}

	/**
	 * @param {Event} object
	 * @param {HTMLButtonElement} object.currentTarget
	 */
	#onClick({ currentTarget }) {
		this.#Tabs.setActiveTab(this.#elements.indexOf(currentTarget));
	}

	/**
	 * @param {Event} event
	 */
	#onKeydown(event) {
		const { dir } = event.target.closest("[dir]") || document.documentElement;
		let flag = false;

		switch (event.key) {
			case "ArrowLeft":
				if (dir === "rtl") {
					this.#setNextTab();
				} else {
					this.#setPreviousTab();
				}
				flag = true;
				break;

			case "ArrowRight":
				if (dir === "rtl") {
					this.#setPreviousTab();
				} else {
					this.#setNextTab();
				}
				flag = true;
				break;

			case "Home":
				this.#Tabs.setActiveTab(0);
				flag = true;
				break;

			case "End":
				this.#Tabs.setActiveTab(this.#elements.length - 1);
				flag = true;
				break;

			default:
				break;
		}

		if (flag) {
			event.stopPropagation();
			event.preventDefault();
		}
	}

	/**
	 * @returns {void}
	 */
	#setNextTab() {
		this.#Tabs.setActiveTab(
			this.#Tabs.index === this.#elements.length - 1 ? 0 : this.#Tabs.index + 1
		);
	}

	/**
	 * @returns {void}
	 */
	#setPreviousTab() {
		this.#Tabs.setActiveTab(
			this.#Tabs.index === 0 ? this.#elements.length - 1 : this.#Tabs.index - 1
		);
	}

	/**
	 * @returns {void}
	 */
	render(focus = true) {
		this.#elements.forEach((button, i) => {
			if (i === this.#Tabs.index) {
				button.setAttribute("aria-selected", "true");
				button.removeAttribute("tabindex");
				if (focus) {
					button.focus();
				}
			} else {
				button.setAttribute("aria-selected", "false");
				button.setAttribute("tabindex", -1);
			}
		});
	}
}
