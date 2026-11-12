import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { ExamId } from "@/data/types";

type LinkProps = {
  className?: string;
  children: ReactNode;
};

export function ExamLink({ examId, className, children }: LinkProps & { examId: ExamId }) {
  if (examId === "ort") {
    return (
      <Link to="/ort" className={className}>
        {children}
      </Link>
    );
  }
  if (examId === "sat") {
    return (
      <Link to="/sat" className={className}>
        {children}
      </Link>
    );
  }
  return (
    <Link to="/ielts" className={className}>
      {children}
    </Link>
  );
}

export function SubjectLink({
  examId,
  subjectId,
  className,
  children,
}: LinkProps & { examId: ExamId; subjectId: string }) {
  const params = { subject: subjectId };
  if (examId === "ort") {
    return (
      <Link to="/ort/$subject" params={params} className={className}>
        {children}
      </Link>
    );
  }
  if (examId === "sat") {
    return (
      <Link to="/sat/$subject" params={params} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <Link to="/ielts/$subject" params={params} className={className}>
      {children}
    </Link>
  );
}

export function TopicLink({
  examId,
  subjectId,
  topicId,
  className,
  children,
}: LinkProps & { examId: ExamId; subjectId: string; topicId: string }) {
  const params = { subject: subjectId, topic: topicId };
  if (examId === "ort") {
    return (
      <Link to="/ort/$subject/$topic" params={params} className={className}>
        {children}
      </Link>
    );
  }
  if (examId === "sat") {
    return (
      <Link to="/sat/$subject/$topic" params={params} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <Link to="/ielts/$subject/$topic" params={params} className={className}>
      {children}
    </Link>
  );
}

export function SimLink({ examId, className, children }: LinkProps & { examId: ExamId }) {
  if (examId === "ort") {
    return (
      <Link to="/ort/simulation" className={className}>
        {children}
      </Link>
    );
  }
  if (examId === "sat") {
    return (
      <Link to="/sat/simulation" className={className}>
        {children}
      </Link>
    );
  }
  return (
    <Link to="/ielts/simulation" className={className}>
      {children}
    </Link>
  );
}
