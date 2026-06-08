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

1. User connects to WebSocket servers .
2. Server maintains active connections and all detail.
3. When a notification is created, the server instantly pushes it to the connected user through net.
4. Users receive notifications without refreshing the application.

Example Connection:

ws://server/notifications
PostgreSQL is chosen because it provides ACID compliance, strong consistency, indexing support, and good scalability.

```sql
-- Standard users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255)
);
```

```sql
-- Main notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    title VARCHAR(255),
    message TEXT,
    type VARCHAR(20),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Added a default timestamp here to make inserts easier
);
```
```sql
-- Insert a new notification record
INSERT INTO notifications
(id, user_id, title, message, type)
VALUES (?, ?, ?, ?, ?);
```

```sql
-- Grab all notifications for a specific user, newest first
SELECT *
FROM notifications
WHERE user_id = ?
ORDER BY created_at DESC;
```

```sql
-- Mark as read when the user clicks it
UPDATE notifications
SET is_read = TRUE
WHERE id = ?;
```

```sql
-- Hard delete a notification (could also consider soft-deletes later)
DELETE FROM notifications
WHERE id = ?;
```

- Millions of notifications can increase database size every day.
- Slow query performance with large datasets.
- High concurrent user traffic.
- Increased storage requirements and many more.

- Create indexes on user_id and created_at.
- Use pagination while fetching notifications.
- Partition large notification tables.
- Archive old notifications.
- Use Redis caching for frequently accessed data.
- Add read replicas for scaling reads.

```sql
-- Fixed column names to match the schema (was studentID, isRead, createdAt)
SELECT *
FROM notifications
WHERE user_id = '1042'
  AND is_read = FALSE
ORDER BY created_at ASC;
```

The query is correct and returns unread notifications for a specific student ordered by creation time.

- Full table scan on large datasets.
- Unnecessary retrieval using SELECT *.
- Sorting overhead on large result sets.

```sql
-- Much better: Only select the fields the frontend actually needs
SELECT id, title, message, created_at
FROM notifications
WHERE user_id = '1042'
  AND is_read = FALSE
ORDER BY created_at ASC;
```

```sql
-- Composite index to speed up that specific unread notifications query
CREATE INDEX idx_notifications_user_read_created
ON notifications(user_id, is_read, created_at);
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
-- Find unique users who got a placement notification in the last week
-- (Fixed notificationType to 'type' to match the schema)
SELECT DISTINCT user_id
FROM notifications
WHERE type = 'Placement'
  AND created_at >= CURRENT_DATE - INTERVAL '7 days';
```

- Pagination
- Database Partitioning
- Archiving Old Notifications
- Redis Caching
- Read Replicas

## Stage 4 - Performance Improvement Strategy

### Problem

Notifications are fetched from the database on every page load, causing high database load and slower response times.

### Proposed Solutions

#### 1. Redis Caching

Store frequently accessed notifications in Redis.

**Benefits**

- Faster response times
- Reduced database load

**Tradeoff**

- Additional infrastructure cost
- Cache invalidation complexity

#### 2. Pagination

Fetch notifications in small batches.

**Benefits**

- Lower memory consumption
- Faster query execution

**Tradeoff**

- Additional API calls

#### 3. Read Replicas

Use read replicas for notification queries.

**Benefits**

- Reduced load on primary database
- Better scalability

**Tradeoff**

- Replication lag

#### 4. Real-Time Push Notifications

Use WebSockets to push new notifications instead of repeatedly fetching them.

**Benefits**

- Better user experience
- Reduced polling traffic

**Tradeoff**

- Persistent connection management

## Stage 5 - Reliable Bulk Notification Delivery

### Problems in Existing Design

- Sequential processing is slow.
- Failure of email delivery can interrupt the entire process.
- Not scalable for 50,000 students.
- Tight coupling between database, email, and push notification operations.

### Proposed Design

1. Save notification data in the database.
2. Publish notification jobs to a message queue.
3. Worker services process email and push notifications independently.
4. Failed jobs are retried automatically.

### Revised Pseudocode

```python
def notify_all(user_ids, message_content):
    # First, generate the core notification record
    notification_id = create_notification(message_content)

    for uid in user_ids:
        # Save to DB first so we don't lose it
        save_user_notification(uid, notification_id)

        # Toss it into the queue for async processing
        # This keeps the main thread fast and unblocked
        publish_to_queue(
            user_id=uid,
            notification_id=notification_id,
            message=message_content
        )
```

### Worker Process

```python
def worker(job):
    # Process email and push independently
    # Wrap in try/except blocks so one failure doesn't kill the other
    
    try:
        send_email(job.user_id, job.message)
    except Exception as e:
        log_error(f"Email failed for user {job.user_id}: {e}")
        # Queue for retry or move to dead-letter queue

    try:
        push_to_app(job.user_id, job.message)
    except Exception as e:
        log_error(f"Push failed for user {job.user_id}: {e}")
```

### Handling Failures

- Failed jobs are moved to a retry queue.
- Retry attempts are performed automatically.
- Permanent failures are stored in a dead-letter queue for investigation.

### Should Database Save and Email Send Happen Together?

No.

Database persistence and email delivery should be decoupled.

Saving notifications should complete immediately while email delivery should be processed asynchronously through worker queues.

### Benefits

- High scalability
- Better fault tolerance
- Faster execution
- Easier recovery from failures
