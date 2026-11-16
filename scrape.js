
const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrapeWebsite() {

    // Accept URL from environment variable or command-line argument
    const url = process.env.SCRAPE_URL || process.argv[2];

    if (!url) {
        console.error("Error: Please provide a URL.");
        process.exit(1);
    }

    let browser;

    try {
        console.log("Starting Chromium...");

        // Launch Chromium using Puppeteer
        browser = await puppeteer.launch({
            headless: true,
            executablePath:
                process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage"
            ]
        });

        const page = await browser.newPage();

        console.log("Opening website:", url);

        // Navigate to the given URL
        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 60000
        });

        // Extract website information
        const scrapedData = await page.evaluate(() => {
            return {
                title: document.title,
                firstHeading:
                    document.querySelector("h1")?.innerText || "No heading found",
                url: window.location.href,
                scrapedAt: new Date().toISOString()
            };
        });

        // Save the scraped information into a JSON file
        fs.writeFileSync(
            "scraped_data.json",
            JSON.stringify(scrapedData, null, 4)
        );

        console.log("Scraping completed successfully!");
        console.log(scrapedData);

    } catch (error) {
        console.error("Scraping failed:", error.message);
        process.exitCode = 1;

    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

scrapeWebsite();
