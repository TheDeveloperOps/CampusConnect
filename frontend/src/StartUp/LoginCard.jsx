import {
	Flex, Modal,
	VStack, ModalBody,
	FormControl, ModalContent,
	FormLabel, ModalOverlay,
	Input, Text,
	Card, Select,
	CardBody, Link,
	Stack, useColorModeValue,
	Button, Heading,
	useDisclosure, ModalHeader,
	ModalCloseButton, Center,
	HStack, Image
} from "@chakra-ui/react";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { Link as RouterLink } from "react-router-dom";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import Cookies from "js-cookies";
import Logo from "../assets/images/logo.png";
import axios from "axios";
import { host } from "../APIRoute/APIRoute";


export default function LoginCard() {
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const setUser = useSetRecoilState(userAtom);
	const [loading, setLoading] = useState(false);
	const { onClose, onOpen } = useDisclosure();
	const [openModal, setOpenModal] = useState(false);
	const [inputs, setInputs] = useState({
		email: "",
		password: "",
		access: "",
	});
	const showToast = useShowToast();

	const [changingPassword, setChangingPassword] = useState({
		email: "",
		newPassword: "",
	});
	const [confirmPassword, setConfirmPassword] = useState("");


	const changePassword = async () => {
	  	setLoading(true);

	  	if (!changingPassword) {
			showToast("Incomplete Information", "Please fill required fields", "error");
			return;
	  	} else if (changingPassword.newPassword !== confirmPassword) {
			showToast("Incorrect Password", "Password Do Not Match", "error");
	  	}

	  	try {
			const res = await axios.put(`${host}/api/users/changePassword`, changingPassword, {
			  	headers: {
					"Content-Type": "application/json",
			  	},
			});

			if (res.status === 200) {
			  	showToast("User password has been changed", "Password changed successfully", "success");
			} else {
			  	showToast("Failed to change password", "Error while changing password", "error");
			}
	  	} catch (error) {
			showToast("Error", error.message, "error");
	  	} finally {
			setLoading(false);
	  	}
	};


	const handleLogin = async () => {
		setLoading(true);

		try {
			const res = await fetch(`${host}/api/users/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(inputs)
			});

			if (res.ok) {
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
				} else {
					Cookies.setItem("Campus-Connect", JSON.stringify(data));
					setUser(data);
				}
			} else {
				const errorData = await res.json();
				showToast("Error", errorData.error, "error");
			}
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setLoading(false);
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
						Login
				  	</Heading>
				</VStack>
				<Card bg={useColorModeValue("whitesmoke", "gray.dark")} variant='outline' borderColor={"white"} w={"full"}>
				  	<CardBody>
						<Stack spacing='4'>
								<FormControl>
								  	<FormLabel size='md'>Email</FormLabel>
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
								<FormControl>
								<HStack justifyContent={"space-between"}>
									<FormLabel size={"md"}>Password</FormLabel>
									<Button
                        				as='a'
										onClick={() => setOpenModal(true)}
										cursor={"pointer"}
                        				variant='link'
                        				size='sm'
                        				color={"blue.500"}
                        				fontWeight='500'
                      				>
                        				Forgot password?
                      				</Button>
								</HStack>
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
									<FormLabel size='sm'>Log in As</FormLabel>
                            		<Select mt={2} fontSize={"sm"} color={useColorModeValue("black", "white")} isRequired value={inputs.access} onChange={(e) => setInputs((inputs) => ({...inputs, access: e.target.value}))} placeholder="Please Select Your Access" bg={useColorModeValue("gray.300", "gray.800")} borderColor={"blackAlpha.400"}>
						    			<option value={"Student"}>Student</option>
						    			<option value={"Lecturer"}>Lecturer</option>
						    			<option value={"Admin"}>Admin</option>
						    		</Select>
								</FormControl>
							<Button
							  bg={useColorModeValue("orange.300", "orange.600")}
							  color={useColorModeValue("black", "white")}
							  size='sm'
							  _hover={{ bg: "whatsapp.600" }}
							  _active={{ bg: "whatsapp.600" }}
							  onClick={handleLogin}
							  isLoading={loading}
							>
							  Login
							</Button>
						</Stack>
				  	</CardBody>
				</Card>

				<Card variant='outline' borderColor='#d0d7de'>
				  	<CardBody>
					<Center>
					  	<HStack fontSize='md' spacing='5'>
							<Text>Don't have an account with us? Sign up now</Text>
							<Link as={RouterLink} onClick={() => setAuthScreen("signup")} to={'/signup'} color={"orange.600"} fontWeight={"semibold"}>
							  	Sign Up
							</Link>
					  	</HStack>
					</Center>
				  </CardBody>
				</Card>
		  	</Stack>
			{openModal && (
				<Modal isOpen={onOpen} onClose={() => setOpenModal(false)} size="md">
				<ModalOverlay />
				<ModalContent borderRadius="md">
				    <ModalHeader>Change Password</ModalHeader>
				    <ModalCloseButton />
				    <ModalBody>
				        <FormControl mb={4}>
				            <FormLabel>Email:</FormLabel>
				            <Input type="email" placeholder="Enter your email" value={changingPassword.email} onChange={(e) => setChangingPassword((changingPassword) => ({...changingPassword, email: e.target.value}))} />
				        </FormControl>
				        <FormControl mb={4}>
				            <FormLabel>New Password:</FormLabel>
				            <Input type="password" placeholder="Enter your new password" autoComplete="off" value={changingPassword.newPassword} onChange={(e) => setChangingPassword((changingPassword) => ({...changingPassword, newPassword: e.target.value}))} />
				        </FormControl>
				        <FormControl mb={4}>
				            <FormLabel>Confirm Password:</FormLabel>
				            <Input type="password" placeholder="Confirm your new password" autoComplete="off" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
				        </FormControl>
				        <Button
				            colorScheme="orange"
				            isLoading={loading}
				            onClick={changePassword}
				            width="full"
				            mt={4}
				        >
				            Change Password
				        </Button>
				    </ModalBody>
				</ModalContent>
				</Modal>
				)}
		</Flex>
	);
}
