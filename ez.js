#!/usr/bin/env node

const exec = require("child_process").exec;
const program = require("commander");
const { prompt } = require("inquirer");

const questions = [
  {
    type: "input",
    name: "projectName",
    message: "Project Name: "
  },
  {
    type: "input",
    name: "devDependencies",
    message:
      "Enter your dev dependencies needed for the project separated by a space:\n"
  },
  {
    type: "input",
    name: "dependencies",
    message:
      "Enter your dependencies needed for the project separated by a space:\n"
  }
];

const createProject = ({ projectName }) =>
  exec(`mkdir ${projectName}`, (err, stdOut, stdErr) => {
    if (err) {
      console.log(err);
      return;
    }

    if (stdErr) {
      console.log(stdErr);
      return;
    }

    console.log(stdOut);
  });

const npmInit = ({ projectName, devDependencies, dependencies }) =>
  exec(`cd ${projectName}; npm init -y`, (err, stdOut, stdErr) => {
    if (err) {
      console.log(err);
      return;
    }

    if (stdErr) {
      console.log(stdErr);
      return;
    }

    console.log(`Project ${projectName} Created`);

    console.log(stdOut);

    if (devDependencies.length > 0) {
      console.log("Installing Dev Dependencies");
      installDevDeps(projectName, devDependencies);
    }

    if (dependencies.length > 0) {
      console.log("Installing Dependencies");
      installDeps(projectName, dependencies);
    }
  });

const installDevDeps = (projectName, devDependencies) =>
  exec(
    `cd ${projectName}; npm i -D ${devDependencies}`,
    (err, stdOut, stdErr) => {
      if (err) {
        console.log(err);
        return;
      }

      if (stdErr) {
        console.log(stdErr);
        return;
      }

      console.log(stdOut);
    }
  );

const installDeps = (projectName, dependencies) =>
  exec(`cd ${projectName}; npm i -S ${dependencies}`, (err, stdOut, stdErr) => {
    if (err) {
      console.log(err);
      return;
    }

    if (stdErr) {
      console.log(stdErr);
      return;
    }

    console.log(stdOut);
  });

program.version("0.0.1").description("EZ Project Starter");

program
  .command("new-project")
  .alias("np")
  .description("Initiating new project")
  .action(() => {
    prompt(questions).then(answers => {
      if (answers.projectName.length === 0) {
        prompt(questions[0]).then(answers =>
          createProject(answers.projectName)
        );
      }

      createProject(answers);
      npmInit(answers);
    });
  });

program.parse(process.argv);
