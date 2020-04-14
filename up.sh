#!/bin/bash

function post {
  curl -s \
    -XPOST http://localhost:3030/${1} \
    -H 'Content-Type: application/json' \
    -d "${2}" | jq .
}

echo 'Creating home directory folder ...'
post 'content' '{ "type": "folder", "path": "/home" }'
post 'content' '{ "type": "folder", "path": "/public" }'
post 'content' '{ "type": "folder", "path": "/admin" }'

echo 'Creating user & dir for Ed ...'
post 'content' '{ "type": "folder", "path": "/home/ed" }'
post 'users' '{
  "name": "Ed Peters",
  "email": "ed@wirewheel.io",
  "permissions": [ 
    "users:list",
    "users:view",
    "users:create",
    "content:read",
    "content:write",
    "content-type:read"
  ] 
}'

post 'content' '{ "type": "folder", "path": "/home/joe" }'
post 'users' '{ 
  "name": "Joe Exotic", 
  "email": "joe@wirewheel.io", 
  "permissions": [ 
    "users:list",
    "content:read:/home/*",
    "content:write:/home/*",
    "content:read:/public/*"
  ] 
}'

echo 'Creating public folders ...'
post 'content' '{ "type": "folder", "path": "/public/foo1" }'
post 'content' '{ "type": "folder", "path": "/public/foo2" }'
echo

echo 'Creating new document types ...'
post 'templates' '{ 
  "name": "jokes", 
  "defaultContent": [
    {
      "q": "Why did the chicken cross the road?",
      "a": "To get to the other side!"
    },
    {
      "q": "Why did the punk rocker cross the road?",
      "a": "He was stapled to the chicken!"
    }
  ]
}'
echo

echo "Creating new document ..."
post 'content' '{
  "type": "0",
  "path": "/public/foo1/jokes.json"  
}'
