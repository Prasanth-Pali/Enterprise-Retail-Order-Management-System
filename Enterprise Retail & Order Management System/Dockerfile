FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["Enterprise Retail & Order Management System/Enterprise Retail & Order Management System.csproj", "Enterprise Retail & Order Management System/"]
RUN dotnet restore "Enterprise Retail & Order Management System/Enterprise Retail & Order Management System.csproj"

COPY . .
WORKDIR "/src/Enterprise Retail & Order Management System"
RUN dotnet publish "Enterprise Retail & Order Management System.csproj" \
    --configuration Release \
    --output /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080
USER $APP_UID

ENTRYPOINT ["dotnet", "Enterprise Retail & Order Management System.dll"]
