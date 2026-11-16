
# ==========================================
# STAGE 1: WEB SCRAPER
# ==========================================

FROM node:18-slim AS scraper

WORKDIR /app

# Install Chromium and required system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    ca-certificates \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

# Tell Puppeteer to use the installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copy Node.js dependency files
COPY package.json ./

# Install Puppeteer
RUN npm install --omit=dev --no-audit --no-fund

# Copy scraper code
COPY scrape.js ./

# Receive the website URL during image building
ARG SCRAPE_URL
ENV SCRAPE_URL=${SCRAPE_URL}

# Run the scraper and generate JSON
RUN test -n "$SCRAPE_URL" && node scrape.js


# ==========================================
# STAGE 2: PYTHON FLASK SERVER
# ==========================================

FROM python:3.10-slim AS final

WORKDIR /app

# Copy Python dependencies
COPY requirements.txt ./

# Install Flask
RUN pip install --no-cache-dir -r requirements.txt

# Copy Flask server code
COPY server.py ./

# Copy scraped JSON from Stage 1
COPY --from=scraper /app/scraped_data.json ./

# Expose Flask port
EXPOSE 5000

# Start Flask server
CMD ["python", "server.py"]
