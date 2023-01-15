import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function TournamentPage() {
  const router = useRouter();

  useEffect(() => {
    router.push(router.asPath + '/standings');
  }, [router]);
  return <div>Redirecting...</div>;
}
