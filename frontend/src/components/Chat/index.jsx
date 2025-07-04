// src/components/AI/AIAssistantDrawer.jsx
import { useState, useRef, useLayoutEffect, useEffect, useContext } from 'react'
import { Button, Drawer, Input, Spin, Tooltip } from 'antd'
import { SendOutlined, UnorderedListOutlined, BulbOutlined, FormOutlined } from '@ant-design/icons'
import ChatMessageRenderer from './ChatMessageRenderer'
import LatestConversations from './LatestConversations'
import SuggestionsList from './SuggestionsList'
import { useTranslation } from "react-i18next";
import {
    closeConversation,
    getConversationsList,
    getConversationById
} from '../../api/mockAIService'
import './ai-assistant-drawer.css'
import { AuthContext } from "../../context/AuthContext";
import TokensCounter from './TokenCounter'
import { postAssistantChat } from "../../api/services";

const { TextArea } = Input

const AIAssistantDrawer = ({
    open = false,
    onClose = () => { },
    width = 500
}) => {
    const { t } = useTranslation("ai")
    const [userPrompt, setUserPrompt] = useState('')
    const [messages, setMessages] = useState([])
    const [conversationId, setConversationId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [hasSent, setHasSent] = useState(false)
    const [typingMessageIndex, setTypingMessageIndex] = useState(-1)

    // sidebar toggles
    const [previewOpen, setPreviewOpen] = useState(false)
    const [suggestionsOpen, setSuggestionsOpen] = useState(false)
    const [newChatOpen, setNewChatOpen] = useState(false)

    // For history list
    const [conversationList, setConversationList] = useState([])

    const { userData } = useContext(AuthContext);
    const { first_name } = userData;

    // Fetch conversation list when history sidebar opens
    useEffect(() => {
        if (previewOpen) {
            getConversationsList()
                .then(list => setConversationList(list))
                .catch(console.error)
        }
    }, [previewOpen])

    // measure input wrapper
    const wrapperRef = useRef(null)
    const [wrapperH, setWrapperH] = useState(0)
    useLayoutEffect(() => {
        if (wrapperRef.current) {
            setWrapperH(wrapperRef.current.clientHeight + 16)
        }
    }, [open, hasSent, userPrompt])

    // auto-scroll
    const chatRef = useRef(null)
    const endRef = useRef(null)
    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, isLoading])

    // New Chat: close previous conversation if exists
    const startNewChat = async () => {
        if (messages.length && conversationId) {
            const { info, title } = await closeConversation(conversationId, messages)
            console.log(info, 'Title:', title)
        }
        setMessages([])
        setConversationId(null)
        setHasSent(false)
        setNewChatOpen(true)
        setUserPrompt('')
        setTypingMessageIndex(-1)
    }

    const handleTypingComplete = (messageIndex) => {
        setMessages((prev) =>
            prev.map((msg, idx) =>
                idx === messageIndex ? { ...msg, isTyping: false } : msg
            )
        );
        setTypingMessageIndex(-1);
    };

    const handleSend = async () => {
        if (!userPrompt.trim()) return
        setHasSent(true)
        setIsLoading(true)
        setNewChatOpen(false)

        const userMsg = {
            "role": 'user',
            "answer_type": 'text',
            "answer": userPrompt
        }
        setMessages(m => [...m, userMsg])
        setUserPrompt('');

        try {
            const payload = {
                "prompt": userPrompt
            };
            const response = await postAssistantChat(payload);

            if (!conversationId) setConversationId("conv-test")
            
            // Add the assistant message with typing animation
            setMessages(m => {
                const newMessages = [...m, { role: 'assistant', ...response, isTyping: true }];
                setTypingMessageIndex(newMessages.length - 1);
                return newMessages;
            });

        } catch (err) {
            console.error(err)
            const errorMessage = { role: 'assistant', answer_type: 'text', answer: t("Failed to send message"), isTyping: true };
            setMessages(m => {
                const newMessages = [...m, errorMessage];
                setTypingMessageIndex(newMessages.length - 1);
                return newMessages;
            });
        } finally {
            setIsLoading(false)
            setUserPrompt('')
        }
    }

    const wrapperStyle = hasSent
        ? { bottom: 16, top: 'auto', transform: 'none' }
        : { top: '60%', bottom: 'auto', transform: 'translateY(-50%)' }

    return (
        <Drawer
            title={t("AI Assistant")}
            open={open}
            onClose={onClose}
            width={width}
            destroyOnHidden
            extra={
                <>
                    <Tooltip title={t("New conversation")}>
                        <Button icon={<FormOutlined />} onClick={startNewChat} type="text" />
                    </Tooltip>
                    <Tooltip title={t("Latest convesations")}>
                        <Button icon={<UnorderedListOutlined />} onClick={() => setPreviewOpen(v => !v)} type="text" />
                    </Tooltip>
                    <Tooltip title={t("Suggestions")}>
                        <Button icon={<BulbOutlined />} onClick={() => setSuggestionsOpen(v => !v)} type="text" />
                    </Tooltip>
                </>
            }
        >
            <div
                className="ai-drawer"
            >
                <div
                    className="ai-drawer__inner"
                    style={{ display: 'flex', height: '100%' }}
                >
                    {/* Main chat area */}
                    <div
                        className="ai-drawer__chat-flex"
                        style={{ flex: 1, position: 'relative' }}
                    >
                        {/* Greeting / New Chat header */}
                        {(!hasSent || newChatOpen) && messages.length === 0 && (
                            <div className="ai-drawer__greeting">
                                <div className="ai-drawer__greeting-title">
                                    {newChatOpen ? `${t("New Chat")}` : `${t("Hello")} ${first_name || ""}`}
                                </div>
                                {!newChatOpen && (
                                    <div className="ai-drawer__greeting-subtitle">
                                        {t("What would you like to analyze today?")}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Chat history or preview */}
                        {messages.length > 0 && (
                            <>
                                <div className="ai-drawer__chat_clean">
                                    <Button type="text" onClick={() => {
                                        setMessages([])
                                        setTypingMessageIndex(-1)
                                    }} >{t("Clear")}</Button>
                                </div>
                                <div
                                    ref={chatRef}
                                    className="ai-drawer__chat-history"
                                    style={{ bottom: wrapperH }}
                                >
                                    {messages.map((m, i) => (
                                        <ChatMessageRenderer 
                                            key={i} 
                                            message={m} 
                                            messageIndex={i}
                                            onTypingComplete={handleTypingComplete}
                                        />
                                    ))}
                                    {isLoading && (
                                        <div className="ai-drawer__message-container">
                                            <div className="ai-drawer__spinner">
                                                <Spin size="small" />
                                            </div>
                                        </div>
                                    )}
                                    <div ref={endRef} />
                                </div>
                            </>
                        )}

                        {/* Input */}
                        <div
                            ref={wrapperRef}
                            className="ai-drawer__input-wrapper"
                            style={wrapperStyle}
                        >
                            { /* Tokens lights*/}
                            {messages.length > 0 && <TokensCounter messages={messages} />}

                            <div className="ai-drawer__input-box">
                                <TextArea
                                    rows={4}
                                    placeholder={t("Type your request...")}
                                    value={userPrompt}
                                    onChange={e => setUserPrompt(e.target.value)}
                                    onPressEnter={e => {
                                        if (!e.shiftKey) {
                                            e.preventDefault()
                                            handleSend()
                                        }
                                    }}
                                    className="ai-drawer__textarea"
                                />
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<SendOutlined />}
                                    onClick={handleSend}
                                    loading={isLoading}
                                    disabled={!userPrompt.trim()}
                                    className={
                                        !userPrompt.trim()
                                            ? 'ai-drawer__send-button btn-disabled-gray'
                                            : 'ai-drawer__send-button'
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* History sidebar */}
                    {previewOpen && (
                        <div className="ai-drawer__preview-sidebar">
                            <LatestConversations
                                items={conversationList}
                                onSelect={item =>
                                    getConversationById(item.conversationId)
                                        .then(msgs => {
                                            setMessages(msgs)
                                            setConversationId(item.conversationId)
                                            setHasSent(true)
                                            setPreviewOpen(false)
                                            setTypingMessageIndex(-1)
                                        })
                                        .catch(console.error)
                                }
                            />
                        </div>
                    )}

                    {/* Suggestions sidebar */}
                    {suggestionsOpen && (
                        <div className="ai-drawer__preview-sidebar">
                            <SuggestionsList onSelect={item => console.log(item)} />
                        </div>
                    )}
                </div>
            </div>
        </Drawer>
    )
}

export default AIAssistantDrawer;