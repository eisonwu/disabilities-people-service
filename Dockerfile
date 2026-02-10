# 使用 docs 目录作为静态资源，由 nginx 提供
# 使用国内镜像避免 Docker Hub 拉取超时（可改为 nginx:alpine）
FROM docker.1ms.run/library/nginx:alpine

# 删除默认页面，改用我们自己的
RUN rm -rf /usr/share/nginx/html/*

# 将构建好的 docs 内容复制到 nginx 根目录
COPY docs/ /usr/share/nginx/html/

# SPA 路由支持：未匹配到的路径回退到 index.html
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
