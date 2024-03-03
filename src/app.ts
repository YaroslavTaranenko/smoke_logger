import fs from "fs";

class SmokeLogger {
  private logFile: string = "./smoke.log";

  constructor() {
    if(!fs.existsSync(this.logFile)) {
      fs.writeFileSync(this.logFile, "");
    }
    this.log("SmokeLogger started");
  }

  log(message: string) {
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

  handleCommand(command: string) {
    // Обработка команды
    switch (command) {
      case "exit":
        this.log("SmokeLogger stopped");
        process.exit(0);
        break;
      case "smoke":
        // const lineCount = fs.readFileSync(this.logFile, "utf8").split("\n").length - 1;
        let lastLine = fs.readFileSync(this.logFile, "utf8").split("\n").slice(-2)[0] || "";
        let smokeCount = 0;
        if (lastLine === "") {
          smokeCount = 1;
        }
        else {
          smokeCount = Number(lastLine) + 1;
        }
        fs.appendFileSync(this.logFile, `${smokeCount}\n`);
        this.log(smokeCount.toString());
        break;
      case "reset":
        fs.writeFileSync(this.logFile, "");
        this.log("SmokeLogger reset");
        break;
      case "show":
        let lastSmoke = fs.readFileSync(this.logFile, "utf8").split("\n").slice(-2)[0] || "";
        this.log(lastSmoke);
        break;
      default:
        this.log(`Unknown command: ${command}`);
        break;
    }
  }
}

const logger = new SmokeLogger();
logger.listenCommands();
