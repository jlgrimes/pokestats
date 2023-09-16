import { Container, useColorMode } from "@chakra-ui/react";
import React from "react";

export const AppBody = ({ children }: { children: React.ReactNode }) => {
  const { colorMode } = useColorMode();

  return (
    <Container
      id='app-layout-container'
      maxW='container.md'
      padding={0}
      alignItems='center'
      height='calc(100% - 3rem)'
      className={colorMode}
    >
      {children}
    </Container>
  )
}