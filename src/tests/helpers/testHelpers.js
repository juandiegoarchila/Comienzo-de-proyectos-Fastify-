//src/tests/helpers/testHelpers.js

import { db } from "../../config/config.js";
import Table from "cli-table3";
import chalk from "chalk";

export async function cleanupTestData() {
  const usersSnapshot = await db
    .collection("users")
    .where("testUser", "==", true)
    .get();
  if (!usersSnapshot.empty) {
    const deletePromises = usersSnapshot.docs.map((doc) => doc.ref.delete());
    await Promise.all(deletePromises);
  }
}

export function generateTestReport(testResults, startTime) {
  const table = new Table({
    head: [
      chalk.bold("#"),
      chalk.bold("Prueba"),
      chalk.bold("Descripción"),
      chalk.bold("Estado"),
      chalk.bold("Tiempo"),
    ],
    colWidths: [5, 25, 40, 15, 15],
    style: { head: ["cyan"] },
  });

  testResults.forEach((test, index) => {
    const estado =
      test.status === "✅" ? chalk.green("✅ PASÓ") : chalk.red("❌ FALLÓ");
    const tiempo =
      test.time > 1000 ? chalk.yellow(`${test.time}ms ⚠️`) : `${test.time}ms`;
    table.push([
      index,
      test.description.split(" - ")[0],
      test.description.split(" - ")[1],
      estado,
      tiempo,
    ]);
  });

  console.log(chalk.bold.magenta(`\n⏱️ Detalles de tiempo por prueba:`));
  console.log(table.toString());

  const totalTime = Date.now() - startTime;
  const passedTests = testResults.filter((r) => r.status === "✅").length;
  const totalTests = testResults.length;
  const averageTime = (totalTime / totalTests).toFixed(2);

  console.log(chalk.bold.blue(`\n═══════════════════════════════════════`));
  console.log(
    chalk.bold.greenBright(
      `✅ PRUEBAS COMPLETADAS - ${passedTests}/${totalTests} EXITOSAS ✅`,
    ),
  );
  console.log(chalk.bold.blue(`═══════════════════════════════════════\n`));
  console.log(chalk.bold.yellowBright(`⏳ TIEMPO TOTAL: ${totalTime}ms`));
  console.log(chalk.bold.yellowBright(`⏱️ TIEMPO PROMEDIO: ${averageTime}ms`));
  console.log(chalk.bold.blue(`═══════════════════════════════════════\n`));
}
