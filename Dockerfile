# Build stage
FROM node:16.13-alpine AS build

WORKDIR /app

# Install dependencies based on the lock file
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Production stage
FROM node:16.13-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy the built app from the build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/next.config.js ./
COPY --from=build /app/node_modules ./node_modules

# Set the environment variable to production
ENV NODE_ENV=production

# Expose the necessary port (3000 is default for Next.js)
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
