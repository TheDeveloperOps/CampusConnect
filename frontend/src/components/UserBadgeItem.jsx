import { CloseButton, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ( {user, handleFunction} ) => {
    return (
        <Box
            px={2}
            py={1}
            borderRadius={"lg"}
            m={2}
            mb={2}
            bg={"green.400"}
            cursor={"pointer"}
            flexDirection={"row"}
            display={"flex"}
            alignItems={"center"}
        >
            <Text fontSize={"sm"} color={"white"} fontWeight={"medium"}>{user.username}</Text>
            <CloseButton ml={2} onClick={handleFunction}/>
        </Box>
    );
}

export default UserBadgeItem;
