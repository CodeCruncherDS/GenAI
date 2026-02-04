import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

marked.setOptions({
  gfm: true,
  breaks: false
});

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "svg", "path"]),
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "title"],
    svg: ["viewBox", "xmlns", "width", "height", "role", "aria-label"],
    path: ["d", "fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"]
  },
  allowedSchemes: ["http", "https", "mailto"],
  disallowedTagsMode: "discard"
};

export function markdownToHtml(markdown: string): string {
  const raw = marked.parse(markdown) as string;
  return sanitizeHtml(raw, sanitizeOptions);
}
