
const { Client, GatewayIntentBits } = require("discord.js");
const { Prefix } = require("./Config/Config.json");
const { readdirSync } = require("fs");

import { Database } from "bun:sqlite";


require('dotenv').config();

export const db = new Database("./db/cache.sqlite", {create: true});

const client: typeof Client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

type Handler = {
    Name: string;
    HandlerFunction: ((message: Object, args: string[]) => Promise<void>) &
      ((client: typeof Client) => Promise<void>);
};

const createHandlerArray = (path: string, handlerArray: Handler[]): Handler[] => {
    readdirSync(path).forEach((file: string) => {
        if (!file.endsWith(".ts") && !file.endsWith(".js")) return;
        let Handler: Handler = {
            Name: file.replace(".ts", "").replace(".js", "").toLowerCase(),
            HandlerFunction: require(`${path}/${file}`).default,
        };
        console.log("Initiated Handler: " + Handler.Name)
        handlerArray.push(Handler);
    });
    return handlerArray
}

let commandHandlers: Handler[] = createHandlerArray("./commands/", []);

const checkTables = (db: Database) => {  
  // db.run("DROP TABLE DailyBrainrotCache")
  db.run(
    `
  CREATE TABLE IF NOT EXISTS DailyBrainrotCache (
    ID varchar(255) NOT NULL,
    Expiry DATETIME NOT NULL,
    Character VARCHAR(64) NOT NULL,
    Primary Key (ID)
  )`);
}

client.on("ready", () => {
  console.log("Bot is ready");
  checkTables(db);
});

client.on("messageCreate", async (message: any) => {
  if (message.author.bot) return;
  let args: string[] = message.content.toLowerCase().split(/ +/);
  if (!args) args = [];
  let command: string = args.shift() as string;
  if (!command || !command.startsWith(Prefix)) return;
  
  commandHandlers.forEach(async (Handler: Handler) => {
    if (Handler.Name.match(new RegExp(`^${command.slice(Prefix.length)}$`, "i"))) Handler.HandlerFunction(message, args);
  });
});

client.login(process.env.TOKEN);
