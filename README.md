# BeatMM App

这是一个基于 Vite + React + Tailwind 的音乐打赏 App。

## 如何运行

1.  安装依赖：
    ```bash
    npm install
    ```
2.  运行开发服务器：
    ```bash
    npm run dev
    ```

## 如何连接 Supabase

1.  在项目根目录创建 `.env` 文件。
2.  将 `.env.example` 中的内容复制到 `.env` 文件中，并替换为您的 Supabase 项目的实际 URL 和 Anon Key。

## 如何通过 Telegram Bot 接收提现消息

1.  在 `.env` 文件中配置 `VITE_TELEGRAM_BOT_TOKEN` 和 `VITE_TELEGRAM_CHAT_ID`。
2.  确保您的 Telegram Bot 已正确设置，并且可以发送消息到指定的 Chat ID。


