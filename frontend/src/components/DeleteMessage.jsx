import {
    Button,
    Modal,
    ModalBody,
    ModalContent ,
    ModalFooter,
    ModalOverlay,
    Text,
    useColorModeValue,
    useDisclosure
} from "@chakra-ui/react";
import React from "react";
import useShowToast from "../hooks/useShowToast.js";
import { host } from "../APIRoute/APIRoute.js";


const DeleteMessage = ({ onClose, messageId }) => {
    const showToast = useShowToast();
    const handleDeleteMessage = async () => {
        const response = await fetch(`${host}/api/messages/deleteMessage/${messageId}`, {
            method: "DELETE",
        });

        if(response.ok) {
            showToast("Success", "Message successfully deleted", "success");
        }else {
            showToast("Error", "Failed to delete message", "error");
        }
    };


    return (
        <Modal isOpen onClose={onClose}>
            <ModalBody>
                <ModalOverlay/>
                <ModalContent p={10}>
                    <Text fontSize={"2xl"} fontWeight={"bold"} textAlign={"center"}>Are you sure that you want to delete this message?</Text>
                    <ModalFooter gap={4}>
                        <Button w={"100%"} bg={"red.500"} onClick={handleDeleteMessage}>Yes</Button>
                        <Button w={"100%"} onClick={onClose} bg={useColorModeValue("wheat", "gray.400")}>No</Button>
                    </ModalFooter>
                </ModalContent>
            </ModalBody>
        </Modal>
    );
}

export default DeleteMessage;