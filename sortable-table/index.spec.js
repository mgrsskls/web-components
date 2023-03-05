import ".";

describe("SortableTable", () => {
	describe("sortable columns", () => {
		beforeEach(() => {
			document.body.innerHTML = `
        <sortable-table>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Event</th>
                <th>Venue</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>12 February</td>
                <td>Waltz with Strauss</td>
                <td>Main Hall</td>
              </tr>
              <tr>
                <td>24 March</td>
                <td>The Obelisks</td>
                <td>West Wing</td>
              </tr>
              <tr>
                <td>14 April</td>
                <td>The What</td>
                <td>Main Hall</td>
              </tr>
            </tbody>
          </table>
        </sortable-table>
      `;
		});

		describe("initializing the WC", () => {
			test("creates sort buttons", async () => {
				await new Promise((resolve) =>
					requestAnimationFrame(() => {
						Array.from(document.querySelectorAll("th")).forEach((th) => {
							expect(th.querySelector("button[data-scope]")).toBeTruthy();
						});
						resolve();
					})
				);
			});
		});

		describe("clicking on a sort button", () => {
			test("sorts the column ascending, then descending, then back to original state", async () => {
				await new Promise((resolve) =>
					requestAnimationFrame(() => {
						const initial = [
							["12 February", "Waltz with Strauss", "Main Hall"],
							["24 March", "The Obelisks", "West Wing"],
							["14 April", "The What", "Main Hall"],
						];

						expect(getCellContent()).toEqual(initial);

						document.querySelector("thead button").click();

						expect(getCellContent()).toEqual([
							["12 February", "Waltz with Strauss", "Main Hall"],
							["14 April", "The What", "Main Hall"],
							["24 March", "The Obelisks", "West Wing"],
						]);

						document.querySelector("thead button").click();

						expect(getCellContent()).toEqual([
							["24 March", "The Obelisks", "West Wing"],
							["14 April", "The What", "Main Hall"],
							["12 February", "Waltz with Strauss", "Main Hall"],
						]);

						document.querySelector("thead button").click();

						expect(getCellContent()).toEqual(initial);

						resolve();
					})
				);
			});
		});
	});

	describe("sortable rows", () => {
		beforeEach(() => {
			document.body.innerHTML = `
        <sortable-table>
          <table>
            <tbody>
              <tr>
                <th>Date</th>
                <td>12 February</td>
                <td>24 March</td>
                <td>14 April</td>
              </tr>
              <tr>
                <th>Event</th>
                <td>Waltz with Strauss</td>
                <td>The Obelisks</td>
                <td>The What</td>
              </tr>
              <tr>
                <th>Venue</th>
                <td>Main Hall</td>
                <td>West Wing</td>
                <td>Main Hall</td>
              </tr>
            </tbody>
          </table>
        </sortable-table>
      `;
		});

		describe("clicking on a sort button", () => {
			test("sorts the row ascending, then descending, then back to original state", async () => {
				await new Promise((resolve) =>
					requestAnimationFrame(() => {
						const initial = [
							["12 February", "24 March", "14 April"],
							["Waltz with Strauss", "The Obelisks", "The What"],
							["Main Hall", "West Wing", "Main Hall"],
						];

						expect(getCellContent()).toEqual(initial);

						document.querySelector("tbody button").click();

						expect(getCellContent()).toEqual([
							["12 February", "14 April", "24 March"],
							["Waltz with Strauss", "The What", "The Obelisks"],
							["Main Hall", "Main Hall", "West Wing"],
						]);

						document.querySelector("tbody button").click();

						expect(getCellContent()).toEqual([
							["24 March", "14 April", "12 February"],
							["The Obelisks", "The What", "Waltz with Strauss"],
							["West Wing", "Main Hall", "Main Hall"],
						]);

						document.querySelector("tbody button").click();

						expect(getCellContent()).toEqual(initial);

						resolve();
					})
				);
			});
		});
	});

	describe("sortable columns and sortable rows", () => {
		beforeEach(() => {
			document.body.innerHTML = `
        <sortable-table>
          <table>
            <caption>
              Delivery slots:
            </caption>
            <thead>
              <tr>
                <th></th>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">09:00 &ndash; 11:00</th>
                <td>Closed</td>
                <td>Open</td>
                <td>Open</td>
                <td>Closed</td>
                <td>Closed</td>
              </tr>
              <tr>
                <th scope="row">11:00 &ndash; 13:00</th>
                <td>Open</td>
                <td>Open</td>
                <td>Closed</td>
                <td>Closed</td>
                <td>Closed</td>
              </tr>
              <tr>
                <th scope="row">13:00 &ndash; 15:00</th>
                <td>Open</td>
                <td>Open</td>
                <td>Open</td>
                <td>Closed</td>
                <td>Closed</td>
              </tr>
              <tr>
                <th scope="row">15:00 &ndash; 17:00</th>
                <td>Closed</td>
                <td>Closed</td>
                <td>Closed</td>
                <td>Open</td>
                <td>Open</td>
              </tr>
            </tbody>
          </table>
        </sortable-table>
      `;
		});

		describe("clicking on sort buttons", () => {
			test("sorts the columns and rows ascending, then descending, then back to original state", async () => {
				await new Promise((resolve) =>
					requestAnimationFrame(() => {
						const initial = [
							["Closed", "Open", "Open", "Closed", "Closed"],
							["Open", "Open", "Closed", "Closed", "Closed"],
							["Open", "Open", "Open", "Closed", "Closed"],
							["Closed", "Closed", "Closed", "Open", "Open"],
						];

						expect(getCellContent()).toEqual(initial);

						document.querySelector("thead button").click();

						expect(getCellContent()).toEqual([
							["Closed", "Open", "Open", "Closed", "Closed"],
							["Closed", "Closed", "Closed", "Open", "Open"],
							["Open", "Open", "Closed", "Closed", "Closed"],
							["Open", "Open", "Open", "Closed", "Closed"],
						]);

						document.querySelector("tbody button").click();

						expect(getCellContent()).toEqual([
							["Closed", "Closed", "Closed", "Open", "Open"],
							["Closed", "Open", "Open", "Closed", "Closed"],
							["Open", "Closed", "Closed", "Open", "Closed"],
							["Open", "Closed", "Closed", "Open", "Open"],
						]);

						document.querySelector("thead button").click();

						expect(getCellContent()).toEqual([
							["Open", "Closed", "Closed", "Open", "Closed"],
							["Open", "Closed", "Closed", "Open", "Open"],
							["Closed", "Closed", "Closed", "Open", "Open"],
							["Closed", "Open", "Open", "Closed", "Closed"],
						]);

						document.querySelector("tbody button").click();

						expect(getCellContent()).toEqual([
							["Open", "Open", "Closed", "Closed", "Closed"],
							["Open", "Open", "Closed", "Closed", "Open"],
							["Closed", "Open", "Closed", "Closed", "Open"],
							["Closed", "Closed", "Open", "Open", "Closed"],
						]);

						document.querySelector("thead button").click();

						expect(getCellContent()).toEqual([
							["Closed", "Open", "Open", "Closed", "Closed"],
							["Open", "Open", "Closed", "Closed", "Closed"],
							["Open", "Open", "Open", "Closed", "Closed"],
							["Closed", "Closed", "Closed", "Open", "Open"],
						]);

						document.querySelector("tbody button").click();

						expect(getCellContent()).toEqual(initial);

						resolve();
					})
				);
			});
		});
	});
});

function getCellContent() {
	const arr = [];
	const trs = Array.from(document.querySelectorAll("tbody tr"));

	trs.forEach((tr, i) => {
		arr.push([]);

		Array.from(tr.querySelectorAll("td")).forEach((td) =>
			arr[i].push(td.textContent)
		);
	});

	return arr;
}
