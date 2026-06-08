import NotificationCard from "./NotificationCard";

function NotificationList({ notifications, viewedIds, onNotificationViewed }) {
  if (!notifications || notifications.length === 0) {
    return <p>No notifications available.</p>;
  }

  return (
    <>
      {notifications.map((notification) => {
        const id = notification.ID ?? notification.id ?? notification.Timestamp;
        const isViewed = viewedIds.includes(id);

        return (
          <NotificationCard
            key={id}
            notification={notification}
            isViewed={isViewed}
            onView={() => onNotificationViewed?.(id)}
          />
        );
      })}
    </>
  );
}

export default NotificationList;