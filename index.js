Array.from(document.querySelectorAll("pre code")).forEach(
	(code) => (code.textContent = code.innerHTML.trim())
);

requestAnimationFrame(() => {
	document.querySelectorAll(".input").forEach((input) => {
		const wrapper = input.closest(".wrapper");
		const wc = wrapper.querySelector(".wc");
		const output = wrapper.querySelector(".output");

		output.textContent = process(wc.innerHTML);
	});
});

function process(str) {
	var div = document.createElement("div");
	div.innerHTML = str.trim();

	return format(div, 0).innerHTML;
}

function format(node, level) {
	const indentBefore = new Array(level++ + 1).join("	");
	const indentAfter = new Array(level - 1).join("	");

	for (let i = 0; i < node.children.length; i++) {
		let textNode;

		if (level === 1 && i === 0) {
			textNode = document.createTextNode(indentBefore);
		} else {
			textNode = document.createTextNode("\n" + indentBefore);
		}

		node.insertBefore(textNode, node.children[i]);

		format(node.children[i], level);

		if (node.lastElementChild == node.children[i]) {
			textNode = document.createTextNode("\n" + indentAfter);
			node.appendChild(textNode);
		}
	}

	return node;
}
