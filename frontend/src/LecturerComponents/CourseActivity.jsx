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


const CourseActivity = () => {
    const [selectedCourse, setSelectedCourse] = useState("");
    const [enrollmentKey, setEnrollmentKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const showToast = useShowToast();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { socket } = useSocket();
    const user = useRecoilValue(userAtom);

    useEffect(() => {
        socket?.on("addCourse", (newCourse) => {
            setCourses((prevCourses) => [...prevCourses, newCourse]);
        });

        return () => {
            socket?.off("addCourse");
        };
    }, [socket]);

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


    useEffect(() => {
        const getAllCourses = async () => {
            const response = await fetch(`${host}/api/lecturer/getAllCourses`, {
                method: "GET"
            });

            if(response.ok) {
                const data = await response.json();
                setAllCourses(data);
            } else {
                showToast("Error", "Failed to fetch courses", "error");
            }
        };

        getAllCourses();
    },[]);


    const addCourse = async () => {
        if(!selectedCourse || !enrollmentKey) {
            showToast("Error", "Incomplete field", "error");
            return;
        }
        try {
            setLoading(true)
            const response = await fetch(`${host}/api/lecturer/addCourse`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    course: selectedCourse,
                    enrollmentKey: enrollmentKey
                })
            });

            const data = await response.json();
            if(response.ok) {
                showToast("Success", `Course Added Successfully!`, "success");
            } else {
                showToast("Error", data.error, "error");
            }
        }catch(error) {
            showToast("Error", error, "error");
        }finally {
            setLoading(false);
            setSelectedCourse("");
            setEnrollmentKey("");
        }
    };


    const deleteCourse = async (courseId) => {
        try {
            const response = await fetch(`${host}/api/lecturer/deleteCourse/${courseId}`, {
                method: "DELETE",
            });

            if(response.ok) {
                setCourses((prevCourses) => prevCourses.filter((course) => course._id !== courseId));
                showToast("Success", "Assignment has been deleted", "success");
            }
        }catch(error) {
            showToast(error);
        }
    }


    return (
        <Flex
            p={4}
            gap={4}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            overscrollY={"auto"}
            w="90%"
        >
            <Flex
                bg={useColorModeValue("whiteAlpha.700", "blackAlpha.700")}
                p={4}
                rounded={"xl"}
                justifyContent={"center"}
                alignItems={"center"}
                flexDirection={"column"}
                my={4}
            >
                <Text fontSize={"xl"} fontWeight={"semibold"} mb={2}>Add Course</Text>
                <Flex flexDirection={"column"}>
                    <Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} my={2} bg={useColorModeValue("white", "gray.200")} textColor={"black"}>
                        <option value={""} disabled>Select Course</option>
                        {allCourses.map((course) => (
                            <option key={course._id} value={JSON.stringify(course)}>{course.courseCode + course.courseName}</option>
                        ))}
                    </Select>

                    <Flex flexDirection={"column"}>
                        <Text fontWeight={"bold"} w={"70%"} mt={3}>Enrollment Key: </Text>
                        <Input bg={useColorModeValue("white", "gray.200")} value={enrollmentKey} onChange={(e) => setEnrollmentKey(e.target.value)} my={2} textColor={"black"}/>
                        <Button bg={useColorModeValue("blackAlpha.300", "whiteAlpha.600")} textColor={useColorModeValue("black", "white")} w={"100%"} onClick={addCourse} isLoading={loading} mt={2}>Add Course</Button>
                    </Flex>
                </Flex>
            </Flex>
            <Flex flexDirection={"column"} w={"90%"} my={4}>
                <Grid
                    templateColumns={"1fr 1fr 1fr 0.2fr"}
                    gap={2}
                    p={4}
                    my={8}
                    bg={useColorModeValue("whiteAlpha.800", "blackAlpha.600")}
                >
                    <Box bg={useColorModeValue("whiteAlpha.500", "blackAlpha.500")} border={"2px solid"} borderColor={useColorModeValue("black", "white")} p={1} fontWeight={"medium"} textAlign={"center"} px={3}>Course Code</Box>
                    <Box bg={useColorModeValue("whiteAlpha.500", "blackAlpha.500")} border={"2px solid"} borderColor={useColorModeValue("black", "white")} p={1} fontWeight={"medium"} textAlign={"center"} px={3}>Course Name</Box>
                    <Box bg={useColorModeValue("whiteAlpha.500", "blackAlpha.500")} border={"2px solid"} borderColor={useColorModeValue("black", "white")} p={1} fontWeight={"medium"} textAlign={"center"} px={3}>Enrollment Key</Box>
                    <Box p={1} textAlign={"center"}></Box>
                    {courses.map((course) => (
                        <React.Fragment key={course._id}>
                            <Box p={2} textAlign={"center"} border={"1px solid"} borderColor={useColorModeValue("black", "white") } textColor={useColorModeValue("black", "white")}>{course.courseCode}</Box>
                            <Box p={2} textAlign={"center"} border={"1px solid"} borderColor={useColorModeValue("black", "white") } textColor={useColorModeValue("black", "white")}>{course.courseName}</Box>
                            <Box p={2} textAlign={"center"} border={"1px solid"} borderColor={useColorModeValue("black", "white") } textColor={useColorModeValue("black", "white")}>{course.courseKey}</Box>
                            <Box textAlign={"center"} mt={2}>
                                <CloseButton p={5} bg={useColorModeValue("red.400", "red.600")} onClick={() => deleteCourse(course._id)} />
                            </Box>
                        </React.Fragment>
                    ))}
                </Grid>
            </Flex>
        </Flex>
    );
}

export default CourseActivity;