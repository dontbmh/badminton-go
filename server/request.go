package main

import (
	"net/http"
	"time"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type handler func(echo.Context, *mgo.Database) error

type Request struct {
	*echo.Echo
	db *mgo.Database
}

func (r *Request) Bind(h handler) func(echo.Context) error {
	return func(c echo.Context) error {
		return h(c, r.db)
	}
}

func (r *Request) Listen() {
	r.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		ExposeHeaders: []string{"token"},
	}))
	r.POST("/login", r.Bind(Login))
	r.POST("/activity/new", r.Bind(CreateActivity))
	r.POST("/activity/active", r.Bind(GetActiveActivities))
	r.POST("/activity/all", r.Bind(GetAllActivities))
	r.POST("/activity/:id/:status", r.Bind(ChangeActivity))
	r.POST("/activity/:id/join", r.Bind(JoinActivity))
	r.POST("/activity/:id/leave", r.Bind(LeaveActivity))
	r.Logger.Fatal(r.Start(":3050"))
}

func GetUser(c echo.Context, d *mgo.Database, u *User) (err error) {
	id := c.Request().Header.Get("token")
	uc := d.C("user")
	if err = uc.FindId(bson.ObjectIdHex(id)).One(u); err != nil {
		return
	}
	return
}

func Login(c echo.Context, d *mgo.Database) (err error) {
	u := new(User)
	if err = c.Bind(u); err != nil {
		return
	}
	uc := d.C("user")
	cnt := 0
	cur := uc.Find(bson.M{"name": u.Name})
	if cnt, err = cur.Count(); err != nil {
		return
	}
	if cnt > 0 {
		cur.One(&u)
	} else {
		u.ID = bson.NewObjectId()
	}
	u.Time = time.Now().Unix()
	if _, err = uc.UpsertId(u.ID, u); err != nil {
		println(err.Error())
		return
	}
	r := NewResp(u)
	c.Response().Header().Set("token", u.ID.Hex())
	return c.JSON(http.StatusOK, r)
}

func CreateActivity(c echo.Context, d *mgo.Database) (err error) {
	u := new(User)
	if err = GetUser(c, d, u); err != nil {
		return
	}
	a := new(Activity)
	if err = c.Bind(a); err != nil {
		return
	}
	a.ID = bson.NewObjectId()
	a.Initiator = u.Name
	a.Attendees = []*User{u}
	a.CurrPpl = 1
	a.Status = "active"
	ac := d.C("activity")
	if err = ac.Insert(a); err != nil {
		return
	}
	r := NewResp(a)
	return c.JSON(http.StatusOK, r)
}

func GetActiveActivities(c echo.Context, d *mgo.Database) (err error) {
	ac := d.C("activity")
	aa := []Activity{}
	if err = ac.Find(bson.M{"status": "active"}).All(&aa); err != nil {
		return
	}
	re := []Activity{}
	up := []bson.ObjectId{}
	now := time.Now().Unix()
	for _, v := range aa {
		if now > v.StartTime {
			up = append(up, v.ID)
		} else {
			re = append(re, v)
		}
	}
	sel := bson.M{"_id": bson.M{"$in": up}}
	doc := bson.M{"$set": bson.M{"status": "expired"}}
	if len(up) > 0 {
		if _, err = ac.UpdateAll(sel, doc); err != nil {
			return
		}
	}
	r := NewResp(re)
	return c.JSON(http.StatusOK, r)
}

func GetAllActivities(c echo.Context, d *mgo.Database) (err error) {
	ac := d.C("activity")
	aa := []Activity{}
	if err = ac.Find(nil).All(&aa); err != nil {
		return
	}
	r := NewResp(aa)
	return c.JSON(http.StatusOK, r)
}

func GetActivity(c echo.Context, d *mgo.Database) (err error) {
	id := c.Param("id")
	ac := d.C("activity")
	a := Activity{}
	if err = ac.Find(bson.M{"_id": bson.ObjectIdHex(id)}).One(&a); err != nil {
		return
	}
	r := NewResp(a)
	return c.JSON(http.StatusOK, r)
}

func JoinActivity(c echo.Context, d *mgo.Database) (err error) {
	u := new(User)
	if err = GetUser(c, d, u); err != nil {
		return
	}
	id := bson.ObjectIdHex(c.Param("id"))
	ac := d.C("activity")
	a := Activity{}
	if err = ac.FindId(id).One(&a); err != nil {
		return
	}
	f := false
	for _, v := range a.Attendees {
		if v.ID == u.ID {
			f = true
			break
		}
	}
	if !f {
		a.Attendees = append(a.Attendees, u)
		a.CurrPpl = len(a.Attendees)
		if err = ac.UpdateId(id, a); err != nil {
			return
		}
	}
	r := NewResp(a)
	return c.JSON(http.StatusOK, r)
}

func LeaveActivity(c echo.Context, d *mgo.Database) (err error) {
	u := new(User)
	if err = GetUser(c, d, u); err != nil {
		return
	}
	id := bson.ObjectIdHex(c.Param("id"))
	ac := d.C("activity")
	a := Activity{}
	if err = ac.FindId(id).One(&a); err != nil {
		return
	}
	f := -1
	for i, v := range a.Attendees {
		if v.ID == u.ID {
			f = i
			break
		}
	}
	if f > -1 {
		a.Attendees = append(a.Attendees[:f], a.Attendees[f+1:]...)
		a.CurrPpl = len(a.Attendees)
		if err = ac.UpdateId(id, a); err != nil {
			return
		}
	}
	r := NewResp(a)
	return c.JSON(http.StatusOK, r)
}

func ChangeActivity(c echo.Context, d *mgo.Database) (err error) {
	u := new(User)
	if err = GetUser(c, d, u); err != nil {
		return
	}
	id := bson.ObjectIdHex(c.Param("id"))
	s := c.Param("status")
	ac := d.C("activity")
	a := Activity{}
	if err = ac.FindId(id).One(&a); err != nil {
		return
	}
	if u.Name != a.Initiator {
		return c.JSON(http.StatusOK, ErrResp("Invalid Operation"))
	}
	if a.Status != s {
		a.Status = s
		if err = ac.UpdateId(id, a); err != nil {
			return
		}
	}
	r := NewResp(a)
	return c.JSON(http.StatusOK, r)
}
