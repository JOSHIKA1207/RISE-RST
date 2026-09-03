/**
 * Generates a structured shift handover object from filtered shift activities.
 * Ensures 100% traceability for every item.
 */
export function generateHandover(activities = [], shiftMeta = {}) {
  const defaultMeta = {
    date: shiftMeta.date || "03 September 2026",
    startTime: shiftMeta.startTime || "09:00 AM",
    endTime: shiftMeta.endTime || "05:00 PM",
    timezone: shiftMeta.timezone || "IST (UTC+5:30)",
    generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    generatedBy: shiftMeta.user || "Shift Handover System",
    status: "READY FOR REVIEW"
  };

  // Group activities into 4 primary handover sections
  const completedWork = [];
  const openItems = [];
  const blockers = [];
  const watchItems = [];

  // Categorize activities
  activities.forEach((act) => {
    const item = {
      id: act.id,
      title: act.title,
      summary: act.description,
      status: act.status,
      source: act.source,
      sourceType: act.sourceType,
      referenceId: act.referenceId,
      timestamp: act.timestamp,
      activityId: act.id,
      user: act.user,
      channel: act.channel,
      repo: act.repo,
      rawActivity: act
    };

    if (act.category === "Blockers" || act.status === "BLOCKED") {
      blockers.push(item);
    } else if (act.category === "Watch for Next Shift" || act.status === "WARNING") {
      watchItems.push(item);
    } else if (
      act.category === "Open Items" ||
      act.status === "OPEN" ||
      act.status === "IN_PROGRESS"
    ) {
      openItems.push(item);
    } else {
      completedWork.push(item);
    }
  });

  // Build Source Activity Summary table
  const sourceStatsMap = {
    Jira: { source: "Jira", total: 0, completed: 0, open: 0 },
    Slack: { source: "Slack", total: 0, completed: 0, open: 0 },
    GitHub: { source: "GitHub", total: 0, completed: 0, open: 0 },
    "Incident System": { source: "Incidents", total: 0, completed: 0, open: 0 }
  };

  activities.forEach((act) => {
    let key = act.source;
    if (key === "Incident System" || key === "Incidents") key = "Incident System";
    if (sourceStatsMap[key]) {
      sourceStatsMap[key].total += 1;
      if (act.status === "RESOLVED" || act.status === "COMPLETED") {
        sourceStatsMap[key].completed += 1;
      } else if (act.status === "OPEN" || act.status === "IN_PROGRESS") {
        sourceStatsMap[key].open += 1;
      }
    }
  });

  const sourceSummaryTable = [
    {
      source: "Jira",
      activities: sourceStatsMap.Jira.total,
      completed: sourceStatsMap.Jira.completed,
      open: sourceStatsMap.Jira.open
    },
    {
      source: "Slack",
      activities: sourceStatsMap.Slack.total,
      completed: "-",
      open: "-"
    },
    {
      source: "GitHub",
      activities: sourceStatsMap.GitHub.total,
      completed: sourceStatsMap.GitHub.completed,
      open: 0
    },
    {
      source: "Incidents",
      activities: sourceStatsMap["Incident System"].total,
      completed: sourceStatsMap["Incident System"].completed,
      open: sourceStatsMap["Incident System"].open
    }
  ];

  // All traceable items list
  const traceabilityList = [
    ...completedWork,
    ...openItems,
    ...blockers,
    ...watchItems
  ];

  return {
    meta: defaultMeta,
    summary: {
      totalActivities: activities.length,
      completedCount: completedWork.length,
      openCount: openItems.length,
      blockersCount: blockers.length,
      watchCount: watchItems.length
    },
    sections: {
      completedWork,
      openItems,
      blockers,
      watchItems,
      sourceSummaryTable,
      traceabilityList
    }
  };
}
