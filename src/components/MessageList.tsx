import React from 'react';
import type { ChatMessage } from '../types';
import Message from './Message';

type MessageListProps = { messages: ChatMessage[] };

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div role="log" aria-live="polite" className="space-y-3">
      {messages.map((m) => (
        <Message key={m.id} message={m} />
      ))}
    </div>
  );
};

export default MessageList;
