"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FolderPlus, UserPlus, Bell, Activity } from "lucide-react";

interface ProjectItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
}

interface AssessorAssignmentItem {
  id: string;
  projectId: string;
  assessorName: string;
  assessorEmail: string;
  createdAt: string;
  project: ProjectItem;
}

interface NotificationItem {
  id: string;
  projectId: string;
  assesseeName: string;
  assesseeEmail: string;
  message: string;
  sentAt: string;
  createdAt: string;
  project: ProjectItem;
}

interface DomainEventItem {
  id: string;
  type: string;
  entityId: string;
  payload: string;
  createdAt: string;
}

export default function ProjectsPage() {
  // Project state
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [projectLoading, setProjectLoading] = useState<boolean>(true);
  const [projectName, setProjectName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [projectAlert, setProjectAlert] = useState<{
    type: string;
    message: string;
  }>({ type: "", message: "" });

  // Assessor assignment state
  const [assignments, setAssignments] = useState<AssessorAssignmentItem[]>([]);
  const [assignmentLoading, setAssignmentLoading] = useState<boolean>(true);
  const [assignProjectId, setAssignProjectId] = useState<string>("");
  const [assessorName, setAssessorName] = useState<string>("");
  const [assessorEmail, setAssessorEmail] = useState<string>("");
  const [assignmentAlert, setAssignmentAlert] = useState<{
    type: string;
    message: string;
  }>({ type: "", message: "" });

  // Notification state
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationLoading, setNotificationLoading] = useState<boolean>(true);
  const [notifyProjectId, setNotifyProjectId] = useState<string>("");
  const [assesseeName, setAssesseeName] = useState<string>("");
  const [assesseeEmail, setAssesseeEmail] = useState<string>("");
  const [notifyMessage, setNotifyMessage] = useState<string>("");
  const [notificationAlert, setNotificationAlert] = useState<{
    type: string;
    message: string;
  }>({ type: "", message: "" });

  // Domain event state
  const [domainEvents, setDomainEvents] = useState<DomainEventItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data: ProjectItem[]) => {
        setProjects(data);
        setProjectLoading(false);
      })
      .catch(() => setProjectLoading(false));

    fetch("/api/assessor-assignments")
      .then((r) => r.json())
      .then((data: AssessorAssignmentItem[]) => {
        setAssignments(data);
        setAssignmentLoading(false);
      })
      .catch(() => setAssignmentLoading(false));

    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data: NotificationItem[]) => {
        setNotifications(data);
        setNotificationLoading(false);
      })
      .catch(() => setNotificationLoading(false));

    fetch("/api/domain-events")
      .then((r) => r.json())
      .then((data: DomainEventItem[]) => {
        setDomainEvents(data);
        setEventsLoading(false);
      })
      .catch(() => setEventsLoading(false));
  }, []);

  const refreshEvents = () => {
    fetch("/api/domain-events")
      .then((r) => r.json())
      .then((data: DomainEventItem[]) => setDomainEvents(data))
      .catch(() => {});
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !startDate || !endDate) {
      setProjectAlert({ type: "error", message: "All fields are required" });
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setProjectAlert({
        type: "error",
        message: "End date must be after start date",
      });
      return;
    }
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: projectName, startDate, endDate }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }
      const created: ProjectItem = await res.json();
      setProjects((prev) => [created, ...prev]);
      setProjectAlert({
        type: "success",
        message: "Project created successfully",
      });
      setProjectName("");
      setStartDate("");
      setEndDate("");
      refreshEvents();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create project";
      setProjectAlert({ type: "error", message });
    }
  };

  const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignProjectId || !assessorName || !assessorEmail) {
      setAssignmentAlert({
        type: "error",
        message: "All fields are required",
      });
      return;
    }
    try {
      const res = await fetch("/api/assessor-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: assignProjectId,
          assessorName,
          assessorEmail,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }
      const created: AssessorAssignmentItem = await res.json();
      // Attach project info for display
      const project = projects.find(
        (p: ProjectItem) => p.id === assignProjectId
      );
      const enriched = { ...created, project: project as ProjectItem };
      setAssignments((prev) => [enriched, ...prev]);
      setAssignmentAlert({
        type: "success",
        message: "Assessor assigned successfully",
      });
      setAssignProjectId("");
      setAssessorName("");
      setAssessorEmail("");
      refreshEvents();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to assign assessor";
      setAssignmentAlert({ type: "error", message });
    }
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyProjectId || !assesseeName || !assesseeEmail || !notifyMessage) {
      setNotificationAlert({
        type: "error",
        message: "All fields are required",
      });
      return;
    }
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: notifyProjectId,
          assesseeName,
          assesseeEmail,
          message: notifyMessage,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }
      const created: NotificationItem = await res.json();
      const project = projects.find(
        (p: ProjectItem) => p.id === notifyProjectId
      );
      const enriched = { ...created, project: project as ProjectItem };
      setNotifications((prev) => [enriched, ...prev]);
      setNotificationAlert({
        type: "success",
        message: "Assessee notified successfully",
      });
      setNotifyProjectId("");
      setAssesseeName("");
      setAssesseeEmail("");
      setNotifyMessage("");
      refreshEvents();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to send notification";
      setNotificationAlert({ type: "error", message });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-3xl font-bold tracking-tight"
            data-testid="project-page-nav"
          >
            Project Management
          </h2>
          <p className="text-muted-foreground">
            Create projects, assign assessors, and notify assessees
          </p>
        </div>
      </div>
      <Separator />

      {/* Create Project Section */}
      {projectAlert.message && (
        <Alert
          data-testid={
            projectAlert.type === "success"
              ? "project-created-alert"
              : projectAlert.message === "End date must be after start date"
                ? "date-error-alert"
                : "project-error-alert"
          }
          variant={
            projectAlert.type === "success" ? "default" : "destructive"
          }
        >
          <AlertDescription>{projectAlert.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Create Project</h3>
        </CardHeader>
        <CardContent>
          <form
            data-testid="project-form"
            onSubmit={handleProjectSubmit}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name</label>
              <Input
                data-testid="project-name-input"
                name="name"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  data-testid="start-date-input"
                  name="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input
                  data-testid="end-date-input"
                  name="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" data-testid="submit-project-btn">
              <FolderPlus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Projects</h3>
        </CardHeader>
        <CardContent>
          <div data-testid="project-list-container">
            {projectLoading ? (
              <p data-testid="project-list-loading">Loading...</p>
            ) : projects.length > 0 ? (
              <ul data-testid="project-list" className="space-y-2">
                {projects.map((item: ProjectItem) => (
                  <li
                    key={item.id}
                    data-testid={`project-item-${item.id}`}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.startDate).toLocaleDateString()} -{" "}
                        {new Date(item.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p data-testid="project-list-empty">No projects yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Assign Assessor Section */}
      {assignmentAlert.message && (
        <Alert
          data-testid={
            assignmentAlert.type === "success"
              ? "assessor-assigned-alert"
              : "assessor-error-alert"
          }
          variant={
            assignmentAlert.type === "success" ? "default" : "destructive"
          }
        >
          <AlertDescription>{assignmentAlert.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Assign Assessor</h3>
        </CardHeader>
        <CardContent>
          <form
            data-testid="assessor-form"
            onSubmit={handleAssignmentSubmit}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Project</label>
              <Select
                value={assignProjectId}
                onValueChange={setAssignProjectId}
              >
                <SelectTrigger data-testid="assessor-project-select">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p: ProjectItem) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Assessor Name</label>
              <Input
                data-testid="assessor-name-input"
                name="assessorName"
                placeholder="Enter assessor name"
                value={assessorName}
                onChange={(e) => setAssessorName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Assessor Email</label>
              <Input
                data-testid="assessor-email-input"
                name="assessorEmail"
                type="email"
                placeholder="Enter assessor email"
                value={assessorEmail}
                onChange={(e) => setAssessorEmail(e.target.value)}
              />
            </div>
            <Button type="submit" data-testid="submit-assessor-btn">
              <UserPlus className="mr-2 h-4 w-4" />
              Assign Assessor
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Assessor Assignments</h3>
        </CardHeader>
        <CardContent>
          <div data-testid="assessor-list-container">
            {assignmentLoading ? (
              <p data-testid="assessor-list-loading">Loading...</p>
            ) : assignments.length > 0 ? (
              <ul data-testid="assessor-list" className="space-y-2">
                {assignments.map((item: AssessorAssignmentItem) => (
                  <li
                    key={item.id}
                    data-testid={`assessor-item-${item.id}`}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{item.assessorName}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.assessorEmail} — {item.project?.name}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p data-testid="assessor-list-empty">No assessors assigned yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Notification Section */}
      {notificationAlert.message && (
        <Alert
          data-testid={
            notificationAlert.type === "success"
              ? "notification-sent-alert"
              : "notification-error-alert"
          }
          variant={
            notificationAlert.type === "success" ? "default" : "destructive"
          }
        >
          <AlertDescription>{notificationAlert.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Notify Assessee</h3>
        </CardHeader>
        <CardContent>
          <form
            data-testid="notification-form"
            onSubmit={handleNotificationSubmit}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Project</label>
              <Select
                value={notifyProjectId}
                onValueChange={setNotifyProjectId}
              >
                <SelectTrigger data-testid="notification-project-select">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p: ProjectItem) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Assessee Name</label>
              <Input
                data-testid="assessee-name-input"
                name="assesseeName"
                placeholder="Enter assessee name"
                value={assesseeName}
                onChange={(e) => setAssesseeName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Assessee Email</label>
              <Input
                data-testid="assessee-email-input"
                name="assesseeEmail"
                type="email"
                placeholder="Enter assessee email"
                value={assesseeEmail}
                onChange={(e) => setAssesseeEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Input
                data-testid="notification-message-input"
                name="message"
                placeholder="Enter notification message"
                value={notifyMessage}
                onChange={(e) => setNotifyMessage(e.target.value)}
              />
            </div>
            <Button type="submit" data-testid="submit-notification-btn">
              <Bell className="mr-2 h-4 w-4" />
              Send Notification
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Sent Notifications</h3>
        </CardHeader>
        <CardContent>
          <div data-testid="notification-list-container">
            {notificationLoading ? (
              <p data-testid="notification-list-loading">Loading...</p>
            ) : notifications.length > 0 ? (
              <ul data-testid="notification-list" className="space-y-2">
                {notifications.map((item: NotificationItem) => (
                  <li
                    key={item.id}
                    data-testid={`notification-item-${item.id}`}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{item.assesseeName}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.assesseeEmail} — {item.project?.name}
                      </p>
                      <p className="text-sm">{item.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p data-testid="notification-list-empty">
                No notifications sent yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Domain Event Log Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Domain Event Log
          </h3>
        </CardHeader>
        <CardContent>
          <div data-testid="event-list-container">
            {eventsLoading ? (
              <p data-testid="event-list-loading">Loading...</p>
            ) : domainEvents.length > 0 ? (
              <ul data-testid="event-list" className="space-y-2">
                {domainEvents.map((event: DomainEventItem) => (
                  <li
                    key={event.id}
                    data-testid={`event-item-${event.id}`}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            event.type === "PROJECT_SUBMITTED"
                              ? "default"
                              : event.type === "ASSESSOR_ASSIGNED"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Entity: {event.entityId}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.createdAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p data-testid="event-list-empty">No events recorded yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
