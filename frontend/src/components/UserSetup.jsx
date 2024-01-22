import {
    Box, Button,
    Flex, FormControl,
    FormLabel, Modal,
    Select, Text,
    useColorModeValue, ModalBody,
    ModalOverlay, ModalHeader,
    ModalCloseButton, ModalContent
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast.js";
import { host } from "../APIRoute/APIRoute.js";


const UserSetup = ({ isOpen, onClose }) => {
    const setUser = useSetRecoilState(userAtom);
    const [selectedDetails, setSelectedDetails] = useState({
        department: "",
        diploma: ""
    });
    const [departments, setDepartments] = useState([]);
    const [diplomas, setDiplomas] = useState([]);
    const showToast = useShowToast();
    const [loading, setLoading] = useState(false);


    //      Fetching Departments from database
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await fetch(`${host}/api/users/getDepartments`);
                if (response.ok) {
                    const data = await response.json();
                    setDepartments(data);
                } else {
                    showToast("Error", "Failed to fetch departments", "error");
                }
            } catch (error) {
                showToast("Error", "Failed to fetch departments", "error");
            }
        };

        fetchDepartments();
    }, []);


    //      Fetch Diplomas from database
    useEffect(() => {
        const fetchDiplomas = async () => {
            const response = await fetch(`${host}/api/users/getDiplomas`);

            if(response.ok) {
                const data = await response.json();
                setDiplomas(data);
            }else {
                showToast("Error", "Failed to fetch diplomas");
            }
        }

        fetchDiplomas();
    }, []);


    const handleSubmit = async () => {
        if(!selectedDetails.department || !selectedDetails.diploma) {
            showToast("Error", "Please select your department and diploma", "error");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${host}/api/users/setupUser`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(selectedDetails)
            });

            if(response.ok) {
                const data = await response.json();
                setUser(data.user);
                showToast("Success", "User successfully update their department and diploma", "success");
            } else {
                showToast("Error", "Failed to submit", "error");
            }
        }catch(error){
            showToast(error);
        }finally {
            setLoading(false);
            onClose();
        }
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount>
        <ModalOverlay />
        <ModalBody>
            <ModalContent>
            <ModalHeader>
                <ModalCloseButton/>
            </ModalHeader>
            <Flex justifyContent={"center"} flexDirection={"column"} alignItems={"center"} p={8}>
                    <Flex>
                        <FormControl>
                            <FormLabel>Department: </FormLabel>
                            <Select
                                my={2}
                                bg={useColorModeValue("white", "gray.200")}
                                textColor={"black"}
                                value={selectedDetails.department}
                                w={"90%"}
                                onChange={(e) => setSelectedDetails((selectedDetails) => ({...selectedDetails, department: e.target.value}))}
                            >
                                <option
                                    bg={useColorModeValue("white", "gray.200")}
                                    textColor={"black"}
                                    value=""
                                    disabled
                                >Select Department</option>
                                    {departments.map((department) => (<option key={department._id} value={JSON.stringify(department)}>{department.name}
                                </option>))}
                            </Select>
                        </FormControl>

                    <FormControl>
                            <FormLabel>Diploma: </FormLabel>
                            <Select
                                my={2}
                                bg={useColorModeValue("white", "gray.200")}
                                textColor={"black"}
                                value={selectedDetails.diploma}
                                w={"90%"}
                                onChange={(e) => setSelectedDetails((selectedDetails) => ({...selectedDetails, diploma: e.target.value}))}
                            >
                                <option
                                    bg={useColorModeValue("white", "gray.200")}
                                    textColor={"black"}
                                    value=""
                                    disabled
                                >Select Diploma</option>
                                    {diplomas.map((diploma) => (<option key={diploma._id} value={JSON.stringify(diploma)}>{diploma.name}
                                </option>))}
                            </Select>
                        </FormControl>
                    </Flex>
                <Button bg={useColorModeValue("orange.300", "orange.600")} w={"100%"} my={5} onClick={handleSubmit} isLoading={loading}>Submit</Button>
            </Flex>
            </ModalContent>
        </ModalBody>
        </Modal>
    );
}

export default UserSetup;