import {
    Modal, ModalBody,
    ModalContent, ModalHeader,
    ModalCloseButton, ModalOverlay,
    Input, useColorModeValue,
    FormControl, FormLabel,
    Flex, Textarea,
    Button, Select
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { host } from "../APIRoute/APIRoute.js";


const AddAssignments = ({ isOpen, onClose }) => {
    const [inputs, setInputs] = useState({
        assignment: "",
        description: "",
        dueDate: "",
        courseId: ""
    });
    const [loading, setLoading] = useState(false);
    const showToast = useShowToast();
    const [courses, setCourses] = useState([]);
    const user = useRecoilValue(userAtom);


    const formatDate = (inputDate) => {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear().toString().slice(2);

        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;

        return `${formattedDay}/${formattedMonth}/${year}`;
    };


    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${host}/api/lecturer/getCourses/${user._id}`, {
                    method: "GET"
                });
                const data = await response.json();

                setCourses(data);
            }catch(error) {
                console.log(error);
            }
        }
        fetchCourses();
    }, []);


    const handleSubmit = async () => {
        if(!inputs.assignment || !inputs.description || !inputs.dueDate) {
            showToast("Error", "Incomplete field", "error");
            return;
        }

        const formattedDate = formatDate(inputs.dueDate);

        try {
            setLoading(true);
            const response = await fetch(`${host}/api/lecturer/addAssignment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({...inputs, dueDate: formattedDate})
            });

            const data = await response.json();
            if(response.ok) {
                onClose();
                showToast("Success", "Assignments has been added to the course", "success");
            } else {
                showToast("Error", data.error, "error");
            }
        }catch(error) {
            showToast(error);
        }finally {
            setLoading(false);
            setInputs({
                assignment: "",
                description: "",
                dueDate: "",
                courseId: ""
            });
        }
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount>
            <ModalBody>
                <ModalOverlay />
                <ModalContent bg={useColorModeValue("whiteAlpha.900", "blackAlpha.900")}>
                    <ModalHeader>
                        Add Assignments
                        <ModalCloseButton />
                    </ModalHeader>
                    <Flex flexDirection={"column"} p={8} gap={8}>
                        <Flex>
                        <FormControl pr={2}>
                            <FormLabel>Assignment</FormLabel>
                            <Input w={"100%"} bg={useColorModeValue("gray.300", "gray.600")} autoComplete="nope" value={inputs.assignment} onChange={(e) => setInputs((inputs) => ({...inputs, assignment: e.target.value}))} />
                        </FormControl>

                        <FormControl pl={2}>
                            <FormLabel>Due Date</FormLabel>
                            <Input type="date" w={"100%"} bg={useColorModeValue("gray.300", "gray.600")}  value={inputs.dueDate} autoComplete="no" onChange={(e) => setInputs((inputs) => ({...inputs, dueDate: e.target.value}))}/>
                        </FormControl>
                        </Flex>

                        <FormControl mt={"-4"}>
                            <Select value={inputs.courseId} onChange={(e) => setInputs({...inputs, courseId: e.target.value})} bg={useColorModeValue("gray.300", "gray.600")}>
                                <option value={""} disabled>Select Course</option>
                                {courses.map((course) => (
                                    <option key={course._id} value={JSON.stringify(course)}>{course.courseCode + course.courseName}</option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Textarea w={"100%"} h={"10rem"} bg={useColorModeValue("gray.300", "gray.600")}  value={inputs.description} onChange={(e) => setInputs((inputs) => ({...inputs, description: e.target.value}))} />
                        </FormControl>

                        <Button w={"100%"} bg={useColorModeValue("gray.300", "gray.600")} onClick={handleSubmit} isLoading={loading}>Submit</Button>
                    </Flex>
                </ModalContent>
            </ModalBody>
        </Modal>
    );
};

export default AddAssignments;
