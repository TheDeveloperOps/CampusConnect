import {
    ModalContent,
    ModalOverlay,
    Text,
    Box,
    Flex,
    useColorModeValue,
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    Input,
    ModalCloseButton,
    SkeletonCircle,
    Skeleton,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import useShowToast from "../hooks/useShowToast.js";
import { FaKey } from "react-icons/fa";
import { host } from "../APIRoute/APIRoute.js";


const AllCourses = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [enrollmentKey, setEnrollmentKey] = useState("");
    const [loadingCourse, setLoadingCourse] = useState(true);
    const [loading, setLoading] = useState(false);
    const showToast = useShowToast();

    const openModal = (course) => {
        setSelectedCourse(course);
    };

    useEffect(() => {
        try {
            const getCourses = async () => {
              const response = await fetch(`${host}/api/students/getCourses`);

              if (response.ok) {
                const data = await response.json();
                setCourses(data.courses);
              } else {
                showToast("Error", "Failed to fetch courses", "error");
              }
            };
            getCourses();
        } catch (error) {
            showToast("Error", error, "error");
        } finally {
            setLoadingCourse(false);
        }
    }, [showToast]);

    const handleEnrollCourse = async () => {
    if (!selectedCourse._id || !enrollmentKey) {
        showToast("Error", "Incomplete field", "error");
        return;
    }

    try {
        setLoading(true);
        const response = await fetch(`${host}/api/students/enrollCourse`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              courseId: selectedCourse._id,
              enrollmentKey: enrollmentKey
            })
        });

        const data = await response.json();
        if (response.ok) {
            showToast(
                "Success",
                "Student successfully enrolled in this course",
                "success"
            );
        } else {
          showToast("Error", data.error, "error");
        }
    } catch (error) {
        showToast("Error", error.message || "An error occurred", "error");
    } finally {
        setLoading(false);
        setSelectedCourse(null);
    }
    };

    const chunkArray = (array, chunkSize) => {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
          result.push(array.slice(i, i + chunkSize));
        }
        return result;
    };

    return (
      <Flex justifyContent={"center"} alignItems={"center"} p={8}>
        {loadingCourse && (
          <Flex justifyContent={"center"} alignItems={"center"} gap={8}>
                {[0, 1, 2, 3].map((_, i) => (
                    <Box
                        key={i}
                        bg={useColorModeValue("whiteAlpha.500", "whiteAlpha.300")}
                        borderRadius={"lg"}
                        boxShadow={"md"}
                        p={4}
                        px={4}
                        w={"100%"}
                    >
                        <SkeletonCircle />
                        <Flex>
                            <Skeleton h={"16px"} w={"120px"} />
                            <Skeleton h={"16px"} w={"100%"} />
                            <Skeleton h={"12px"} w={"100%"} />
                            <Skeleton h={"12px"} w={"120px"} />
                        </Flex>
                    </Box>
                ))}
          </Flex>
        )}

        {!loadingCourse && (
        <Flex flexDirection="column" alignItems="center">
            {chunkArray(courses, 4).map((row, rowIndex) => (
              <Flex key={rowIndex} gap={6}>
                {row.map((course) => (
                  <Flex
                    flexDirection={"column"}
                    bg={useColorModeValue("white", "gray.dark")}
                    p={3}
                    px={4}
                    rounded={"xl"}
                    width={"100%"}
                    key={course._id}
                    mt={4}
                  >
                    <Text fontWeight={"semibold"} textAlign={"center"}>
                      {course.courseCode}
                    </Text>
                    <Text fontWeight={"semibold"} my={2} textAlign={"center"}>
                      {course.courseName}
                    </Text>
                    <Button
                      bg={useColorModeValue("orange.300", "orange.600")}
                      w={"100%"}
                      gap={4}
                      mt={2}
                      onClick={() => openModal(course)}
                    >
                      <FaKey size={10} />
                      Enroll in this course
                    </Button>
                  </Flex>
                ))}
              </Flex>
            ))}
        </Flex>
        )}

        {selectedCourse && (
        <Modal isOpen onClose={() => setSelectedCourse(null)} blockScrollOnMount={false}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Text fontSize={"lg"}>{selectedCourse.courseCode}</Text>
                    <Text fontSize={"md"}>{selectedCourse.courseName}</Text>
                    <ModalCloseButton />
                </ModalHeader>
                <ModalBody>
                    <Flex>
                        <Text fontWeight={"semibold"} mx={2} mt={2}>
                            Enrollment Key:{" "}
                        </Text>
                        <Input
                            type="text"
                            w={"65%"}
                            value={enrollmentKey}
                            onChange={(e) => setEnrollmentKey(e.target.value)}
                            bg={useColorModeValue("orange.200", "orange.700")}
                            ml={2}
                        />
                    </Flex>
                    <Button my={3} w={"100%"} bg={useColorModeValue("orange.300", "orange.600")} onClick={handleEnrollCourse} isLoading={loading}>
                      Enroll
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
        )}
        </Flex>
    );
};

export default AllCourses;
