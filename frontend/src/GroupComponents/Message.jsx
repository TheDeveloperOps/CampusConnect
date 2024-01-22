import {
	Avatar,
	Box,
	Flex,
	Image,
	Skeleton,
	Text,
	useColorModeValue,
	useDisclosure,
	Tooltip
} from "@chakra-ui/react";
import React from "react";
import { selectedGroupAtom } from "../atoms/groupAtom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import DeleteMessage from "../components/DeleteMessage";



const Message = ({ ownMessage, message }) => {
	const selectedGroup = useRecoilValue(selectedGroupAtom);
	const user = useRecoilValue(userAtom);
	const [imgLoaded, setImgLoaded] = useState(false);
	const [formattedTimestamp, setFormattedTimestamp] = useState("");
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [showDeleteMessage, setShowDeleteMessage] = useState(false);
	const [isTooltipOpen, setIsTooltipOpen] = useState(false);


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
						maxW={"350px"} p={1}
						borderRadius={"md"}
						cursor={"pointer"}
						onDoubleClick={handleBubbleClick}
						onMouseEnter={() => setIsTooltipOpen(true)}
                		onMouseLeave={() => setIsTooltipOpen(false)}
					>
					  	  <Flex flexDirection={"column"} ml={2} pb={1}>
							  <Text color={useColorModeValue("black", "whiteAlpha.800")} textDecoration={"underline"} letterSpacing={"wide"} mb={1} fontSize={"xs"} fontWeight={"semibold"}>{message.username}</Text>
						  	  <Text fontSize={"sm"} color={useColorModeValue("black", "whiteAlpha.800")}>{message.text}</Text>
						  </Flex>
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
				  {message.img && !imgLoaded && (
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
					  <Flex mt={5} w={"200px"} bg={useColorModeValue("orange.500", "orange.600")}>
						  <Image src={message.img} alt='Message image' borderRadius={4} />
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
					  <Flex minW={"20"} maxW={"350px"} minH={"12"} bg={"gray.500"} p={2} px={3} borderRadius={"md"} flexDirection={"column"}>
					  	  <Text color={"white"} textDecoration={"underline"} letterSpacing={"wide"} mb={1} fontSize={"xs"} fontWeight={"semibold"}>{message.username}</Text>
						  <Text color={"white"} fontSize={"sm"} fontWeight={"normal"}>
							  {message.text}
						  </Text>
					  </Flex>
				  )}


				  {message.img && !imgLoaded && (
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
					  <Flex mt={5} w={"200px"}>
						  <Image src={message.img} alt='Message image' borderRadius={4} />
					  </Flex>
				  )}
				  <Avatar w='7' h={7} src={selectedGroup.groupPic} />
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
