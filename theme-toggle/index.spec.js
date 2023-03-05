import ".";

describe("ThemeToggle", () => {
	describe("sortable columns", () => {
		describe("initializing the WC", () => {
			document.body.innerHTML = "<theme-toggle></theme-toggle>";

			test("creates radio buttons", async () => {
				await new Promise((resolve) =>
					requestAnimationFrame(() => {
						expect(
							document.querySelector('input[type="radio"][value="auto"]')
						).toBeTruthy();
						expect(
							document.querySelector('input[type="radio"][value="light"]')
						).toBeTruthy();
						expect(
							document.querySelector('input[type="radio"][value="dark"]')
						).toBeTruthy();
						resolve();
					})
				);
			});
		});

		describe("selecting a light or dark radio button", () => {
			describe("WC without options", () => {
				document.body.innerHTML = "<theme-toggle></theme-toggle>";

				test("adds a class ", async () => {
					await new Promise((resolve) =>
						requestAnimationFrame(() => {
							expect(
								document.querySelector('input[type="radio"][value="auto"]')
							).toBeTruthy();
							expect(
								document.querySelector('input[type="radio"][value="light"]')
							).toBeTruthy();
							expect(
								document.querySelector('input[type="radio"][value="dark"]')
							).toBeTruthy();
							resolve();
						})
					);
				});
			});

			describe("with name option", () => {
				document.body.innerHTML = '<theme-toggle name="test"></theme-toggle>';

				test("adds a class to the html element", async () => {
					await new Promise((resolve) =>
						requestAnimationFrame(() => {
							document.querySelector(
								'input[type="radio"][value="light"]'
							).checked = true;
							document
								.querySelector('input[type="radio"][value="light"]')
								.dispatchEvent(new Event("change"));

							expect(
								document.documentElement.classList.contains("test-light")
							).toBeTruthy();

							resolve();
						})
					);
				});
			});
		});
	});
});
