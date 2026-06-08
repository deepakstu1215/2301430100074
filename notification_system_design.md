**Endpoint**

POST /api/v1/notifications

**Request Body**

```json
{
  "userId": "123",
  "title": "Order Delivered",
  "message": "Your order has been delivered",
  "type": "info"
}
```

**Response**

```json
{
  "notificationId": "n001",
  "status": "created"
}
```
**Endpoint**

GET /api/v1/users/{userId}/notifications

**Response**

```json
[
  {
    "notificationId": "n001",
    "title": "Order Delivered",
    "message": "Your order has been delivered",
    "isRead": false
  }
]
```
**Endpoint**

PATCH /api/v1/notifications/{notificationId}/read

**Response**

```json
{
  "status": "success"
}
```
**Endpoint**

DELETE /api/v1/notifications/{notificationId}

**Response**

```json
{
  "status": "deleted"
}
```
## Real-Time Notification Mechanism

The system will use WebSockets for real-time notifications.

Flow:

1. User connects to WebSocket server.
2. Server maintains active connections.
3. When a notification is created, the server instantly pushes it to the connected user.
4. Users receive notifications without refreshing the application.

Example Connection:

ws://server/notifications
PostgreSQL is chosen because it provides ACID compliance, strong consistency, indexing support, and good scalability.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255)
);
```

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    title VARCHAR(255),
    message TEXT,
    type VARCHAR(20),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP
);
```
```sql
INSERT INTO notifications
(id, user_id, title, message, type)
VALUES (?, ?, ?, ?, ?);
```

```sql
SELECT *
FROM notifications
WHERE user_id = ?
ORDER BY created_at DESC;
```

```sql
UPDATE notifications
SET is_read = TRUE
WHERE id = ?;
```

```sql
DELETE FROM notifications
WHERE id = ?;
```

- Millions of notifications can increase database size.
- Slow query performance with large datasets.
- High concurrent user traffic.
- Increased storage requirements.

- Create indexes on user_id and created_at.
- Use pagination while fetching notifications.
- Partition large notification tables.
- Archive old notifications.
- Use Redis caching for frequently accessed data.
- Add read replicas for scaling reads.

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
  AND isRead = false
ORDER BY createdAt ASC;
```

The query is correct and returns unread notifications for a specific student ordered by creation time.

- Full table scan on large datasets.
- Unnecessary retrieval using SELECT *.
- Sorting overhead on large result sets.

```sql
SELECT id, title, message, createdAt
FROM notifications
WHERE studentID = 1042
  AND isRead = false
ORDER BY createdAt ASC;
```

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt);
```

Without Index:

```text
O(N)
```

With Composite Index:

```text
O(log N)
```

Indexes should be created only on frequently filtered, sorted, or joined columns.

Creating indexes on every column increases storage usage and slows INSERT, UPDATE, and DELETE operations.

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
  AND createdAt >= CURRENT_DATE - INTERVAL '7 days';
```

- Pagination
- Database Partitioning
- Archiving Old Notifications
- Redis Caching
- Read Replicas
```
