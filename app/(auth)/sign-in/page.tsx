import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">
            Welcome Back
          </CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <SignIn
            routing="path"
            path="/sign-in"
            afterSignInUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-none",
              },
            }}
          />
          <div className="text-center">
            <Link
              href="/campaigns"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground underline-offset-4 hover:underline"
            >
              Continue as Guest
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

