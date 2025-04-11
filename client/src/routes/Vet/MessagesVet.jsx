import React, { useState } from "react";
import { Input } from "@/components/shadcn-components/ui/input";
import { Button } from "@/components/shadcn-components/ui/button";
import { Card } from "@/components/shadcn-components/ui/card";
import { ScrollArea } from "@/components/shadcn-components/ui/scroll-area";
import {
  Avatar,
  AvatarFallback,
} from "@/components/shadcn-components/ui/avatar";

const mockMessages = [
  { sender: "user", content: "Hello! How can I help your pet today?" },
  { sender: "vet", content: "My dog has been vomiting since yesterday." },
  { sender: "user", content: "Noted. Can you tell me if the dog has a fever?" },
];

const mockConnections = ["John Doe", "Jane Smith", "Emily Vet"];

const MessagesVet = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, { sender: "user", content: message }]);
    setMessage("");
  };

  return (
    <div className="flex h-full  gap-4">
      {/* Chat Section */}
      <div className="flex flex-col flex-1 bg-white shadow-md p-4">
        <h1 className="text-3xl font-bold mb-4">Chat</h1>
        <ScrollArea className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-lg">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <Card className="p-3 max-w-[75%] bg-gray-100 text-sm">
                  {msg.content}
                </Card>
              </div>
            ))
          )}
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>

      {/* Connections Section */}
      <div className="w-[250px] bg-white shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Connections</h2>
        <ScrollArea className="h-[calc(100%-32px)] space-y-3">
          {mockConnections.map((name, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer"
            >
              <Avatar>
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{name}</span>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

export default MessagesVet;
