"use client";

import { use } from "react";
import AlunoDashboardDynamic from "./AlunoDashboardDynamic";

interface Props {
  params: Promise<{
    personalUsername: string;
    studentId: string;
  }>;
}

export default function DynamicAlunoDashboardPage({ params }: Props) {
  const resolvedParams = use(params);
  const { personalUsername, studentId } = resolvedParams;

  return (
    <AlunoDashboardDynamic
      personalUsername={personalUsername}
      studentId={studentId}
    />
  );
}
