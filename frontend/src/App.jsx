import { Box, Flex, } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Sidebar from "./components/Sidebar";
import GroupPage from "./pages/GroupPage";
import CommunityPage from "./pages/CommunityPage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./CommunityComponents/CreatePost";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";
import CustomerServicePage from "./pages/CustomerServicePage";
import AdminPage from "./pages/AdminPage";
import LecturerPage from "./pages/LecturerPage";


function App() {
	const user = useRecoilValue(userAtom);

	return (
		<Flex h={"100vh"} overflow={"hidden"}>
		{user && <Sidebar />}
			<Box flex="1">
				<Routes>
				<Route path='/' element={user ? <ChatPage /> : <AuthPage />} />
					<Route path='/auth' element={!user ? <AuthPage /> : <Navigate to='/' />} />
					<Route path='/update' element={user ? <UpdateProfilePage /> : <Navigate to='/auth' />} />
					<Route
						path='/:username'
						element={
							user ? (
								<>
									<UserPage />
									<CreatePost />
								</>
							) : (
								<AuthPage />
							)
						}
					/>
					<Route path='/:username/post/:pid' element={<PostPage />} />
					<Route path='/group' element={user ? <GroupPage /> : <Navigate to={"/auth"} />} />
					<Route path='/community' element={user ? <CommunityPage /> : <Navigate to={"/auth"} />} />
					<Route path="/adminControl" element={user ? <AdminPage /> : <Navigate to={"/auth"} /> } />
					<Route path="/courses" element={user ? <LecturerPage /> : <Navigate to={"/auth"} /> } />
					<Route path="/customerService" element={user ? <CustomerServicePage/> : <Navigate to={"/auth"} />} />
					<Route path='/settings' element={user ? <SettingsPage /> : <Navigate to={"/auth"} />} />
				</Routes>
			</Box>
		</Flex>
	);
}

export default App;
