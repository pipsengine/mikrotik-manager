import { Injectable } from "@nestjs/common";
import * as http from "node:http";
import * as https from "node:https";
import * as net from "node:net";

type PortProbe = {
  port: number;
  service: string;
  open: boolean;
  secure?: boolean;
  banner?: string;
};

export type RouterCredentialInput = {
  host: string;
  restPort?: number;
  routerUsername?: string;
  routerPassword?: string;
};

export type RouterOsRestIdentity = {
  name?: string;
  model?: string;
  routerOs?: string;
  serialNumber?: string;
  source?: string;
};

const mikrotikPorts = [
  { port: 8728, service: "RouterOS API" },
  { port: 8729, service: "RouterOS API SSL", secure: true },
  { port: 443, service: "REST API / HTTPS", secure: true },
  { port: 80, service: "HTTP" },
  { port: 22, service: "SSH" },
  { port: 8291, service: "WinBox" }
];

@Injectable()
export class ConnectionTestService {
  test(host: string) {
    return { host, restApi: "pending", routerOsApi: "pending", ssh: "pending" };
  }

  async detect(input: string | RouterCredentialInput) {
    const normalizedHost = (typeof input === "string" ? input : input.host).trim();
    const ports = await Promise.all(mikrotikPorts.map((candidate) => probePort(normalizedHost, candidate.port, candidate.service, candidate.secure)));
    const httpSignals = await Promise.all([
      probeHttp(normalizedHost, 443, true),
      probeHttp(normalizedHost, 80, false)
    ]);
    const identity = typeof input === "string" ? undefined : await readRouterOsRestIdentity(input).catch(() => undefined);

    const openPorts = ports.filter((port) => port.open);
    const restSignal = httpSignals.find((signal) => signal.reachable);
    const routerOsApi = ports.find((port) => port.port === 8728 && port.open) ?? ports.find((port) => port.port === 8729 && port.open);
    const ssh = ports.find((port) => port.port === 22 && port.open);
    const rest = ports.find((port) => (port.port === 443 || port.port === 80) && port.open);
    const winbox = ports.find((port) => port.port === 8291 && port.open);
    const mikrotikSignals = [
      routerOsApi ? "RouterOS API port is reachable" : undefined,
      ssh?.banner?.toLowerCase().includes("rosssh") ? "SSH banner looks like MikroTik RouterOS" : undefined,
      restSignal?.serverHeader?.toLowerCase().includes("mikrotik") ? "HTTP server header mentions MikroTik" : undefined,
      identity ? "Authenticated RouterOS REST read succeeded" : undefined,
      winbox ? "WinBox port is reachable" : undefined
    ].filter(Boolean);

    const confidence = Math.min(100, openPorts.length * 15 + mikrotikSignals.length * 20 + (identity ? 25 : 0));

    return {
      host: normalizedHost,
      reachable: openPorts.length > 0,
      confidence,
      likelyMikroTik: confidence >= 35,
      ports,
      http: httpSignals,
      detected: {
        apiPort: routerOsApi?.port ?? 8728,
        restPort: rest?.port ?? 443,
        sshPort: ssh?.port ?? 22,
        connectionMethod: routerOsApi ? "RouterOS API first" : rest ? "REST API first" : ssh ? "SSH first" : "Auto select secure path",
        status: openPorts.length > 0 ? "Detected" : "Unreachable",
        signals: mikrotikSignals,
        name: identity?.name,
        model: identity?.model,
        routerOs: identity?.routerOs,
        serialNumber: identity?.serialNumber
      },
      identity,
      message: openPorts.length
        ? identity
          ? "Management services detected and authenticated REST inventory data was read."
          : "Management services detected. Enter RouterOS credentials and run detection again to read model, RouterOS version and serial number."
        : "No common MikroTik management services responded from this host."
    };
  }
}

