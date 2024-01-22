import { Avatar, Divider, Flex, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext.jsx";
import messageSound from "../assets/sounds/message.mp3";
import { host } from "../APIRoute/APIRoute.js";


const MessageContainer = () => {
	const showToast = useShowToast();
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const [loadingMessages, setLoadingMessages] = useState(true);
	const [messages, setMessages] = useState([]);
	const currentUser = useRecoilValue(userAtom);

	const { socket } = useSocket();
	const setConversations = useSetRecoilState(conversationsAtom);
	const messageEndRef = useRef(null);


	useEffect(() => {
		socket.on("newMessage", (message) => {
			if (selectedConversation._id === message.conversationId) {
				setMessages((prev) => [...prev, message]);
			}

			// make a sound if the window is not focused
			if (!document.hasFocus()) {
				const sound = new Audio(messageSound);
				sound.play();
			}

			setConversations((prev) => {
				const updatedConversations = prev.map((conversation) => {
					if (conversation._id === message.conversationId) {
						return {
							...conversation,
							lastMessage: {
								text: message.text,
								sender: message.sender,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
		});

		return () => socket.off("newMessage");
	}, [socket, selectedConversation, setConversations]);

	useEffect(() => {
		const lastMessageIsFromOtherUser = messages.length && messages[messages.length - 1].sender !== currentUser._id;

		if (lastMessageIsFromOtherUser) {
			socket.emit("markMessagesAsSeen", {
				conversationId: selectedConversation._id,
				userId: selectedConversation.userId,
			});
		}

		socket.on("messagesSeen", ({ conversationId }) => {
			if (selectedConversation._id === conversationId) {
				setMessages((prev) => {
					const updatedMessages = prev.map((message) => {
						if (!message.seen) {
							return {
								...message,
								seen: true,
							};
						}
						return message;
					});
					return updatedMessages;
				});
			}
		});
	}, [socket, currentUser._id, messages, selectedConversation]);

	useEffect(() => {
		const getMessages = async () => {
			setLoadingMessages(true);
			setMessages([]);

			try {
				if (selectedConversation.mock) return;

				const res = await fetch(`${host}/api/messages/${selectedConversation.userId}`);
				const data = await res.json();

				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setMessages(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoadingMessages(false);
			}
		};

		getMessages();
	}, [showToast, selectedConversation.userId, selectedConversation.mock]);


	//	Handle deleted message
	useEffect(() => {
		const handleDeleteMessage = (deletedMessageId) => {
		  setMessages((prevMessages) => prevMessages.filter(message => message._id !== deletedMessageId));
		};

		// Listen for the 'messageDeleted' event
		socket.on('messageDeleted', handleDeleteMessage);

		return () => {
		  // Clean up the event listener when the component is unmounted
		  socket.off('messageDeleted', handleDeleteMessage);
		};
	}, [socket]);


	useEffect(() => {
		// Scroll to the bottom of the container when messages change
		if (messageEndRef.current) {
		  messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<Flex
      		flex='70'
      		bg={useColorModeValue("whitesmoke", "gray.dark")}
      		borderRadius={"md"}
      		p={2}
      		flexDirection={"column"}
      		position="relative"
      		overflow="hidden"
			minH={"100vh"}
		>
			{/* Message header */}
			<Flex w={"full"} h={12} alignItems={"center"} gap={2}>
				<Avatar src={selectedConversation.userProfilePic} size={"sm"} ml={"3"} mr={"1"} />
				<Text display={"flex"} alignItems={"center"}>
					{selectedConversation.username}
				</Text>
			</Flex>

			<Divider h={"0.5"} bg={useColorModeValue("gray.dark", "white")} />

			<Flex flexDir={"column"} gap={4} my={4} p={2} height={"70vh"} overflowY={"auto"}>
				{loadingMessages &&
					[...Array(5)].map((_, i) => (
						<Flex
							key={i}
							gap={2}
							alignItems={"center"}
							p={1}
							borderRadius={"md"}
							alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
						>
							{i % 2 === 0 && <SkeletonCircle size={7} />}
							<Flex flexDir={"column"} gap={2}>
								<Skeleton h='8px' w='250px' />
								<Skeleton h='8px' w='250px' />
								<Skeleton h='8px' w='250px' />
							</Flex>
							{i % 2 !== 0 && <SkeletonCircle size={7} />}
						</Flex>
					))}

				{!loadingMessages &&
					messages.map((message) => (
						<Flex
							key={message._id}
							direction={"column"}
							ref={messages.length - 1 === messages.indexOf(message) ? messageEndRef : null}
						>
							<Message message={message} ownMessage={currentUser._id === message.sender} />
						</Flex>
					))}
			</Flex>
			<Flex
				position="absolute"
        		bottom="0"
        		width="100%"
        		borderRadius="md"
			>
				<MessageInput setMessages={setMessages} />
			</Flex>
		</Flex>
	);
};

export default MessageContainer;
