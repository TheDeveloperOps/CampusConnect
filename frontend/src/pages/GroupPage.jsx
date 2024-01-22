import {
	Box,
	Button,
	Flex,
	Skeleton,
	SkeletonCircle,
	Text,
	useColorModeValue,
} from  "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { groupAtom, selectedGroupAtom } from "../atoms/groupAtom.js";
import { useSocket } from "../context/SocketContext";
import { GiConversation } from "react-icons/gi";
import { FaPlus } from "react-icons/fa";
import GroupModal from "../GroupComponents/GroupModal";
import useShowToast from "../hooks/useShowToast.js";
import Group from "../GroupComponents/Group.jsx";
import GroupMessageContainer from "../GroupComponents/GroupMessageContainer.jsx";
import userAtom from "../atoms/userAtom.js";
import { host } from "../APIRoute/APIRoute.js";


const GroupPage = () => {
	const [loadingGroups, setLoadingGroups] = useState(true);
	const [selectedGroup, setSelectedGroup] = useRecoilState(selectedGroupAtom);
	const [groups, setGroups] = useRecoilState(groupAtom);
	const [openGroupModal, setOpenModal] = useState(false);
	const showToast = useShowToast();
	const user = useRecoilValue(userAtom);
	const { socket } = useSocket();
	const groupPageRef = useRef();

	useEffect(() => {
		const isScrolledDown = () => {
		  	const groupPageElement = groupPageRef.current;

		  	if (groupPageElement) {
				return groupPageElement.scrollHeight - groupPageElement.scrollTop === groupPageElement.clientHeight;
		  	}
		  	return false;
		};

		if (isScrolledDown()) {
		  groupPageRef.current.scrollTop = groupPageRef.current.scrollHeight;
		}
	}, [groups]);


	useEffect(() => {
		socket?.on("groupDeleted", ({ groupId }) => {
			setGroups(prevGroups => prevGroups.filter(group => group._id !== groupId));

			if (selectedGroup._id === groupId) {
				setSelectedGroup({});
			}
		});

		return () => {
			socket?.off("groupDeleted");
		};
	}, [socket, setGroups, selectedGroup, setSelectedGroup]);


	useEffect(() => {
		socket?.on("leftGroup", (group) => {
			setGroups((prevGroups) => {
				// Update the groups state by removing the group from the groups
				const updatedGroups = prevGroups.filter((g) => g._id !== group._id);
				return updatedGroups;
			});
			setSelectedGroup({});
		});

		return () => {
			socket?.off("leftGroup");
		};
	}, [socket, setGroups, showToast]);


	//	Handle get grouping chats from database
	useEffect(() => {
		const getAllGroups = async () => {
			try {
				const res = await fetch(`${host}/api/group/getAllGroups`);
				const data = await res.json();

				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setGroups(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoadingGroups(false);
			}
		};

		getAllGroups();
	}, [showToast, setGroups]);


    useEffect(() => {
        socket?.on("joinGroup", (group) => {
            // Update the groups state by adding the new group to the groups
            setGroups((prevGroups) => [...prevGroups, group]);
        });

        return () => {
            socket?.off("joinGroup");
        };
    }, [socket, setGroups]);


	useEffect(() => {
		if (selectedGroup._id) {
		  socket.emit("joinGroup", { groupId: selectedGroup._id });
		}
	}, [selectedGroup, socket]);


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
						Groups
					</Text>

					<Button onClick={() => setOpenModal(true)} w={"full"} bg={useColorModeValue("orange.400", "whiteAlpha.400")}>
    					<FaPlus />
					</Button>
					{openGroupModal && <GroupModal onClose={() => setOpenModal(false)} />}


					{loadingGroups &&
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

					{!loadingGroups &&
						groups.map((group) => (
							<Group
								key={group._id}
								group={group}
								onClick={() => handleGroupSelect(group._id)}
							/>
						))}
				</Flex>
				{!selectedGroup._id && (
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
						<Text fontSize={20}>Select a group to start messaging</Text>
					</Flex>
				)}

				{selectedGroup._id && <GroupMessageContainer />}
			</Flex>
		</Box>
	);
}

export default GroupPage;