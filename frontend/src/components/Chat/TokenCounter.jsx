import React from "react";
import { Tooltip } from 'antd'
import { useTranslation } from "react-i18next";
import './ai-assistant-drawer.css'

const getTokenLevel = (total) => {
    if (total >= 4500) return 'green';
    if (total >= 2500) return 'yellow';
    return 'red';
};

const TokensCounter = ({ messages, disableTooltip }) => {
    const { t } = useTranslation("ai")
    if (!messages) return null;

    const [latestMessage] = messages.slice(-1);

    const { prompt_tokens, completion_tokens, total_tokens } = latestMessage;

    return (
        <div className="ai-drawer__tokens">
            <Tooltip className="ai-drawer__tokens" title={
                disableTooltip === true ? null :
                    <>
                        <div>Prompt Tokens: {prompt_tokens}</div>
                        <div>Completion Tokens: {completion_tokens}</div>
                    </>
            }>
                <span className={`dot ${getTokenLevel(total_tokens)}`} />
                <span>{total_tokens} tokens</span>
            </Tooltip>
        </div>
    );
};

export default TokensCounter;