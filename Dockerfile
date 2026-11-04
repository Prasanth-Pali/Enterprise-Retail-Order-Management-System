FROM mcr.microsoft.com/dotnet/sdk:10.0 AS api-build
WORKDIR /src

COPY ["Enterprise Retail & Order Management System/Enterprise Retail & Order Management System.csproj", "Enterprise Retail & Order Management System/"]
RUN dotnet restore "Enterprise Retail & Order Management System/Enterprise Retail & Order Management System.csproj"

COPY ["Enterprise Retail & Order Management System/", "Enterprise Retail & Order Management System/"]
WORKDIR "/src/Enterprise Retail & Order Management System"
RUN dotnet publish "Enterprise Retail & Order Management System.csproj" \
    --configuration Release \
    --output /app/publish \
    /p:UseAppHost=false \
    --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS api
WORKDIR /app
COPY --from=api-build /app/publish .

ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080
USER $APP_UID

ENTRYPOINT ["dotnet", "Enterprise Retail & Order Management System.dll"]

FROM node:22-alpine AS frontend-build
WORKDIR /app

COPY ["enterprise-retail-order-management-ui/package.json", "enterprise-retail-order-management-ui/package-lock.json", "./"]
RUN npm ci

COPY ["enterprise-retail-order-management-ui/", "./"]
RUN npm run build

FROM nginx:alpine AS frontend
ENV API_UPSTREAM=http://api:8080
ENV PORT=80
ENV NGINX_ENVSUBST_FILTER=^(API_UPSTREAM|PORT)$
COPY ["enterprise-retail-order-management-ui/nginx.conf", "/etc/nginx/templates/default.conf.template"]
COPY --from=frontend-build /app/dist/enterprise-retail-order-management-ui/browser /usr/share/nginx/html

EXPOSE 80

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS app
ENV API_UPSTREAM=http://127.0.0.1:8081 \
    ASPNETCORE_URLS=http://127.0.0.1:8081 \
    PORT=10000

RUN apt-get update \
    && apt-get install -y --no-install-recommends nginx supervisor gettext-base \
    && rm -rf /var/lib/apt/lists/* \
    && rm -f /etc/nginx/sites-enabled/default

WORKDIR /app
COPY --from=api-build /app/publish ./api
COPY --from=frontend-build /app/dist/enterprise-retail-order-management-ui/browser /usr/share/nginx/html
COPY ["enterprise-retail-order-management-ui/nginx.conf", "/etc/nginx/templates/default.conf.template"]
COPY ["docker/supervisord.conf", "/etc/supervisor/supervisord.conf"]
COPY ["docker/entrypoint.sh", "/entrypoint.sh"]

RUN chmod +x /entrypoint.sh

EXPOSE 10000
ENTRYPOINT ["/entrypoint.sh"]
