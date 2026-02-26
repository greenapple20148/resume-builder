import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
    SupportMessage,
    QuickReply,
    INITIAL_QUICK_REPLIES,
    createWelcomeMessage,
    createUserMessage,
    createAssistantMessage,
    sendSupportMessage,
    getFollowUpSuggestions,
} from '../lib/supportAgent'
import '../styles/support-agent.css'

/* ── Simple markdown-to-HTML for chat bubbles ──────────── */
function renderMarkdown(text: string): string {
    return text
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Unordered lists
        .replace(/^[-•]\s+(.*)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
        // Ordered lists
        .replace(/^\d+\.\s+(.*)/gm, '<li>$1</li>')
        // Line breaks → paragraphs
        .split('\n\n')
        .map(block => {
            block = block.trim()
            if (!block) return ''
            if (block.startsWith('<ul>') || block.startsWith('<ol>') || block.startsWith('<li>')) return block
            return `<p>${block.replace(/\n/g, '<br/>')}</p>`
        })
        .join('')
}

function formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/* ── Typing Indicator ──────────────────────────────────── */
function TypingIndicator() {
    return (
        <div className="support-typing">
            <div className="support-typing-dot" />
            <div className="support-typing-dot" />
            <div className="support-typing-dot" />
        </div>
    )
}

/* ── Main Support Agent Component ──────────────────────── */
export default function SupportAgent() {
    const [isOpen, setIsOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const [messages, setMessages] = useState<SupportMessage[]>([createWelcomeMessage()])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [quickReplies, setQuickReplies] = useState<QuickReply[]>(INITIAL_QUICK_REPLIES)
    const [hasUnread, setHasUnread] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const isFirstOpen = useRef(true)

    /* ── Scroll to bottom when messages change ───────────── */
    const scrollToBottom = useCallback(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages, scrollToBottom])

    /* ── Focus input when chat opens ─────────────────────── */
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 350)
        }
    }, [isOpen])

    /* ── Show proactive greeting after 15 seconds ────────── */
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isOpen && isFirstOpen.current) {
                setHasUnread(true)
            }
        }, 15000)
        return () => clearTimeout(timer)
    }, [isOpen])

    /* ── Toggle Chat ─────────────────────────────────────── */
    const toggleChat = useCallback(() => {
        if (isOpen) {
            setIsClosing(true)
            setTimeout(() => {
                setIsOpen(false)
                setIsClosing(false)
            }, 250)
        } else {
            setIsOpen(true)
            setHasUnread(false)
            isFirstOpen.current = false
        }
    }, [isOpen])

    /* ── Send Message ────────────────────────────────────── */
    const handleSend = useCallback(async (text?: string) => {
        const messageText = (text || inputValue).trim()
        if (!messageText || isLoading) return

        // Add user message
        const userMsg = createUserMessage(messageText)
        setMessages(prev => [...prev, userMsg])
        setInputValue('')
        setIsLoading(true)

        // Create placeholder assistant message
        const assistantMsg = createAssistantMessage('', 'streaming')
        setMessages(prev => [...prev, assistantMsg])

        // Update quick replies
        const suggestions = getFollowUpSuggestions(messageText)
        setQuickReplies(suggestions.length > 0 ? suggestions : [])

        try {
            const conversationHistory = messages.filter(m => m.role !== 'system')

            await sendSupportMessage(
                messageText,
                conversationHistory,
                // onStream callback
                (partialText: string) => {
                    setMessages(prev =>
                        prev.map(m =>
                            m.id === assistantMsg.id
                                ? { ...m, content: partialText, status: 'streaming' as const }
                                : m
                        )
                    )
                },
            )

            // Mark as done
            setMessages(prev =>
                prev.map(m =>
                    m.id === assistantMsg.id ? { ...m, status: 'done' as const } : m
                )
            )
        } catch (error: any) {
            console.error('Support agent error:', error)
            setMessages(prev =>
                prev.map(m =>
                    m.id === assistantMsg.id
                        ? {
                            ...m,
                            content: "I'm sorry, I ran into an issue. Please try again, or reach out to our support team at **support@resumebuildin.com** for help.",
                            status: 'error' as const,
                        }
                        : m
                )
            )
        } finally {
            setIsLoading(false)
        }
    }, [inputValue, isLoading, messages])

    /* ── Handle key press ────────────────────────────────── */
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }, [handleSend])

    /* ── Auto-resize textarea ────────────────────────────── */
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value)
        // Auto-resize
        const el = e.target
        el.style.height = 'auto'
        el.style.height = Math.min(el.scrollHeight, 100) + 'px'
    }, [])

    /* ── Clear chat ──────────────────────────────────────── */
    const handleClearChat = useCallback(() => {
        setMessages([createWelcomeMessage()])
        setQuickReplies(INITIAL_QUICK_REPLIES)
    }, [])

    return (
        <>
            {/* ── Floating Action Button ──────────────────── */}
            <button
                id="support-agent-fab"
                className={`support-fab ${isOpen ? 'is-open' : ''}`}
                onClick={toggleChat}
                aria-label={isOpen ? 'Close support chat' : 'Open support chat'}
                title="AI Support Agent"
            >
                {isOpen ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="10" r="0.5" fill="currentColor" />
                        <circle cx="8" cy="10" r="0.5" fill="currentColor" />
                        <circle cx="16" cy="10" r="0.5" fill="currentColor" />
                    </svg>
                )}
                {hasUnread && !isOpen && <span className="support-fab-badge">1</span>}
            </button>

            {/* ── Chat Window ─────────────────────────────── */}
            {isOpen && (
                <div className={`support-window ${isClosing ? 'closing' : ''}`} id="support-agent-window">
                    {/* Header */}
                    <div className="support-header">
                        <div className="support-avatar">🤖</div>
                        <div className="support-header-info">
                            <div className="support-header-name">Craft AI Support</div>
                            <div className="support-header-status">
                                <span className="support-status-dot" />
                                Always online
                            </div>
                        </div>
                        <button
                            className="support-close-btn"
                            onClick={handleClearChat}
                            title="Clear conversation"
                            aria-label="Clear conversation"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="1 4 1 10 7 10" />
                                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                            </svg>
                        </button>
                        <button
                            className="support-close-btn"
                            onClick={toggleChat}
                            title="Close chat"
                            aria-label="Close chat"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="support-messages" id="support-messages-scroll">
                        {messages.map((msg) => (
                            <div key={msg.id}>
                                <div className={`support-msg ${msg.role}`}>
                                    <div className="support-msg-avatar">
                                        {msg.role === 'assistant' ? '🤖' : '👤'}
                                    </div>
                                    <div>
                                        <div
                                            className="support-msg-bubble"
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    msg.status === 'streaming' && !msg.content
                                                        ? '<div class="support-typing"><div class="support-typing-dot"></div><div class="support-typing-dot"></div><div class="support-typing-dot"></div></div>'
                                                        : renderMarkdown(msg.content),
                                            }}
                                        />
                                        <div className="support-msg-time">{formatTime(msg.timestamp)}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Replies */}
                    {quickReplies.length > 0 && !isLoading && (
                        <div className="support-quick-replies">
                            {quickReplies.map((qr, i) => (
                                <button
                                    key={i}
                                    className="support-quick-btn"
                                    onClick={() => handleSend(qr.message)}
                                >
                                    {qr.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="support-input-area">
                        <div className="support-input-wrapper">
                            <textarea
                                ref={inputRef}
                                id="support-agent-input"
                                className="support-input"
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask me anything..."
                                rows={1}
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            className="support-send-btn"
                            onClick={() => handleSend()}
                            disabled={!inputValue.trim() || isLoading}
                            aria-label="Send message"
                            id="support-agent-send"
                        >
                            {isLoading ? (
                                <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Powered By */}
                    <div className="support-powered">
                        Powered by Gemini AI ✦ resumebuildin
                    </div>
                </div>
            )}
        </>
    )
}
