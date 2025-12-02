import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
          <SignIn
            routing="path"
            path="/sign-in"
            fallbackRedirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-none",
              },
            }}
          />
          <div className="text-center mt-6">
            <Link
              href="/campaigns"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground underline-offset-4 hover:underline"
            >
              Continue as Guest
            </Link>
          </div>
    </div>
  );
}

