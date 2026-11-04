#!/bin/sh
set -eu

: "${PORT:=10000}"
: "${API_UPSTREAM:=http://127.0.0.1:8081}"
export PORT API_UPSTREAM

if [ -n "${RETAILFLOW_CONNECTION_STRING:-}" ] &&
    [ -z "${ConnectionStrings__RetailFlowConnection:-}" ]; then
    ConnectionStrings__RetailFlowConnection=$RETAILFLOW_CONNECTION_STRING
    export ConnectionStrings__RetailFlowConnection
fi

if [ -n "${JWT_KEY:-}" ] && [ -z "${Jwt__Key:-}" ]; then
    Jwt__Key=$JWT_KEY
    export Jwt__Key
fi

envsubst '${PORT} ${API_UPSTREAM}' \
    < /etc/nginx/templates/default.conf.template \
    > /etc/nginx/conf.d/default.conf

exec /usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf
