/**
 * Seed entry point — delegates to the modular orchestrator.
 * Run with: npx tsx scripts/seed.ts
 *
 * NOW WITH AUTOMATED DEV SERVER MANAGEMENT
 * Ensures pnpm dev is running so that ISR revalidation hooks can fire.
 */
import { runSeed } from "./seed/index";
import { spawn, type ChildProcess } from "child_process";
import net from "net";

const PORT = 3000;
const DEV_COMMAND = "pnpm";
const DEV_ARGS = ["dev"];

/**
 * Checks if a port is in use.
 */
function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer((socket) => {
      socket.write("Echo\r\n");
      socket.pipe(socket);
    });

    server.listen(port, "127.0.0.1");
    server.on("error", () => {
      resolve(true); // Port is in use
    });
    server.on("listening", () => {
      server.close();
      resolve(false); // Port is free
    });
  });
}

/**
 * Waits for the server to be reachable by making HTTP requests.
 */
async function waitForServer(url: string, timeoutMs = 60000): Promise<boolean> {
  const start = Date.now();
  process.stdout.write(`Waiting for server at ${url}...`);

  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) {
        // 404 is fine, means server is up but maybe path is wrong,
        // but for revalidation we just need the server to accept connections.
        console.log(" Ready!");
        return true;
      }
    } catch {
      // Ignore error, wait and retry
    }
    process.stdout.write(".");
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.log(" Timeout!");
  return false;
}

async function main() {
  const portInUse = await isPortInUse(PORT);
  let devProcess: ChildProcess | null = null;

  if (!portInUse) {
    console.log(
      `Port ${PORT} is free. Starting dev server for revalidation...`,
    );
    devProcess = spawn(DEV_COMMAND, DEV_ARGS, {
      stdio: "inherit", // Pipe output so we see build progress
      env: { ...process.env, NODE_ENV: "development" },
      detached: false,
    });

    const success = await waitForServer(`http://localhost:${PORT}`);
    if (!success) {
      console.error(
        "Failed to start dev server. Revalidation might fail, but continuing...",
      );
    }
  } else {
    console.log(
      `Port ${PORT} is in use. Assuming dev server is running. Proceeding...`,
    );
  }

  try {
    // Give it a tiny bit more buffer if we just started it
    if (devProcess) await new Promise((r) => setTimeout(r, 2000));

    await runSeed();
  } catch (err) {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  } finally {
    if (devProcess) {
      console.log("Stopping temporary dev server...");
      // Use tree-kill or similar if possible, but simple signals might suffice for pnpm -> next
      devProcess.kill("SIGTERM");
      try {
        if (devProcess.pid) process.kill(devProcess.pid);
      } catch {}
    }
    process.exit();
  }
}

main();
