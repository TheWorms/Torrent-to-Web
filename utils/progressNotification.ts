import type { Browser } from "wxt/browser";

export class ProgressNotification {
    private readonly notificationId: string;
    private hasErrored = false;

    private constructor(notificationId: string) {
        this.notificationId = notificationId;
    }

    public async success(message: string): Promise<void> {
        if (this.hasErrored) {
            return;
        }

        await ProgressNotification.displayNotification(
            message,
            browser.runtime.getURL("/icons/icon-48.png"),
            this.notificationId,
        );
    }

    public async error(message: string): Promise<void> {
        if (this.hasErrored) {
            return;
        }

        this.hasErrored = true;
        await ProgressNotification.displayNotification(
            message,
            browser.runtime.getURL("/icons/error.png"),
            this.notificationId,
        );
    }

    public static async create(message: string): Promise<ProgressNotification> {
        const notificationId = await ProgressNotification.displayNotification(
            message,
            browser.runtime.getURL("/icons/icon-48.png"),
            undefined,
        );

        return new ProgressNotification(notificationId);
    }

    private static async displayNotification(
        message: string,
        iconUrl: string,
        notificationId: string | undefined,
    ): Promise<string> {
        const options: Browser.notifications.NotificationCreateOptions = {
            type: "basic",
            iconUrl: iconUrl,
            title: "Torrent to Web",
            message: message,
        };

        // Passing an explicit undefined id is rejected by the typings, so the two overloads have
        // to be picked apart rather than relying on the argument being optional.
        return notificationId === undefined
            ? browser.notifications.create(options)
            : browser.notifications.create(notificationId, options);
    }
}
