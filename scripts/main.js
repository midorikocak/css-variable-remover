function replace(pasteContent) {
	const regexp = /(--.*?): *?(.*?);/gi;
	const rootMatch = pasteContent.match(/:root.*?{([\s\S\n]*?)}/gm);
	if (rootMatch) {
		const root = rootMatch[0];
		const allVars = new Map();
		while ((m = regexp.exec(root)) !== null) {
			if (!isVar(m[2])) {
				allVars.set(m[1].trim(), m[2].trim());
			} else {
				const varname = m[2].replace(/var\((--.*?)\)/gi, "$1").trim();
				allVars.set(m[1], allVars.get(varname));
			}
		}

		let noRoot = pasteContent.replace(/:root.*?{[\s\S\n]*?}\n*/gm, "");
		for (const [key, value] of allVars) {
			const pattern = "var\\(\\s*?" + key + "\\s*?\\)";
			const re = new RegExp(pattern, "gm");
			noRoot = noRoot.replace(re, value);
		}
		return noRoot.replace(/\s*?--.*?:.*?;\n/g, "");
	} else {
		return pasteContent;
	}
}

function isVar(string) {
	const regexp = /var\(--(.*?)\)/gi;
	return regexp.test(string);
}

const options = { lineNumbers: true, styleActiveLine: true, matchBrackets: true };
const pasteArea = document.getElementById("pasteEditor");
const pasteEditor = CodeMirror.fromTextArea(pasteArea, {
	value: pasteArea.value,
	mode: "css",
	...options
});

const convertArea = document.getElementById("convertEditor");
const convertEditor = CodeMirror.fromTextArea(convertArea, {
	value: convertArea.value,
	mode: "css",
	...options
});

const convertButton = document.getElementById("convertButton");
convertButton.addEventListener("click", () => {
	convertEditor.setValue(replace(pasteEditor.getValue()));
});

const clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", () => {
	pasteEditor.setValue("");
	convertEditor.setValue("");
});