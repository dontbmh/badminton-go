package main

import (
	"log"

	"github.com/labstack/echo"
	"gopkg.in/mgo.v2"
)

func main() {
	sess, err := mgo.Dial("mongodb://mongo:27017")
	if err != nil {
		log.Fatalf("db.Open(): %q\n", err)
	}
	defer sess.Close()
	sess.SetMode(mgo.Monotonic, true)
	r := Request{echo.New(), sess.DB("badminton-go")}
	r.Static("/", "static")
	r.Listen()
}
