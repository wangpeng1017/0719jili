module.exports = {
  apps: [
    {
      name: "jili-demo",
      cwd: "/root/0719jili",
      script: ".next/standalone/server.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "700M",
      env: {
        NODE_ENV: "production",
        PORT: "3006",
        HOSTNAME: "0.0.0.0",
        NEXT_PUBLIC_BASE_PATH: "/jili",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: "3006",
        HOSTNAME: "0.0.0.0",
        NEXT_PUBLIC_BASE_PATH: "/jili",
      },
    },
  ],
};
