import {
    Modal, VStack,
    ModalHeader, Box,
    ModalBody, Flex,
    ModalCloseButton, Text,
    Button,
    ModalOverlay,
    ModalContent,
    Input,
    FormControl,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import UserBadgeItem from "../components/UserBadgeItem";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import { groupAtom } from "../atoms/groupAtom";
import UserListItem from "../components/UserListItem";
import { host } from "../APIRoute/APIRoute.js";


const GroupModal = ({ onClose }) => {
	const [groupName, setGroupName] = useState("");
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [search, setSearch] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const showToast = useShowToast();
	const [groups, setGroups] = useRecoilState(groupAtom);
	const [groupCode, setGroupCode] = useState("");
	const user = useRecoilValue(userAtom);


	//	Handle user searching
	const handleSearch = async (query) => {
		setSearch(query);
		if (!query) {
			setSearchResults([]);
			return;
		}

		try {
			setLoading(true);
			const response = await fetch(`${host}/api/users/getAllUsers?search=${query}`);

			if (response.ok) {
				const data = await response.json();
				setSearchResults(data);
			} else {
				throw new Error("Failed to fetch users");
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	//	Handle adding user when user want to create a group
    const handleGroup = (userToAdd) => {
        if (selectedUsers.some(user => user._id === userToAdd._id)) {
            showToast("User has already been added");
        } else {
            setSelectedUsers([...selectedUsers, userToAdd]);
        }
    };

	//	Create Group Function
	const handleGroupCreation = async () => {
		if (!groupName || selectedUsers.length < 1) {
			showToast("Error", "Fill all required fields", "error");
			return;
		}

		setLoading(true);

		try {
			const response = await fetch(`${host}/api/group/createGroupChat`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: groupName,
					users: selectedUsers.map((user) => user._id),
				}),
			});

			if (response.ok) {
				const groupData = await response.json();

				const mockGroup = {
					...groupData,
					mock: true,
					user: "",
					lastMessage: {
						text: "",
						sender: "",
					},
					_id: Date.now(),
					participants: groupData.participants
				}
				setGroups((prevGroups) => [...prevGroups, mockGroup]);
				showToast("Success", "Group created successfully", "success");
			} else {
				throw new Error("Failed to create group");
			}
			setSelectedUsers([]);
		} catch (error) {
			showToast(error.message);
		} finally {
			setLoading(false);
			onClose();
		}
	};


	//	Handle Join Group
	const handleJoinGroup = async () => {
		if(!groupCode) {
			showToast("Error", "Please complete the field", "error");
		}

		try {
			setLoading(true);
			const response = await fetch(`${host}/api/group/joinGroup`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ groupCode })
			});

			const data = await response.json();

			if(response.ok) {
				showToast("Success", "User successfully join the group", "success");
			} else {
				showToast("Error", data.error, "error");
			}
		}catch(error) {
			showToast(error);
		}finally {
			setLoading(false);
			onClose();
		}
	}

	const handleDelete = (delUser) => {
		setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
	};


	return (
		<>
			{/* New Modal for joining group */}
			{user.isStudent && (
				<Modal isOpen onClose={onClose} size="sm">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Join Group</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Input
							value={groupCode}
							onChange={(e) => setGroupCode(e.target.value)}
							placeholder="Enter group code"
							autoComplete="nope"
						/>
						<Button onClick={handleJoinGroup} isLoading={loading} colorScheme="orange" mt={4} w={"100%"}>
							Join Group
						</Button>
					</ModalBody>
				</ModalContent>
				</Modal>
			)}

			{!user.isStudent && (
				// New Modal for entering group info
				<Modal isOpen onClose={onClose}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Create A Group</ModalHeader>
						<ModalCloseButton />
						<ModalBody display={"flex"} flexDirection={"column"} alignItems={"center"}>
							<FormControl>
								<Input
									value={groupName}
									my={2}
									onChange={(e) => setGroupName(e.target.value)}
									placeholder="Group name"
									autoComplete="nope"
								/>
							</FormControl>
							<FormControl>
								<Input
									placeholder="Add User"
									onChange={(e) => handleSearch(e.target.value)}
									mb={1}
									autoComplete="nope"
								/>
							</FormControl>

							<Flex flexDirection={"row"}>
								{selectedUsers.map((user) => (
									<UserBadgeItem
										key={user._id}
										user={user}
										handleFunction={() => handleDelete(user)}
									/>
								))}
							</Flex>
							<Text>List of Users</Text>
							<VStack align="center" spacing={2}>
								{loading ? (
									<Box>Loading</Box>
								) : (
									searchResults?.slice(0, 4).map((user) => (
										<UserListItem
											key={user._id}
											user={user}
											handleFunction={() => handleGroup(user)}
										/>
									))
								)}
							</VStack>
							<Button isLoading={loading} colorScheme="orange" mt={4} onClick={handleGroupCreation}>
								Create Group
							</Button>
						</ModalBody>
					</ModalContent>
				</Modal>
			)}
		</>
	);
}

export default GroupModal;