export async function readRouterOsRestIdentity(input: RouterCredentialInput): Promise<RouterOsRestIdentity | undefined> {
  const host = input.host.trim();
  const username = input.routerUsername?.trim();
  const password = input.routerPassword ?? "";
  if (!host || !username || !password) return undefined;

  const candidates = buildRestCandidates(input.restPort);
  for (const candidate of candidates) {
    try {
      const [identity, resource, routerboard] = await Promise.all([
        requestRouterOsJson(host, candidate.port, candidate.secure, "/rest/system/identity", username, password),
        requestRouterOsJson(host, candidate.port, candidate.secure, "/rest/system/resource", username, password),
        requestRouterOsJson(host, candidate.port, candidate.secure, "/rest/system/routerboard", username, password).catch(() => undefined)
      ]);

      const identityObject = firstObject(identity);
      const resourceObject = firstObject(resource);
      const routerboardObject = firstObject(routerboard);
      const result: RouterOsRestIdentity = {
        name: stringField(identityObject, "name"),
        model: stringField(routerboardObject, "model") ?? stringField(resourceObject, "board-name"),
        routerOs: stringField(resourceObject, "version"),
        serialNumber: stringField(routerboardObject, "serial-number"),
        source: `${candidate.secure ? "https" : "http"}://${host}:${candidate.port}/rest`
      };

      if (result.name || result.model || result.routerOs || result.serialNumber) return result;
    } catch {
      continue;
    }
  }

  return undefined;
}

function buildRestCandidates(restPort?: number) {
  const requestedPort = Number(restPort);
  const rawCandidates = [
    Number.isFinite(requestedPort) && requestedPort > 0 ? { port: requestedPort, secure: requestedPort !== 80 } : undefined,
    { port: 443, secure: true },
    { port: 80, secure: false }
  ].filter((candidate): candidate is { port: number; secure: boolean } => Boolean(candidate));

  return rawCandidates.filter((candidate, index, list) => list.findIndex((item) => item.port === candidate.port && item.secure === candidate.secure) === index);
}

function requestRouterOsJson(host: string, port: number, secure: boolean, path: string, username: string, password: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const client = secure ? https : http;
    const request = client.request(
      {
        host,
        port,
        method: "GET",
        path,
        timeout: 3500,
        rejectUnauthorized: false,
        headers: {
          accept: "application/json",
          authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`
        }
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
        response.on("end", () => {
          if (!response.statusCode || response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`RouterOS REST returned ${response.statusCode ?? "unknown status"}`));
            return;
          }

          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    request.once("timeout", () => {
      request.destroy();
      reject(new Error("RouterOS REST request timed out"));
    });
    request.once("error", reject);
    request.end();
  });
}

function firstObject(value: unknown): Record<string, unknown> | undefined {
  if (Array.isArray(value)) return value.find((item): item is Record<string, unknown> => item !== null && typeof item === "object");
  if (value !== null && typeof value === "object") return value as Record<string, unknown>;
  return undefined;
}

function stringField(source: Record<string, unknown> | undefined, field: string) {
  const value = source?.[field];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function probePort(host: string, port: number, service: string, secure?: boolean): Promise<PortProbe> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;
    let banner = "";

    const finish = (result: PortProbe) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(1800);
    socket.once("connect", () => {
      if (port === 22) {
        socket.once("data", (chunk) => {
          banner = chunk.toString("utf8").slice(0, 120).trim();
          finish({ port, service, secure, open: true, banner });
        });
        setTimeout(() => finish({ port, service, secure, open: true, banner }), 350);
        return;
      }
      finish({ port, service, secure, open: true });
    });
    socket.once("timeout", () => finish({ port, service, secure, open: false }));
    socket.once("error", () => finish({ port, service, secure, open: false }));
    socket.connect(port, host);
  });
}

function probeHttp(host: string, port: number, secure: boolean): Promise<{ port: number; protocol: string; reachable: boolean; statusCode?: number; serverHeader?: string }> {
  return new Promise((resolve) => {
    const client = secure ? https : http;
    const request = client.request(
      {
        host,
        port,
        method: "GET",
        path: "/",
        timeout: 1800,
        rejectUnauthorized: false
      },
      (response) => {
        response.resume();
        resolve({
          port,
          protocol: secure ? "https" : "http",
          reachable: true,
          statusCode: response.statusCode,
          serverHeader: Array.isArray(response.headers.server) ? response.headers.server.join(", ") : response.headers.server
        });
      }
    );

    request.once("timeout", () => {
      request.destroy();
      resolve({ port, protocol: secure ? "https" : "http", reachable: false });
    });
    request.once("error", () => resolve({ port, protocol: secure ? "https" : "http", reachable: false }));
    request.end();
  });
}
