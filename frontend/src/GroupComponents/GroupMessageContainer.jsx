import {
    Avatar, CloseButton,
    Divider, Flex,
    Input, Skeleton,
    SkeletonCircle, Text,
    useColorModeValue, Button,
	Modal, ModalBody,
	ModalContent, ModalCloseButton,
	useDisclosure, Box, ModalHeader
} from "@chakra-ui/react";
import React from "react"
import Message from "../GroupComponents/Message";
import MessageInput from "../GroupComponents/MessageInput";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { groupAtom, selectedGroupAtom } from "../atoms/groupAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import messageSound from "../assets/sounds/message.mp3";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import GroupAddUser from "./GroupAddUser";
import usePreviewImg from "../hooks/usePreviewImg";
import { host } from "../APIRoute/APIRoute";


const GroupMessageContainer = () => {
    const showToast = useShowToast();
    const [selectedGroup, setSelectedGroup] = useRecoilState(selectedGroupAtom);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [messages, setMessages] = useState([]);
	const currentUser = useRecoilValue(userAtom);

	const { socket } = useSocket();
	const setGroups = useSetRecoilState(selectedGroupAtom);
	const messageEndRef = useRef(null);
	const [renameGroup, setRenameGroup] = useState("");

	const [loading, setLoading] = useState(false);
	const [openModel, setOpenModal] =useState(false);
	const fileRef = useRef();
	const { onClose } = useDisclosure();
	const { handleImageChange, imgUrl } = usePreviewImg();


	//	Handle scrolling effect
    useEffect(() => {
		if (messageEndRef.current && messages.length > 0) {
		    messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
		}
	}, [messages]);


	//	Handle user socket when messaging
	useEffect(() => {
		socket.on("sendGroupMessage", (message) => {
			if (selectedGroup._id === message.groupId) {
				// Check if the current user is the sender
				const isCurrentUserSender = message.user === currentUser._id;

				if (!isCurrentUserSender) {
					setMessages((prev) => [...prev, message]);
				}
			}

				if (!document.hasFocus()) {
					const sound = new Audio(messageSound);
					sound.play();
				}

				setGroups((prev) => {
					const updatedGroups = prev.map((group) => {
						if (group._id === message.groupId) {
							return {
								...group,
								lastMessage: {
									text: message.text,
									user: message.user,
								},
							};
						}
						return group;
					});
					return updatedGroups;
				});

		});

		return () => socket.off("sendGroupMessage");
	}, [socket, selectedGroup, setGroups]);


	//	Handle get message from database
    useEffect(() => {
        const getMessages = async () => {
            setLoadingMessages(true);
            setMessages([]);

            try {
				if(selectedGroup.mock) return;

                const res = await fetch(`${host}/api/group/${selectedGroup._id}`);
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
    }, [showToast, selectedGroup.user, selectedGroup.mock]);


	//	Handle rename group
	const handleRenameGroup = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${host}/api/group/renameGroup`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					groupId: selectedGroup._id,
					groupName: renameGroup,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to update group name");
			} else {
				setSelectedGroup((prevGroup) => ({
					...prevGroup,
					groupName: renameGroup,
				}));
				showToast("Group name changed successfully");
			}

		} catch (error) {
			console.error(error);
			showToast("Error updating group name", "error");
		} finally {
			setLoading(false);
		}
	};


	//	Handle remove user
	const handleRemoveUser = async (user) => {
		if (selectedGroup.admin._id !== currentUser._id && user._id !== currentUser._id) {
			showToast("Only group admin can remove users from a group", "error");
			return;
		}

		try {
			setLoading(true);
			const response = await fetch(`${host}/api/group/removeUserFromGroup`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					groupId: selectedGroup._id,
					userId: user._id,
				}),
			});

			const data = response.json();

			if(response.ok) {
				showToast("Succes", "User removed successfully", "success");
				const updatedParticipants = selectedGroup.participants.filter(participant => participant._id !== user._id);
				setSelectedGroup(prev => ({
					...prev,
					participants: updatedParticipants
				}));
			} else {
				showToast(data.error);
			}
		} catch (error) {
			console.error(error);
			showToast("Error removing user from the group");
		} finally {
			setLoading(false);
		}
	};


	//	Handle user leaving group
	const handleLeaveGroup = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${host}/api/group/leaveGroup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    groupId: selectedGroup._id,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                showToast("Success", "User leave successfully", "success");
				const updatedParticipants = selectedGroup.participants.filter(participant => participant._id !== currentUser._id);
				setSelectedGroup(prev => ({
					...prev,
					participants: updatedParticipants
				}));
            } else {
                showToast(data.error);
            }

        } catch (error) {
            showToast("Error leaving the group");
        } finally {
            setLoading(false);
        }
    };


	//	Handle group admin delete group
	const handleDeleteGroup = async () => {
		try {
			setLoading(true);
			const response = await fetch(`${host}/api/group/removeGroup/${selectedGroup._id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				const updatedGroups = groups.filter((group) => group._id !== selectedGroup._id);
				setGroups(updatedGroups);
				showToast("Success", "Group deleted successfully", "success");
			} else if (response.status === 404) {
				showToast("Group not found");
			} else if (response.status === 403) {
				showToast('Only the group admin can remove the group');
			} else {
				showToast("Failed to delete the group");
			}
		} catch (error) {
			console.error(error);
			showToast("Success", "Group deleted successfully", "success");
		} finally {
			setLoading(false);
		}
	};


	const handleCopyGroupCode = () => {
		if (selectedGroup && selectedGroup.groupCode) {
		  navigator.clipboard.writeText(selectedGroup.groupCode);
		  showToast("Group code copied to clipboard");
		}
	};


    return (
        <Flex
            flex={"70"}
            bg={useColorModeValue("whitesmoke", "gray.dark")}
            borderRadius={"md"}
            p={2}
			position={"relative"}
            flexDirection={"column"}
            overflow={"hidden"}
            minH={"100vh"}
        >
			{/*		Header		*/}
            <Flex w={"full"} h={12} alignItems={"center"} gap={2} cursor={"pointer"} onClick={() => setOpenModal(true)}>
                <Avatar src={selectedGroup.groupPic} size={"sm"} ml={"3"} mr={"1"} />
                <Text fontSize="md">{selectedGroup.groupName}</Text>
            </Flex>
			<Divider h={"0.5"} bg={useColorModeValue("gray.dark", "white")} />

            <Flex flexDir={"column"} gap={4} my={4} p={2} height={"67vh"} overflowY={"auto"}>
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
							<Message message={message} ownMessage={currentUser._id === message.user}/>
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

			{openModel && (
				<Modal isOpen onClose={onClose}>
					<ModalBody maxH={"80vh"}>
						<ModalContent>
						<ModalHeader>
							<Text>Group Details</Text>
							<ModalCloseButton onClick={() => setOpenModal(false)}/>
						</ModalHeader>
						<Box display={"grid"} placeItems={"center"}>
		    			  	<Avatar
		    			    	name={selectedGroup.groupName}
		    			    	src={imgUrl || selectedGroup.groupPic}
								my={2}
		    			    	size={{
		    			    	  	base: "md",
		    			    	  	md: "xl",
		    			    	}}
								cursor={"pointer"}
								onClick={() => fileRef.current.click()}
		    			  	>
								<input
									hidden
									type="file"
									value={imgUrl}
									onChange={handleImageChange}
									ref={fileRef}
									accept="image/*"
									id="uploadPicture"
								/>
							</Avatar>
		    			<Text fontSize={"xl"} fontWeight={"bold"} flex={10} justifyContent={"center"}>
		    			  	{selectedGroup.groupName}
		    			</Text>
		  				</Box>
						  	<Flex
			    			    flexDir={"column"}
			    			    p={4}
			    			    borderRadius={"md"}
			    			    boxShadow={"lg"}
			    			    position={"relative"}
			    			    zIndex={10}
			    			    width={"100%"}
			    			>
			    			    <Flex flexDirection={"row"} mb={3}>
			    			        <Input
			    			            value={renameGroup}
										placeholder="Enter New Name"
			    			            bg={useColorModeValue("gray.200", "whiteAlpha.500")}
			    			            onChange={(e) => setRenameGroup(e.target.value)}
			    			        />
									<Box>
										<Button
			    			        	    w={"full"}
			    			        	    ml={2}
			    			        	    bg={useColorModeValue("orange.300", "gray.600")}
			    			        	    onClick={handleRenameGroup}
			    			        	    isLoading={loading}
			    			        	>
			    			        	    Save
			    			        	</Button>
									</Box>
			    			    </Flex>

								<GroupAddUser>
									<Button w={"full"} mb={3} bg={useColorModeValue("orange.300", "gray.600")}>Add User</Button>
								</GroupAddUser>
								<Flex mb={3} gap={8}>
									<Flex>
										<Text fontWeight={"semibold"}>Group Admin: </Text>
			    			        	<Text fontWeight={"bold"}>{selectedGroup.admin.username}</Text>
									</Flex>
									<Flex>
										<Text fontWeight={"semibold"}>Group Code: </Text>
										<Text fontWeight={"bold"} cursor={"pointer"} onClick={handleCopyGroupCode}>{selectedGroup.groupCode}</Text>
									</Flex>
								</Flex>
			    			    {selectedGroup.participants.map((participant) => (
			    			        <Flex key={participant._id} alignItems="center" ml={2} my={2} width={"100%"} overflowY={"auto"}>
			    			            <Avatar src={participant.profilePic} size={"sm"} />
			    			            <Text ml={2}>{participant.username}</Text>
			    			            {currentUser._id === selectedGroup.admin._id && participant._id !== currentUser._id && (
			    			                <CloseButton mx={5} onClick={() => handleRemoveUser(participant)} />
			    			            )}
			    			        </Flex>
			    			    ))}

			    			    <Flex justifyContent={"flex-end"}>
			    			        {currentUser._id === selectedGroup.admin._id ? (
			    			            <Button
			    			                p={3}
			    			                px={3}
			    			                bg={useColorModeValue("red.500", "red.700")}
			    			                onClick={handleDeleteGroup}
											isLoading={loading}
			    			            >
			    			                Delete Group
			    			            </Button>
			    			        ) : (
			    			            <Button
			    			                p={3}
			    			                px={3}
			    			                bg={useColorModeValue("red.500", "red.700")}
			    			                onClick={handleLeaveGroup}
											isLoading={loading}
			    			            >
			    			                Leave Group
			    			            </Button>
			    			        )}
			    			    </Flex>
			    			</Flex>
						</ModalContent>
					</ModalBody>
				</Modal>
			)}
        </Flex>
    );
};

export default GroupMessageContainer;