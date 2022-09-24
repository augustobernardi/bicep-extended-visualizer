// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import vscode from "vscode";
import { IActionContext } from "@microsoft/vscode-azext-utils";

import { BicepVisualEditorViewManager } from "../visualEditor";
import { Command } from "./types";
import { findOrCreateActiveBicepFile } from "./findOrCreateActiveBicepFile";

async function showVisualEditor(
  context: IActionContext,
  viewManager: BicepVisualEditorViewManager,
  documentUri: vscode.Uri | undefined,
  sideBySide = false
) {
  // Opens Tab with options for Bicep files to open and waits for user to choose
  documentUri = await findOrCreateActiveBicepFile(
    context,
    documentUri,
    "Choose which Bicep file to edit"
  );

  const viewColumn = sideBySide
    ? vscode.ViewColumn.Beside
    : vscode.window.activeTextEditor?.viewColumn ?? vscode.ViewColumn.One;

  await viewManager.openView(documentUri, viewColumn);

  return viewColumn;
}

export class ShowVisualEditorCommand implements Command {
  public readonly id = "bicep.showVisualEditor";

  public constructor(
    private readonly viewManager: BicepVisualEditorViewManager
  ) {}

  public async execute(
    context: IActionContext,
    documentUri?: vscode.Uri | undefined
  ): Promise<vscode.ViewColumn | undefined> {
    return await showVisualEditor(context, this.viewManager, documentUri);
  }
}
