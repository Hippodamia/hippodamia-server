import fs from "fs";
import { packageDirectorySync } from "pkg-dir";

export class I18n {

  translations: Record<string, string> = {};

  constructor(language: string, directory: string) {
    const langDefaultFilePath = `${directory}/${language}.lang`;
    const langFilePath = `${directory}/${language}.lang`;

    console.log(`Loading translations from ${langFilePath} and ${langDefaultFilePath}`);

    if (fs.existsSync(langDefaultFilePath)) {
      const langDefaultFileContent = fs.readFileSync(langDefaultFilePath, "utf-8");
      this.translations = { ...this.translations, ...this.parseLanguageFile(langDefaultFileContent) };
    }

    if (fs.existsSync(langFilePath)) {
      const langFileContent = fs.readFileSync(langFilePath, "utf-8");
      this.translations = { ...this.translations, ...this.parseLanguageFile(langFileContent)};
    }



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
