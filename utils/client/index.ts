import { Deluge } from "./deluge";
import { QBittorrent } from "./qbittorrent";
import { RuTorrent } from "./ruTorrent";
import { Transmission } from "./transmission";

export type ClientConfig = {
    url: string;
    username: string;
    password: string;
    autostart: boolean;
};

export type SendOptions = {
    label?: string;
};

export type Client = {
    sendTorrent: (filename: string, torrent: Blob, options?: SendOptions) => Promise<void>;
    sendMagnetUrl: (url: string, options?: SendOptions) => Promise<void>;
};

export const clients = {
    deluge: Deluge,
    qbittorrent: QBittorrent,
    rutorrent: RuTorrent,
    transmission: Transmission,
};

export type ClientName = keyof typeof clients;
export const clientNames = Object.keys(clients) as unknown as Readonly<[ClientName]>;

/**
 * Clients for which a label/category can be attached to a torrent at send time.
 */
export const labelCapableClients: readonly ClientName[] = ["rutorrent", "qbittorrent"];
