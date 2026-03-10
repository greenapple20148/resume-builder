'use client'
/**
 * XSS sanitization utilities for ResumeBuildIn.
 *
 * React JSX escapes values by default, but any time we use
 * dangerouslySetInnerHTML, document.write, or build HTML strings
 * from user input, we must sanitize first.
 */

// Characters that have special meaning in HTML
const HTML_ESCAPE_MAP: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#96;',
}

const HTML_ESCAPE_REGEX = /[&<>"'/`]/g

/**
 * Escape a string for safe insertion into HTML.
 * Use this before injecting any user-generated content into raw HTML.
 */
export function escapeHtml(str: string): string {
    if (!str) return ''
    return str.replace(HTML_ESCAPE_REGEX, (char) => HTML_ESCAPE_MAP[char] || char)
}

/**
 * Strip all HTML tags from a string, leaving only plain text.
 */
export function stripHtml(str: string): string {
    if (!str) return ''
    return str.replace(/<[^>]*>/g, '')
}

/**
 * Allowlist-based HTML sanitizer.
 * Removes all tags/attributes not on the allowlist.
 * This is safer than dangerouslySetInnerHTML with unsanitized content.
 */
const ALLOWED_TAGS = new Set([
    'p', 'br', 'strong', 'b', 'em', 'i', 'u',
    'ul', 'ol', 'li',
    'code', 'pre',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'a', 'span', 'div',
    'blockquote', 'hr',
])

const ALLOWED_ATTRS: Record<string, Set<string>> = {
    a: new Set(['href', 'title', 'target', 'rel']),
    span: new Set(['class', 'className']),
    div: new Set(['class', 'className']),
    code: new Set(['class', 'className']),
    pre: new Set(['class', 'className']),
}

// Unsafe URL schemes
const UNSAFE_URL_PATTERN = /^\s*(javascript|data|vbscript):/i

/**
 * Sanitize an HTML string by removing disallowed tags and attributes.
 * Safe for use with dangerouslySetInnerHTML.
 *
 * Uses a DOM-based approach: parse HTML in a detached document,
 * then walk the tree and strip anything not allowlisted.
 */
export function sanitizeHtml(html: string): string {
    if (!html) return ''

    // Use DOMParser to parse HTML safely (no script execution)
    const parser = new DOMParser()
    const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html')
    const container = doc.body.firstElementChild

    if (!container) return ''

    sanitizeNode(container)

    return container.innerHTML
}

function sanitizeNode(node: Element): void {
    // Process children in reverse order since we may remove nodes
    const children = Array.from(node.childNodes)

    for (const child of children) {
        if (child.nodeType === Node.TEXT_NODE) {
            // Text nodes are safe
            continue
        }

        if (child.nodeType === Node.COMMENT_NODE) {
            // Remove HTML comments (can contain conditional IE exploits)
            node.removeChild(child)
            continue
        }

        if (child.nodeType === Node.ELEMENT_NODE) {
            const el = child as Element
            const tagName = el.tagName.toLowerCase()

            // Remove script, style, iframe, object, embed, form, input, etc.
            if (!ALLOWED_TAGS.has(tagName)) {
                // Replace disallowed tag with its text content
                const textNode = document.createTextNode(el.textContent || '')
                node.replaceChild(textNode, el)
                continue
            }

            // Strip disallowed attributes
            const allowedAttrs = ALLOWED_ATTRS[tagName] || new Set()
            const attrs = Array.from(el.attributes)
            for (const attr of attrs) {
                if (!allowedAttrs.has(attr.name)) {
                    el.removeAttribute(attr.name)
                    continue
                }

                // Sanitize href/src to block javascript: URLs
                if (attr.name === 'href' || attr.name === 'src') {
                    if (UNSAFE_URL_PATTERN.test(attr.value)) {
                        el.removeAttribute(attr.name)
                    }
                }

                // Strip event handlers (onclick, onerror, etc.)
                if (attr.name.startsWith('on')) {
                    el.removeAttribute(attr.name)
                }
            }

            // Force safe link attributes
            if (tagName === 'a') {
                el.setAttribute('rel', 'noopener noreferrer')
                el.setAttribute('target', '_blank')
            }

            // Recursively sanitize children
            sanitizeNode(el)
        }
    }
}

/**
 * Sanitize a URL to prevent javascript: and data: XSS attacks.
 * Returns the URL if safe, or '#' if unsafe.
 */
export function sanitizeUrl(url: string): string {
    if (!url) return '#'
    const trimmed = url.trim()
    if (UNSAFE_URL_PATTERN.test(trimmed)) {
        return '#'
    }
    return trimmed
}

/**
 * Sanitize user input for use in HTML attributes (e.g., title, alt).
 * Escapes HTML entities and strips control characters.
 */
export function sanitizeAttribute(value: string): string {
    if (!value) return ''
    return escapeHtml(value.replace(/[\x00-\x1f\x7f]/g, ''))
}
