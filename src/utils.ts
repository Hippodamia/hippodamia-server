import fs from "fs";
import path from "path";

/**
 * Recursively reads files in a directory and applies a handler function to each file.
 *
 * @param {string} directory - The directory to start reading files from.
 * @param {(filePath: string) => void} handler - The function to apply to each file.
 */
export function readFilesRecursive(
  directory: string,
  handler: (filePath: string) => void
) {
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      readFilesRecursive(filePath, handler); // 递归读取子目录
    } else {
      handler(filePath);
    }
  });
}

/**
 * Returns an array of all files in the given directory and its subdirectories.
 *
 * @param directory - The directory to search recursively.
 * @return An array of absolute file paths.
 */
export function getFilesRecursively(directory: string): string[] {
  let files: string[] = [];
  const filesInDirectory = fs.readdirSync(directory);
  for (const file of filesInDirectory) {
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory()) {
      files = files.concat(getFilesRecursively(absolute));
    } else {
      files.push(absolute);
    }
  }
  return files;
}

/**
 * Generates a random emoji from a predefined list of emojis.
 *
 * @return {string} The randomly generated emoji.
 */
export function randomEmoji() {
  var emojis = ["😊", "😂", "😍", "🤩", "😎", "😜", "😋", "🤪", "😇", "🤓"];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

/**
 * Shuffles the elements of an array randomly.
 *
 * @param {any[]} array - The array to be shuffled.
 * @return {any[]} The shuffled array.
 */
export const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

type I18nType = {
  [key: string]: string;
};


export class I18n {
  
  translations: Record<string, string>;

  constructor(language: string, directory: string) {
    const langFilePath = `${directory}/${language}.lang`;

    console.log(`Loading translations from ${langFilePath}`);
    
    const langFileContent = fs.readFileSync(langFilePath, "utf-8");
    this.translations = this.parseLanguageFile(langFileContent);
  }

  parseLanguageFile(content: string): Record<string, string> {
    const translations: Record<string, string> = {};
    const lines = content.split("\n");
    for (const line of lines) {
      if (line.trim() === "" || line.trim().startsWith("#")) {
        continue;
      }
      const [key, value] = line.split("=");
      const trimmedKey = key.trim();
      translations[trimmedKey] = value.trim().replace(/%space%/g, " ");
    }
    return translations;
  }

  translate(key: string): string {
    if (this.translations.hasOwnProperty(key)) {
      return this.translations[key].replace(/\\n/g, "\n");
    }
    return key;
  }

  build() {
    return new Proxy(this, {
      get: (target, prop) => {
        if (typeof prop === "string") {
          return target.translate(prop);
        }
        return Reflect.get(target, prop);
      },
    });
  }

}
