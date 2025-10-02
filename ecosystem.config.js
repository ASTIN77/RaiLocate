module.exports = {
  apps: [{
    name: "railocate",
    cwd: "/var/www/railocate",
    script: "npm",
    args: "start",
    env_file: ".env",
    env: { NODE_ENV: "production", PORT: "3004" }
  }]
}
