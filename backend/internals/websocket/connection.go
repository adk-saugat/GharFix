package websocket

import (
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}

func HandleWebSocket(hub *Hub, w http.ResponseWriter, r *http.Request, userID string) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}

	c := &Connection{UserID: userID, Send: make(chan []byte, 256)}
	hub.Register(userID, c)

	go c.writePump(conn)
	go c.readPump(conn, hub, userID)
}

func (c *Connection) readPump(ws *websocket.Conn, hub *Hub, userID string) {
	defer func() {
		hub.Unregister(userID)
		ws.Close()
	}()
	for {
		if _, _, err := ws.ReadMessage(); err != nil {
			break
		}
	}
}

func (c *Connection) writePump(ws *websocket.Conn) {
	defer ws.Close()
	for message := range c.Send {
		ws.WriteMessage(websocket.TextMessage, message)
	}
	ws.WriteMessage(websocket.CloseMessage, nil)
}
