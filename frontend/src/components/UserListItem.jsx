import {
    Box,
    Avatar,
    Text,
    useColorModeValue,
    Flex
} from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
    const handleClick = () => {
        handleFunction(user);
    }


    return (
        <Flex
            onClick={handleClick}
            cursor="pointer"
            bg={useColorModeValue("orange.100", "gray.600")}
            _hover={{
              background: useColorModeValue("orange.400", "whiteAlpha.500"),
              color: useColorModeValue("gray", "white"),
            }}
            w="100%"
            flexDirection={"row"}
            alignItems="center"
            color="black"
            px={3}
            py={2}
            mb={2}
            borderRadius="lg"
        >
            <Avatar
                mr={2}
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
            />
            <Flex textColor={useColorModeValue("black", "white")} flexDirection={"column"}>
                <Text fontWeight={"medium"}>{user.username}</Text>
                <Text fontSize="xs">
                    <b>Email : </b>
                    {user.email}
                </Text>
            </Flex>
        </Flex>
    );
};

export default UserListItem;