import { Container, useColorMode } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { BetaBanner } from "./BetaBanner";
import { useRouter } from "next/router";
import { AppLogo } from "./AppBar/AppLogo";
import { Callout, Text } from "@tremor/react";
import { ExclamationIcon } from "@heroicons/react/solid";
import { useShouldRemoveAds } from "../../hooks/ads";

export const AppBody = ({ children }: { children: React.ReactNode }) => {
  const { colorMode } = useColorMode();
  const router = useRouter();

  const shouldRemoveAds = useShouldRemoveAds();

  useEffect(() => {
    if (shouldRemoveAds && document.querySelectorAll('.adsbygoogle').length > 0) {
      document.querySelectorAll('.adsbygoogle').forEach((el) => el.remove());
    }
  }, [shouldRemoveAds]);


  return (
    <Container
      id='app-layout-container'
      maxW={'container.md'}
      paddingX={2}
      alignItems='center'
      height='calc(100% - 3rem)'
      className={colorMode}
    >
      {(router.asPath === '/about') && <AppLogo big />}
      {process.env['NEXT_PUBLIC_ENV'] == 'staging' && (
        <>
          <BetaBanner />
        </>
      )}
      {/* {router.asPath === '/' && (
        <Callout
          className="text-sm mb-4"
          icon={ExclamationIcon}
          title='Ongoing data inaccuracy for Lille'
          color='rose'>
            10/21: Deck percentages might be off.
        </Callout>
      )} */}
      {children}
    </Container>
  )
}