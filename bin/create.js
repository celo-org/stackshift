const inquirer = require("inquirer");
const shell = require("shelljs");
const chalk = require("chalk");
const ora = require("ora");
const emoji = require("node-emoji");
const { ensureDir, readdir } = require("fs-extra");
const Os = require("os");

const BASE_URL = "https://github.com/celo-org/celo-composer/";

const createAsync = async (command) => {
    let availablePackages = {
        "react-app": "React",
        "react-native-app": "React Native (With Expo)",
        "react-native-app-without-expo": "React Native (without Expo)",
        "flutter-app": "Flutter",
        "angular-app": "Angular",
        hardhat: "Hardhat",
        truffle: "Truffle",
        subgraphs: "TheGraph",
    };

    let packageNameMap = {
        "react-app": "react-app",
        "react-native-app": "react-native-app",
        "react-native-app-without-expo": "react-native-app",
        "flutter-app": "flutter-app",
        "angular-app": "angular-app",
        hardhat: "hardhat",
        truffle: "truffle",
        subgraphs: "subgraphs",
    };

    let fELibraries = {
        rc: "react-celo",
        rk: "rainbowkit-celo",
    };

    let selectedPackages = [];
    let selectedFELibrary = "";

    let { fEFramework } = await inquirer.prompt({
        type: "list",
        name: "fEFramework",
        message: "Choose front-end framework:",
        default: Object.values(availablePackages)[0],
        choices: [
            availablePackages["react-app"],
            availablePackages["react-native-app"],
            availablePackages["react-native-app-without-expo"],
            availablePackages["flutter-app"],
            availablePackages["angular-app"],
        ],
    });

    /**
     * Based on what fEFramework value is,
     * get its index in the object values array,
     * at the same index get its key and push it to selectedPackages.
     */

    selectedPackages.push(
        Object.keys(availablePackages)[
            Object.values(availablePackages).indexOf(fEFramework)
        ]
    );

    if (fEFramework == availablePackages["react-app"]) {
        let { fELibrary } = await inquirer.prompt({
            type: "list",
            name: "fELibrary",
            message: "Choose web3 library for react app:",
            default: fELibraries["rk"],
            choices: [fELibraries["rc"], fELibraries["rk"]],
        });
        selectedFELibrary = fELibrary;
    }

    let { scFramework } = await inquirer.prompt({
        type: "list",
        name: "scFramework",
        message: "Choose smart-contract framework:",
        default: availablePackages["hardhat"],
        choices: [
            availablePackages["hardhat"],
            availablePackages["truffle"],
            "None",
        ],
    });

    if (scFramework !== "None") {
        selectedPackages.push(
            Object.keys(availablePackages)[
                Object.values(availablePackages).indexOf(scFramework)
            ]
        );
    }

    let { indexingProtocol } = await inquirer.prompt({
        type: "list",
        name: "indexingProtocol",
        message: "Create a subgraph:",
        default: "No",
        choices: ["Yes", "No"],
    });

    if (indexingProtocol === "Yes") {
        selectedPackages.push("subgraphs");
    }

    let { projectName } = await inquirer.prompt({
        type: "input",
        name: "projectName",
        message: "Project name: ",
    });

    if (selectedPackages.length > 0) {
        const pwd = process.cwd();
        const outputDir = `${pwd}/${projectName}`;

        // Ensure the output directory exists
        await ensureDir(outputDir);
        await isOutputDirectoryEmpty(outputDir);

        // Showing the loader
        const spinner = loading(
            `Generating custom Celo Composer project with the following packages: ${selectedPackages.join(
                ", "
            )}...\n`
        );

        // Shell commands to clone and trim the required directories
        shell.cd(pwd);
        shell.exec(
            `git clone --depth 2 --filter=blob:none --sparse ${BASE_URL} ${projectName}`
        );
        shell.cd(projectName);

        let packageJson = {
            name: `${projectName}`,
            version: "1.0.0",
            description: "Custom Celo Composer project.",
            private: true,
            author: "Celo",
            license: "MIT",
            scripts: {},
            repository: {
                type: "git",
                url: "git+https://github.com/celo-org/celo-composer.git",
            },
            bugs: {
                url: "https://github.com/celo-org/celo-composer/issues",
            },
            homepage:
                "https://github.com/celo-org/celo-composer/blob/main/README.md",
            workspaces: ["packages/*"],
            keywords: ["celo-composer", "celo"],
        };

        for (let x = 0; x < selectedPackages.length; x++) {

            let package = selectedPackages[x];

            // clone to local only the projects user wants
            shell.exec(
                `git sparse-checkout add packages/${package}`,
                { silent: true }
            );

            // if project isn't web no need to netlify.toml
            if (
                package == availablePackages["react-native-app"] ||
                package == availablePackages["react-native-app-without-expo"] ||
                package == availablePackages["flutter-app"]
            ) {
                shell.rm("netlify.toml");
            }

            // flutter project doesn't have package.json
            if (package != availablePackages["flutter-app"]) {
                let localPackageJson = shell.cat(
                    `packages/${package}/package.json`
                );
                let projectPackage = JSON.parse(localPackageJson);

                // Change the name of the project in package.json for the generated packages.
                projectPackage["name"] = `@${projectName}/${package}`;

                // write back the changes to the package.json
                shell
                    .echo(JSON.stringify(projectPackage, "", 4))
                    .to(`packages/${package}/package.json`);

                Object.keys(projectPackage.scripts).forEach((key) => {
                    packageJson.scripts[
                        `${packageNameMap[package]}:${key}`
                    ] = `yarn workspace @${projectName}/${package} ${key}`;
                });
            }

            // update front-end web3 library
            if (
                package == packageNameMap["react-app"] &&
                selectedFELibrary != ""
            ) {
                shell.echo(`Customizing ${package} with ${selectedFELibrary}...\n`);
                let localPackageJson = shell.cat(
                    `packages/${package}/package.json`
                );
                let projectPackage = JSON.parse(localPackageJson);
                switch (selectedFELibrary) {
                    // rainbowkit-celo
                    case fELibraries["rk"]:
                        shell.echo(`rainbowkit-celo`);
                        // remove react-celo libraries in packages.json file
                        delete projectPackage.dependencies[
                            "@celo/react-celo"
                        ];
                        delete projectPackage.dependencies[
                            "@celo/contractkit"
                        ];

                        // remove react-celo header component
                        shell.rm(
                            "packages/react-app/components/HeaderRC.tsx"
                        );
                        shell.rm("packages/react-app/pages/_appRC.tsx");
                        shell.mv(
                            "packages/react-app/components/HeaderRK.tsx",
                            "packages/react-app/components/Header.tsx"
                        );
                        shell.sed(
                            "-i",
                            'import Header from "./HeaderRK";',
                            'import Header from "./Header";',
                            "packages/react-app/components/Layout.tsx"
                        );
                        break;

                    // react-celo
                    case fELibraries["rc"]:
                        // remove rainbowkit-celo libraries in packages.json file
                        delete projectPackage["dependencies"][
                            "@celo/rainbowkit-celo"
                        ];
                        delete projectPackage["dependencies"][
                            "@rainbow-me/rainbowkit"
                        ];

                        // remove rainbowkit-celo header component
                        shell.rm(
                            "packages/react-app/components/HeaderRK.tsx"
                        );
                        shell.rm("packages/react-app/pages/_app.tsx");
                        shell.mv(
                            "packages/react-app/pages/_appRC.tsx",
                            "packages/react-app/pages/_app.tsx"
                        );
                        shell.mv(
                            "packages/react-app/components/HeaderRC.tsx",
                            "packages/react-app/components/Header.tsx"
                        );
                        shell.sed(
                            "-i",
                            'import Header from "./HeaderRK";',
                            'import Header from "./Header";',
                            "packages/react-app/components/Layout.tsx"
                        );
                        break;

                    default:
                        break;
                }
                // write back the changes to the package.json
                shell
                    .echo(JSON.stringify(projectPackage, "", 4))
                    .to(`packages/${package}/package.json`);

                Object.keys(projectPackage.scripts).forEach((key) => {
                    packageJson.scripts[
                        `${packageNameMap[package]}:${key}`
                    ] = `yarn workspace @${projectName}/${package} ${key}`;
                });
            }

        }
        /**
         * Getting all packages selected by the user
         * First list them via echo packages/\*\/
         * Some string manipulation so that packages looks like
         * eg:- ["react-app", "hardhat"] etc...
         */
        let packagesStdOut;
        if(isWindows) {
            let { stdout } = shell.exec("dir packages /b", {
                silent: true,
            });
            packagesStdOut = stdout;
        } else {
            let { stdout } = shell.exec("echo packages/*/", {
                silent: true,
            });
            packagesStdOut = stdout;
        }

        /**
         * Node 14 and below doens't support replaceAll
         */
        let packages;
        if(isWindows) {
            packages = packagesStdOut.replaceAll("\n", " ").replaceAll("\r", "").split(" ");
            // remove empty strings from array
            packages = packages.filter(function (el) {
                return el != null && el != "";
            });
        } else {
            // remove new line from packagesStdOut
            packages = packagesStdOut
            .replace(/packages\//g, "")
            .replace(/\//g, "")
            .replace(/\n/g, "")
            .split(" ");
            
        }
        
      

        shell.exec("rm -rf .git");
        shell.exec("git init --quiet --initial-branch=main");

        spinner.stopAndPersist({
            symbol: emoji.get("100"),
            text: chalk.green(" Done!"),
        });
        shell.echo(JSON.stringify(packageJson, "", 4)).to("package.json");
    }
};

async function isOutputDirectoryEmpty(outputFolder, force = false) {
    const files = await readdir(outputFolder);
    // TODO: Add  --force option to overwrite existing files
    if (files.length > 0 && !force) {
        const { value } = await inquirer.prompt({
            name: "value",
            type: "confirm",
            message:
                "Output directory is not empty. Are you sure you want to continue?",
        });
        if (!value) {
            process.exit(1);
        }
    }
}

const loading = (message) => {
    return ora(message).start();
};

function isWindows() {  
    return Os.platform() === 'win32'
}

module.exports = {
    createAsync,
};