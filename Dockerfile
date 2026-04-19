# 使用官方 Ubuntu 作为基础镜像（和你的本地环境一致）
FROM ubuntu:24.04

# 设置工作目录
WORKDIR /app

# 安装必要工具
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 复制你的脚本到容器中
COPY scripts/system_check.sh /app/system_check.sh

# 赋予执行权限
RUN chmod +x /app/system_check.sh

# 设置容器启动时默认执行的命令
CMD ["/app/system_check.sh"]
