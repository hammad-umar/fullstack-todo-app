"use client";

import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";

const CreateTodoSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .max(32, "Title can not exceed 32 characters."),
});

type CreateTodo = z.infer<typeof CreateTodoSchema>;

const CreateTodoForm: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<CreateTodo>({
    resolver: zodResolver(CreateTodoSchema),
    defaultValues: {
      title: "",
    },
  });

  const handleOnSubmit = async (values: CreateTodo): Promise<void> => {
    setLoading(true);
    const supabase = createClient();

    try {
      const user = await supabase.auth.getUser();

      await supabase.from("todos").insert([
        {
          title: values.title,
          user_id: user.data.user?.id,
        },
      ]);

      form.reset({ title: "" });
    } catch (err) {
      console.log(err);
      alert(err instanceof Error ? err.message : "An error occured.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-4 mb-5">
      <form
        className="flex flex-row gap-4"
        id="form-rhf-todo"
        onSubmit={form.handleSubmit(handleOnSubmit)}
      >
        <FieldGroup>
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter todo title here..."
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Button disabled={loading} type="submit" form="form-rhf-todo">
          {loading ? "Saving..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default CreateTodoForm;
