import { ModeToggle } from '@/components/mode-toggle';
import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <main className="flex justify-between p-5">
      <p>Homepage</p>
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </main>
  );
}
