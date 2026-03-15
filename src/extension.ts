import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

// Use sound-play for silent background playback on Windows
const sound = require("sound-play");

export function activate(context: vscode.ExtensionContext) {
  console.log("Action Audio Thala is active!");

  function playFaahhSound() {
    const audioPath = path.join(context.extensionPath, "assets", "faahh.wav");

    if (!fs.existsSync(audioPath)) {
      return;
    }

    sound.play(audioPath).catch((err: any) => {
      console.error("Playback error:", err);
    });
  }

  // 1. Manual Command
  let disposableCommand = vscode.commands.registerCommand(
    "faahh-sound.play",
    () => {
      playFaahhSound();
      vscode.window.showInformationMessage("Thala Feedback Played!");
    },
  );
  context.subscriptions.push(disposableCommand);

  // 2. Save Listener (Moved the check inside the function)
  let disposableSave = vscode.workspace.onDidSaveTextDocument(() => {
    const config = vscode.workspace.getConfiguration("files");
    const autoSave = config.get<string>("autoSave");

    // Only play sound if Auto Save is OFF.
    // This prevents the sound from playing every 1 second if they have auto-save on.
    if (autoSave === "off") {
      playFaahhSound();
    }
  });
  context.subscriptions.push(disposableSave);

  // 3. Debug Listener
  let disposableRun = vscode.debug.onDidStartDebugSession(() => {
    playFaahhSound();
  });
  context.subscriptions.push(disposableRun);
}

export function deactivate() {}
