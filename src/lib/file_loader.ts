import { readdir, stat } from "node:fs/promises";
import { resolve, sep } from "node:path";

export class FileFinder {
  constructor(public fileName: string, private throwMessage: string) {}

  public async getRelativePath() {
    const INITIAL_DIR = ".";
    return this.findFile(resolve(INITIAL_DIR), this.fileName);
  }

  private async findFile(directory: string, name: string): Promise<string> {
    const possiblePath = `${directory}${sep}${name}`;
    const fileExists = await this.searchDirForFile(directory, name);
    if (fileExists) return possiblePath;

    const isRootDir = await this.hasGitConfig(directory);
    if (isRootDir) throw new Error(this.throwMessage);

    const previousDirectory = resolve(directory, "..");
    return this.findFile(previousDirectory, name);
  }

  private async searchDirForFile(directory: string, filename: string) {
    const files = await readdir(directory);
    return files.includes(filename);
  }

  private async hasGitConfig(directory: string) {
    return stat(directory);
  }
}
