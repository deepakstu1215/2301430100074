import { Card, CardContent, Typography, Box } from "@mui/material";

function NotificationCard({ notification, isViewed, onView }) {
  const title = notification.Type || "Notification";
  const message = notification.Message || "No details available.";
  const timestamp = notification.Timestamp
    ? new Date(notification.Timestamp).toLocaleString()
    : "Unknown time";

  return (
    <Card
      onClick={onView}
      sx={{
        mb: 2,
        cursor: onView ? "pointer" : "default",
        borderLeft: 4,
        borderColor: isViewed ? "transparent" : "primary.main",
        bgcolor: isViewed ? "background.paper" : "rgba(25,118,210,0.06)",
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">{title}</Typography>
          {!isViewed && (
            <Typography variant="caption" color="primary">
              New
            </Typography>
          )}
        </Box>

        <Typography sx={{ whiteSpace: "pre-wrap", mb: 1 }}>{message}</Typography>

        <Typography variant="caption" color="text.secondary">
          {timestamp}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default NotificationCard;