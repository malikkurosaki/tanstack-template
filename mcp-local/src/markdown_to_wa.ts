export function markdownToWhatsApp(text: string): string {
  let result = text;

  // Normalize line endings
  result = result.replace(/\r\n/g, "\n");

  // Code blocks (```code```)
  result = result.replace(/```([\s\S]*?)```/g, (_m, code) => {
    return "```" + code.trim() + "```";
  });

  // Inline code
  result = result.replace(/`([^`]+)`/g, "`$1`");

  // Bold (**text** or __text__)
  result = result.replace(/\*\*(.*?)\*\*/g, "*$1*");
  result = result.replace(/__(.*?)__/g, "*$1*");

  // Italic (*text* or _text_)
  result = result.replace(/(^|[^*])\*(?!\*)([^*]+)\*(?!\*)/g, "$1_$2_");
  result = result.replace(/(^|[^_])_(?!_)([^_]+)_(?!_)/g, "$1_$2_");

  // Strikethrough
  result = result.replace(/~~(.*?)~~/g, "~$1~");

  // Headings (# ## ###)
  result = result.replace(/^#{1,6}\s*(.*)$/gm, "*$1*");

  // Links [text](url)
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)");

  // Unordered lists (- or *)
  result = result.replace(/^[\s]*[-*]\s+/gm, "• ");

  // Ordered lists (1. 2.)
  result = result.replace(/^[\s]*(\d+)\.\s+/gm, "$1) ");

  // Remove remaining markdown symbols that WA doesn't support
  result = result.replace(/[*_~]{2,}/g, "");

  // Trim extra spaces
  return result.trim();
}
