import { SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import Conversation from "../ChatComponents/Conversation";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../ChatComponents/MessageContainer";
import { useEffect, useState, useRef } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import UserListItem from "../components/UserListItem";
import axios from "axios";
import { host } from "../APIRoute/APIRoute";


const ChatPage = () => {
	const [search, setSearch] = useState(false);
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingConversations, setLoadingConversations] = useState(true);
	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
	const [conversations, setConversations] = useRecoilState(conversationsAtom);
	const currentUser = useRecoilValue(userAtom);
	const showToast = useShowToast();
	const { socket, onlineUsers } = useSocket();
	const chatPageRef = useRef();


	useEffect(() => {
		const isScrolledDown = () => {
		  const chatPageElement = chatPageRef.current;
		  if (chatPageElement) {
			return chatPageElement.scrollHeight - chatPageElement.scrollTop === chatPageElement.clientHeight;
		  }
		  return false;
		};

		// Scroll chat page to the bottom if the user is already scrolled down
		if (isScrolledDown()) {
		  chatPageRef.current.scrollTop = chatPageRef.current.scrollHeight;
		}
	}, [conversations]);


	useEffect(() => {
		socket?.on("messagesSeen", ({ conversationId }) => {
			setConversations((prev) => {
				const updatedConversations = prev.map((conversation) => {
					if (conversation._id === conversationId) {
						return {
							...conversation,
							lastMessage: {
								...conversation.lastMessage,
								seen: true,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
		});
	}, [socket, setConversations]);


	useEffect(() => {
	  	const getConversations = async () => {
			try {
			  	const res = await axios.get(`${host}/api/messages/conversations`);
			  	const data = res.data;

			  	if (data.error) {
					showToast("Error", data.error, "error");
					return;
			  	}
			  	setConversations(data);
			} catch (error) {
			  	showToast("Error", error.message, "error");
			} finally {
			  	setLoadingConversations(false);
			}
	  	};

	  	getConversations();
	}, [showToast, setConversations, setLoadingConversations]);


	const handleConversationSearch = async (query) => {
	  	setSearch(query);

	  	if (!query) {
			setSearchResults([]);
			return;
	  	}

	  	try {
			setLoading(true);
			const response = await axios.get(`${host}/api/users/getAllUsers`, {
			  	params: {
					search: query,
			  	},
			});

			const data = response.data;
			setSearchResults(data);
	  	} catch (error) {
			showToast("Error", error.message, "error");
	  	} finally {
			setLoading(false);
			setConversations((prevConvs) => [...prevConvs]);
	  	}
	};


	const handleSelectConversation = (conversation) => {
		setSearch(false);
		setSearchResults([]);

		const mockConversation = {
			mock: true,
			lastMessage: {
				text: "",
				sender: "",
			},
			_id: Date.now(),
			participants: [
				{
					_id: conversation._id,
					username: conversation.username,
					profilePic: conversation.profilePic,
				},
			],
		};
		setConversations((prevConvs) => [...prevConvs, mockConversation]);
	};


	return (
		<Box
			justifyContent={"center"}
			alignItems={"center"}
			w={"full"}
			h={"100vh"}
		>
			<Flex
				gap={4}
				flex={{ base: "column", md: "row" }}
				mx={"auto"}
				px={4}
				pt={4}
				bg={useColorModeValue("gray.200", "whiteAlpha.200")}
				maxW={{
					sm: "720px",
					md: "full",
				}}
			>
				<Flex flex={30} gap={2} flexDirection={"column"} mx={"auto"} >
					<Text fontWeight={700} color={useColorModeValue("gray.700", "gray.300")}>
						Chats
					</Text>
					<Flex alignItems={"center"} gap={2}>
						<Input
							bg={"whiteAlpha.400"}
							border={"1px solid"}
							borderColor={useColorModeValue("black", "white")}
							placeholder='Search for a user'
							onChange={(e) => handleConversationSearch(e.target.value)} />
						<Button bg={useColorModeValue("gray.700", "gray.200")} size={"sm"} isLoading={search}>
							<SearchIcon color={useColorModeValue("whitesmoke", "gray.dark")} />
						</Button>
					</Flex>

					{loadingConversations &&
						[0, 1, 2, 3, 4].map((_, i) => (
							<Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
								<Box>
									<SkeletonCircle size={"10"} />
								</Box>
								<Flex w={"full"} flexDirection={"column"} gap={3}>
									<Skeleton h={"10px"} w={"80px"} />
									<Skeleton h={"8px"} w={"90%"} />
								</Flex>
							</Flex>
						))}

						{loading ? (
						  	[0, 1, 2].map((_, i) => (
						  	  	<Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
						  			<Box>
						  			  	<SkeletonCircle size={"10"} />
						  			</Box>
						  			<Flex w={"full"} flexDirection={"column"} gap={3}>
						  				<Skeleton h={"10px"} w={"80px"} />
						  				<Skeleton h={"8px"} w={"90%"} />
						  			</Flex>
						  	  	</Flex>
						  	))
						) : (
						  searchResults?.slice(0, 5).map((user) => (
						    <UserListItem
						      key={user._id}
						      user={user}
						      handleFunction={handleSelectConversation}
						    />
						  ))
						)}


					{!loadingConversations &&
						conversations.map((conversation) => (
							<Conversation
								key={conversation?._id}
								isOnline={onlineUsers.includes(conversation.participants[0]?._id)}
								conversation={conversation}
							/>
						))}
				</Flex>
				{!selectedConversation._id && (
					<Flex
						flex={70}
						borderRadius={"md"}
						p={2}
						h={"100vh"}
						flexDir={"column"}
						alignItems={"center"}
						justifyContent={"center"}
						height={"100vh"}
						marginLeft={"2xl"}
						bg={useColorModeValue("whitesmoke", "whiteAlpha.300")}
					>
						<GiConversation size={100} />
						<Text fontSize={20}>Select a contact to start messaging</Text>
					</Flex>
				)}

				{selectedConversation._id && <MessageContainer />}
			</Flex>
		</Box>
	);
};

export default ChatPage;
