import { useEffect, useMemo, useState } from "react";
import { Container, Typography, Select, MenuItem, Alert, CircularProgress, Box } from "@mui/material";

import NotificationList from "../components/NotificationList";
import { getNotifications } from "../services/notificationService";

const STORAGE_KEY = "affordmed_viewed_notifications";

function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [type, setType] = useState("");
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

      const data = await getNotifications(1, 20, type);
      setLoading(false);

      if (data.error) {
        setError(data.error);
        setNotifications([]);
      } else {
        setNotifications(data.notifications || []);
      }
    }

    loadNotifications();
  }, [type]);

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
        All Notifications
      </Typography>

      <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" mb={3}>
        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
        </Select>

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

export default AllNotifications;
