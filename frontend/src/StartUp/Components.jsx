import {
    Box,
    Text,
    Button,
    Input,
} from '@chakra-ui/react';

export const Container = (props) => (
    <Box
        backgroundColor="rgb(250, 200, 100)"
        borderRadius="10px"
        boxShadow="0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)"
        position="relative"
        width="70%"
        minHeight="70vh"
        {...props}
    />
);

export const SignUpContainer = (props) => (
    <Box
      position="absolute"
      top="0"
      height="100%"
      transition="all 0.6s ease-in-out"
      left="0"
      width="50%"
      opacity="0"
      zIndex="2"
      transform={props.signinIn !== true ? 'translateX(100%)' : undefined}
    />
);

export const SignInContainer = (props) => (
    <Box
      position="absolute"
      top="0"
      height="100%"
      transition="all 0.6s ease-in-out"
      left="0"
      width="50%"
      zIndex="1"
      transform={props.signinIn !== true ? 'translateX(100%)' : undefined}
    />
);


export const Form = (props) => (
    <Box
        display="flex"
        bg={"orange.400"}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        height="100%"
        textAlign="center"
        {...props}
    />
);

export const Title = (props) => (
    <Text fontWeight="bold" fontSize="1.3em" margin="0" {...props} />
);


export const CustomInput = (props) => (
    <Input
      backgroundColor="#eee"
      color="#000"
      border="none"
      padding="8px 10px"
      margin="8px 0"
      width="100%"
      fontSize="0.8em"
      borderRadius="0.75rem"
      paddingLeft="1rem"
      {...props}
    />
);

export const CustomButton = (props) => (
    <Button
      borderRadius="20px"
      border="1px solid #ff4b2b"
      backgroundColor="#ff4b2b"
      marginTop="8px"
      color="#ffffff"
      fontSize="12px"
      fontWeight="bold"
      padding="12px 36px"
      letterSpacing="1px"
      textTransform="uppercase"
      transition="transform 80ms ease-in"
      _active={{ transform: 'scale(0.95)' }}
      _focus={{ outline: 'none' }}
      {...props}
    />
);

export const GhostButton = (props) => (
    <CustomButton
      backgroundColor="transparent"
      borderColor="#ffffff"
      {...props}
    />
);


export const Anchor = (props) => (
    <Text
      color="#333"
      fontSize="1em"
      cursor="pointer"
      textDecoration="none"
      margin="15px 0"
      {...props}
    />
);

export const OverlayContainer = (props) => (
    <Box
      position="absolute"
      top="0"
      left="50%"
      width="50%"
      height="100%"
      overflow="hidden"
      transition="transform 0.6s ease-in-out"
      zIndex="10"
      transform={props.signinin !== true ? 'translateX(-100%)' : undefined}
      {...props}
    />
);

export const Overlay = (props) => (
    <Box
      background="linear-gradient(to right, rgb(255, 155, 80), rgb(198, 61, 47))"
      backgroundSize="cover"
      backgroundPosition="0 0"
      color="#ffffff"
      position="relative"
      left="-100%"
      height="100%"
      width="200%"
      transition="transform 0.6s ease-in-out"
      transform={props.signinin !== true ? 'translateX(50%)' : undefined}
      {...props}
    />
);

export const OverlayPanel = (props) => (
    <Box
      position="absolute"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      padding="0 40px"
      textAlign="center"
      top="0"
      height="100%"
      width="50%"
      transform="translateX(0)"
      transition="transform 0.6s ease-in-out"
      {...props}
    />
);


export const LeftOverlayPanel = (props) => (
    <OverlayPanel
      transform={props.signinin !== true ? 'translateX(0)' : undefined}
      {...props}
    />
);


export const RightOverlayPanel = (props) => (
    <OverlayPanel
      right="0"
      transform={props.signinin !== true ? 'translateX(20%)' : undefined}
      {...props}
    />
);


export const Paragraph = (props) => (
    <Text
        fontSize="0.9em"
        color="rgb(32, 32, 32)"
        fontWeight="700"
        lineHeight="20px"
        letterSpacing="0.5px"
        margin="20px 0 5px"
        {...props}
    />
);