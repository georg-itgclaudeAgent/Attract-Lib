import { premierepro } from "../globals";

const uxp = require("uxp") as typeof import("uxp");

export async function getSelectedCaptionText(): Promise<string | null> {
  try {
    const project = await premierepro.Project.getActiveProject();
    const sequence = await project.getActiveSequence();
    if (!sequence) return null;

    const selection = await sequence.getSelection();
    const trackItems = await selection.getTrackItems();
    if (!trackItems || trackItems.length === 0) return null;

    const firstItem = trackItems[0];
    const projectItem = await firstItem.getProjectItem();

    const transcriptJson = await premierepro.Transcript.exportToJSON(projectItem);
    if (!transcriptJson) return null;

    const transcript = JSON.parse(transcriptJson);
    if (!transcript.segments || transcript.segments.length === 0) return null;

    const text = transcript.segments
      .flatMap((seg: any) => seg.words || [])
      .filter((w: any) => w.type === "word")
      .map((w: any) => w.text)
      .join(" ");

    return text || null;
  } catch (err) {
    console.error("Failed to get caption text:", err);
    return null;
  }
}

export async function saveAudioFile(
  audioData: ArrayBuffer,
  directoryToken: string
): Promise<string> {
  const { localFileSystem } = uxp.storage;

  const folder = await localFileSystem.getEntryForPersistentToken(directoryToken);
  if (!folder) {
    throw new Error("Output directory not found. Please reconfigure in Settings.");
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const filename = `attract-lib-${timestamp}.mp3`;

  const file = await (folder as any).createFile(filename, { overwrite: false });
  const uint8 = new Uint8Array(audioData);
  await file.write(uint8);

  return file.nativePath;
}

export async function importAndInsertAtPlayhead(
  filePath: string
): Promise<void> {
  const project = await premierepro.Project.getActiveProject();
  const sequence = await project.getActiveSequence();
  if (!sequence) {
    throw new Error("No active sequence. Please open a sequence first.");
  }

  const imported = await project.importFiles([filePath], true, null, false);
  if (!imported) {
    throw new Error("Failed to import audio file into project.");
  }

  const rootItem = await project.getRootItem();
  const items = await (rootItem as any).getItems();
  const filename = filePath.split(/[/\\]/).pop();

  let audioItem: any = null;
  for (const item of items) {
    if (item.name === filename) {
      audioItem = item;
      break;
    }
  }

  if (!audioItem) {
    throw new Error("Could not find imported audio in project. It was imported but may be in a subfolder.");
  }

  const playheadTime = await sequence.getPlayerPosition();
  const sequenceEditor = premierepro.SequenceEditor.getEditor(sequence);

  project.lockedAccess(() => {
    project.executeTransaction((compoundAction: any) => {
      const action = sequenceEditor.createOverwriteItemAction(
        audioItem,
        playheadTime,
        0,
        0
      );
      compoundAction.addAction(action);
    }, "Attract Lib: Add generated audio");
  });
}

export async function pickOutputDirectory(): Promise<{
  path: string;
  token: string;
} | null> {
  const { localFileSystem } = uxp.storage;

  try {
    const folder = await localFileSystem.getFolder();
    if (!folder) return null;

    const token = await localFileSystem.createPersistentToken(folder);
    return {
      path: (folder as any).nativePath || folder.name,
      token,
    };
  } catch (err) {
    console.error("Failed to pick directory:", err);
    return null;
  }
}
