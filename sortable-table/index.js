customElements.define(
	"sortable-table",
	class SortableTable extends HTMLElement {
		#elements;
		#sortBy = {
			col: {
				index: null,
				order: null,
				id: null,
			},
			row: {
				index: null,
				order: null,
				id: null,
			},
		};
		#cells = [];

		constructor() {
			super();
		}

		connectedCallback() {
			window.requestAnimationFrame(() => {
				this.#elements = {
					table: this.querySelector("table"),
					tbody: this.querySelector("tbody"),
					th: Array.from(this.querySelectorAll("th")),
					buttons: {
						col: [],
						row: [],
					},
				};
				this.#elements.allRows = Array.from(this.querySelectorAll("tr"));
				this.#elements.sortableRows = Array.from(
					this.querySelectorAll("tbody tr")
				).filter((tr) => !tr.querySelector('th[scope="col"]'));

				this.#elements.allRows.forEach((row, i) => {
					this.#cells[i] = [];
					Array.from(row.querySelectorAll("td, th")).forEach((cell, k) => {
						cell.dataset.value = cell.textContent;
						cell.dataset.id = `${i}-${k}`;
						this.#cells[i][k] = {
							value: cell.textContent,
							id: cell.dataset.id,
						};
					});
				});

				this.#addElements();
			});
		}

		#addElements() {
			this.#elements.th.forEach((th) => {
				if (
					th.hasAttribute("colspan") ||
					th.hasAttribute("rowspan") ||
					th.querySelector("button[data-scope]") ||
					th.textContent.trim().length === 0
				)
					return;

				const button = document.createElement("button");

				if (th.scope) {
					if (th.scope === "row") {
						button.textContent = "⇄";
						button.dataset.scope = "row";
					} else if (th.scope === "col") {
						button.textContent = "⇵";
						button.dataset.scope = "col";
					}
				} else {
					if (this.#elements.tbody.contains(th)) {
						button.textContent = "⇄";
						button.dataset.scope = "row";
					} else {
						button.textContent = "⇵";
						button.dataset.scope = "col";
					}
				}

				button.type = "button";

				button.addEventListener("click", this.#onSort.bind(this));

				th.appendChild(button);

				this.#elements.buttons[button.dataset.scope].push(button);
			});
		}

		#onSort({ target }) {
			if (target.dataset.scope === "col") {
				this.#sortBy.col.id = target.closest("th").dataset.id;
				this.#setSortDirection("col");

				if (this.#sortBy.row.id === null || this.#sortBy.col.id === null) {
					this.#reset();
				}

				if (this.#sortBy.row.id !== null) {
					this.#elements.buttons.col = [];
					this.#sortRow();
				}

				if (this.#sortBy.col.id !== null) {
					this.#elements.buttons.row = [];
					this.#sortColumn();
				}
			} else {
				this.#sortBy.row.id = target.closest("th").dataset.id;
				this.#setSortDirection("row");

				if (this.#sortBy.row.id === null || this.#sortBy.col.id === null) {
					this.#reset();
				}

				if (this.#sortBy.col.id !== null) {
					this.#elements.buttons.row = [];
					this.#sortColumn();
				}

				if (this.#sortBy.row.id !== null) {
					this.#elements.buttons.col = [];
					this.#sortRow();
				}
			}

			this.#addElements();
			this.#render();
		}

		#setSortDirection(direction) {
			if (!this.#sortBy[direction].order) {
				this.#sortBy[direction].order = "asc";
			} else if (this.#sortBy[direction].order === "asc") {
				this.#sortBy[direction].order = "desc";
			} else {
				this.#sortBy[direction].order = null;
				this.#sortBy[direction].id = null;
			}
		}

		#render() {
			["col", "row"].forEach((direction) => {
				Array.from(
					this.#elements.table.querySelectorAll(
						`button[data-scope="${direction}"]`
					)
				).forEach((button) => {
					if (button.closest("th").dataset.id === this.#sortBy[direction].id) {
						if (direction === "col") {
							button.textContent =
								this.#sortBy[direction].order === "asc" ? "↓" : "↑";
						} else {
							button.textContent =
								this.#sortBy[direction].order === "asc" ? "→" : "←";
						}
						button.setAttribute("aria-pressed", "true");
						this.#sortBy[direction].id = button.closest("th").dataset.id;
					} else {
						if (direction === "col") {
							button.textContent = "⇵";
						} else {
							button.textContent = "⇄";
						}
						button.removeAttribute("aria-pressed");
					}
				});
			});
		}

		#reset() {
			this.#elements.allRows.forEach((row, i) => {
				Array.from(row.querySelectorAll("td, th")).forEach((cell, k) => {
					cell.textContent = this.#cells[i][k].value;
					cell.dataset.value = this.#cells[i][k].value;
					cell.dataset.id = this.#cells[i][k].id;
				});
			});

			this.#elements.buttons = {
				col: [],
				row: [],
			};
		}

		#sortColumn() {
			const columns = this.#getTableContentColumns();
			const th = this.#elements.th.find(
				(th) => th.dataset.id === this.#sortBy.col.id
			);
			const index = Array.from(th.closest("tr").querySelectorAll("th")).indexOf(
				th
			);

			if (this.#sortBy.col.order === "desc") {
				columns.sort((a, b) => this.#sortMatrixDesc(a, b, index));
			} else {
				columns.sort((a, b) => this.#sortMatrixAsc(a, b, index));
			}

			this.#elements.sortableRows.forEach((row, i) => {
				Array.from(row.querySelectorAll("th, td")).forEach((el, k) => {
					el.textContent = columns[i][k].value;
					el.dataset.value = columns[i][k].value;
					el.dataset.id = columns[i][k].id;
				});
			});
		}

		#sortRow() {
			const rows = this.#getTableContentRows();
			const th = this.#elements.th.find(
				(th) => th.dataset.id === this.#sortBy.row.id
			);
			const index = this.#elements.allRows.indexOf(th.closest("tr"));

			if (this.#sortBy.row.order === "desc") {
				rows.sort((a, b) => this.#sortMatrixDesc(a, b, index));
			} else {
				rows.sort((a, b) => this.#sortMatrixAsc(a, b, index));
			}

			this.#elements.allRows.forEach((row, i) => {
				Array.from(row.querySelectorAll("td, th")).forEach((el, k) => {
					if (k === 0) return;
					el.textContent = rows[k - 1][i].value;
					el.dataset.value = rows[k - 1][i].value;
					el.dataset.id = rows[k - 1][i].id;
				});
			});
		}

		#sortMatrixDesc(a, b, index) {
			const aParsed = Number.isNaN(parseInt(a[index].value, 10))
				? a[index].value
				: parseInt(a[index].value, 10);
			const bParsed = Number.isNaN(parseInt(b[index].value, 10))
				? b[index].value
				: parseInt(b[index].value, 10);

			if (aParsed > bParsed) return -1;
			if (aParsed < bParsed) return 1;
			return 0;
		}

		#sortMatrixAsc(a, b, index) {
			const aParsed = Number.isNaN(parseInt(a[index].value, 10))
				? a[index].value
				: parseInt(a[index].value, 10);
			const bParsed = Number.isNaN(parseInt(b[index].value, 10))
				? b[index].value
				: parseInt(b[index].value, 10);

			if (aParsed < bParsed) return -1;
			if (aParsed > bParsed) return 1;
			return 0;
		}

		#getTableContentColumns() {
			const rows = [];

			this.#elements.sortableRows.forEach((tr, i) => {
				rows[i] = [];

				Array.from(tr.querySelectorAll("td, th")).forEach((td) => {
					rows[i].push({ value: td.dataset.value, id: td.dataset.id });
				});
			});

			return rows;
		}

		#getTableContentRows() {
			const cols = [];

			const td =
				this.#elements.table.querySelector('th[scope="row"]') ||
				this.#elements.table.querySelector("tbody td");
			const tr = td.closest("tr");
			const tds = Array.from(tr.querySelectorAll("td"));

			tds.forEach((td, i) => {
				cols[i] = [];
			});

			for (let c = 0; c < cols.length; c++) {
				this.#elements.allRows.forEach((tr) => {
					const tds = Array.from(
						tr.querySelectorAll('td, th:not([scope="row"])')
					).filter(
						(td) => Array.from(tr.querySelectorAll("td, th")).indexOf(td) > 0
					);

					if (tds.length === cols.length) {
						const cell = tds[c];

						if (cell) {
							cols[c].push({ value: cell.dataset.value, id: cell.dataset.id });
						}
					}
				});
			}

			return cols;
		}
	}
);
