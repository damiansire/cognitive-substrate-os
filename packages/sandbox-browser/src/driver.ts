/**
 * Optional Playwright-backed browser driver.
 *
 * Playwright is NOT a hard dependency (it downloads full browsers). It is loaded via a
 * dynamic import: if the user has run `npm i playwright` it is used to render pages with
 * JavaScript; otherwise the browser domain falls back to a raw HTTP fetch. Same fail-safe
 * philosophy as the container sandbox: real capability when present, graceful degradation
 * when absent — never a hard crash.
 */

/** Contract for browser drivers. A real driver renders JS and supports interaction. */
export interface BrowserDriver {
    navigate(url: string): Promise<void>;
    readText(): Promise<string>;
    click(selector: string): Promise<void>;
    type(selector: string, text: string): Promise<void>;
    screenshot(filePath: string): Promise<void>;
    close(): Promise<void>;
}

const NAV_TIMEOUT_MS = 15_000;

/** A Playwright (chromium, headless) implementation of BrowserDriver. */
export class PlaywrightDriver implements BrowserDriver {
    private browser: any;
    private page: any;

    private constructor(browser: any, page: any) {
        this.browser = browser;
        this.page = page;
    }

    /** Launches a headless chromium, or returns null if Playwright isn't installed. */
    static async tryCreate(): Promise<PlaywrightDriver | null> {
        let pw: any;
        try {
            // Non-literal specifier so the compiler doesn't require the optional module.
            const moduleName = 'playwright';
            pw = await import(moduleName);
        } catch {
            return null; // Playwright not installed -> caller falls back to raw fetch.
        }
        try {
            const browser = await pw.chromium.launch({ headless: true });
            const page = await browser.newPage();
            return new PlaywrightDriver(browser, page);
        } catch {
            return null; // Browsers not downloaded / launch failed -> graceful fallback.
        }
    }

    async navigate(url: string): Promise<void> {
        await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT_MS });
    }

    async readText(): Promise<string> {
        // String form avoids needing DOM lib types at compile time.
        return (await this.page.evaluate('document.body ? document.body.innerText : ""')) as string;
    }

    async click(selector: string): Promise<void> {
        await this.page.click(selector, { timeout: NAV_TIMEOUT_MS });
    }

    async type(selector: string, text: string): Promise<void> {
        await this.page.fill(selector, text, { timeout: NAV_TIMEOUT_MS });
    }

    async screenshot(filePath: string): Promise<void> {
        await this.page.screenshot({ path: filePath });
    }

    async close(): Promise<void> {
        try {
            await this.browser?.close();
        } catch {
            /* best-effort */
        }
    }
}

/** Factory: a live driver if Playwright is usable, otherwise null. */
export async function loadBrowserDriver(): Promise<BrowserDriver | null> {
    return PlaywrightDriver.tryCreate();
}
