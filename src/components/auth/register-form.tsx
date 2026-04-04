"use client";

import Link from "next/link";
import { z } from "zod";
import { FC } from "react";
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

const RegisterSchema = z.object({
  email: z.string().email("Provide valid email address."),
  password: z.string().min(1, "Password is required."),
});

type RegisterForm = z.infer<typeof RegisterSchema>;

const RegisterForm: FC = () => {
  const form = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleOnSubmit = (values: RegisterForm) => {
    console.log(values);
  };

  return (
    <Card className="w-full sm:max-w-md m-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
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
          <Button type="submit" form="form-rhf-login">
            Submit
          </Button>
        </Field>
        <Field orientation="horizontal">
          <p>
            Already have an account?
            <span className="underline text-blue-600">
              <Link href="/login">Login</Link>
            </span>
          </p>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
