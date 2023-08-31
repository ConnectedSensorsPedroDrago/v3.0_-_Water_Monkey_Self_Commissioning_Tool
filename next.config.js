/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
         {
            protocol: "https",
            hostname: "**",
         },
      ],
    },
    "files.associations": {
        "*.js": "javascriptreact",
        ".env.development*": "env",
        ".env.production*": "env",
        ".env.local*": "env",
        ".env.*": "properties",
    },
}

module.exports = nextConfig
