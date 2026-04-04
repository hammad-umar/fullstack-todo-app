"use client";

import Link from "next/link";
import { z } from "zod";
import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const LoginSchema = z.object({
  email: z.string().email("Provide valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginForm = z.infer<typeof LoginSchema>;

const LoginForm: FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleOnSubmit = async (values: LoginForm): Promise<void> => {
    setLoading(true);

    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        ...values,
      });

      if (error) throw error;

      alert("Login successful!");
      router.push("/");
    } catch (err: unknown) {
      console.error(err);
      alert(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full sm:max-w-md m-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription className="text-lg font-bold">
          Welcome back to the Todo App.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-login" onSubmit={form.handleSubmit(handleOnSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-login-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-login-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your email address"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-login-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-login-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your password"
                    autoComplete="off"
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button disabled={loading} type="submit" form="form-rhf-login">
            {loading ? "Logging in..." : "Submit"}
          </Button>
        </Field>
        <Field orientation="horizontal">
          <p>
            Don&apos;t have an account?{" "}
            <span className="underline text-blue-600">
              <Link href="/register">Register</Link>
            </span>
          </p>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
