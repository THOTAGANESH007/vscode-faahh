import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

const player = require("play-sound")();

export function activate(context: vscode.ExtensionContext) {
  console.log("Faahh Sound extension is active!");

  function playFaahhSound() {
    const audioPath = path.join(context.extensionPath, "assets", "faahh.wav");
    if (!fs.existsSync(audioPath)) {
      console.error("ERROR: Sound file not found at ->", audioPath);
      vscode.window.showErrorMessage(
        "Faahh sound file not found! Check developer console.",
      );
      return;
    }

    console.log("Playing sound from:", audioPath);

    // Play the sound
    player.play(audioPath, (err: any) => {
      if (err && !err.killed) {
        console.error("Could not play sound. Error:", err);
        vscode.window.showErrorMessage(`Audio Error: ${err}`);
      }
    });
  }

  // 1. Listen for the keyboard shortcut / command palette
  let disposableCommand = vscode.commands.registerCommand(
    "faahh-sound.play",
    () => {
      playFaahhSound();
      vscode.window.showInformationMessage("Faahh!");
    },
  );
  context.subscriptions.push(disposableCommand);

  // 2. Listen for ANY file being saved
  // Check Auto Save setting
  const config = vscode.workspace.getConfiguration("files");
  const autoSave = config.get<string>("autoSave");

  if (autoSave === "off") {
    let disposableSave = vscode.workspace.onDidSaveTextDocument(() => {
      playFaahhSound();
    });
    context.subscriptions.push(disposableSave);
  }

  // 3. Listen for a Run/Debug session starting
  let disposableRun = vscode.debug.onDidStartDebugSession(() => {
    playFaahhSound();
  });
  context.subscriptions.push(disposableRun);
}

export function deactivate() {}
