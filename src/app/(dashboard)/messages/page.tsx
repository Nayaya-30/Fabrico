// app/(dashboard)/messages/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Search,
  Image as ImageIcon,
  Paperclip,
  MoreVertical,
  Loader2,
} from "lucide-react";

interface MessagesPageProps {
  clerkId: string;
  userName: string;
}

export default function MessagesPage({ clerkId, userName }: MessagesPageProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<Id<"conversations"> | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations = useQuery(api.chat.getConversations, { clerkId });
  const messages = useQuery(
    api.chat.getMessages,
    selectedConversationId
      ? { clerkId, conversationId: selectedConversationId }
      : "skip"
  );

  const sendMessage = useMutation(api.chat.sendMessage);
  const markAsRead = useMutation(api.chat.markMessagesAsRead);

  const filteredConversations = conversations?.filter((conv) =>
    conv.otherParticipant?.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (selectedConversationId && messages) {
      markAsRead({ clerkId, conversationId: selectedConversationId });
    }
  }, [selectedConversationId, messages, clerkId, markAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversationId) return;

    try {
      await sendMessage({
        clerkId,
        conversationId: selectedConversationId,
        content: messageText,
      });
      setMessageText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const selectedConversation = conversations?.find(
    (c) => c._id === selectedConversationId
  );

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="grid lg:grid-cols-[350px_1fr] gap-6 h-full">
        {/* Conversations List */}
        <Card className="h-full flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations?.map((conversation) => (
              <button
                key={conversation._id}
                onClick={() => setSelectedConversationId(conversation._id)}
                className={`w-full p-4 border-b hover:bg-accent transition text-left ${
                  selectedConversationId === conversation._id ? "bg-accent" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold shrink-0">
                    {conversation.otherParticipant?.fullName.charAt(0) || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold truncate">
                        {conversation.otherParticipant?.fullName || "Unknown User"}
                      </p>
                      {conversation.lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(conversation.lastMessage.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    {conversation.lastMessage && (
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage.content}
                      </p>
                    )}
                    {conversation.unreadCount > 0 && (
                      <Badge variant="default" className="mt-1">
                        {conversation.unreadCount} new
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}

            {filteredConversations?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No conversations found</p>
              </div>
            )}
          </div>
        </Card>

        {/* Messages Area */}
        <Card className="h-full flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {selectedConversation.otherParticipant?.fullName.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {selectedConversation.otherParticipant?.fullName || "Unknown User"}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {selectedConversation.otherParticipant?.role}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages === undefined ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {messages.map((message) => {
                      const isSent = message.sender?.clerkId === clerkId;
                      return (
                        <div
                          key={message._id}
                          className={`flex ${isSent ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              isSent
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {!isSent && (
                              <p className="text-xs font-semibold mb-1">
                                {message.sender?.fullName}
                              </p>
                            )}
                            <p className="text-sm">{message.content}</p>
                            {message.media && message.media.length > 0 && (
                              <div className="mt-2 grid grid-cols-2 gap-2">
                                {message.media.map((url, idx) => (
                                  <img
                                    key={idx}
                                    src={url}
                                    alt="Attachment"
                                    className="rounded-md w-full"
                                  />
                                ))}
                              </div>
                            )}
                            <p
                              className={`text-xs mt-1 ${
                                isSent ? "text-primary-foreground/70" : "text-muted-foreground"
                              }`}
                            >
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon">
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!messageText.trim()}>
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Send className="h-10 w-10 text-muted-foreground" />
                </div>
                <p className="text-lg font-semibold mb-2">Select a conversation</p>
                <p className="text-sm text-muted-foreground">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
