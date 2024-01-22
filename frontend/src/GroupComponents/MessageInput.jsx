import {
	Button, ModalContent,
	Flex, ModalHeader,
	Image, ModalOverlay,
	Input, Spinner,
	InputGroup, useDisclosure,
	InputRightElement, Box,
	Modal, Text,
	ModalBody,
	ModalCloseButton,
	useColorModeValue,
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { IoAttachSharp, IoSendSharp, IoDocumentTextSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { BsFillImageFill } from "react-icons/bs";
import { groupAtom, selectedGroupAtom } from "../atoms/groupAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import usePreviewDoc from "../hooks/usePreviewDoc";
import userAtom from "../atoms/userAtom";
import { host } from "../APIRoute/APIRoute.js";


const MessageInput = ({ setMessages }) => {
    const [messageText, setMessageText] = useState("");
    const showToast = useShowToast();
    const selectedGroup = useRecoilValue(selectedGroupAtom);
    const setGroups = useSetRecoilState(groupAtom);

    const { onClose } = useDisclosure();
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
	const { handleDocumentChange, docUrl, setDocUrl } = usePreviewDoc();
    const [isSending, setIsSending] = useState(false);
	const [mediaPicker, setMediaPicker] = useState(false);
    const currentUser = useRecoilValue(userAtom);

    const imageRef = useRef(null);
	const mediaPickerRef = useRef(null);
	const documentRef = useRef(null);


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
			const res = await fetch(`${host}/api/group/sendGroupMessage`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: messageText,
					user: currentUser._id,
                    groupId: selectedGroup._id,
					img: imgUrl,
					doc: docUrl,
					timestamp: new Date().toISOString(),
				}),
			});

			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			setMessages((messages) => [...messages, data]);

			setGroups((prevGroups) => {
				const updatedGroups = prevGroups.map((group) => {
					if (group._id === selectedGroup._id) {
						return {
							...group,
							lastMessage: {
								text: messageText,
								sender: data.sender,
							},
						};
					}
					return group;
				});
				return updatedGroups;
			});

			setMessageText("");
			setImgUrl("");
			setDocUrl("");
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsSending(false);
		}
	};

	return (
		<Flex gap={2} alignItems={"center"} py={10} justifySelf={"flex-end"} w={"95%"}>
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
			<Button px={3} cursor={"pointer"} onClick={() => setMediaPicker(true)} ref={mediaPickerRef}>
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
						bg={useColorModeValue("whiteAlpha.500", "whiteAlpha.300")}
					/>
					<InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
						<IoSendSharp />
					</InputRightElement>
				</InputGroup>
			</form>
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
		</Flex>
	);
};

export default MessageInput;
