import React, { useState } from "react";
import {
    Button,
    Flex,
    Input,
    Select,
    Text,
    Textarea,
    useColorModeValue,
} from "@chakra-ui/react";
import { IoAttachSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { host } from "../APIRoute/APIRoute.js";


const CustomerServicePage = () => {
    const [report, setReport] = useState({
        option: "",
        subject: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const showToast = useShowToast();

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${host}/api/customerService/sendReport`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(report),
            });

            const data = await response.json();

            if (response.ok) {
                showToast("Success", data.message, "success");
                setReport({
                    option: "",
                    subject: "",
                    description: "",
                });
            } else {
                showToast("Error", data.error, "error");
            }
        } catch (error) {
            showToast("Error", "Internal Server Error", "error");
        } finally {
            setLoading(false);
            setReport({
                option: "",
                subject: "",
                description: "",
            });
        }
    };


    return (
        <Flex flexDirection={"column"} justifyContent={"center"}>
            <Flex
                p={"5"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                bg={useColorModeValue("whiteAlpha.700", "blackAlpha.400")}
                w={"100%"}
            >
                <Text fontSize="3xl" fontWeight={"bold"}>
                    Customer Service
                </Text>
                <Text fontSize={"2xl"} fontWeight={"semibold"} mt={"5"}>
                    Hello! We are here to help
                </Text>
            </Flex>

            <Flex
                p={"5"}
                flexDirection={"row"}
                justifyContent={"center"}
                alignItems={"center"}
                fontWeight={"medium"}
                gap={"10"}
                mr={"12"}
            >
                <Flex flexDirection={"row"} bg={useColorModeValue("white", "black")} p={"5"} rounded={"xl"} h={"50vh"} w={"50%"}>
                    <Flex flexDirection={"row"} mb={"16"} alignItems="center">
                        <Flex flexDirection={"column"}>
                            <Text fontSize="2xl" textAlign={"start"}>Hello, Campus Connect</Text>
                            <Text fontSize={"md"} mt={"8"}>I would like to make a <br/> report about your application: </Text>
                        </Flex>
                        <Select
                            value={report.option}
                            onChange={(e) => setReport({...report, option: e.target.value})}
                            ml={2}
                            w={"12.5rem"}
                            mt={"16"}
                            bg={"whiteAlpha.600"}
                            textColor={"gray.dark"}
                        >
                            <option value={"Select Option"}>Select Option</option>
                            <option value={"Bugs"}>BUGS</option>
                            <option value={"Improvement"}>IMPROVEMENT</option>
                        </Select>
                    </Flex>
                </Flex>

                <Flex bg={useColorModeValue("white", "black")} p={"5"} rounded={"2xl"} flexDirection={"column"} w={"50%"}>
                <Flex flexDirection={"row"} mt={"2"} alignItems="center">
                    <Text fontSize={"md"}>Subject: </Text>
                    <Input
                        type={"text"}
                        placeholder={"Enter the subject of the report..."}
                        value={report.subject}
                        w={"100%"}
                        ml={2}
                        bg={useColorModeValue("gray.200", "gray.dark")}
                        border={"none"}
                        onChange={(e) =>
                            setReport((report) => ({
                                ...report,
                                subject: e.target.value,
                            }))
                        }
                    />
                </Flex>

                <Flex flexDirection={"column"} mt={"8"}>
                    <Text fontSize={"md"}>Description: </Text>
                    <Textarea w={"100%"} h={"10rem"} bg={useColorModeValue("gray.200", "gray.dark")} value={report.description} onChange={(e) => setReport((report) => ({...report, description: e.target.value}))} />
                    <Button isLoading={loading} my={4} bg={useColorModeValue("gray.300", "gray.800")} onClick={handleSubmit}>Submit</Button>
                </Flex>
            </Flex>
            </Flex>
        </Flex>
    );
};

export default CustomerServicePage;
