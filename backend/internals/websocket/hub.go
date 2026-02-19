package websocket

import "sync"

type Hub struct {
	connections map[string]*Connection
	mu          sync.Mutex
}

type Connection struct {
	UserID string
	Send   chan []byte
}

var globalHub *Hub
var hubOnce sync.Once

func GetHub() *Hub {
	hubOnce.Do(func() {
		globalHub = &Hub{connections: make(map[string]*Connection)}
	})
	return globalHub
}

func (h *Hub) Register(userID string, conn *Connection) {
	h.mu.Lock()
	if old, ok := h.connections[userID]; ok {
		close(old.Send)
	}
	h.connections[userID] = conn
	h.mu.Unlock()
}

func (h *Hub) Unregister(userID string) {
	h.mu.Lock()
	if conn, ok := h.connections[userID]; ok {
		close(conn.Send)
		delete(h.connections, userID)
	}
	h.mu.Unlock()
}

func (h *Hub) SendToUser(userID string, message []byte) {
	h.mu.Lock()
	conn, ok := h.connections[userID]
	h.mu.Unlock()
	if ok {
		select {
		case conn.Send <- message:
		default:
			h.Unregister(userID)
		}
	}
}
