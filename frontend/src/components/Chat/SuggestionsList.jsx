import React, { useState } from 'react'
import { List } from 'antd'
import { useTranslation } from "react-i18next";
import './ai-assistant-drawer.css'

/**
 * Sidebar list of the last 3 user prompts.
 * Props:
 * - messages: Array<{ role, answer_type, answer }>
 * - onSelect: (message) => void
 */
const SuggestionsList = ({ suggestions = [], onSelect }) => {

  const { t } = useTranslation("ai")
  const items = suggestions.length > 0
    ? suggestions
    : [
        { id: 's1', text: 'Suggestion 1' },
        { id: 's2', text: 'Suggestion 2' },
        { id: 's3', text: 'Suggestion 3' },
      ]

  // track which preview item is selected
  const [selectedIdx, setSelectedIdx] = useState(null)

  return (
    <div className="ai-drawer__preview-list">
      <h2>Suggestions</h2>
      <List
        dataSource={items}
        renderItem={(item, idx) => (
          <List.Item
            key={idx}
            className={
              `ai-drawer__preview-list-item` +
              (selectedIdx === idx ? ' ai-drawer__preview-list-item--selected' : '')
            }
            onClick={() => {
              setSelectedIdx(idx)
              //onSelect(item)
            }}
          >
            {<span>{item.text}</span>}
          </List.Item>
        )}
      />
    </div>
  )
}

export default SuggestionsList;