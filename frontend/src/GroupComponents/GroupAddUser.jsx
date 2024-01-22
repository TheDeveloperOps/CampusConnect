import {
    Modal,
    ModalBody,
    ModalContent,
    Button,
    useDisclosure,
    ModalOverlay,
    Input,
    FormControl,
    Text,
    VStack,
    Box,
    Flex,
    ModalHeader,
    useColorModeValue
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import UserBadgeItem from "../components/UserBadgeItem";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import UserListItem from "../components/UserListItem";
import { selectedGroupAtom } from "../atoms/groupAtom";
import { host } from "../APIRoute/APIRoute.js";

const GroupAddUser = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const showToast = useShowToast();
    const currentUser = useRecoilValue(userAtom);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedGroup, setSelectedGroup] = useRecoilState(selectedGroupAtom);

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


    const handleAdd = (usersToAdd) => {
        // Check if any of the selected users are already in the selectedUsers array
        const existingUsers = usersToAdd.filter(userToAdd =>
            selectedUsers.some(user => user._id === userToAdd._id)
        );

        if (existingUsers.length > 0) {
            showToast("Some users have already been added");
        } else {
            setSelectedUsers([...selectedUsers, ...usersToAdd]);
        }
    };


    const handleDelete = (delUser) => {
		setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
	};

    const handleAddUser = async (users) => {
        if (selectedGroup.participants.find((participant) => participant._id === users.map((user) => user._id))) {
            showToast("User already in the group");
            return;
        }

        if (selectedGroup.admin._id !== currentUser._id) {
            showToast("Only group admin can add a user to the group");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${host}/api/group/addUser`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    groupId: selectedGroup._id,
                    userIds: users.map((user) => user._id),
                    admin: currentUser._id,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setSelectedGroup(data);
                showToast("Users has been successfully added to the group");
            } else {
                throw new Error("Failed to add user to the group");
            }
        } catch (error) {
            showToast("Error adding user to the group");
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <span onClick={onOpen} onClose={onClose} size="sm">{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add User To The Group</ModalHeader>
                    <ModalBody>
                    <FormControl>
                        <Input
                            onChange={(e) => handleSearch(e.target.value)}
                            mb={1}
                            autoComplete="nope"
                        />
                    </FormControl>
                    <Flex flexDirection={"row"}>
                        {selectedUsers.map(user => (
                            <UserBadgeItem
                                key={user._id}
                                user={user}
                                handleFunction={() => handleDelete(user)}
                            />
                        ))}
                    </Flex>
                    <Text>List of Users</Text>
                    <VStack align={"center"} spacing={2}>
                        {loading ? (
                            <Box>Loading</Box>
                        ) : (
                            searchResults?.slice(0, 4).map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAdd([user])}
                                />
                            ))
                        )}
                    </VStack>
                    <Button onClick={() => handleAddUser(selectedUsers)} w={"full"} bg={useColorModeValue("orange.400", "gray.600")}>
                        Add
                    </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
};

export default GroupAddUser;