import {
    Button,
    Flex,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import CreateUserAccount from "../AdminComponents/createUserAccount";
import ViewUserAccount from "../AdminComponents/viewUserAccount";
import ManageDepartment from "../AdminComponents/manageDepartment";


const AdminPage = () => {
    const [selectedComponent, setSelectedComponent] = useState("create");

    const renderComponent = () => {
        if (selectedComponent === "create") {
            return <CreateUserAccount />;
        } else if (selectedComponent === "view") {
            return <ViewUserAccount />;
        } else if (selectedComponent === "manageDepartment") {
            return <ManageDepartment />;
        }

        return null;
    };

    return (
        <Flex justifyContent={"center"} flexDirection={"column"} alignItems={"center"}>
            <Flex
                justifyContent={"center"}
                alignItems={"center"}
                bg={useColorModeValue("whitesmoke", "gray.dark")}
                w={"full"}
                h={"full"}
                pb={5}
                flexDirection={"column"}
            >
                <Text fontSize={"3xl"} fontWeight={"semibold"} mt={"5"} textAlign={"center"}>
                    Admin Controls
                </Text>
                <Flex flexDirection={"row"} gap={4} mt={3}>
                    <Button bg={useColorModeValue("gray.200", "gray.600")} p={3} onClick={() => setSelectedComponent("create")}>
                        Create Users Account
                    </Button>
                    <Button bg={useColorModeValue("gray.200", "gray.600")} p={3} onClick={() => setSelectedComponent("view")}>
                         View Users Account
                    </Button>
                    <Button bg={useColorModeValue("gray.200", "gray.600")} p={3} onClick={() => setSelectedComponent("manageDepartment")}>
                         Manage Department
                    </Button>
                </Flex>
            </Flex>

            <Flex mt={5}>
                {renderComponent()}
            </Flex>
        </Flex>
    );
}

export default AdminPage;