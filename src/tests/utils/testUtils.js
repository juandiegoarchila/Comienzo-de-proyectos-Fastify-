//src/tests/utils/testUtils.js

import chalk from "chalk";

export function logTitle(title, emoji = "📌") {
  console.log(chalk.bold.blue(`\n═══════════════════════════════════════`));
  console.log(chalk.bold.cyanBright(`${emoji} ${title}`));
  console.log(chalk.bold.blue(`═══════════════════════════════════════`));
}

export function logSuccess(message, time) {
  console.log(chalk.green(`✅ ${message} (${time}ms)`));
}

export function logError(message, error) {
  console.log(chalk.red(`❌ ${message}`));
  console.error(chalk.redBright(error));
}
