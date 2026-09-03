import { parseTimeToMinutes, rawActivities } from '../data/mockData';

/**
 * Filter activities strictly based on shift time window and metadata filters.
 */
export function filterShiftActivities({
  activities = rawActivities,
  shiftDate = "2026-09-03",
  startTime = "09:00 AM",
  endTime = "05:00 PM",
  enabledSources = ["Jira", "Slack", "GitHub", "Incident System"],
  activityType = "All", // "All" | "Tickets" | "Incidents" | "Messages" | "Commits"
  statusFilter = "All", // "All" | "RESOLVED" | "OPEN" | "BLOCKED" | "IN_PROGRESS" | "WARNING"
  searchQuery = ""
}) {
  const startMins = parseTimeToMinutes(startTime);
  const endMins = parseTimeToMinutes(endTime);
  const isOvernight = startMins > endMins;

  return activities.filter((act) => {
    // 1. Date filter (if activity has shiftDate)
    if (act.shiftDate && shiftDate && act.shiftDate !== shiftDate) {
      return false;
    }

    // 2. Strict Time Window Filter
    const timeMins = act.timeMinutes ?? parseTimeToMinutes(act.timestamp);
    let inWindow = false;
    if (isOvernight) {
      inWindow = timeMins >= startMins || timeMins <= endMins;
    } else {
      inWindow = timeMins >= startMins && timeMins <= endMins;
    }

    if (!inWindow) return false;

    // 3. Source connection filter
    if (enabledSources && enabledSources.length > 0) {
      const sourceMatch = enabledSources.some(
        (src) => src.toLowerCase() === act.source.toLowerCase()
      );
      if (!sourceMatch) return false;
    }

    // 4. Activity Type filter
    if (activityType && activityType !== "All") {
      const typeMap = {
        Tickets: "ticket",
        Incidents: "incident",
        Messages: "message",
        Commits: "commit"
      };
      const expectedType = typeMap[activityType];
      if (expectedType && act.sourceType !== expectedType) {
        return false;
      }
    }

    // 5. Status Filter
    if (statusFilter && statusFilter !== "All") {
      if (act.status !== statusFilter) return false;
    }

    // 6. Search query filter
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      const matchTitle = act.title?.toLowerCase().includes(query);
      const matchDesc = act.description?.toLowerCase().includes(query);
      const matchRef = act.referenceId?.toLowerCase().includes(query);
      const matchUser = act.user?.toLowerCase().includes(query);
      const matchSource = act.source?.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc && !matchRef && !matchUser && !matchSource) {
        return false;
      }
    }

    return true;
  });
}
