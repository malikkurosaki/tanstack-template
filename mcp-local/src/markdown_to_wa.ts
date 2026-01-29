export function markdownToTelegram(text: string): string {
	if (!text) return "";

	let result = text;

	// Normalize line endings to \n
	result = result.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

	// Track and restore code blocks to prevent regex interference
	const codeBlocks: string[] = [];
	result = result.replace(/```([\s\S]*?)```/g, (match, code) => {
		codeBlocks.push(match);
		return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
	});

	// Track and restore inline code
	const inlineCodes: string[] = [];
	result = result.replace(/`([^`]+)`/g, (match) => {
		inlineCodes.push(match);
		return `__INLINE_CODE_${inlineCodes.length - 1}__`;
	});

	// Bold: **text** or __text__ → **text**
	result = result.replace(/\*\*(.+?)\*\*/g, "**$1**");
	result = result.replace(/__(.+?)__/g, "**$1**");

	// Italic: *text* or _text_ → __text__ (Telegram uses double underscore)
	result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "__$1__");
	result = result.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, "__$1__");

	// Strikethrough: ~~text~~ → ~~text~~ (same format)
	// Already in correct format for Telegram

	// Spoiler (Telegram-specific): ||text|| - no conversion needed if already present

	// Headings: # ## ### → **Heading**
	result = result.replace(/^#{1,6}\s+(.+)$/gm, "**$1**");

	// Blockquotes: > text → > text (Telegram supports this natively in some clients)
	// Keep as is, or could use alternative format
	result = result.replace(/^>\s*(.+)$/gm, "> $1");

	// Links: [text](url) → [text](url) (Telegram supports markdown links)
	// Keep as is - Telegram supports this format

	// Unordered lists: - or * at line start → •
	result = result.replace(/^[\s]*[-*]\s+/gm, "• ");

	// Ordered lists: 1. 2. at line start → 1. 2. (keep as is)
	// Telegram supports numbered lists in original format

	// Horizontal rules: --- or *** → ━━━━━━━
	result = result.replace(/^[\s]*[-*]{3,}[\s]*$/gm, "━━━━━━━━━━━━━━");

	// Tables - simplify to text representation
	result = result.replace(/\|[^|\n]+\|/g, (match) => {
		return match
			.split("|")
			.filter((cell) => cell.trim())
			.map((cell) => cell.trim())
			.join(" | ");
	});

	// Restore code blocks with proper Telegram formatting
	codeBlocks.forEach((code, index) => {
		// Extract language and code content
		const codeMatch = code.match(/```(\w+)?\n?([\s\S]*?)```/);
		if (codeMatch) {
			const lang = codeMatch[1] || "";
			const content = codeMatch[2];
			// Telegram format: ```language\ncode```
			const telegramCode = lang ? `\`\`\`${lang}\n${content}\`\`\`` : `\`\`\`\n${content}\`\`\``;
			result = result.replace(
				new RegExp(`__CODE_BLOCK_${index}__`, "g"),
				telegramCode
			);
		} else {
			result = result.replace(
				new RegExp(`__CODE_BLOCK_${index}__`, "g"),
				code
			);
		}
	});

	// Restore inline code (Telegram uses same format)
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