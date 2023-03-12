function themeToggle(el) {
	const { value } = el.querySelector("input:checked");

	if (value !== "auto")
		document.documentElement.classList.add(`theme-${value}`);

	Array.from(el.querySelectorAll("input")).forEach((input) => {
		input.addEventListener("change", ({ target }) => {
			["light", "dark"].forEach((mode) =>
				document.documentElement.classList.remove(`theme-${mode}`)
			);

			if (target.value !== "auto")
				document.documentElement.classList.add(`theme-${target.value}`);
		});
	});
}
