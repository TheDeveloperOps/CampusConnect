import {
    Button,
    Flex,
    Text,
    useColorModeValue,
    Box
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import CourseActivity from "../LecturerComponents/CourseActivity";

const LecturerPage = () => {
    const user = useRecoilValue(userAtom);
    const [selectedComponent, setSelectedComponent] = useState("courseActivity");

    const renderComponent = () => {
        if(selectedComponent === "courseActivity") {
            return <CourseActivity />;
        }
    }


    return (
        <Box h={"100vh"} overflowY={"auto"}>
        <Flex justifyContent={"center"} alignItems={"center"} flexDirection={"column"} position={"relative"}>
            <Flex
                justifyContent={"center"}
                alignItems={"center"}
                bg={useColorModeValue("orange.300", "orange.600")}
                w={"100%"}
                pb={5}
                flexDirection={"column"}
            >
                <Flex flexDirection={"row"} gap={3} mt={"5"}>
                    <Text fontSize={"3xl"} fontWeight={"semibold"} textAlign={"center"}>Welcome </Text>
                    <Text fontSize={"3xl"} fontWeight={"semibold"} textAlign={"center"}>{user.username}</Text>
                </Flex>
{/*
                <Flex flexDirection={"row"} gap={4} mt={3}>
                    <Button bg={useColorModeValue("gray.200", "gray.600")} p={3} onClick={() => setSelectedComponent("courseActivity")}>
                        Course Activity
                    </Button>
                    <Button bg={useColorModeValue("gray.200", "gray.600")} p={3}>
                        Students Activity
                    </Button>
                </Flex>
*/}
            </Flex>
            <Flex mt={"5"} overflowY={"auto"}>
                {renderComponent()}
            </Flex>
        </Flex>
        </Box>
    );
}

export default LecturerPage;
