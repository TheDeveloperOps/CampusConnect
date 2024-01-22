import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Select,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
import { host } from "../APIRoute/APIRoute";


const createUserAccount = () => {
    const [inputs, setInputs] = useState({
        nric: "",
        username: "",
        email: "",
        access: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const showToast = useShowToast();


    const handleSubmit = async () => {
        setLoading(true);

        try {
            const res = await axios.post(`${host}/api/admin/createUserAccount`, inputs, {
              headers: {
                "Content-Type": "application/json",
              },
            });

            const data = res.data;

            if (data.error) {
              showToast("Error", data.error, "error");
              return;
            } else {
              showToast("Success", "User created successfully!", "success");
            }
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setLoading(false);
            setInputs({
                nric: "",
                username: "",
                email: "",
                access: "",
                password: "",
            });
        }
    };


    return (
        <>
            <Flex
                bg={useColorModeValue("whitesmoke", "gray.dark")}
                p={"6"}
                justifyContent={"center"}
                flexDirection={"column"}
                gap={2}
                rounded={"2xl"}
            >
                <Text fontSize={"xl"} fontWeight={"medium"} textAlign={"center"}>Create An Account</Text>
                <Flex mb={2}>
                    <FormControl mx={2}>
                        <FormLabel fontWeight={"medium"}>NRIC:</FormLabel>
                        <Input
                            border={"none"}
                            bg={useColorModeValue("gray.300", "whiteAlpha.600")}
                            color={"black"}
                            autoComplete="nope"
                            value={inputs.nric}
                            onChange={(e) => setInputs((inputs) => ({...inputs, nric: e.target.value}))}
                        />
                    </FormControl>

                    <FormControl mx={2}>
                        <FormLabel fontWeight={"medium"}>Username:</FormLabel>
                        <Input
                            border={"none"}
                            bg={useColorModeValue("gray.300", "whiteAlpha.600")}
                            color={"black"}
                            autoComplete="nope"
                            value={inputs.username}
                            onChange={(e) => setInputs((inputs) => ({...inputs, username: e.target.value}))}
                        />
                    </FormControl>
                </Flex>

                <Flex>
                    <FormControl>
                        <FormLabel fontWeight={"medium"}>Email:</FormLabel>
                        <Input
                            border={"none"}
                            bg={useColorModeValue("gray.300", "whiteAlpha.600")}
                            color={"black"}
                            autoComplete="nope"
                            value={inputs.email}
                            onChange={(e) => setInputs((inputs) => ({...inputs, email: e.target.value}))}
                        />
                    </FormControl>
                </Flex>

                <Flex>
                    <FormControl mx={2}>
                        <FormLabel fontWeight={"medium"}>Access Level:</FormLabel>
                        <Select
                            bg={useColorModeValue("gray.300", "whiteAlpha.600")}
                            color={"black"}
                            value={inputs.access}
                            onChange={(e) => setInputs((inputs) => ({...inputs, access: e.target.value}))}
                            placeholder="Select Access Level"
                        >
                            <option value={"Student"}>Student</option>
                            <option value={"Lecturer"}>Lecturer</option>
                            <option value={"Admin"}>Admin</option>
                        </Select>
                    </FormControl>

                    <FormControl mx={2}>
                        <FormLabel fontWeight={"medium"}>Password:</FormLabel>
                        <Input
                            border={"none"}
                            type="password"
                            bg={useColorModeValue("gray.300", "whiteAlpha.600")}
                            color={"black"}
                            autoComplete="nope"
                            value={inputs.password}
                            onChange={(e) => setInputs((inputs) => ({...inputs, password: e.target.value}))}
                        />
                    </FormControl>
                </Flex>

                <Button
                    bg={useColorModeValue("gray.300", "whiteAlpha.700")}
                    color={"black"}
                    my={2}
                    isLoading={loading}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </Flex>
        </>
    )
}

export default createUserAccount;