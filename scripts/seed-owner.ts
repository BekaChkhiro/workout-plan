import { config } from "dotenv";

config({ path: ".env.local" });

const DEFAULT_OWNER_EMAIL = "mei@fitplan.ge";
const ARGON2_OPTIONS = {
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
} as const;

type CliFlags = {
  force: boolean;
  email?: string;
  password?: string;
  name?: string;
};

function parseFlags(argv: readonly string[]): CliFlags {
  const flags: CliFlags = { force: false };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i] ?? "";
    if (arg === "--force") {
      flags.force = true;
      continue;
    }
    const eq = arg.indexOf("=");
    const key = eq === -1 ? arg : arg.slice(0, eq);
    const inlineValue = eq === -1 ? undefined : arg.slice(eq + 1);
    const value = inlineValue ?? argv[++i];

    if (value === undefined) {
      throw new Error(`Missing value for argument: ${key}`);
    }

    switch (key) {
      case "--email":
        flags.email = value;
        break;
      case "--password":
        flags.password = value;
        break;
      case "--name":
        flags.name = value;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return flags;
}

async function promptHidden(question: string): Promise<string> {
  const { stdin, stdout } = process;
  if (!stdin.isTTY) {
    throw new Error(
      "Cannot prompt for input — stdin is not a TTY. Provide --password or OWNER_PASSWORD env var.",
    );
  }
  stdout.write(question);
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding("utf8");

  return await new Promise<string>((resolve, reject) => {
    let buffer = "";
    const onData = (chunk: string) => {
      for (const ch of chunk) {
        const code = ch.charCodeAt(0);
        if (ch === "\r" || ch === "\n") {
          cleanup();
          stdout.write("\n");
          resolve(buffer);
          return;
        }
        if (code === 3) {
          cleanup();
          stdout.write("\n");
          reject(new Error("Aborted"));
          return;
        }
        if (code === 127 || code === 8) {
          if (buffer.length > 0) buffer = buffer.slice(0, -1);
          continue;
        }
        buffer += ch;
      }
    };
    const cleanup = () => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener("data", onData);
    };
    stdin.on("data", onData);
  });
}

async function resolveCredentials(flags: CliFlags) {
  const email = flags.email ?? process.env.OWNER_EMAIL ?? DEFAULT_OWNER_EMAIL;
  const name = flags.name ?? process.env.OWNER_NAME ?? email.split("@")[0] ?? "Owner";
  let password = flags.password ?? process.env.OWNER_PASSWORD;

  if (!password) {
    if (!process.stdin.isTTY) {
      throw new Error(
        "OWNER_PASSWORD env var is required when running non-interactively. " +
          "Set it in .env.local, pass --password, or run in a TTY.",
      );
    }
    process.stdout.write(`Owner email: ${email}\n`);
    password = await promptHidden("Password: ");
    if (!password) throw new Error("Password cannot be empty.");
    const confirm = await promptHidden("Confirm password: ");
    if (password !== confirm) throw new Error("Passwords do not match.");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  return { email, name, password };
}

async function main() {
  const flags = parseFlags(process.argv.slice(2));
  const { email, name, password } = await resolveCredentials(flags);

  const [{ db }, { users }, { eq }, { hash }, { seedUserPlan }] = await Promise.all([
    import("../src/db/index"),
    import("../src/db/schema"),
    import("drizzle-orm"),
    import("@node-rs/argon2"),
    import("../src/db/helpers/seedUserPlan"),
  ]);

  const existingAny = await db.select({ id: users.id, email: users.email }).from(users).limit(2);
  const existingByEmail = existingAny.find((u) => u.email === email);

  if (existingAny.length > 0 && !flags.force) {
    const first = existingAny[0];
    const detail = existingByEmail
      ? `User ${existingByEmail.email} already exists.`
      : `A different user (${first?.email ?? "unknown"}) already exists.`;
    console.error(`${detail} Re-run with --force to proceed.`);
    process.exit(1);
  }

  const passwordHash = await hash(password, ARGON2_OPTIONS);

  let userId: string;
  if (existingByEmail) {
    userId = existingByEmail.id;
    await db.update(users).set({ passwordHash, name }).where(eq(users.id, userId));
    console.log(`Updated existing owner ${email} (${userId}).`);
  } else {
    const [inserted] = await db
      .insert(users)
      .values({ email, passwordHash, name })
      .returning({ id: users.id });
    if (!inserted) throw new Error("Failed to insert owner user.");
    userId = inserted.id;
    console.log(`Created owner ${email} (${userId}).`);
  }

  const result = await seedUserPlan(userId);
  if (result.inserted) {
    console.log(
      `Seeded plan: ${result.mealsCount} meals, ${result.workoutsCount} workouts, 1 settings row.`,
    );
  } else {
    console.log("Plan already seeded for this user — left untouched.");
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
