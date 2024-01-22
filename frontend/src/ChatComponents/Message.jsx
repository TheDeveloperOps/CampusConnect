import {
	Avatar,
	Box,
	Button,
	Flex,
	Image,
	Link,
	Skeleton,
	Text,
	Tooltip,
	useColorModeValue,
	useDisclosure
} from "@chakra-ui/react";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import DeleteMessage from "../components/DeleteMessage";

const Message = ({ ownMessage, message }) => {
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const user = useRecoilValue(userAtom);
	const [showDeleteMessage, setShowDeleteMessage] = useState(false);
	const [isTooltipOpen, setIsTooltipOpen] = useState(false);
	const [imgLoaded, setImgLoaded] = useState(false);
	const [docLoaded, setDocLoaded] = useState(false);
	const [vidLoaded, setVidLoaded] = useState(false);
	const [formattedTimestamp, setFormattedTimestamp] = useState("");
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
	  	if (message.createdAt) {
			const formattedDate = format(new Date(message.createdAt), "HH:mm");
			setFormattedTimestamp(formattedDate);
	  	}
	}, [message.createdAt]);

	const handleBubbleClick = () => {
		setShowDeleteMessage(true);
		onOpen();
  	};


	return (
		<>
			{ownMessage ? (
				<Flex gap={2} alignSelf={"flex-start"}>
					<Avatar src={user.profilePic} w='7' h={7} />
					{message.text && (
					<Tooltip
						isOpen={isTooltipOpen}
            			label="Double click to delete this message"
            			placement="top"
            			onClose={() => setIsTooltipOpen(false)}
					>
						<Flex
							bg={useColorModeValue("orange.300", "orange.700")}
							minH={"12"}
							maxW={"350px"}
							p={1}
							borderRadius={"md"}
							onDoubleClick={handleBubbleClick}
							cursor={"pointer"}
							onMouseEnter={() => setIsTooltipOpen(true)}
                			onMouseLeave={() => setIsTooltipOpen(false)}
						>
							<Text fontSize={"sm"} color={useColorModeValue("black", "whiteAlpha.800")} mt={1} marginLeft={2} pb={2}>{message.text}</Text>
							<Box
								alignSelf={"flex-end"}
								ml={1}
								color={message.seen ? "blue.400" : ""}
							>
								<Flex flexDirection={"row"} alignSelf={"flex-end"}>
								<Text fontSize={"xs"} color={useColorModeValue("black", "whiteAlpha.800")}>{formattedTimestamp}</Text>
								<BsCheck2All size={16} fontWeight={"500"}/>
							</Flex>
							</Box>
						</Flex>
					</Tooltip>
					)}

					{/*		Image Message : Self Message		*/}
					{message.img && !imgLoaded && !message.doc && (
						<Flex mt={5} w={"200px"}>
							<Image
								src={message.img}
								hidden
								onLoad={() => setImgLoaded(true)}
								alt='Message image'
								borderRadius={4}
							/>
							<Skeleton w={"200px"} h={"200px"} />
						</Flex>
					)}

					{message.img && imgLoaded && (
					<Tooltip
						isOpen={isTooltipOpen}
            			label="Double click to delete this message"
            			placement="top"
            			onClose={() => setIsTooltipOpen(false)}
					>
						<Flex
							mt={5}
							w={"240px"}
							p={"2"}
							bg={useColorModeValue("orange.300", "orange.700")}
							flexDirection={"column"}
							onDoubleClick={handleBubbleClick}
							cursor={"pointer"}
							onMouseEnter={() => setIsTooltipOpen(true)}
                			onMouseLeave={() => setIsTooltipOpen(false)}
						>
							<Image src={message.img} alt='Message image' borderRadius={4} />
							<Box
								alignSelf={"flex-end"}
								ml={1}
								color={message.seen ? "blue.400" : ""}
								fontWeight={"bold"}
							>
							<Flex flexDirection={"row"}>
								<Text fontSize={"xs"} color={"white"} >{formattedTimestamp}</Text>
								<BsCheck2All size={16} />
							</Flex>
							</Box>
						</Flex>
					</Tooltip>
					)}


					{/*		Document Message : Self Message		*/}
					{message.doc && !docLoaded && (
						<Flex mt={5} w={"200px"} bg={"gray.600"} p={10}>
							<iframe
								src={message.doc}
								onLoad={() => setDocLoaded(true)}
								alt='Message document'
								borderRadius={4}
								display={docLoaded ? "block":"none"}
							/>
							<Skeleton w={"200px"} h={"200px"} />
						</Flex>
					)}

					{message.doc && docLoaded && (
					<Tooltip
						isOpen={isTooltipOpen}
            			label="Double click to delete this message"
            			placement="top"
            			onClose={() => setIsTooltipOpen(false)}
					>
						<Flex
							mt={5}
							flexDirection={"column"}
							w={"240px"}
							p={"2"}
							bg={useColorModeValue("orange.500", "orange.600")}
							onDoubleClick={handleBubbleClick}
							cursor={"pointer"}
							onMouseEnter={() => setIsTooltipOpen(true)}
                			onMouseLeave={() => setIsTooltipOpen(false)}
						>
					    <iframe
					      	src={message.doc}
					      	alt='Message image'
					      	style={{ width: '100%', height: '100%', objectFit: 'cover' }}
					      	borderRadius={4}
					    />
					    <Box>
					      	<Flex flexDirection={"row"} alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
					        	<Link href={message.doc} download target="_blank" rel="noopener noreferrer">
					          		<Button bg={useColorModeValue("whitesmoke", "gray.300")} textColor={useColorModeValue("gray.dark", "gray.800")} w={"full"}>
					            		Download
					          		</Button>
					        	</Link>
					    		<Box ml={"16"} display={"flex"} flexDirection={"row"}>
					          		<Text fontSize={"xs"} color={"white"}>{formattedTimestamp}</Text>
					          		<BsCheck2All size={16} />
					        	</Box>
					      	</Flex>
					    </Box>
					  	</Flex>
					</Tooltip>
					)}


					{/*		Video Message : Self Message		*/}
					{message.vid && !vidLoaded && (
						<Flex mt={5} w={"200px"} bg={"gray.600"} p={10}>
							<iframe
								src={message.vid}
								onLoad={() => setVidLoaded(true)}
								alt='Message video'
								borderRadius={4}
							/>
							<Skeleton w={"200px"} h={"200px"} />
						</Flex>
					)}

					{message.vid && vidLoaded &&  (
						<Flex mt={5} w={"320px"} flexDirection={"column"}>
							<iframe src={message.vid} alt='Message video' borderRadius={4} />
							<Flex>
								<Link href={message.vid} download target="_blank" rel="noopener noreferrer">
									<Button bg={useColorModeValue("whitesmoke", "gray.300")} textColor={useColorModeValue("gray.dark", "gray.800")} w={"full"}>
										Download
									</Button>
								</Link>
							</Flex>
							<Box
								alignSelf={"flex-end"}
								ml={1}
								color={message.seen ? "blue.400" : ""}
								fontWeight={"bold"}
							>
							<Flex flexDirection={"row"}>
								<Text fontSize={"xs"} color={"white"}>{formattedTimestamp}</Text>
								<BsCheck2All size={16} />
							</Flex>
							</Box>
						</Flex>
					)}
				</Flex>
			) : (
				<Flex gap={2} alignSelf={"flex-end"} >
					{message.text && (
    					<Flex minW={"20"} maxW={"350px"} minH={"12"} bg={"gray.400"} borderRadius={"md"} p={2} px={3}>
    					    <Text color={"black"} fontSize={"sm"} fontWeight={"normal"}>
    					        {message.text}
    					    </Text>
    					</Flex>
					)}


					{/*		Image message : Client Message		*/}
					{message.img && !imgLoaded && !message.doc && (
						<Flex mt={5} w={"200px"}>
							<Image
								src={message.img}
								onLoad={() => setImgLoaded(true)}
								alt='Message image'
								borderRadius={4}
							/>
						</Flex>
					)}

					{message.img && imgLoaded && !message.doc && (
						<Flex mt={5} w={"200px"} p={"2"} bg={"gray.400"}>
							<Image src={message.img} alt='Message image' borderRadius={4} />
						</Flex>
					)}


					{/*		Document Message : Client Message		*/}
					{message.doc && !docLoaded && (
						<Flex mt={5} w={"200px"}>
						<iframe
							src={message.doc}
							hidden
							onLoad={() => setDocLoaded(true)}
							alt='Message document'
							borderRadius={4}
						/>
						<Skeleton/>
						</Flex>
					)}

					{message.doc && docLoaded && (
						<Flex mt={5} w={"200px"} flexDirection={"column"} p={"2"} bg={"gray.400"}>
							<iframe src={message.doc} alt='Message document' borderRadius={4} />
							<Link href={message.doc} download target="_blank" rel="noopener noreferrer">
								<Button bg={useColorModeValue("whitesmoke", "gray.300")} textColor={useColorModeValue("gray.dark", "gray.800")} w={"full"}>
									Download
								</Button>
							</Link>
						</Flex>
					)}


					{/*		Video Message : Client Message		*/}
					{message.vid && !vidLoaded && (
						<Flex mt={5} w={"200px"} bg={"gray.600"} p={10}>
							<iframe
								src={message.vid}
								onLoad={() => setVidLoaded(true)}
								alt='Message video'
								borderRadius={4}
								display={vidLoaded ? "block":"none"}
							/>
							<Skeleton w={"200px"} h={"200px"} />
						</Flex>
					)}

					{message.vid && vidLoaded &&  (
						<Flex mt={5} w={"200px"} flexDirection={"column"}>
							<iframe src={message.vid} alt='Message video' borderRadius={4} />
							<Flex>
								<Link href={message.vid} download target="_blank" rel="noopener noreferrer">
									<Button bg={useColorModeValue("whitesmoke", "gray.300")} textColor={useColorModeValue("gray.dark", "gray.800")} w={"full"}>
										Download
									</Button>
								</Link>
							</Flex>
							<Box
								alignSelf={"flex-end"}
								ml={1}
								color={message.seen ? "blue.400" : ""}
								fontWeight={"bold"}
							>
							<Flex flexDirection={"row"}>
								<Text fontSize={"xs"} color={"white"}>{formattedTimestamp}</Text>
								<BsCheck2All size={16} />
							</Flex>
							</Box>
						</Flex>
					)}
					<Avatar src={selectedConversation.userProfilePic} w='7' h={7} />
				</Flex>
			)}

			{showDeleteMessage && (
            <DeleteMessage
                isOpen={isOpen}
                onOpen={onOpen}
				messageId={message._id}
                onClose={() => {
                  onClose();
                  setShowDeleteMessage(false);
                }}
            />
      	   )}
		</>
	);
};

export default Message;
