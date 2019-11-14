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

Local：
``` docker
git clone https://github.com/dontbmh/badminton-go.git
docker-compose up -d --build
```

Docker Hub：
``` docker
curl -o docker-compose.yml https://github.com/dontbmh/badminton-go/blob/master/docker-compose-nobuild.yml
docker-compose up -d
```

临时玩物，BUG多多，希望大家共同学习进步
