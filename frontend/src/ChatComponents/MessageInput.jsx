import {
	Box, Button,
	Flex, Image,
	Input, InputGroup,
	InputRightElement, Modal,
	ModalBody, ModalCloseButton,
	ModalContent, ModalHeader,
	ModalOverlay, Spinner,
	useColorModeValue, useDisclosure,
	Text
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { IoSendSharp, IoAttachSharp, IoDocumentTextSharp } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import useShowToast from "../hooks/useShowToast";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from "../hooks/usePreviewImg";
import usePreviewDoc from "../hooks/usePreviewDoc";
import usePreviewVid from "../hooks/usePreviewVideo";
import { host } from "../APIRoute/APIRoute.js";


const MessageInput = ({ setMessages }) => {
	const [messageText, setMessageText] = useState("");
	const showToast = useShowToast();
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const setConversations = useSetRecoilState(conversationsAtom);
	const { onClose } = useDisclosure();
	const [isSending, setIsSending] = useState(false);

	//	Media Sharing
	const [mediaPicker, setMediaPicker] = useState(false);
	const mediaPickerRef = useRef(null);
	const imageRef = useRef(null);
	const documentRef = useRef(null);
	const videoRef = useRef(null);
	const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
	const { handleDocumentChange, docUrl, setDocUrl } = usePreviewDoc();
	const { handleVideoChange, vidUrl, setVidUrl } = usePreviewVid();


	useEffect(() => {
	  // Event listener to close media picker when clicking outside
	  	const handleClickOutside = (event) => {
			if (mediaPicker && mediaPickerRef.current && !mediaPickerRef.current.contains(event.target)) {
			  setMediaPicker(false);
			}
	  	};

	  // Attach the event listener to the document
	  	document.addEventListener('mousedown', handleClickOutside);

	  // Clean up the event listener on component unmount
	  	return () => {
			document.removeEventListener('mousedown', handleClickOutside);
	  	};
	}, [mediaPicker]);


	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!messageText && !imgUrl && !docUrl) return;
		if (isSending) return;

		setIsSending(true);

		try {
			const res = await fetch(`${host}/api/messages`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: messageText,
					recipientId: selectedConversation.userId,
					img: imgUrl,
					doc: docUrl,
					vid: vidUrl,
					timestamp: new Date().toISOString(),
				}),
			});
			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			setMessages((messages) => [...messages, data]);

			setConversations((prevConvs) => {
				const updatedConversations = prevConvs.map((conversation) => {
					if (conversation._id === selectedConversation._id) {
						return {
							...conversation,
							lastMessage: {
								text: messageText,
								sender: data.sender,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
			setMessageText("");
			setImgUrl("");
			setDocUrl("");
			setVidUrl("");
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsSending(false);
		}
	};

	return (
		<Flex gap={2} alignItems={"center"} pb={8} justifySelf={"flex-end"} w={"95%"}>
		{mediaPicker && (
			<Box position={"absolute"} bottom={"20"} p={2} ref={mediaPickerRef} bg={useColorModeValue("yellow.100", "gray.800")} rounded={"md"}>
				<Flex flexDirection={"row"} p={2} pr={5} rounded={"md"} mb={1} cursor={"pointer"} _hover={{ bg: useColorModeValue("orange.200", "gray.600")}} onClick={() => imageRef.current.click()}>
					<BsFillImageFill size={20} />
					<Input type={"file"} accept="image/*" hidden ref={imageRef} onChange={handleImageChange} />
					<Text ml={4}>Photos</Text>
				</Flex>

				<Flex flexDirection={"row"} p={2} pr={5} rounded={"md"} cursor={"pointer"} _hover={{ bg: useColorModeValue("orange.200", "gray.600")}} onClick={() => documentRef.current.click()}>
					<IoDocumentTextSharp size={20} />
					<Input type={"file"} accept="*" hidden ref={documentRef} onChange={handleDocumentChange} />
					<Text ml={4}>Document</Text>
				</Flex>
			</Box>
		)}
			<Button bg={useColorModeValue("gray.300", "whiteAlpha.300")} onClick={() => setMediaPicker(true)} ref={mediaPickerRef}>
				<IoAttachSharp size={20} />
			</Button>
			<form onSubmit={handleSendMessage} style={{ flex: 100 }}>
				<InputGroup>
					<Input
						w={"full"}
						placeholder='Type a message'
						fontSize={"sm"}
						onChange={(e) => setMessageText(e.target.value)}
						value={messageText}
						bg={useColorModeValue("gray.300", "whiteAlpha.300")}
					/>
					<InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
						<IoSendSharp />
					</InputRightElement>
				</InputGroup>
			</form>

			{/*		Image URL		*/}
			<Modal
				isOpen={imgUrl}
				onClose={() => {
					onClose();
					setImgUrl("");
				}}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex mt={5} w={"full"}>
							<Image src={imgUrl} />
						</Flex>
						<Flex justifyContent={"flex-end"} my={2}>
							{!isSending ? (
								<IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />
							) : (
								<Spinner size={"md"} />
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>


			{/*		Document URL	*/}
			<Modal
				isOpen={docUrl}
				onClose={() => {
					onClose();
					setDocUrl("");
				}}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex mt={5} w={"full"} h={"60vh"}>
							<iframe src={docUrl} height={"80%"} />
						</Flex>
						<Flex justifyContent={"flex-end"} my={2}>
							{!isSending ? (
								<IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />
							) : (
								<Spinner size={"md"} />
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>

			{/*		Videoe URL	*/}
			<Modal
				isOpen={vidUrl}
				onClose={() => {
					onClose();
					setVidUrl("");
				}}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex mt={5} w={"full"} h={"60vh"}>
							<iframe src={vidUrl} height={"80%"} />
						</Flex>
						<Flex justifyContent={"flex-end"} my={2}>
							{!isSending ? (
								<IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />
							) : (
								<Spinner size={"md"} />
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Flex>
	);
};

export default MessageInput;
