import React, { useState } from 'react'
import { List } from 'antd'
import './ai-assistant-drawer.css'
import { getRelativeTime } from '../../utils/utils'
import TokensCounter from "./TokenCounter"
import ClickableDiv from '../Utils/ClickableDiv'
import { useTranslation } from "react-i18next";

/**
 * Sidebar list of the last 3 conversation starters (first prompts).
 * Props:
 * - messages: Array<{ role, answer_type, answer }>
 * - onSelect: (message) => void
 */
const LatestConversations = ({ items = [], onSelect }) => {
  const [selectedIdx, setSelectedIdx] = useState(null)
  const { t } = useTranslation("ai")

  return (
    <ClickableDiv className="ai-drawer__preview-list">
      <h2>{t("Conversations")}</h2>
      <List
        dataSource={items}
        renderItem={(item, idx) => (
          <List.Item
            tabIndex={0}
            aria-selected={selectedIdx === idx}
            role="button"
            key={idx}
            className={
              `ai-drawer__preview-list-item` +
              (selectedIdx === idx ? ' ai-drawer__preview-list-item--selected' : '')
            }
            onClick={() => {
              setSelectedIdx(idx)
              onSelect(item)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); // Prevent scroll on space
                setSelectedIdx(idx);
                onSelect(item);
              }
            }}
          >
            {<span className="ai-drawer__snippet">{item.snippet}</span>}
            <div className="ai-drawer__summary">
              {<span className="ai-drawer__time-passed">{getRelativeTime(item.lastUpdated)}</span>}
              <TokensCounter message={item.token_data} disableTooltip={true}/>
            </div>
          </List.Item>
        )}
      />
    </ClickableDiv>
  )
}

export default LatestConversations;