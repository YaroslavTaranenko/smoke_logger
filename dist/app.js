"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class SmokeLogger {
    constructor() {
        this.logFile = "./smoke.log";
        if (!fs_1.default.existsSync(this.logFile)) {
            fs_1.default.writeFileSync(this.logFile, "");
        }
        this.log("SmokeLogger started");
    }
    log(message) {
        console.log(`[${new Date().toISOString().split('T')[0]}] ${message}`);
    }
    listenCommands() {
        process.stdin.setEncoding("utf8");
        process.stdin.on("readable", () => {
            let chunk;
            while ((chunk = process.stdin.read()) !== null) {
                this.handleCommand(chunk.trim());
            }
        });
        process.stdin.on("end", () => {
            process.stdout.write("End of command input");
        });
    }
    handleCommand(command) {
        // Обработка команды
        switch (command) {
            case "exit":
                this.log("SmokeLogger stopped");
                process.exit(0);
                break;
            case "smoke":
                // const lineCount = fs.readFileSync(this.logFile, "utf8").split("\n").length - 1;
                let lastLine = fs_1.default.readFileSync(this.logFile, "utf8").split("\n").slice(-2)[0] || "";
                let smokeCount = 0;
                if (lastLine === "") {
                    smokeCount = 1;
                }
                else {
                    smokeCount = Number(lastLine) + 1;
                }
                fs_1.default.appendFileSync(this.logFile, `${smokeCount}\n`);
                this.log(smokeCount.toString());
                break;
            case "reset":
                fs_1.default.writeFileSync(this.logFile, "");
                this.log("SmokeLogger reset");
                break;
            default:
                this.log(`Unknown command: ${command}`);
                break;
        }
    }
}
const logger = new SmokeLogger();
logger.listenCommands();
