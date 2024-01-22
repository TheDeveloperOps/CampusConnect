import {
    Avatar,
    Box,
    Flex,
    Stack,
    Text,
    WrapItem,
    useColorModeValue,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { selectedGroupAtom } from "../atoms/groupAtom";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";


const Group = ({ group }) => {
    const currentUser = useRecoilValue(userAtom);
    const lastMessage = group.lastMessage;
    const [selectedGroup, setSelectedGroup] = useRecoilState(selectedGroupAtom);


    return (
        <Flex
            gap={4}
            alignItems={"center"}
            p={"1"}
			_hover={{
				cursor: "pointer",
				bg: useColorModeValue("whiteAlpha.700", "whiteAlpha.300"),
				color: useColorModeValue("gray.dark", "whitesmoke"),
			}}
            onClick={() => {
                setSelectedGroup({
                    _id: group._id,
                    groupPic: group.pic,
                    groupName: group.name,
                    participants: group.participants,
                    groupCode: group.code,
                    user: currentUser._id,
                    admin: group.admin,
                    mock: group.mock,
                })
            }}
			bg= {
  			   	   selectedGroup?._id === group._id ? useColorModeValue("orange.300", "orange.700"): useColorModeValue("whiteAlpha.500", "gray.700")
  				}
            borderRadius={"md"}
        >
            <WrapItem>
                <Avatar
                    size={{
                        base: "xs",
                        sm: "sm",
                        md: "md",
                    }}
                    src={group.pic}
                />
            </WrapItem>

            <Stack direction={"column"} fontSize={"sm"}>
                <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
                    {group.name}
                </Text>
                <Flex mt={"-2"}>
                    <Text fontWeight={"semibold"}>{group.lastMessage.username} <span>:</span></Text>
                    <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1} fontWeight={"normal"} ml={2}>
                    {lastMessage.text.length > 18 ? lastMessage.text.substring(0, 18) + "...": lastMessage.text || <BsFillImageFill size={16} />}
                        {currentUser._id === lastMessage.sender ? (
                            <Box color={lastMessage.seen ? "blue.400": ""}>
                                <BsCheck2All size={16} />
                            </Box>
                        ) : (
                            ""
                        )}
                    </Text>
                </Flex>
            </Stack>
        </Flex>
    );
};

export default Group;
