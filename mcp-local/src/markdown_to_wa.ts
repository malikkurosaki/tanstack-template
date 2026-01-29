
export function markdownToWhatsApp(text: string): string {
	if (!text) return "";

	let result = text;

	// Normalize line endings to \n
	result = result.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

	// Track and restore code blocks to prevent regex interference
	const codeBlocks: string[] = [];
	result = result.replace(/```[\s\S]*?```/g, (match) => {
		codeBlocks.push(match);
		return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
	});

	// Track and restore inline code
	const inlineCodes: string[] = [];
	result = result.replace(/`[^`]+`/g, (match) => {
		inlineCodes.push(match);
		return `__INLINE_CODE_${inlineCodes.length - 1}__`;
	});

	// Bold: **text** or __text__ → *text*
	result = result.replace(/\*\*(.+?)\*\*/g, "*$1*");
	result = result.replace(/__(.+?)__/g, "*$1*");

	// Italic: *text* or _text_ → _text_
	// Use word boundary to avoid matching asterisks used for bold
	result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "_$1_");
	result = result.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, "_$1_");

	// Strikethrough: ~~text~~ → ~text~ (not supported on all WA clients)
	result = result.replace(/~~(.+?)~~/g, "~$1~");

	// Headings: # ## ### → *Heading* (uppercase for emphasis)
	result = result.replace(/^#{1,6}\s+(.+)$/gm, "*$1*");

	// Blockquotes: > text → *text* (as quote indicator)
	result = result.replace(/^>\s*(.+)$/gm, "» $1");

	// Links: [text](url) → text (url)
	result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)");

	// Unordered lists: - or * at line start → •
	result = result.replace(/^[\s]*[-*]\s+/gm, "• ");

	// Ordered lists: 1. 2. at line start → 1) 2)
	result = result.replace(/^[\s]*(\d+)\.\s+/gm, "$1) ");

	// Horizontal rules: --- or *** → ─
	result = result.replace(/^[\s]*[-*]{3,}[\s]*$/gm, "─");

	// Tables - simplify to text representation
	result = result.replace(/\|[^|\n]+\|/g, (match) => {
		return match
			.split("|")
			.filter((cell) => cell.trim())
			.map((cell) => cell.trim())
			.join(" | ");
	});

	// Remove empty bold/italic markers that may have been left
	result = result.replace(/\*\*/g, "").replace(/__/g, "");

	// Restore inline code
	codeBlocks.forEach((code, index) => {
		result = result.replace(
			new RegExp(`__CODE_BLOCK_${index}__`, "g"),
			code.replace(/\n/g, "\n"),
		);
	});

	inlineCodes.forEach((code, index) => {
		result = result.replace(new RegExp(`__INLINE_CODE_${index}__`, "g"), code);
	});

	// Clean up multiple consecutive blank lines
	result = result.replace(/\n{3,}/g, "\n\n");

	// Remove leading/trailing whitespace from each line
	result = result
		.split("\n")
		.map((line) => line.trimEnd())
		.join("\n");

	return result.trim();
}
