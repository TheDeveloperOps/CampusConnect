import {
    useDisclosure,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    ModalFooter,
    Button,
    Input,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from 'react';
import { FaArrowUp } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import usePreviewDoc from "../hooks/usePreviewDoc";
import useShowToast from "../hooks/useShowToast";

const MediaUploader = ({ children }) => {
    const { handleDocumentChange, docUrl, setDocUrl } = usePreviewDoc();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const showToast = useShowToast();
    const [files, setFiles] = useState([]);

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('file', docUrl[0]); // Assuming you are uploading only one file

            const response = await fetch("/api/lecturer/uploadFile", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setFiles(data);
                showToast("Upload successful!");
                console.log("Files: ", files);
            } else {
                showToast("Upload failed. Please try again.");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            showToast("Error uploading file. Please try again later.");
        }
    };


    return (
        <>
            <span onClick={onOpen} size="sm">{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalBody minW={"200px"} minH={"200px"} display={"flex"} flexDirection={"column"} alignItems={"center"} p={8}>
                        <FaArrowUp size={24} color={"gray"} mb={4} />
                        <Input type="file" accept="*" onChange={handleDocumentChange} mb={4} />
                        <Button onClick={handleUpload} colorScheme="teal" mb={4}>Upload</Button>
                        {files.length > 0 && (
                            <ul>
                                {files.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default MediaUploader;
