customElements.define(
	"theme-toggle",
	class ThemeToggle extends HTMLElement {
		#DEFAULT_THEMES = ["auto", "light", "dark"];
		#DEFAULT_NAME = "theme";
		#index;
		#name;
		#themes;
		#currentTheme;
		#defaultTheme;
		#inputs;

		constructor() {
			super();
		}

		connectedCallback() {
			this.#index = Array.from(
				document.querySelectorAll("theme-toggle")
			).indexOf(this);

			window.requestAnimationFrame(() => {
				this.#inputs = Array.from(this.querySelectorAll('[type="radio"]'));
				if (this.#inputs.length > 0) {
					this.#name = this.#inputs[0].name;
					this.#themes = this.#inputs.map((option) => option.value);
					this.#currentTheme =
						this.#getStoredTheme() ||
						this.#getCurrentTheme() ||
						this.#themes[0];
				} else {
					this.#name =
						this.getAttribute("name") ||
						`${this.#DEFAULT_NAME}${this.#index > 0 ? `-${this.#index}` : ""}`;
					this.#themes =
						this.getAttribute("themes")?.split(" ") || this.#DEFAULT_THEMES;
					this.#currentTheme = this.#getStoredTheme() || this.#themes[0];
					this.#inputs = this.#addOptions();
				}

				this.#defaultTheme = this.#inputs[0].value;

				this.#render();

				this.#inputs.forEach((input) => {
					input.addEventListener("change", ({ target }) => {
						const { value } = target;

						this.#saveTheme(value);
						this.#render();
					});
				});
			});
		}

		#saveTheme(theme) {
			this.#currentTheme = theme;

			if (theme === this.#defaultTheme) {
				localStorage.removeItem(this.#name);
			} else {
				localStorage.setItem(this.#name, theme);
			}
		}

		#getStoredTheme() {
			return localStorage[this.#name];
		}

		#getCurrentTheme() {
			const checkedInput = this.#inputs.find((input) => input.checked);

			if (checkedInput) return checkedInput.value;

			return null;
		}

		#render() {
			const input = this.#inputs.find(
				(input) => input.value === this.#currentTheme
			);

			if (input) {
				input.checked = true;
			}
		}

		#addOptions() {
			return this.#themes.map((theme) => {
				const div = document.createElement("div");
				const input = document.createElement("input");
				const label = document.createElement("label");
				const id = `${"theme-toggle"}-${this.#index}-${theme}`;

				input.type = "radio";
				input.name = this.#name;
				input.value = theme;
				input.id = id;

				label.setAttribute("for", id);
				label.textContent = theme;

				div.appendChild(input);
				div.appendChild(label);
				this.appendChild(div);

				return input;
			});
		}
	}
);
