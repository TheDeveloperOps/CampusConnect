import { Box, Checkbox, Flex, Grid, Spinner, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import axios from 'axios';
import { host } from "../APIRoute/APIRoute";


const Report = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const showToast = useShowToast();



    useEffect(() => {
        const getReports = async () => {
            try {
                const response = await axios.get(`${host}/api/customerService/getReports`, {
                  headers: { "Content-Type": "application/json" },
                });

                if (response.status === 200) {
                  const data = response.data;
                  setReports(data);
                } else {
                  showToast("Error", "Failed to fetch reports", "error");
                }
            } catch (error) {
                showToast("Error", "An unexpected error occurred", "error");
            } finally {
                setLoading(false);
            }
        };

        getReports();
    }, [showToast]);


    return (
        <Box w={"full"} p={8}>
            {loading ? (
                <Flex justifyContent="center" alignItems="center" height="200px">
                    <Spinner />
                </Flex>
            ) : (
                <Flex justifyContent="center" alignItems="center" w="90%" h="100%" ml={12}>
                    <Grid templateColumns="1fr 1.5fr 2fr 0.25fr" gap={2} p={4} bg={useColorModeValue("wheat", "gray.600")} w={"full"}>
                        <Box bg={useColorModeValue("orange.300", "orange.600")} p={1} fontWeight="bold" textAlign="center">Report</Box>
                        <Box bg={useColorModeValue("orange.300", "orange.600")} p={1} fontWeight="bold" textAlign="center">Subject</Box>
                        <Box bg={useColorModeValue("orange.300", "orange.600")} p={1} fontWeight="bold" textAlign="center">Description</Box>
                        <Box textAlign="center"></Box>
                        {reports.map(report => (
                            <React.Fragment key={report._id}>
                                <Box p={2} textAlign="center" textColor={useColorModeValue("black", "white")}>{report.reportType}</Box>
                                <Box p={2} textAlign="center" textColor={useColorModeValue("black", "white")}>{report.subject}</Box>
                                <Box p={2} textAlign="center" textColor={useColorModeValue("black", "white")}>{report.description}</Box>
                                <Box textAlign="center" mt={2}><Checkbox p={2} bg={useColorModeValue("blackAlpha.700", "whiteAlpha.700")} /></Box>
                            </React.Fragment>
                        ))}
                    </Grid>
                </Flex>
            )}
        </Box>
    );
};

export default Report;
