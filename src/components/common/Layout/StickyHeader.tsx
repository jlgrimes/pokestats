import { Stack, useColorMode } from '@chakra-ui/react';
import { memo, useEffect, useState } from 'react';

export const StickyHeader = memo(
  ({ id, children }: { id: string; children: JSX.Element }) => {
    const { colorMode } = useColorMode();

    const height = '3rem';

    const [scrollTop, setScrollTop] = useState(0);
    const [stickyHeaderStyle, setStickyHeaderStyle] = useState(false);
    const [headerOffset, setHeaderOffset] = useState<number>(0);

    useEffect(() => {
      setHeaderOffset(document.getElementById(id)?.offsetTop as number);
    }, [id]);

    useEffect(() => {
      const onScroll = () => {
        setScrollTop(document.documentElement.scrollTop);
        if (document.documentElement.scrollTop > headerOffset) {
          setStickyHeaderStyle(true);
        } else {
          setStickyHeaderStyle(false);
        }
      };
      window.addEventListener('scroll', onScroll);

      return () => window.removeEventListener('scroll', onScroll);
    }, [scrollTop]);

    return (
      <Stack height={height}>
        <Stack
          id={id}
          height={height}
          background={colorMode === 'dark' ? 'gray.800' : 'white'}
          position={stickyHeaderStyle ? 'fixed' : 'relative'}
          top={0}
          left={0}
          zIndex={'50'}
          width={'100%'}
          justifyContent={'center'}
          boxShadow={stickyHeaderStyle ? 'lg' : 'none'}
          transition='box-shadow 0.15s ease-in-out'
        >
          {children}
        </Stack>
      </Stack>
    );
  }
);

StickyHeader.displayName = 'StickyHeader';
