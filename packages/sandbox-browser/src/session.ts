import { type BrowserDriver, loadBrowserDriver } from './driver';

const MAX_TEXT = 20_000;
const UNAVAILABLE =
    'Browser no disponible: instalá Playwright (`npm i playwright`) para habilitar la navegación interactiva. ' +
    'Mientras tanto podés usar fetchUrl para lectura simple.';

/**
 * A stateful browser session for one task: it lazily loads a driver on first use,
 * keeps the page across tool calls (so navigate → click → readText works), and is
 * closed once when the task finishes. Fail-safe: if no driver is available every action
 * returns an explanatory message instead of throwing.
 */
export class BrowserSession {
    private driver: BrowserDriver | null = null;
    private loaded = false;

    constructor(private readonly factory: () => Promise<BrowserDriver | null> = loadBrowserDriver) {}

    private async ensure(): Promise<BrowserDriver | null> {
        if (!this.loaded) {
            this.driver = await this.factory();
            this.loaded = true;
        }
        return this.driver;
    }

    /** True if a driver was successfully loaded (i.e. interactive browsing is available). */
    async isAvailable(): Promise<boolean> {
        return (await this.ensure()) !== null;
    }

    async navigate(url: string): Promise<string> {
        const d = await this.ensure();
        if (!d) return UNAVAILABLE;
        try {
            await d.navigate(url);
            return `Navegación OK a ${url}.`;
        } catch (e: any) {
            return `Error navegando a ${url}: ${e?.message ?? String(e)}`;
        }
    }

    async readText(): Promise<string> {
        const d = await this.ensure();
        if (!d) return UNAVAILABLE;
        try {
            const text = await d.readText();
            return text.length > MAX_TEXT ? text.slice(0, MAX_TEXT) + '\n…[truncado]' : text;
        } catch (e: any) {
            return `Error leyendo la página: ${e?.message ?? String(e)}`;
        }
    }

    async click(selector: string): Promise<string> {
        const d = await this.ensure();
        if (!d) return UNAVAILABLE;
        try {
            await d.click(selector);
            return `Click OK en ${selector}.`;
        } catch (e: any) {
            return `Error en click(${selector}): ${e?.message ?? String(e)}`;
        }
    }

    async type(selector: string, text: string): Promise<string> {
        const d = await this.ensure();
        if (!d) return UNAVAILABLE;
        try {
            await d.type(selector, text);
            return `Escritura OK en ${selector}.`;
        } catch (e: any) {
            return `Error en type(${selector}): ${e?.message ?? String(e)}`;
        }
    }

    /** Takes a screenshot to an absolute path the caller has validated is inside the workspace. */
    async screenshot(absolutePath: string): Promise<string> {
        const d = await this.ensure();
        if (!d) return UNAVAILABLE;
        try {
            await d.screenshot(absolutePath);
            return `Captura guardada.`;
        } catch (e: any) {
            return `Error en screenshot: ${e?.message ?? String(e)}`;
        }
    }

    /** Closes the underlying driver if one was opened. Safe to call always. */
    async close(): Promise<void> {
        if (this.driver) {
            await this.driver.close();
            this.driver = null;
        }
    }
}
