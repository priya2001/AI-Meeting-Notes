import Link from "next/link";
import { ArrowLeft, BadgeCheck, BrainCircuit, Sparkles, ShieldCheck } from "lucide-react";
import { SignIn } from "@clerk/nextjs";

const benefits = [
  {
    icon: Sparkles,
    title: "Fast note generation",
    description: "Paste a transcript and get a clean summary in seconds."
  },
  {
    icon: ShieldCheck,
    title: "Protected history",
    description: "Every note is tied to your account and saved for later."
  },
  {
    icon: BadgeCheck,
    title: "Upgrade ready",
    description: "Free and Pro plans are built around a real checkout flow."
  }
];

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
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.14),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.12),transparent_24%)]" />
      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <section className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>

            <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
              <BrainCircuit className="h-4 w-4" />
              MeetWise login
            </div>

            <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Sign in to resume your meeting notes workspace.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-white/68">
              This is the real authentication entry point for the SaaS. Once signed in, you’ll keep your session, use the dashboard, and later unlock subscriptions.
            </p>
          </div>

          <div className="mt-10 grid gap-4">
            {benefits.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-cyan-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="font-medium text-white">{item.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-white/60">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-cyan-950/25">
            <div className="rounded-[1.5rem] border border-white/10 bg-white p-2">
              <SignIn
                path="/sign-in"
                routing="path"
                forceRedirectUrl="/dashboard"
                fallbackRedirectUrl="/dashboard"
                signUpUrl="/sign-up"
                appearance={{
                  elements: {
                    rootBox: "mx-auto w-full",
                    card: "shadow-none border-0 bg-transparent",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "rounded-xl",
                    formButtonPrimary: "rounded-xl bg-slate-950 hover:bg-slate-800",
                    footerActionLink: "text-cyan-600 hover:text-cyan-700"
                  }
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
