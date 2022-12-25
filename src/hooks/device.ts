import { useEffect, useState } from 'react';
import { isMobileDevice } from '../lib/userAgent';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  return [isMobile, setIsMobile];
};
