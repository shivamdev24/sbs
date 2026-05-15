/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState, useTransition } from "react";

import {
  createCategories,
  deleteCategory,
  getCategories,
} from "@/actions/categoryAction";

import { useBusinessStore } from "@/lib/zustandStore/useBusinessStore";

import { toast } from "sonner";

import { Plus, Trash2, FolderOpen, Loader2, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface CategoryInput {
  name: string;
}

interface SavedCategory {
  id: string;
  name: string;
}

export default function CategoryPage() {
  const business = useBusinessStore((state) => state.business);

  const businessProfileId = business?.id;

  const [categories, setCategories] = useState<SavedCategory[]>([]);

  const [inputs, setInputs] = useState<CategoryInput[]>([{ name: "" }]);

  const [isPending, startTransition] = useTransition();

  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // ================= FETCH =================

  const fetchCategories = async () => {
    if (!businessProfileId) return;

    try {
      const data = await getCategories(businessProfileId);

      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [businessProfileId]);

  // ================= INPUTS =================

  const addInput = () => {
    setInputs((prev) => [...prev, { name: "" }]);
  };

  const removeInput = (index: number) => {
    setInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const updateInput = (index: number, value: string) => {
    const updated = [...inputs];

    updated[index].name = value;

    setInputs(updated);
  };

  // ================= CREATE =================

  const handleCreate = () => {
    startTransition(async () => {
      if (!businessProfileId) {
        toast.error("Business profile not found");
        return;
      }

      const filtered = inputs.filter((c) => c.name.trim());

      if (!filtered.length) {
        toast.error("Add at least one category");
        return;
      }

      try {
        const data = await createCategories({
          categories: filtered,
          businessProfileId,
        });

        if (!data.success) {
          toast.error(data.error);
          return;
        }

        const count = data.count ?? 0;

        toast.success(`Created ${count} categor${count > 1 ? "ies" : "y"}`);

        setInputs([{ name: "" }]);

        fetchCategories();
      } catch (error) {
        console.error(error);
        toast.error("Failed to create categories");
      }
    });
  };

  // ================= DELETE =================

  const handleDelete = async (categoryId: string, categoryName: string) => {
    const confirmDelete = confirm(`Delete "${categoryName}"?`);

    if (!confirmDelete) return;

    setIsDeleting(categoryId);

    try {
      const data = await deleteCategory(categoryId);

      if (!data.success) {
        toast.error(data.error);
        return;
      }

      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));

      toast.success("Category deleted");
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    } finally {
      setIsDeleting(null);
    }
  };

  // ================= LOADING =================

  if (!business) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* ================= HEADER ================= */}

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Organize your salon services into categories.
          </p>
        </div>

        {/* ================= MAIN GRID ================= */}

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* ================= CREATE ================= */}

          <Card className="h-fit rounded-3xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Create Categories</CardTitle>

              <CardDescription>
                Add categories for your salon services.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {inputs.map((input, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Category ${index + 1}`}
                    value={input.name}
                    onChange={(e) => updateInput(index, e.target.value)}
                    className="h-11 rounded-xl"
                  />

                  {inputs.length > 1 && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="rounded-xl"
                      onClick={() => removeInput(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={addInput}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add More
              </Button>

              <Button
                className="h-11 w-full rounded-xl"
                disabled={isPending}
                onClick={handleCreate}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Categories
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* ================= CATEGORY LIST ================= */}

          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>All Categories ({categories.length})</CardTitle>

                <CardDescription>
                  Manage your existing categories.
                </CardDescription>
              </div>

              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <FolderOpen className="h-5 w-5" />
              </div>
            </CardHeader>

            <CardContent>
              {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="rounded-full bg-muted p-4">
                    <Tag className="h-8 w-8 text-muted-foreground" />
                  </div>

                  <h3 className="mt-4 text-lg font-semibold">
                    No Categories Yet
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Create your first category to organize services.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between rounded-2xl border bg-background p-4 transition hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-primary/10 p-2 text-primary">
                          <Tag className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="font-medium">{category.name}</p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isDeleting === category.id}
                        onClick={() => handleDelete(category.id, category.name)}
                      >
                        {isDeleting === category.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
