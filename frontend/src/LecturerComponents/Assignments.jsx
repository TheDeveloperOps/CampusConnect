import {
    Flex, useColorModeValue,
    Text, Input,
    Button, Grid,
    Box, CloseButton,
    Select, useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useSocket } from "../context/SocketContext.jsx";
import { useRecoilValue } from "recoil";
import { FaPlus } from "react-icons/fa";
import userAtom from "../atoms/userAtom.js";
import AddAssignments from "./AddAssignments.jsx";
import { host } from "../APIRoute/APIRoute.js";


const Assignments = () => {
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { socket } = useSocket();
    const showToast = useShowToast();
    const user = useRecoilValue(userAtom);


    useEffect(() => {
        // Listen for the "addAssignment" event
        socket?.on("addAssignment", (newAssignment) => {
            setAssignments((prevAssignments) => [...prevAssignments, newAssignment]);
        });

        return () => {
            socket?.off("addAssignment");
        };
    }, [socket]);

    useEffect(() => {
        fetchAssignment();
    },[]);


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


    const fetchAssignment = async () => {
        const response = await fetch(`${host}/api/lecturer/getAssignments/${user._id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if(response.ok) {
            setAssignments(data);
        } else {
            showToast("Error", "Failed to fetch assignments", "error");
        }
    };


    const handleDeleteAssignment = async (assignmentId) => {
        const response = await fetch(`${host}/api/lecturer/deleteAssignment/${assignmentId}`,{
            method: "DELETE"
        });

        if(response.ok) {
            setAssignments((prevAssignment) => prevAssignment.filter((assignment) => assignment._id !== assignmentId));
            showToast("Success", "Assignment has been deleted", "success");
        }
    }


    const handleAddAssignmentClick = () => {
        onOpen();
    };


    return (
        <>
            <Flex
                bg={useColorModeValue("whiteAlpha.600", "blackAlpha.600")}
                p={4}
                rounded={"md"}
                flexDirection={"column"}
                my={4}
                width={"80%"}
            >
                <Flex flexDirection={"column"}>
                    <Flex rounded="lg">
                        <Text fontSize={"lg"} fontWeight="bold" mr={2} mt={1}>Assignments</Text>
                        <Box bg={useColorModeValue("blackAlpha.200", "whiteAlpha.300")} cursor={"pointer"} p={2} px={10} mx={2} rounded={"md"} onClick={handleAddAssignmentClick}>
                            <FaPlus size={20}/>
                        </Box>
                    </Flex>
                    {courses.map((course) => (
                        <Flex flexDirection={"column"} my={4} key={course._id}>
                            <Flex columnGap={4}>
                                <Text fontWeight={"semibold"}>{course.courseCode}</Text>
                                <Text fontWeight={"medium"}>{course.courseName}</Text>
                            </Flex>
                            <Grid
                                templateColumns="1.5fr 2fr 1.5fr 0.25fr"
                                gap={2}
                                p={4}
                                maxH={"70vh"}
                                overflowY={"auto"}
                            >
                                <Box
                                    border={"2px solid"}
                                    borderColor={useColorModeValue("black", "white") }
                                    p={1}
                                    fontWeight="bold"
                                    textAlign="center"
                                >
                                    Assignment
                                </Box>
                                <Box
                                    border={"2px solid"}
                                    borderColor={useColorModeValue("black", "white")}
                                    p={1}
                                    fontWeight="bold"
                                    textAlign="center"
                                >
                                  Description
                                </Box>
                                <Box
                                    border={"2px solid"}
                                    borderColor={useColorModeValue("black", "white")}
                                    p={1}
                                    fontWeight="bold"
                                    textAlign="center"
                                >
                                    Due Date
                                </Box>
                                <Box textAlign="center"></Box>
                                <AddAssignments
                                    courseId={course._id}
                                    isOpen={isOpen}
                                    onClose={onClose}
                                />
                                {assignments
                                    .filter((assignment) => assignment.course === course._id)
                                    .map((assignment) => (
                                        <React.Fragment key={assignment._id}>
                                            <Box
                                                p={2}
                                                textAlign="center"
                                                border={"2px solid"}
                                                bg={useColorModeValue("gray.300", "gray.700")}
                                            >
                                                {assignment.name}
                                            </Box>
                                            <Box
                                                p={2}
                                                textAlign="center"
                                                border={"2px solid"}
                                                bg={useColorModeValue("gray.300", "gray.700")}
                                            >
                                                {assignment.description}
                                            </Box>
                                            <Box
                                                p={2}
                                                textAlign="center"
                                                border={"2px solid"}
                                                bg={useColorModeValue("gray.300", "gray.700")}
                                            >
                                              {assignment.dueDate}
                                            </Box>
                                            <Box
                                                textAlign="center"
                                                onClick={() => handleDeleteAssignment(assignment._id)}
                                            >
                                              <CloseButton bg={useColorModeValue("red.400", "red.600")} textColor={useColorModeValue("black", "white")} />
                                            </Box>
                                        </React.Fragment>
                                    ))}
                            </Grid>
                        </Flex>
                    ))}
                </Flex>
            </Flex>
        </>
    );
}

export default Assignments;