import {
	Center, Text,
	Box, FormControl,
	FormLabel, Input,
	HStack, Card,
	CardBody, Image,
	Link, Stack,
	VStack, Button,
	Heading, useColorModeValue,
	Flex
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import { Link as RouterLink } from "react-router-dom";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import Cookies from "js-cookies";
import Logo from "../assets/images/logo.png";
import axios from "axios";
import { host } from "../APIRoute/APIRoute";


export default function SignupCard() {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const [inputs, setInputs] = useState({
		nric: "",
		username: "",
		email: "",
		password: "",
	});
	const [confirmPassword, setConfirmPassword] = useState('');

	const showToast = useShowToast();
	const setUser = useSetRecoilState(userAtom);


	const handleSignup = async () => {
	  	if (inputs.password !== confirmPassword) {
			showToast("Error", "Password Not Match", "error");
			return;
	  	}

	  	try {
			const res = await axios.post(`${host}/api/users/signup`, inputs, {
			  	headers: {
					"Content-Type": "application/json",
			  	},
			});

			const data = res.data;

			if (data.error) {
			  	showToast("Error", data.error, "error");
			  	return;
			}

			Cookies.setItem("Campus-Connect", JSON.stringify(data));
			setUser(data);
	  	} catch (error) {
			showToast("Error", error.message, "error");
	  	}
	};


	return (
		<Flex justifyContent={"center"} bg={"blackAlpha.300"} px={12} rounded={"2xl"} py={8}>
		  	<Stack spacing='4'>
				<VStack justifyContent={"center"} spacing='5'>
					<Image mt={"-12"} src={Logo} rounded={"full"} w={100} h={"auto"} />
				  	<Heading
						fontWeight={"bold"}
						fontSize='1.5em'
						letterSpacing='-0.5px'
				  	>
						Create Account
				  	</Heading>
				</VStack>
				<Card bg={useColorModeValue("whitesmoke", "gray.dark")} variant='outline' borderColor={"white"} w={"full"}>
				  	<CardBody>
						<Stack spacing='4'>
							<Flex columnGap={8}>
								<FormControl>
								  	<FormLabel size='md'>NRIC</FormLabel>
								  	<Input
										type='text'
										bg={useColorModeValue("gray.300", "gray.800")}
										borderColor={"blackAlpha.400"}
										size='sm'
										borderRadius='6px'
										value={inputs.nric}
										onChange={(e) => setInputs((inputs) => ({...inputs, nric: e.target.value}))}
								  	/>
								</FormControl>
								<FormControl>
								<FormLabel size={"md"}>Username</FormLabel>
								  	<Input
										type='text'
										bg={useColorModeValue("gray.300", "gray.800")}
										borderColor={"blackAlpha.400"}
										size='sm'
										borderRadius='6px'
										value={inputs.username}
										onChange={(e) => setInputs((inputs) => ({...inputs, username: e.target.value}))}
								  	/>
								</FormControl>
							</Flex>

							<FormControl>
								<FormLabel size={"md"}>Email</FormLabel>
								<Input
									type='email'
									bg={useColorModeValue("gray.300", "gray.800")}
									borderColor={"blackAlpha.400"}
									size='sm'
									borderRadius='6px'
									value={inputs.email}
									onChange={(e) => setInputs((inputs) => ({...inputs, email: e.target.value}))}
								/>
							</FormControl>
							<Flex columnGap={8}>
								<FormControl>
								  	<FormLabel size='sm'>Password</FormLabel>
								  	<Input
										type='password'
										bg={useColorModeValue("gray.300", "gray.800")}
										borderColor={"blackAlpha.400"}
										size='sm'
										borderRadius='6px'
										value={inputs.password}
										onChange={(e) => setInputs((inputs) => ({...inputs, password: e.target.value}))}
								  	/>
								</FormControl>
								<FormControl>
								<FormLabel size='sm'>Confirm Password</FormLabel>
								  <Input
									type='password'
									bg={useColorModeValue("gray.300", "gray.800")}
									borderColor={"blackAlpha.400"}
									size='sm'
									borderRadius='6px'
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								  />
								</FormControl>
							</Flex>
							<Button
							  bg={useColorModeValue("orange.300", "orange.600")}
							  color={useColorModeValue("black", "white")}
							  size='sm'
							  _hover={{ bg: "whatsapp.600" }}
							  _active={{ bg: "whatsapp.600" }}
							  onClick={handleSignup}
							>
							  Sign in
							</Button>
						</Stack>
				  	</CardBody>
				</Card>

				<Card variant='outline' borderColor='#d0d7de'>
				  	<CardBody>
					<Center>
					  	<HStack fontSize='md' spacing='5'>
							<Text>Already have an account? Login now</Text>
							<Link color={"orange.600"} as={RouterLink} to={'/login'} onClick={() => setAuthScreen("login")}>
							  	Login
							</Link>
					  	</HStack>
					</Center>
				  </CardBody>
				</Card>
		  	</Stack>
		</Flex>
	);
}
