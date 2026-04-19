#!/bin/bash
# 系统健康检查脚本 v2 - 第一阶段练习

echo "==================== 系统健康检查 ===================="
echo "检查时间: $(date)"
echo "主机名  : $(hostname)"
echo "IP 地址 : $(hostname -I | awk '{print $1}')"
echo ""

echo "磁盘使用率 (根分区):"
df -h / | tail -1

echo -e "\n内存使用情况:"
free -h

echo -e "\n当前登录用户数: $(who | wc -l) 人"

echo -e "\n系统运行时间:"
uptime

echo -e "\n==================== 检查完成 ===================="
