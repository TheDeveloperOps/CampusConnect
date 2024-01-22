import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { Button, useColorModeValue, useToast } from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";


const UserHeader = ({ user }) => {
	const toast = useToast();
	const currentUser = useRecoilValue(userAtom);


	return (
		<VStack p={10} px={15} bg={useColorModeValue("gray.200", "blackAlpha.300")}>
		  	<Box justifyContent={"center"}>
		    	{user.profilePic && (
		      	<Avatar
		        	name={user.name}
		        	src={user.profilePic}
					my={2}
		        	size={{
		        	  	base: "md",
		        	  	md: "xl",
		        	}}
		      	/>
		    	)}
		    	{!user.profilePic && (
		    	  	<Avatar
		    	  	  	name={user.name}
		    	  	  	src="https://bit.ly/broken-link"
						my={2}
		    	  	  	size={{
		    	  	  	  	base: "md",
		    	  	  	  	md: "xl",
		    	  	  	}}
		    	  	/>
		    	)}
		    <Text fontSize={"3xl"} fontWeight={"bold"} flex={10} justifyContent={"center"}>
		      	{user.name}
		    </Text>
		    <Flex gap={2} alignItems={"center"}>
		      	<Text fontSize={"md"} fontWeight={"medium"}>{user.username}</Text>
		    </Flex>
		  	<Text>{user.bio}</Text>
		  	</Box>
		  	<Flex w={"full"} justifyContent={"space-between"}>
		  	  <Flex gap={2} alignItems={"center"} pl={"5"}>
		  	  </Flex>
		  	  	<Flex>
		  	  	</Flex>
		  	</Flex>
		</VStack>
	);
};

export default UserHeader;
