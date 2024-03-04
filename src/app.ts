import fs from 'fs';
import { DateTimeFormatOptions } from 'intl';

interface ILogger {
    reset(): void;
    logFile: string;
    log(message: string): void;
}

class Logger implements ILogger {
    private _logFile: string = './app.log';
    get logFile() {
        return this._logFile;
    }
    log(message: string) {
        const options: DateTimeFormatOptions = {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        const recDate = `${new Date().toLocaleDateString(
            'ru-RU',
            options
        )} ${new Date().toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
        })}`;
        const record = `${recDate}|${message}\n`;
        fs.appendFileSync(this._logFile, record);
        console.log(`[${recDate}] ${message}`);
    }
    reset() {
        fs.writeFileSync(this._logFile, '');
    }
    constructor() {
        if (!fs.existsSync(this._logFile)) {
            fs.writeFileSync(this._logFile, '');
        }
    }
}

class SmokeLogger {
    private logger: ILogger = new Logger();

    constructor() {
        console.log('SmokeLogger started');
    }

    listenCommands() {
        process.stdin.setEncoding('utf8');

        process.stdin.on('readable', () => {
            let chunk;
            while ((chunk = process.stdin.read()) !== null) {
                this.handleCommand(chunk.trim());
            }
        });

        process.stdin.on('end', () => {
            process.stdout.write('End of command input');
        });
    }

    handleCommand(command: string) {
        // Обработка команды
        switch (command) {
            case 'exit':
                console.log('SmokeLogger stopped');
                process.exit(0);
                break;
            case 'smoke':
                // const lineCount = fs.readFileSync(this.logFile, "utf8").split("\n").length - 1;
                let lastLine =
                    fs
                        .readFileSync(this.logger.logFile, 'utf8')
                        .split('\n')
                        .slice(-2)[0] || '';
                let smokeCount = 0;
                if (lastLine === '') {
                    smokeCount = 1;
                } else {
                    smokeCount = Number(lastLine.split('|')[1]) + 1;
                }
                this.logger.log(smokeCount.toString());
                break;
            case 'reset':
                this.logger.reset();
                console.log('SmokeLogger reset');
                break;
            case 'show':
                let lastSmoke =
                    fs
                        .readFileSync(this.logger.logFile, 'utf8')
                        .split('\n')
                        .slice(-2)[0] || '';
                console.log(lastSmoke.replace('|', ' '));
                break;
            default:
                console.log(`Unknown command: ${command}`);
                break;
        }
    }
}

const logger = new SmokeLogger();
logger.listenCommands();
