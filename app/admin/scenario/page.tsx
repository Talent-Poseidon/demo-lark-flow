"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText } from "lucide-react";

interface ScenarioItem {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function ScenarioPage() {
  const [items, setItems] = useState<ScenarioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [alert, setAlert] = useState<{ type: string; message: string }>({
    type: "",
    message: "",
  });

  useEffect(() => {
    fetch("/api/scenario")
      .then((r) => r.json())
      .then((data: ScenarioItem[]) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setAlert({ type: "error", message: "All fields are required" });
      return;
    }
    try {
      const res = await fetch("/api/scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }
      const created: ScenarioItem = await res.json();
      setItems((prev) => [created, ...prev]);
      setAlert({ type: "success", message: "Scenario Submitted" });
      setTitle("");
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
            data-testid="scenario-page-nav"
          >
            Scenario Submission
          </h2>
          <p className="text-muted-foreground">
            Submit scenarios
          </p>
        </div>
      </div>
      <Separator />

      {alert.message && (
        <Alert
          data-testid={
            alert.type === "success"
              ? "scenario-created-alert"
              : "scenario-error-alert"
          }
          variant={alert.type === "success" ? "default" : "destructive"}
        >
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Scenario Details</h3>
        </CardHeader>
        <CardContent>
          <form
            data-testid="scenario-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                data-testid="scenario-title-input"
                name="title"
                placeholder="Enter scenario title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                data-testid="scenario-description-input"
                name="description"
                placeholder="Enter scenario description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button type="submit" data-testid="submit-scenario-btn">
              <FileText className="mr-2 h-4 w-4" />
              Submit Scenario
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Submitted Scenarios</h3>
        </CardHeader>
        <CardContent>
          <div data-testid="scenario-list-container">
            {loading ? (
              <p data-testid="scenario-list-loading">Loading...</p>
            ) : items.length > 0 ? (
              <ul data-testid="scenario-list" className="space-y-2">
                {items.map((item: ScenarioItem) => (
                  <li
                    key={item.id}
                    data-testid={`scenario-item-${item.id}`}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{item.title}</p>
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
              <p data-testid="scenario-list-empty">
                No scenarios submitted yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
