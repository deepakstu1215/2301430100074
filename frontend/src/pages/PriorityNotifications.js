import { useEffect, useMemo, useState } from "react";
import { Container, Typography, Alert, CircularProgress, Box } from "@mui/material";

import NotificationList from "../components/NotificationList";
import { getNotifications } from "../services/notificationService";

const STORAGE_KEY = "affordmed_viewed_notifications";

function PriorityNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewedIds, setViewedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    async function loadNotifications() {
      setError("");
      setLoading(true);
      const data = await getNotifications(1, 50);
      setLoading(false);

      if (data.error) {
        setError(data.error);
        setNotifications([]);
        return;
      }

      const weights = {
        Placement: 3,
        Result: 2,
        Event: 1,
      };

      const sorted = (data.notifications || [])
        .map((n) => ({
          ...n,
          score:
            (weights[n.Type] || 0) * 1000000000000 +
            new Date(n.Timestamp).getTime(),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      setNotifications(sorted);
    }

    loadNotifications();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(viewedIds));
  }, [viewedIds]);

  const unreadCount = useMemo(() => {
    return notifications.filter((notification) => {
      const id = notification.ID ?? notification.id ?? notification.Timestamp;
      return id && !viewedIds.includes(id);
    }).length;
  }, [notifications, viewedIds]);

  const handleNotificationViewed = (id) => {
    if (!id || viewedIds.includes(id)) return;
    setViewedIds((prev) => [...prev, id]);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Priority Notifications
      </Typography>

      <Box mb={3}>
        <Typography color="text.secondary">
          Showing top {notifications.length} priority notifications.
        </Typography>
        <Typography color="text.secondary">
          {unreadCount} new notification{unreadCount === 1 ? "" : "s"}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <NotificationList
          notifications={notifications}
          viewedIds={viewedIds}
          onNotificationViewed={handleNotificationViewed}
        />
      )}
    </Container>
  );
}

export default PriorityNotifications;
