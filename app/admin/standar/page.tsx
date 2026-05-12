"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ClipboardList } from "lucide-react";

interface StandarItem {
  id: string;
  jobTitle: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function StandarPage() {
  const [items, setItems] = useState<StandarItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [jobTitle, setJobTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [alert, setAlert] = useState<{ type: string; message: string }>({
    type: "",
    message: "",
  });

  useEffect(() => {
    fetch("/api/standar")
      .then((r) => r.json())
      .then((data: StandarItem[]) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !description) {
      setAlert({ type: "error", message: "All fields are required" });
      return;
    }
    try {
      const res = await fetch("/api/standar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, description }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }
      const created: StandarItem = await res.json();
      setItems((prev) => [created, ...prev]);
      setAlert({ type: "success", message: "Standar Submitted" });
      setJobTitle("");
      setDescription("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit";
      setAlert({ type: "error", message });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-3xl font-bold tracking-tight"
            data-testid="standar-page-nav"
          >
            Standar Submission
          </h2>
          <p className="text-muted-foreground">
            Submit job standards
          </p>
        </div>
      </div>
      <Separator />

      {alert.message && (
        <Alert
          data-testid={
            alert.type === "success"
              ? "standar-created-alert"
              : "standar-error-alert"
          }
          variant={alert.type === "success" ? "default" : "destructive"}
        >
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Job Standard Details</h3>
        </CardHeader>
        <CardContent>
          <form
            data-testid="standar-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Title</label>
              <Input
                data-testid="standar-jobTitle-input"
                name="jobTitle"
                placeholder="Enter job title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                data-testid="standar-description-input"
                name="description"
                placeholder="Enter job standard description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button type="submit" data-testid="submit-standar-btn">
              <ClipboardList className="mr-2 h-4 w-4" />
              Submit Standar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Submitted Standards</h3>
        </CardHeader>
        <CardContent>
          <div data-testid="standar-list-container">
            {loading ? (
              <p data-testid="standar-list-loading">Loading...</p>
            ) : items.length > 0 ? (
              <ul data-testid="standar-list" className="space-y-2">
                {items.map((item: StandarItem) => (
                  <li
                    key={item.id}
                    data-testid={`standar-item-${item.id}`}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{item.jobTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p data-testid="standar-list-empty">
                No standards submitted yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
