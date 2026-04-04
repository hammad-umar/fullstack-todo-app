"use client";

import { NextPage } from "next";
import CreateTodoForm from "@/components/todo/create-todo-form";
import TodosList from "@/components/todo/todos-list";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const HomePage: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogout = async (): Promise<void> => {
    setLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      router.push("/login");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "An error occured.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="bg-gray-300 p-4 mb-4 flex flex-row items-center justify-between">
        <div>
          <h1 className="text-black text-3xl font-bold underline">Todo App.</h1>
          <p className="text-black text-xl font-bold underline">
            Best application to keep track of your todos.
          </p>
        </div>
        <Button onClick={handleLogout} disabled={loading} variant="destructive">
          {loading ? "Logging out..." : "Logout"}
        </Button>
      </div>
      <CreateTodoForm />
      <TodosList />
    </div>
  );
};

export default HomePage;
