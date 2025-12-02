import { SignUp } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      {/* <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">
            Create Your Account
          </CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            Join BrandMatch to connect creators with brands
          </p>
        </CardHeader>
        <CardContent> */}
          <SignUp
            routing="path"
            path="/sign-up"
            afterSignUpUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-none",
              },
            }}
          />
        {/* </CardContent>
      </Card> */}
    </div>
  );
}

