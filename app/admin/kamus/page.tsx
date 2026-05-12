"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen } from "lucide-react";

interface KamusItem {
  id: string;
  templateName: string;
  fileName: string;
  status: string;
  createdAt: string;
}

export default function KamusPage() {
  const [items, setItems] = useState<KamusItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [templateName, setTemplateName] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [alert, setAlert] = useState<{ type: string; message: string }>({
    type: "",
    message: "",
  });

  useEffect(() => {
    fetch("/api/kamus")
      .then((r) => r.json())
      .then((data: KamusItem[]) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName || !fileName) {
      setAlert({ type: "error", message: "All fields are required" });
      return;
    }
    try {
      const res = await fetch("/api/kamus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateName, fileName }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }
      const created: KamusItem = await res.json();
      setItems((prev) => [created, ...prev]);
      setAlert({ type: "success", message: "Kamus Submitted" });
      setTemplateName("");
      setFileName("");
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
            data-testid="kamus-page-nav"
          >
            Kamus Submission
          </h2>
          <p className="text-muted-foreground">
            Submit dictionary templates
          </p>
        </div>
      </div>
      <Separator />

      {alert.message && (
        <Alert
          data-testid={
            alert.type === "success"
              ? "kamus-created-alert"
              : "kamus-error-alert"
          }
          variant={alert.type === "success" ? "default" : "destructive"}
        >
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Upload Dictionary Template</h3>
        </CardHeader>
        <CardContent>
          <form
            data-testid="kamus-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Template Name</label>
              <Input
                data-testid="kamus-templateName-input"
                name="templateName"
                placeholder="Enter template name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">File Name</label>
              <Input
                data-testid="kamus-fileName-input"
                name="fileName"
                placeholder="Enter file name (e.g., template.xlsx)"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>
            <Button type="submit" data-testid="submit-kamus-btn">
              <BookOpen className="mr-2 h-4 w-4" />
              Submit Kamus
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Submitted Kamus</h3>
        </CardHeader>
        <CardContent>
          <div data-testid="kamus-list-container">
            {loading ? (
              <p data-testid="kamus-list-loading">Loading...</p>
            ) : items.length > 0 ? (
              <ul data-testid="kamus-list" className="space-y-2">
                {items.map((item: KamusItem) => (
                  <li
                    key={item.id}
                    data-testid={`kamus-item-${item.id}`}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{item.templateName}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.fileName}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p data-testid="kamus-list-empty">No kamus submitted yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
