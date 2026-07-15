import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-12 text-white">
        <h1 className="text-3xl font-semibold">Sign in</h1>
        <p className="mt-3 text-white/65">Add your Clerk publishable key to enable the hosted sign-in flow.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <SignIn />
    </main>
  );
}