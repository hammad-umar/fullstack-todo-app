"use client";

import { createClient } from "@/lib/supabase/client";
import { Todo } from "@/types";
import { FC, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const TodosList: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [todos, setTodos] = useState<Todo[]>([]);

  const supabase = createClient();

  const getTodos = async (): Promise<void> => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setTodos(data || []);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id: string, current: boolean): Promise<void> => {
    try {
      const { error } = await supabase
        .from("todos")
        .update({ is_completed: !current })
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const setup = async () => {
      await getTodos();

      const channel = supabase
        .channel("todos-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "todos",
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setTodos((prev) => [payload.new as Todo, ...prev]);
            }

            if (payload.eventType === "UPDATE") {
              setTodos((prev) =>
                prev.map((todo) =>
                  todo.id === payload.new.id ? (payload.new as Todo) : todo,
                ),
              );
            }

            if (payload.eventType === "DELETE") {
              setTodos((prev) =>
                prev.filter((todo) => todo.id !== payload.old.id),
              );
            }
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setup();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center">📝 My Todos</h2>

      {loading && (
        <p className="text-center text-muted-foreground">Loading todos...</p>
      )}

      {!loading && todos.length === 0 && (
        <p className="text-center text-muted-foreground">No todos found 🚀</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {todos.map((todo) => (
          <Card
            key={todo.id}
            className="hover:shadow-lg transition-all duration-200 rounded-2xl"
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={todo.is_completed}
                  onCheckedChange={() => toggleTodo(todo.id, todo.is_completed)}
                />

                <p
                  className={`text-sm font-medium ${
                    todo.is_completed
                      ? "line-through text-muted-foreground"
                      : ""
                  }`}
                >
                  {todo.title}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 size={18} />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TodosList;
