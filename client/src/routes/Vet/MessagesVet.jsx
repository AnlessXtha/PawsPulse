import { useContext, useEffect, useRef, useState } from "react";
import { Input } from "@/components/shadcn-components/ui/input";
import { Button } from "@/components/shadcn-components/ui/button";
import { Card } from "@/components/shadcn-components/ui/card";
import { ScrollArea } from "@/components/shadcn-components/ui/scroll-area";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn-components/ui/avatar";
import bg from "@/assets/images/whatsapp_bg.jpg";
import {
  fetchChats,
  fetchSingleChat,
  getChatsStatus,
  selectAllChats,
} from "@/redux/slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "@/context/AuthContext";
import { format } from "timeago.js";
import apiRequest from "@/lib/apiRequest";
import { SocketContext } from "@/context/SocketContext";

const MessagesVet = () => {
  const dispatch = useDispatch();
  const chatStatus = useSelector(getChatsStatus);
  const allChats = useSelector(selectAllChats);

  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const [message, setMessage] = useState("");

  const [chat, setChat] = useState(null);

  console.log("currentUser", currentUser);

  useEffect(() => {
    if (chatStatus === "idle") {
      dispatch(fetchChats());
    }
  }, [chatStatus, dispatch]);

  // console.log(allChats, "allChats");
  const handleOpenChat = async (chatId, receiver) => {
    try {
      const response = await dispatch(fetchSingleChat(chatId));
      setChat({ ...response.payload, receiver });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!message) return;
    try {
      const res = await apiRequest.post(`/messages/${chat.id}`, {
        text: message,
      });
      console.log(res, "res");

      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, res.data],
      }));
      setMessage("");
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put(`/chats/read/${chat.id}`);
      } catch (err) {
        console.log(err);
      }
    };

    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });
    }
    return () => {
      socket?.off("getMessage");
    };
  }, [chat, socket]);

  console.log(chat, "chat");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages]);

  return (
    <div
      className={`flex rounded-md overflow-hidden max-h-full ${
        currentUser?.userType === "owner"
          ? "min-h-[calc(100vh-105px)] p-6"
          : "h-full"
      } `}
    >
      {/* Chat Section */}
      {!chat ? (
        <div
          className={`flex flex-col flex-1 shadow-md items-center justify-center  bg-[#a63e4b]/10  ${
            currentUser?.userType === "owner" ? "max-h-full" : "h-full"
          } `}
          style={{
            background: `url(${bg})`,
            // backgroundSize: "cover",
            // backgroundPosition: "center",
            filter: "contrast(1.2)",
          }}
        >
          <h1 className="text-muted-foreground font-bold text-2xl px-20 text-center content-center w-full h-full bg-[#a63e4b]/10 ">
            Select a chat to start the conversation.{" "}
          </h1>
        </div>
      ) : (
        <div
          className={`flex flex-col flex-1  shadow-md  ${
            currentUser?.userType === "owner"
              ? "max-h-[calc(100vh-155px)] "
              : "max-h-[835px]"
          }`}
          style={{
            background: `url(${bg})`,
            // backgroundSize: "cover",
            // backgroundPosition: "center",
            filter: "contrast(1.2)",
          }}
        >
          <h1 className="text-lg text-gray-100 font-medium p-3 flex gap-2 items-center backdrop-blur-2x1 bg-[#a63e4b]/80 ">
            <Avatar>
              <AvatarImage />
              <AvatarFallback className={"text-black"}>
                {chat?.receiver.firstName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {chat?.receiver?.firstName} {chat?.receiver?.lastName}
          </h1>
          {/* <hr className="border-gray-500" /> */}
          <ScrollArea className="flex-1 overflow-y-auto space-y-4 p-4 bg-[#a63e4b]/10 animate-in fade-in-0 slide-in-from-right-10 duration-300 scrollbar-hide">
            {chat?.messages?.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-lg">
                No messages yet. Start the conversation!
              </div>
            ) : (
              chat?.messages?.map((msg, index) => (
                <div key={index} className="flex flex-col mb-4">
                  <div
                    className={`flex gap-2 items-center ${
                      msg?.userId === currentUser.id
                        ? "justify-end "
                        : "justify-start"
                    }`}
                  >
                    {msg?.userId !== currentUser.id ? (
                      <>
                        <Avatar>
                          <AvatarFallback>
                            {chat?.receiver?.firstName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <Card
                          className={`px-3 py-2 max-w-[75%] bg-gray-100 text-sm ${
                            msg?.userId === currentUser.id
                              ? " bg-[#d9afaf] border-0"
                              : ""
                          }`}
                        >
                          {msg?.text}
                        </Card>

                        <span className="text-gray-800 text-xs font-light mt-4">
                          {format(msg?.createdAt)}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-800 text-xs font-light mt-4">
                          {format(msg?.createdAt)}
                        </span>

                        <Card
                          className={`px-3 py-2 max-w-[75%] bg-gray-100 text-sm ${
                            msg?.userId === currentUser.id
                              ? " bg-[#d9afaf] border-0"
                              : ""
                          }`}
                        >
                          {msg?.text}
                        </Card>

                        <Avatar>
                          <AvatarFallback>
                            {currentUser?.firstName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
          <div className="flex items-center gap-2 p-3 bg-[#a63e4b]/10">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </div>
      )}

      {/* Connections Section */}
      <div className="w-[250px] bg-gray-200 shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">Connections</h2>
        <ScrollArea className="h-[calc(100%-32px)] space-y-3">
          {allChats?.map((chatContent) => {
            const isSelected = chat?.id === chatContent.id;
            return (
              <div
                key={chatContent.id}
                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${
                  isSelected
                    ? "bg-[#a63e4b] text-white"
                    : chatContent.seenBy.includes(currentUser.id)
                    ? "hover:bg-muted"
                    : "bg-[#ebb8b8] hover:bg-[#ebb8b8]/80"
                }`}
                onClick={() =>
                  handleOpenChat(chatContent.id, chatContent.receiver)
                }
              >
                <Avatar>
                  <AvatarFallback className={`${isSelected && "text-black"}`}>
                    {chatContent.receiver?.firstName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {chatContent.receiver?.firstName}{" "}
                  {chatContent.receiver?.lastName}
                </span>
              </div>
            );
          })}
        </ScrollArea>
      </div>
    </div>
  );
};

export default MessagesVet;
