# badminton-go

本项目旨在为羽球活动提供个简单的沟通工具

## 后端：

golang + echo + mongodb

涉及RestApi + mgo驱动的增改查

## 前端：

typescript + react + semantic ui

涉及react-router + LocalStorage的页面

## 部署：

docker-compose.yml

app + mongo containers

## Docker:
``` docker
docker-compose up -d --build
docker login
docker tag golang-echo-react-mongo .
docker push .
```

临时玩物，BUG多多，希望大家共同学习进步
