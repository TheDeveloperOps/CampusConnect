import { Box, Flex, Spinner, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../CommunityComponents/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const CommunityPage = () => {
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [loading, setLoading] = useState(true);
	const showToast = useShowToast();
	useEffect(() => {
		const getFeedPosts = async () => {
			setLoading(true);
			setPosts([]);
			try {
				const res = await fetch("/api/posts/feed");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				console.log(data);
				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};
		getFeedPosts();
	}, [showToast, setPosts]);

	return (
		<Flex gap='10' alignItems={"flex-start"} p={10}>
			<Box flex={70} bg={useColorModeValue("orange.200", "orange.600")} p={"5"} rounded={"xl"}>
				{!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}

				{loading && (
					<Flex justify='center'>
						<Spinner size='xl' />
					</Flex>
				)}

				{posts.map((post) => (
					<Post key={post._id} post={post} postedBy={post.postedBy} />
				))}
			</Box>
			<Box
				flex={30}
				p={"5"}
				rounded={"xl"}
				bg={useColorModeValue("orange.200", "orange.600")}
				display={{
					base: "none",
					md: "block",
				}}
			>
			</Box>
		</Flex>
	);
};

export default CommunityPage;
