package main

import (
	"gopkg.in/mgo.v2/bson"
)

type User struct {
	ID   bson.ObjectId `json:"id" bson:"_id"`
	Name string        `json:"name" bson:"name"`
	Bio  string        `json:"bio" bson:"bio"`
	Time int64         `json:"time" bson:"time"`
}

type Activity struct {
	ID        bson.ObjectId `json:"id" bson:"_id"`
	Initiator string        `json:"initiator" bson:"initiator"`
	Stadium   string        `json:"stadium" bson:"stadium"`
	Fields    string        `json:"fields" bson:"fields"`
	StartTime int64         `json:"startTime" bson:"startTime"`
	EndTime   int64         `json:"endTime" bson:"endTime"`
	MaxPpl    int           `json:"maxPpl" bson:"maxPpl"`
	Costs     int           `json:"costs" bson:"costs"`
	Desc      string        `json:"desc" bson:"desc"`
	Attendees []*User       `json:"attendees" bson:"attendees"`
	CurrPpl   int           `json:"currPpl" bson:"currPpl"`
	Status    string        `json:"status" bson:"status"`
}

type Response struct {
	Status int         `json:"status"`
	Error  string      `json:"error"`
	Data   interface{} `json:"data"`
}

func NewResp(data interface{}) *Response {
	r := Response{200, "", data}
	return &r
}

func ErrResp(err string) *Response {
	r := Response{500, err, nil}
	return &r
}
