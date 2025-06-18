import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login');
  
  // This code won't be reached due to the redirect
  return null;
}
