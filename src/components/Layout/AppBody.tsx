import { Container, useColorMode } from "@chakra-ui/react";
import React from "react";
import { BetaBanner } from "./BetaBanner";
import { useRouter } from "next/router";
import { AppLogo } from "./AppBar/AppLogo";

export const AppBody = ({ children }: { children: React.ReactNode }) => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  console.log(router)

  return (
    <Container
      id='app-layout-container'
      maxW='container.md'
      padding={0}
      alignItems='center'
      height='calc(100% - 3rem)'
      className={colorMode}
    >
      {(router.asPath === '/' || router.asPath === '/about') && <AppLogo big />}
      {process.env['NEXT_PUBLIC_ENV'] == 'staging' && (
        <BetaBanner />
      )}
      {children}
    </Container>
  )
}