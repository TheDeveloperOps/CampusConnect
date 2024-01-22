import {
    Flex,
    useColorModeValue ,
    Text,
    Box,
    Button
} from "@chakra-ui/react";
import React, { useState } from "react";
import CourseActivity from "./CourseActivity";
import Assignments from './Assignments';


const LecturerPanel = () => {
    const [selectedComponent, setSelectedComponent] = useState("courseActivity");

    const renderComponent = () => {
        if(selectedComponent === "courseActivity") {
            return <CourseActivity />
        }else if(selectedComponent === "assignments") {
            return <Assignments />
        }
    }
    return (
        <Flex
            w={"100%"}
            bg={useColorModeValue("whitesmoke", "gray.dark")}
            h={"50px"}
            mt={"-4"}
            gap={2}
            flexDirection={"column"}
        >
            <Flex justifyContent={"center"} alignItems={"center"} mx={4} gap={4} mt={1}>
                <Button bg={useColorModeValue("orange.300", "orange.700")} textAlign={"center"} fontWeight={"medium"} onClick={() => setSelectedComponent("courseActivity")}>Manage Course</Button>
                <Button bg={useColorModeValue("orange.300", "orange.700")} textAlign={"center"} fontWeight={"medium"} onClick={() => setSelectedComponent("assignments")}>Manage Assignments</Button>
            </Flex>

            <Flex justifyContent={"center"}>
                {renderComponent()}
            </Flex>
        </Flex>
    );
}

export default LecturerPanel;