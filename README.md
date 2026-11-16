# Docker Web Scraper

A multi-stage Docker project that uses Node.js, Puppeteer, Chromium, Python and Flask to scrape website information and serve it as JSON.

## Technologies Used

- Node.js
- Puppeteer
- Chromium
- Python
- Flask
- Docker

## Project Structure

```text
Docker-Web-Scraper/
├── Dockerfile
├── scrape.js
├── package.json
├── server.py
├── requirements.txt
└── README.md
```

## How It Works

### Stage 1: Web Scraping

- Uses Node.js and Puppeteer.
- Launches Chromium in headless mode.
- Opens the provided website URL.
- Extracts the page title, first heading, URL and scraping timestamp.
- Saves the extracted information in `scraped_data.json`.

### Stage 2: Flask Server

- Uses Python and Flask.
- Reads the generated JSON file.
- Serves the scraped information through an HTTP endpoint.

## Build the Docker Image

Provide the website URL using the `SCRAPE_URL` build argument.

Replace `https://example.com` with the website you want to scrape.

```bash
sudo docker build \
  --build-arg SCRAPE_URL=https://example.com \
  -t docker-web-scraper .
```

**Note:** The website is scraped during the Docker image build. The generated `scraped_data.json` file is copied from the scraper stage into the final Python image. To scrape another website, rebuild the image with a different URL.

## Run the Docker Container

```bash
sudo docker run -d \
  --name scraper-container \
  -p 5000:5000 \
  docker-web-scraper
```

## Access the Scraped Data

Open this URL in your browser:

http://localhost:5000

The scraped website information will be displayed in JSON format.

## Health Check

Open:

http://localhost:5000/health

This endpoint checks whether the Flask server is running.

## Stop the Container

```bash
sudo docker stop scraper-container
```

## Remove the Container

```bash
sudo docker rm scraper-container
```